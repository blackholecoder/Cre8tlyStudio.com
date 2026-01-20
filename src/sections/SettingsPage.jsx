import { useState, useEffect, useRef } from "react";
import { useAuth } from "../admin/AuthContext";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { Img } from "react-image";
import Cropper from "react-easy-crop";

export default function DashboardSettings() {
  const { user, setUser, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ctaSaved, setCtaSaved] = useState(false);

  const [twofaEnabled, setTwofaEnabled] = useState(user?.twofa_enabled === 1);
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState(null);
  const [twofaCode, setTwofaCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const hasBrandFile = Boolean(settings?.brand_identity_file);

  const fileInputRef = useRef(null);

  function bufferToBase64URL(buffer) {
    let bytes;
    if (buffer instanceof ArrayBuffer) {
      bytes = new Uint8Array(buffer);
    } else if (ArrayBuffer.isView(buffer)) {
      bytes = new Uint8Array(buffer.buffer);
    } else {
      throw new Error("Invalid buffer type passed to bufferToBase64URL");
    }

    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  // Enable 2FA (get QR + secret)
  const handleEnable2FA = async () => {
    try {
      const res = await axiosInstance.post("/auth/user/enable-2fa");
      setQr(res.data.qr);
      setSecret(res.data.secret);
      toast.info("Scan the QR code with Google Authenticator or Authy.");
    } catch (err) {
      console.error("2FA setup error:", err);
      toast.error("Failed to start 2FA setup.");
    }
  };

  const handleVerify2FA = async () => {
    if (!twofaCode.trim()) return toast.warning("Enter the 6-digit code");
    setVerifying(true);
    try {
      const res = await axiosInstance.post("/auth/user/verify-login-2fa", {
        token: twofaCode,
      });
      if (res.data.success || res.data.verified) {
        setTwofaEnabled(true);
        setQr(null);
        setSecret(null);
        setTwofaCode("");
        setUser({ ...user, twofa_enabled: 1 });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, twofa_enabled: 1 })
        );
        toast.success("✅ Two-Factor Authentication enabled!");
      } else {
        toast.error("Invalid 2FA code. Try again.");
      }
    } catch (err) {
      console.error("2FA verify error:", err);
      toast.error("Invalid or expired code.");
    } finally {
      setVerifying(false);
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      // 1️⃣ Request registration options from backend
      const { data: options } = await axiosInstance.post(
        "/auth/webauthn/register-options",
        {
          email: user.email,
        }
      );

      // 2️⃣ Handle both possible formats for challenge
      const challengeBase64 = options.challenge || options.publicKey?.challenge;
      if (!challengeBase64)
        throw new Error("Missing challenge from server response");

      // 🔐 Decode challenge (Base64URL → Uint8Array)
      const challenge = Uint8Array.from(
        atob(challengeBase64.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0)
      );

      // 🔐 Decode user ID safely
      const userIdStr = options.user?.id || options.publicKey?.user?.id || "";
      const userId = Uint8Array.from(userIdStr, (c) => c.charCodeAt(0));

      // 3️⃣ Create credential in browser
      const credential = await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge,
          user: {
            ...options.user,
            id: userId,
          },
        },
      });

      // ✅ Always encode the true ArrayBuffer
      function toBase64Url(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      const rawIdBase64URL = toBase64Url(credential.rawId);

      const attResp = {
        id: rawIdBase64URL,
        rawId: rawIdBase64URL,
        type: credential.type,
        response: {
          attestationObject: bufferToBase64URL(
            credential.response.attestationObject
          ),
          clientDataJSON: bufferToBase64URL(credential.response.clientDataJSON),
        },
      };

      // 5️⃣ Send credential to backend for verification
      const { data } = await axiosInstance.post(
        "/auth/webauthn/register-verify",
        {
          email: user.email,
          attResp,
        }
      );

      // ✅ Success handling
      if (data.success) {
        toast.success("✅ Passkey registered successfully!");
        setUser({ ...user, has_passkey: 1 });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, has_passkey: 1 })
        );
      } else {
        toast.error("Passkey registration failed.");
      }
    } catch (err) {
      console.error("❌ Passkey registration error:", err);
      toast.error("Passkey registration failed. Try again.");
    }
  };

  const handleRemovePasskey = async () => {
    try {
      const res = await axiosInstance.post("/auth/webauthn/remove-passkey");
      if (res.data.success) {
        toast.info("🗑️ Passkey removed successfully.");
        setUser({ ...user, has_passkey: 0 });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, has_passkey: 0 })
        );
      } else {
        toast.warning("Failed to remove passkey. Try again.");
      }
    } catch (err) {
      console.error("❌ Passkey removal error:", err);
      toast.error("Error removing passkey.");
    }
  };

  function canvasHasTransparency(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height).data;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] < 255) return true;
    }
    return false;
  }

  useEffect(() => {
    if (location.search.includes("connected=true")) {
      refreshUser(); // Refreshes /auth/me data from backend
      toast.success("✅ Stripe account connected successfully!");
      // Optionally clean up URL so it doesn’t re-trigger on reload
      const url = new URL(window.location);
      url.searchParams.delete("connected");
      window.history.replaceState({}, "", url);
    }
  }, [location.search]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get(
          `/upload-data/user/settings/${user.id}`
        );
        setSettings(res.data.settings);
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load brand settings.");
      }
    };
    fetchSettings();
  }, [user?.id]);

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);

      try {
        const res = await axiosInstance.post(
          "/upload-data/user/settings/upload",
          {
            user_id: user.id,
            file_name: file.name,
            file_data: base64Data,
          }
        );

        setSettings((prev) => ({
          ...prev,
          brand_identity_file: res.data.fileUrl,
        }));
        setUser((prev) => ({
          ...prev,
          brand_identity_file: res.data.fileUrl,
        }));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            brand_identity_file: res.data.fileUrl,
          })
        );

        toast.success("Brand file uploaded successfully!");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        console.error(err);
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    try {
      const res = await axiosInstance.delete(
        `/upload-data/user/settings/remove/${user.id}`
      );

      if (res.data.success) {
        // 🔥 Clear everything in sync: state, user, localStorage, and selected file
        setSettings((prev) => ({ ...prev, brand_identity_file: null }));
        setUser((prev) => ({ ...prev, brand_identity_file: null }));
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, brand_identity_file: null })
        );

        toast.info("Brand identity file removed. Defaults restored.");
      } else {
        toast.warning("Failed to remove brand file. Try again.");
      }
    } catch (err) {
      console.error("Error removing brand file:", err);
      toast.error("Error removing file.");
    }
  };

  const handleSaveCTA = async () => {
    try {
      await axiosInstance.put("/upload-data/user/settings/update-cta", {
        userId: user.id,
        cta: settings?.cta || "",
      });

      setUser((prev) => ({ ...prev, cta: settings?.cta }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, cta: settings?.cta })
      );

      setCtaSaved(true);
      toast.success("CTA saved successfully!");
      setTimeout(() => setCtaSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update CTA:", err);
      toast.error("Failed to update CTA. Please try again.");
    }
  };

  const handleUploadAvatar = async () => {
    if (!file) return toast.warning("Crop and select an image first");

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const res = await axiosInstance.post("/upload-data/upload-avatar", {
          userId: user.id,
          profileImage: reader.result,
        });

        if (res.data.profileImage) {
          const updated = {
            ...user,
            profile_image: res.data.profileImage,
            profile_image_url: res.data.profileImage,
          };

          setUser(updated);

          localStorage.setItem("user", JSON.stringify(updated));
          URL.revokeObjectURL(cropSrc);
          toast.success("Profile image updated!");
          setFile(null);
        }
      };

      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getUserPlan = () => {
    const plans = [];

    // Business Builder Monthly (Pro)
    if (
      user.plan === "business_builder_pack" &&
      user.billing_type === "monthly" &&
      user.pro_status === "active"
    ) {
      plans.push({
        title: "Business Builder",
        planKey: "business_builder_pack_monthly",
        billing: "monthly",
        description:
          "Monthly plan with 15 lead magnet slots and full premium tools.",
        remainingSlots: user.magnet_slots,
      });
    }

    // Business Builder Annual (Pro)
    else if (
      user.plan === "business_builder_pack" &&
      user.billing_type === "annual" &&
      user.pro_status === "active"
    ) {
      plans.push({
        title: "Business Builder",
        planKey: "business_builder_pack_annual",
        billing: "annual",
        description:
          "Annual plan with 15 lead magnet slots and full premium tools.",
        remainingSlots: user.magnet_slots,
      });
    }

    // Business Basic (Annual)
    if (user.plan === "business_basic_builder" && user.basic_annual === 1) {
      plans.push({
        title: "Business Basic",
        planKey: "business_basic_builder",
        billing: "annual",
        description:
          "Annual basic plan with 7 lead magnet slots and core selling tools.",
        remainingSlots: user.magnet_slots,
      });
    }

    // Free Trial
    if (!user.plan && user.has_free_magnet === 1) {
      plans.push({
        title: "Free Trial",
        planKey: "free",
        billing: "trial",
        description:
          "Your Free Trial includes 1 lead magnet slot and 7 day access.",
        expires: user.free_trial_expires_at,
        remainingSlots: user.magnet_slots,
      });
    }

    // Author’s Assistant add on
    if (user.has_book === 1) {
      plans.push({
        title: "Author’s Assistant",
        planKey: "assistant",
        billing: "one_time",
        description: "Create up to 750 pages with the AI Book Builder.",
        remainingPages: user.book_slots,
      });
    }

    return plans;
  };

  const plans = getUserPlan();

  const canUseCustomDomains =
    user?.pro_status === "active" && user?.plan === "business_builder_pack";

  const isFreeTier = user?.has_free_magnet === 1 && !user?.plan;

  return (
    <div
      className="
      flex justify-center w-full min-h-screen
      bg-dashboard-bg-light
      dark:bg-dashboard-bg-dark
      text-dashboard-text-light
      dark:text-dashboard-text-dark
  "
    >
      <div className="w-full max-w-[900px] p-5">
        {/* Header */}
        <div
          className="
          mb-10 pb-6 border-b
          border-dashboard-border-light
          dark:border-dashboard-border-dark
  "
        >
          <h1
            className="
            text-3xl font-bold design-text normal-case
            text-dashboard-text-light
            dark:text-dashboard-text-dark
  "
          >
            Brand Settings
          </h1>
          <p
            className="
            mt-2
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark"
          >
            Manage your brand tone and upload a reference file for AI
            generation.
          </p>
        </div>

        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-2xl p-8 mb-10 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-semibold text-dashboard-text-light
            dark:text-dashboard-text-dark
"
            >
              Your Plan
            </h2>
            <span
              className="text-sm text-dashboard-muted-light
            dark:text-dashboard-muted-dark
"
            >
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}{" "}
            </span>
          </div>

          {plans.length > 0 ? (
            <div
              className={`grid gap-6 ${
                plans.length === 1
                  ? "grid-cols-1 place-items-center"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {plans.map((plan, idx) => {
                // Determine status badge
                let statusBadge = "Active";
                let statusColor = "text-green bg-green/10";

                if (plan.planKey === "free" || plan.billing === "trial") {
                  statusBadge = "Free Trial";
                  statusColor = "text-amber-400 bg-amber-500/10";
                }

                if (plan.planKey === "business_basic_builder") {
                  statusBadge = "Basic";
                  statusColor = "text-emerald-400 bg-emerald-500/10";
                }

                // Trial expiration
                if (plan.billing === "trial" && plan.expires) {
                  if (new Date(plan.expires) < new Date()) {
                    statusBadge = "Expired";
                    statusColor = "text-red-400 bg-red-400/10";
                  }
                }

                return (
                  <div
                    key={idx}
                    className="
                    relative flex flex-col justify-between transition-all
                    rounded-xl p-5 border shadow-inner
                    bg-dashboard-sidebar-light
                    dark:bg-dashboard-hover-dark
                    border-dashboard-border-light
                    dark:border-dashboard-border-dark
                    hover:shadow-[0_0_20px_rgba(0,255,170,0.15)]
"
                  >
                    {/* Status Badge */}
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md mb-2 self-start ${statusColor}`}
                    >
                      {statusBadge}
                    </span>

                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Author’s Assistant icon */}
                      {plan.planKey === "assistant" && (
                        <svg
                          className="w-6 h-6 text-hotPink"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 20l9-5-9-5-9 5 9 5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 12l9-5-9-5-9 5 9 5z"
                          />
                        </svg>
                      )}

                      {/* Business Builder icons */}
                      {plan.planKey.startsWith("business_builder_pack") && (
                        <svg
                          className="w-6 h-6 text-blue"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h11M9 21V3m12 7h-5a2 2 0 00-2 2v9"
                          />
                        </svg>
                      )}

                      {plan.planKey === "business_basic_builder" && (
                        <svg
                          className="w-6 h-6 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v18m9-9H3"
                          />
                        </svg>
                      )}

                      <h3
                        className="text-lg font-semibold text-dashboard-text-light
                        dark:text-dashboard-text-dark
"
                      >
                        {plan.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      className="text-sm text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
                      leading-relaxed"
                    >
                      {plan.description}
                    </p>

                    {/* Billing Label */}
                    <p
                      className="text-xs mt-2 text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
"
                    >
                      {plan.billing === "monthly" && "Billed Monthly"}
                      {plan.billing === "annual" && "Billed Annually"}
                      {plan.billing === "trial" &&
                        `Trial Ends: ${new Date(plan.expires).toLocaleDateString()}`}
                      {plan.billing === "one_time" && "One-Time Purchase"}
                    </p>
                    {plan.planKey === "free" && (
                      <button
                        onClick={() => (window.location.href = "/plans")}
                        className="mt-4 px-5 py-2.5 bg-royalPurple 
                      text-dashboard-text-light
                        dark:text-dashboard-text-dark
                        font-semibold rounded-lg shadow-md hover:opacity-90 transition"
                      >
                        Upgrade Plan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              className="text-dashboard-muted-light
            dark:text-dashboard-muted-dark
              text-sm text-center py-4"
            >
              No active plan detected. Please contact support if this seems
              incorrect.
            </p>
          )}
        </div>

        {/* Avatar Upload */}
        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg mt-8"
        >
          <h2
            className="text-lg font-semibold text-dashboard-text-light
          dark:text-dashboard-text-dark
"
          >
            Profile Avatar
          </h2>

          <div className="flex items-center gap-6 mt-4">
            <Img
              src={user?.profile_image}
              loader={
                <div
                  className="
                  w-20 h-20 rounded-full animate-pulse object-cover
                  border border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  transition-opacity duration-300
"
                />
              }
              unloader={
                <img
                  src="/default-avatar.png"
                  className="
                  w-20 h-20 rounded-full object-cover
                  border border-dashboard-border-light
                  dark:border-dashboard-border-dark
"
                  alt="avatar"
                />
              }
              decode={true}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-700 transition-opacity duration-300"
            />

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  setCropSrc(URL.createObjectURL(f));
                }}
                className="w-full text-sm text-dashboard-text-light
              dark:text-dashboard-text-dark file:mr-3 file:py-2 file:px-4 
                   file:rounded-lg file:border-0 file:text-sm file:bg-white 
                   file:font-semibold hover:file:opacity-90"
              />
              {cropSrc && (
                <div className="mt-6">
                  <div className="relative w-full h-[260px] rounded-lg overflow-hidden bg-black/40">
                    <Cropper
                      image={cropSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(_, pixels) =>
                        setCroppedAreaPixels(pixels)
                      }
                    />
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full mt-4"
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      disabled={uploading}
                      className="px-4 py-2 bg-green text-dashboard-bg-dark rounded font-semibold"
                      onClick={async () => {
                        if (!croppedAreaPixels) return;

                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        img.src = cropSrc;
                        await new Promise((r) => (img.onload = r));

                        const { width, height, x, y } = croppedAreaPixels;
                        canvas.width = width;
                        canvas.height = height;

                        ctx.clearRect(0, 0, width, height);
                        ctx.drawImage(
                          img,
                          x,
                          y,
                          width,
                          height,
                          0,
                          0,
                          width,
                          height
                        );

                        const hasAlpha = canvasHasTransparency(
                          ctx,
                          width,
                          height
                        );
                        const mimeType = hasAlpha ? "image/png" : "image/jpeg";
                        const quality = hasAlpha ? undefined : 0.9;
                        const fileName = hasAlpha ? "avatar.png" : "avatar.jpg";

                        const blob = await new Promise((r) =>
                          canvas.toBlob(r, mimeType, quality)
                        );

                        setFile(blob);
                        setCropSrc(null);
                        setCrop({ x: 0, y: 0 });
                        setZoom(1);
                      }}
                    >
                      Use Image
                    </button>

                    <button
                      className="
                      px-4 py-2 rounded
                      bg-dashboard-hover-light
                      dark:bg-dashboard-hover-dark
                      text-dashboard-text-light
                      dark:text-dashboard-text-dark
"
                      onClick={() => {
                        URL.revokeObjectURL(cropSrc);
                        setCropSrc(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleUploadAvatar}
                disabled={uploading}
                className="mt-3 px-5 py-2 rounded-lg bg-green text-dashboard-bg-dark font-semibold 
                   hover:opacity-90 disabled:opacity-50 transition"
              >
                {uploading ? "Uploading..." : "Upload Avatar"}
              </button>
            </div>
          </div>
        </div>

        {/* 🔐 Two-Factor Authentication Section */}
        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-xl p-6 space-y-4 shadow-lg mt-8"
        >
          <h2
            className="text-lg font-semibold text-dashboard-text-light
          dark:text-dashboard-text-dark
"
          >
            Two-Factor Authentication
          </h2>
          <p
            className="text-sm text-dashboard-muted-light
          dark:text-dashboard-muted-dark
"
          >
            Add an extra layer of security to your Cre8tly Studio account.
          </p>

          {twofaEnabled ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-green font-semibold">
                  ✅ 2FA is enabled
                </span>
                <p
                  className="text-xs text-dashboard-muted-light
                dark:text-dashboard-muted-dark
"
                >
                  Your account is protected with two-factor authentication.
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await axiosInstance.post(
                      "/auth/user/disable-2fa"
                    );
                    if (res.data.success) {
                      setTwofaEnabled(false);
                      setUser({ ...user, twofa_enabled: 0 });
                      localStorage.setItem(
                        "user",
                        JSON.stringify({ ...user, twofa_enabled: 0 })
                      );
                      toast.info("2FA has been disabled.");
                    } else {
                      toast.error("Failed to disable 2FA. Try again.");
                    }
                  } catch (err) {
                    console.error("Disable 2FA error:", err);
                    toast.error("Server error disabling 2FA.");
                  }
                }}
                className="
  px-5 py-2
  bg-red-600 hover:bg-red-700
  text-white
  dark:text-dashboard-text-dark
  rounded-lg font-semibold transition
"
              >
                Disable 2FA
              </button>
            </div>
          ) : (
            <>
              {!qr ? (
                <button
                  onClick={handleEnable2FA}
                  className="mt-2 px-6 py-2.5 bg-green text-dashboard-bg-dark font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Enable 2FA
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <QRCode
                    value={qr}
                    size={160}
                    bgColor="#0B0F19"
                    fgColor="#00ffae"
                  />
                  <p
                    className="text-xs text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                    text-center"
                  >
                    Scan this code with your Authenticator app, then enter the
                    6-digit code below.
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={twofaCode}
                    onChange={(e) => setTwofaCode(e.target.value)}
                    className="w-40 text-center py-2 px-3 rounded-md bg-dashboard-hover-light dark:bg-dashboard-hover-dark border border-dashboard-border-light dark:border-dashboard-border-dark text-dashboard-text-light
                  dark:text-dashboard-text-dark
                    focus:ring-2 focus:ring-green outline-none placeholder-dashboard-muted-light
  dark:placeholder-dashboard-muted-dark"
                  />
                  <button
                    onClick={handleVerify2FA}
                    disabled={verifying}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                      verifying
                        ? "opacity-60 cursor-not-allowed bg-green-700"
                        : "bg-green text-dashboard-bg-dark hover:opacity-90"
                    }`}
                  >
                    {verifying ? "Verifying..." : "Verify 2FA Code"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-xl p-6 space-y-4  shadow-lg mt-8"
        >
          <h2
            className="text-lg font-semibold text-dashboard-text-light
          dark:text-dashboard-text-dark
"
          >
            Passkey Authentication
          </h2>
          <p
            className="text-sm text-dashboard-muted-light
          dark:text-dashboard-muted-dark
"
          >
            Securely sign in using Face ID, Touch ID, or your device’s security
            key.
          </p>

          {user?.has_passkey ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-green font-semibold">
                  ✅ Passkey Registered
                </span>
                <p
                  className="text-xs text-dashboard-muted-light
                dark:text-dashboard-muted-dark
"
                >
                  You can now use “Sign in with Passkey” on the login screen.
                </p>
              </div>
              <button
                onClick={handleRemovePasskey}
                className="
                px-5 py-2
                bg-red-600 hover:bg-red-700
                text-white
                rounded-lg font-semibold transition
  "
              >
                Remove Passkey
              </button>
            </div>
          ) : (
            <button
              onClick={handleRegisterPasskey}
              className="px-6 py-2.5 bg-blue text-dashboard-text-light
            dark:text-dashboard-text-dark
            font-semibold rounded-lg hover:opacity-90 transition"
            >
              Register Passkey
            </button>
          )}
        </div>
        {/* 💳 Stripe Seller Connection */}
        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg mt-8"
        >
          <h2
            className="text-lg font-semibold text-dashboard-text-light
          dark:text-dashboard-text-dark
"
          >
            Seller Payouts (Stripe Connect)
          </h2>
          <p
            className="text-sm text-dashboard-muted-light
          dark:text-dashboard-muted-dark mb-4"
          >
            Connect your Stripe Express account to receive payouts for sales you
            make through Cre8tly Studio.
          </p>

          {/* 🔍 Free trial users cannot access Stripe */}
          {isFreeTier ? (
            <div className="text-center py-8">
              <p
                className="text-dashboard-muted-light
              dark:text-dashboard-muted-dark
              mb-3 text-sm max-w-[420px] mx-auto"
              >
                Selling products and connecting Stripe is a{" "}
                <span className="text-green font-semibold">
                  premium feature
                </span>
                . Upgrade to unlock payouts, the seller dashboard, and full
                product sales.
              </p>

              <button
                onClick={() => (window.location.href = "/plans")}
                className="px-6 py-3 rounded-lg bg-royalPurple 
              text-dashboard-text-light
              dark:text-dashboard-text-dark
                font-semibold shadow-md hover:opacity-90 transition mx-auto"
              >
                Upgrade to Unlock Selling
              </button>
            </div>
          ) : (
            <>
              {/* Stripe Connected */}
              {user?.stripe_connected ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green font-semibold">
                      ✅ Connected
                    </span>
                    <p
                      className="text-xs text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
"
                    >
                      Your Stripe account is active and ready for payouts.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      window.open(
                        "https://dashboard.stripe.com/express",
                        "_blank"
                      )
                    }
                    className="
                    px-5 py-2
                    bg-blue hover:bg-blue/80
                    text-white
                    rounded-lg font-semibold transition
"
                  >
                    Open Stripe Dashboard
                  </button>
                </div>
              ) : user?.stripe_connect_account_id ? (
                // Stripe pending setup
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-semibold">
                      ⚠️ Pending Setup
                    </span>
                    <p
                      className="text-xs text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
"
                    >
                      Your Stripe account was created but not completed.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const { data } = await axiosInstance.post(
                          "/seller/create-account-link"
                        );
                        if (data.url) window.location.href = data.url;
                      } catch (err) {
                        console.error("Stripe connect error:", err);
                        toast.error(
                          "Failed to resume Stripe onboarding. Try again."
                        );
                      }
                    }}
                    className="px-6 py-2.5 bg-amber-500 text-dashboard-text-light
                    dark:text-dashboard-text-dark
                    font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Complete Setup
                  </button>
                </div>
              ) : (
                // Stripe Start Setup
                <button
                  onClick={async () => {
                    try {
                      const { data } = await axiosInstance.post(
                        "/seller/create-account-link"
                      );
                      if (data.url) window.location.href = data.url;
                    } catch (err) {
                      console.error("Stripe connect error:", err);
                      toast.error(
                        "Failed to start Stripe onboarding. Try again."
                      );
                    }
                  }}
                  className="px-6 py-2.5 bg-royalPurple text-dashboard-text-light
                  dark:text-dashboard-text-dark
                  font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Connect with Stripe
                </button>
              )}
            </>
          )}
        </div>

        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg mt-8 relative overflow-hidden"
        >
          <h2
            className="text-lg font-semibold text-dashboard-text-light
          dark:text-dashboard-text-dark
"
          >
            Custom Domains
          </h2>

          <p
            className="text-sm text-dashboard-muted-light
          dark:text-dashboard-muted-dark mb-4"
          >
            Connect your own domain to host landing pages on your brand.
          </p>

          {canUseCustomDomains ? (
            <button
              onClick={() => navigate("/settings/domains")}
              className="px-6 py-2.5 bg-royalPurple text-white
            dark:text-dashboard-text-dark
            font-semibold rounded-lg hover:opacity-90 transition"
            >
              Manage Custom Domains →
            </button>
          ) : (
            <>
              {/* Locked overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
                <div className="mb-3 text-3xl">🔒</div>
                <p
                  className="
                  text-sm mb-4 max-w-[360px]
                  text-dashboard-text-light
                  dark:text-dashboard-text-dark
  "
                >
                  Custom Domains are available on the{" "}
                  <span className="text-green font-semibold">
                    Business Builder
                  </span>{" "}
                  plan only.
                </p>

                <button
                  onClick={() => navigate("/plans")}
                  className="px-6 py-2.5 bg-royalPurple text-dashboard-text-light
                  dark:text-dashboard-text-dark
                  font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Upgrade to Unlock
                </button>
              </div>
            </>
          )}
        </div>

        {/* Active File */}
        <div
          className="bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark rounded-xl p-6 space-y-3 shadow-lg mb-8 mt-8"
        >
          {settings?.brand_identity_file ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-dashboard-text-light dark:text-dashboard-text-dark">
                  <span className="text-green-400 font-semibold">
                    Active Brand File
                  </span>
                </p>
                <button
                  aria-label="Remove brand identity file"
                  onClick={handleRemove}
                  className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md font-semibold shadow-sm transition"
                >
                  Remove
                </button>
              </div>
              <p
                className="text-xs text-dashboard-muted-light
              dark:text-dashboard-muted-dark
              italic"
              >
                Uploaded on: {new Date().toLocaleDateString()}
              </p>
            </>
          ) : (
            <p
              className="text-dashboard-muted-light
              dark:text-dashboard-muted-dark
              text-sm text-center"
            >
              No brand identity uploaded yet.
            </p>
          )}
        </div>

        {/* Upload Section */}

        <div
          className="bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark rounded-xl p-6 space-y-4 shadow-lg"
        >
          <h2
            className="text-lg font-semibold text-dashboard-text-light
            dark:text-dashboard-text-dark
"
          >
            Upload New Brand File
          </h2>

          {isFreeTier ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p
                className="text-dashboard-muted-light
                dark:text-dashboard-muted-dark
                text-sm mb-4 max-w-[400px]"
              >
                🧩 Uploading a custom brand identity file is a{" "}
                <span className="text-green font-semibold">paid feature</span>.
                Upgrade to personalize your tone, voice, and branding for all
                generated products.
              </p>
              <button
                onClick={() => (window.location.href = "/plans")}
                className="px-6 py-3 rounded-lg bg-royalPurple text-dashboard-text-light
                dark:text-dashboard-text-dark
                font-semibold shadow-md hover:opacity-90 transition"
              >
                Upgrade Now
              </button>
            </div>
          ) : (
            <>
              <p
                className="text-sm text-dashboard-muted-light
    dark:text-dashboard-muted-dark"
              >
                Accepted formats:{" "}
                <span className="text-gray-700 dark:text-dashboard-text-dark">
                  .pdf, .docx, .doc, .txt
                </span>{" "}
                (max 5 MB)
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="flex-1 w-full">
                  {/* 🔒 Hidden native file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />

                  {/* ✅ Custom Choose File button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={hasBrandFile}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition
                    ${
                      hasBrandFile
                        ? `
                          bg-gray-200 text-gray-400 cursor-not-allowed
                          dark:bg-dashboard-hover-dark dark:text-dashboard-muted-dark
                        `
                        : `
                          bg-gray-200 text-gray-900 hover:opacity-90
                          dark:bg-dashboard-hover-dark dark:text-dashboard-text-dark
                        `
                    }
                  `}
                  >
                    Choose File
                  </button>

                  {/* Filename display */}
                  <p
                    className="mt-2 text-xs italic
                    text-dashboard-muted-light
                    dark:text-dashboard-muted-dark"
                  >
                    {hasBrandFile ? (
                      "A brand file is already uploaded. Remove it to upload a new one."
                    ) : file ? (
                      <>
                        Selected:{" "}
                        <span className="font-medium text-gray-700 dark:text-dashboard-text-dark">
                          {file.name}
                        </span>
                      </>
                    ) : (
                      "No file selected"
                    )}
                  </p>
                </div>

                {/* Save button stays the same */}
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading || hasBrandFile}
                  className={`relative w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all
                  ${
                    !file || uploading || hasBrandFile
                      ? "opacity-60 cursor-not-allowed bg-green/60"
                      : "bg-green hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  }
                  text-black
                `}
                >
                  {!file
                    ? "Select a File"
                    : hasBrandFile
                      ? "Brand Already Saved"
                      : uploading
                        ? "Uploading..."
                        : "Save Brand"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* CTA Settings */}
        <div
          className="
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          rounded-xl p-6 space-y-4 shadow-lg mt-8
  "
        >
          {/* CTA Settings */}
          <div
            className="
            bg-dashboard-hover-light
            dark:bg-dashboard-hover-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            rounded-xl p-6 shadow-inner
    "
          >
            <h2
              className="text-lg font-semibold text-dashboard-text-light
              dark:text-dashboard-text-dark
"
            >
              Default Closing Message / CTA
            </h2>
            <p
              className="text-sm text-dashboard-muted-light
              dark:text-dashboard-muted-dark mb-4"
            >
              This message will appear at the end of your lead magnets or books.
              You can change it anytime.
            </p>

            {/* Inner card for textarea + button */}
            <div className="rounded-lg p-5 space-y-4">
              <textarea
                placeholder={`Example:\nCreate your first lead magnet today with Cre8tlyStudio or join my free newsletter at https://yourwebsite.com.\n\nLet’s keep this journey going together — no tech overwhelm, no burnout, just steady growth.`}
                value={settings?.cta || ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, cta: e.target.value }))
                }
                rows={6}
                className="
                w-full px-4 py-3 rounded-lg
                bg-dashboard-bg-light
                dark:bg-dashboard-bg-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                placeholder-dashboard-muted-light
                dark:placeholder-dashboard-muted-dark
                focus:ring-2 focus:ring-green focus:outline-none
