import React, { useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";

export default function PageUrlUsernameField({ landing, setLanding }) {
  const hasCustomDomain = Boolean(
    landing?.domain?.hasPrimaryDomain && landing?.domain?.primaryDomain
  );

  const primaryDomain = landing?.domain?.primaryDomain;

  useEffect(() => {
    if (hasCustomDomain && landing.username) {
      setLanding((prev) => ({ ...prev, username: prev.username }));
    }
  }, [hasCustomDomain]);

  return (
    <div className="max-w-[40%] pb-10">
      <label className="block font-semibold mb-1 text-silver">
        Page Url Username
      </label>

      <input
        type="text"
        maxLength={30}
        value={landing.username || ""}
        disabled={hasCustomDomain}
        onChange={(e) => {
          if (hasCustomDomain) return;
          setLanding({ ...landing, username: e.target.value });
        }}
        onBlur={async () => {
          if (hasCustomDomain) return;

          if (landing.username?.trim()?.length >= 3) {
            try {
              const res = await axiosInstance.get(
                `/landing/check-username/${landing.username.trim()}`
              );

              toast[res.data.available ? "success" : "error"](res.data.message);
            } catch (err) {
              const msg =
                err?.response?.data?.message || "Error checking username";
              toast.error(msg);
            }
          }
        }}
        placeholder={
          hasCustomDomain ? "Custom domain connected" : "e.g. cre8tlydesigns"
        }
        className={`
          w-[40%]
          border
          rounded-lg
          px-4
          py-2
          !border-white/10
          !text-white
          placeholder-white/30
          ${
            hasCustomDomain
              ? "bg-gray-800/60 cursor-not-allowed opacity-60"
              : "!bg-bioModal"
          }
        `}
      />

      <p className="text-xs text-gray-200 mt-1 mb-10">
        {hasCustomDomain ? (
          <>
            Your page is live at{" "}
            <span className="text-green">https://{primaryDomain}</span>
            <br />
            <span className="text-gray-400">
              Subdomain is disabled while a custom domain is active.
            </span>
          </>
        ) : (
          <>
            This will be used for your page URL{" "}
            <span className="text-green">
              {landing.username
                ? `https://${landing.username}.cre8tlystudio.com`
                : "https://yourname.cre8tlystudio.com"}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
