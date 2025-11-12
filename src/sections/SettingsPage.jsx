import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../admin/AuthContext";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

export default function DashboardSettings() {
  const { user, setUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ctaSaved, setCtaSaved] = useState(false);

  const [twofaEnabled, setTwofaEnabled] = useState(user?.twofa_enabled === 1);
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState(null);
  const [twofaCode, setTwofaCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const fileInputRef = useRef(null);

  // Enable 2FA (get QR + secret)
  const handleEnable2FA = async () => {
    try {
      const res = await api.post(
        "https://cre8tlystudio.com/api/auth/user/enable-2fa"
      );
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
      const res = await api.post(
        "https://cre8tlystudio.com/api/auth/user/verify-login-2fa",
        { token: twofaCode }
      );
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

  useEffect(() => {
    if (!user?.id) return;
    const fetchSettings = async () => {
      try {
        const res = await api.get(`upload-data/user/settings/${user.id}`);
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
        const res = await api.post("upload-data/user/settings/upload", {
          user_id: user.id,
          file_name: file.name,
          file_data: base64Data,
        });

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
      const res = await api.delete(
        `upload-data/user/settings/remove/${user.id}`
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
      await api.put("upload-data/user/settings/update-cta", {
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

  const getUserPlan = () => {
    if (!user) return [];
    const plans = [];
    if (user.has_book) plans.push("Assistant");
    if (user.has_magnet) plans.push("Magnets");
    if (user.pro_covers) plans.push("Pro Covers");
    return plans;
  };

  const plans = getUserPlan();

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#030712] text-white">
      <div className="w-full max-w-[900px] p-5">
        {/* Header */}
        <div className="mb-10 border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-white design-text">
            Brand Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your brand tone and upload a reference file for AI
            generation.
          </p>
        </div>

        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-8 mb-10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Your Plan</h2>
            <span className="text-sm text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}{" "}
            </span>
          </div>

          {plans.length > 0 ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {plans.map((plan) => {
                let planStatus = "active"; // active | expired | lifetime
                let remainingSlots = null;

                if (plan.includes("Assistant")) {
                  remainingSlots = user?.book_slots ?? 0;
                  if (remainingSlots <= 0) planStatus = "expired";
                } else if (plan.includes("Magnets")) {
                  remainingSlots = user?.magnet_slots ?? 0;
                  if (remainingSlots <= 0) planStatus = "expired";
                } else if (plan.includes("Pro")) {
                  planStatus = user?.pro_covers ? "lifetime" : "expired";
                }

                return (
                  <div
                    key={plan}
                    className={`relative flex flex-col justify-between transition-all rounded-xl p-5 border shadow-inner
              ${
                planStatus === "expired"
                  ? "bg-[#0c0f18]/80 border-gray-800 opacity-70"
                  : "bg-[#111827]/80 hover:bg-[#1f2937]/80 border-gray-700 hover:border-gray-600 hover:shadow-[0_0_20px_rgba(0,255,170,0.15)]"
              }`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md mb-2 self-start ${
                        planStatus === "expired"
                          ? "text-red-400 bg-red-400/10"
                          : "text-green bg-green-400/10"
                      }`}
                    >
                      {plan.includes("Pro")
                        ? "Active"
                        : planStatus === "active"
                          ? "Active"
                          : "Expired"}
                    </span>

                    {/* Icon and Title */}
                    <div className="flex items-center gap-3 mb-3">
                      {plan.includes("Assistant") && (
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
                      {plan.includes("Magnets") && (
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
                      {plan.includes("Pro") && (
                        <svg
                          className="w-6 h-6 text-royalPurple"
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

                      <h3 className="text-lg font-semibold text-white">
                        {plan}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {plan.includes("Assistant")
                        ? "Access advanced book creation and AI writing tools."
                        : plan.includes("Magnets")
                          ? "Generate digital products and marketing assets."
                          : "Unlock pro cover uploads and customization tools."}
                    </p>

                    {/* ✅ Footer: Slots or Lifetime (aligned perfectly) */}
                    <div className="mt-3">
                      {planStatus === "lifetime" ? (
                        <p className="text-xs font-semibold text-gray-500 tracking-wide">
                          Lifetime
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Slots remaining:{" "}
                          <span
                            className={`font-semibold ${
                              remainingSlots > 0
                                ? "text-gray-300"
                                : "text-red-400"
                            }`}
                          >
                            {remainingSlots}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              No active plan detected. Please contact support if this seems
              incorrect.
            </p>
          )}
        </div>

        {/* 🔐 Two-Factor Authentication Section */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg mt-8">
                <h2 className="text-lg font-semibold text-gray-200">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-400">
                  Add an extra layer of security to your Cre8tly Studio account.
                </p>

                {!twofaEnabled ? (
                  <>
                    {!qr ? (
                      <button
                        onClick={handleEnable2FA}
                        className="mt-2 px-6 py-2.5 bg-green text-black font-semibold rounded-lg hover:opacity-90 transition"
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
                        <p className="text-xs text-gray-400 text-center">
                          Scan this code with your Authenticator app, then enter
                          the 6-digit code below.
                        </p>

                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={twofaCode}
                          onChange={(e) => setTwofaCode(e.target.value)}
                          className="w-40 text-center py-2 px-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green outline-none"
                        />

                        <button
                          onClick={handleVerify2FA}
                          disabled={verifying}
                          className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                            verifying
                              ? "opacity-60 cursor-not-allowed bg-green-700"
                              : "bg-green text-black hover:opacity-90"
                          }`}
                        >
                          {verifying ? "Verifying..." : "Verify 2FA Code"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-green font-semibold">
                      ✅ 2FA is enabled
                    </span>
                    <p className="text-xs text-gray-500">
                      Your account is protected with two-factor authentication.
                    </p>
                  </div>
                )}
              </div>

        {/* Active File */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-3 shadow-lg mb-8 mt-8">
          {settings?.brand_identity_file ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">
                    Active Brand File
                  </span>
                </p>
                <button
                  onClick={handleRemove}
                  className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md font-semibold shadow-sm transition"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-400 italic">
                Uploaded on: {new Date().toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center">
              No brand identity uploaded yet.
            </p>
          )}
        </div>

        {/* Upload Section */}
        {/* Upload Section */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-200">
            Upload New Brand File
          </h2>

          {user?.has_free_magnet === 1 && user?.magnet_slots === 1 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-400 text-sm mb-4 max-w-[400px]">
                🧩 Uploading a custom brand identity file is a{" "}
                <span className="text-green font-semibold">Pro feature</span>.
                Upgrade to personalize your tone, voice, and branding for all
                generated products.
              </p>
              <button
                onClick={() => (window.location.href = "/plans")}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Upgrade Now
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400">
                Accepted formats:{" "}
                <span className="text-gray-300">.pdf, .docx, .doc, .txt</span>{" "}
                (max 5 MB)
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="flex-1 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-500 file:to-purple-600 hover:file:opacity-90"
                  />
                  {file && (
                    <p className="text-xs text-gray-400 italic mt-1">
                      Selected:{" "}
                      <span className="text-gray-200">{file.name}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`relative w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all duration-300
            ${
              uploading
                ? "opacity-60 cursor-not-allowed bg-gradient-to-r from-green-700 to-green-600"
                : "bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            }
            text-white shadow-[inset_0_0_6px_rgba(255,255,255,0.15)]`}
                >
                  <span className="relative z-10">
                    {uploading ? "Uploading..." : "Save Brand"}
                  </span>
                  {!uploading && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* CTA Settings */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg mt-8">
          <h2 className="text-lg font-semibold text-gray-200">
            Default Closing Message / CTA
          </h2>
          <p className="text-sm text-gray-400">
            This message will appear at the end of your lead magnets or books.
            You can change it anytime.
          </p>

          <textarea
            placeholder={`Example:\nCreate your first lead magnet today with Cre8tlyStudio or join my free newsletter at https://yourwebsite.com.\n\nLet’s keep this journey going together — no tech overwhelm, no burnout, just steady growth.`}
            value={settings?.cta || ""}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, cta: e.target.value }))
            }
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveCTA}
              className="mt-3 px-6 py-2 rounded-lg bg-green text-black font-semibold hover:opacity-90 transition"
            >
              Save CTA
            </button>
          </div>
          {user?.has_book ? (
            <>
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-lg mt-8 text-center">
                <h2 className="text-lg font-semibold text-gray-200 mb-2">
                  Guided Tour
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Replay the Book Builder onboarding walkthrough to revisit all
                  key features.
                </p>

                <button
                  onClick={async () => {
                    try {
                      await api.post(
                        "https://cre8tlystudio.com/api/books/onboarding/replay",
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
                  className="px-5 py-2.5 rounded-lg bg-[#6a5acd] text-black font-semibold hover:opacity-90 transition"
                >
                  Replay Book Tour
                </button>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-lg mt-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2">
                  ISBN Assistance
                </h2>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
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
                    className="flex-1 bg-green text-black font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition text-center"
                  >
                    Get ISBN from Bowker
                  </button>

                  <button
                    onClick={() =>
                      toast.info(
                        "Our team will soon offer a Pro ISBN Concierge service directly inside Cre8tly Studio!"
                      )
                    }
                    className="flex-1 bg-gray-800 text-gray-300 font-semibold py-2.5 rounded-lg border border-gray-700 hover:border-green hover:text-green transition"
                  >
                    Coming Soon: ISBN Concierge
                  </button>
                </div>

                <p className="text-xs text-gray-500 italic mt-3">
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