"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSaveCTA}
                  className="px-6 py-2 rounded-lg bg-green text-dashboard-bg-dark font-semibold hover:opacity-90 transition"
                >
                  Save CTA
                </button>
              </div>
            </div>
          </div>

          {user?.has_book ? (
            <>
              <div
                className="
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                rounded-xl p-6 shadow-lg mt-8
"
              >
                <h2
                  className="text-lg font-semibold text-dashboard-text-light
                dark:text-dashboard-text-dark
                mb-2"
                >
                  Guided Tour
                </h2>
                <p
                  className="text-sm text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                  mb-4"
                >
                  Replay the Book Builder onboarding walkthrough to revisit all
                  key features.
                </p>

                <button
                  onClick={async () => {
                    try {
                      await axiosInstance.post(
                        "/books/onboarding/replay",
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${user?.accessToken}`,
                          },
                        }
                      );

                      toast.success(
                        "✅ Tour reset! It will replay next time you open Book Builder."
                      );
                    } catch (err) {
                      console.error("❌ Failed to reset onboarding:", err);
                      toast.error("Could not reset tour. Please try again.");
                    }
                  }}
                  className="
                  px-5 py-2.5 rounded-lg
                  bg-bookBtnColor
                  text-black
                  font-semibold
                  hover:opacity-90
                  transition
                "
                >
                  Replay Book Tour
                </button>
              </div>
              <div
                className="
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                rounded-xl p-6 shadow-lg mt-8
"
              >
                <h2
                  className="text-lg font-semibold text-dashboard-text-light
                  dark:text-dashboard-text-dark
                  mb-2"
                >
                  ISBN Assistance
                </h2>
                <p
                  className="text-sm text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                  mb-4 leading-relaxed"
                >
                  Need an ISBN for your book? Cre8tly Studio can guide you
                  through the process. An ISBN (International Standard Book
                  Number) identifies your book worldwide and is required for
                  publishing on major retailers like Amazon, Apple Books, and
                  Barnes & Noble.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() =>
                      window.open("https://www.myidentifiers.com/", "_blank")
                    }
                    className="flex-1 bg-green text-dashboard-bg-dark font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition text-center"
                  >
                    Get ISBN from Bowker
                  </button>

                  <button
                    onClick={() =>
                      toast.info(
                        "Our team will soon offer a Pro ISBN Concierge service directly inside Cre8tly Studio!"
                      )
                    }
                    className="flex-1 bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-text-light dark:text-dashboard-text-dark font-semibold py-2.5 rounded-lg border border-dashboard-border-light dark:border-dashboard-border-dark hover:border-green hover:text-green transition"
                  >
                    Coming Soon: ISBN Concierge
                  </button>
                </div>

                <p
                  className="text-xs text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                  italic mt-3"
                >
                  Available for Assistant Plan users. Stay tuned for automated
                  ISBN requests inside the dashboard.
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
