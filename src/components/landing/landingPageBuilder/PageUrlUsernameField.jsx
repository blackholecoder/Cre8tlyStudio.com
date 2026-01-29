import React, { useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";

export default function PageUrlUsernameField({ landing, setLanding }) {
  const hasCustomDomain = Boolean(
    landing?.domain?.hasPrimaryDomain && landing?.domain?.primaryDomain,
  );

  const primaryDomain = landing?.domain?.primaryDomain;

  useEffect(() => {
    if (hasCustomDomain && landing.username) {
      setLanding((prev) => ({ ...prev, username: prev.username }));
    }
  }, [hasCustomDomain]);

  return (
    <div className="w-full pb-10">
      <label
        className="
        block font-semibold mb-1
        text-dashboard-text-light
        dark:text-dashboard-text-dark
      "
      >
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
                `/landing/check-username/${landing.username.trim()}`,
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
        w-75
        rounded-lg px-4 py-2
        border
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        placeholder-dashboard-muted-light
        dark:placeholder-dashboard-muted-dark
        border-dashboard-border-light
        dark:border-dashboard-border-dark
        ${
          hasCustomDomain
            ? "bg-dashboard-disabled-light dark:bg-dashboard-disabled-dark cursor-not-allowed opacity-60"
            : "bg-dashboard-bg-light dark:bg-dashboard-bg-dark"
        }
      `}
      />

      <p
        className="
        text-xs mt-1 mb-10
        text-dashboard-muted-light
        dark:text-dashboard-muted-dark
      "
      >
        {hasCustomDomain ? (
          <>
            Your page is live at{" "}
            <span className="block text-blue break-all">
              https://{primaryDomain}
            </span>
            <br />
            <span className="block mt-1 text-dashboard-muted-light dark:text-dashboard-muted-dark">
              Subdomain is disabled while a custom domain is active.
            </span>
          </>
        ) : (
          <>
            This will be used for your page URL{" "}
            <span className="block text-dashboard-muted-light dark:text-dashboard-muted-dark break-all">
              {landing.username
                ? `https://${landing.username}.themessyattic.com`
                : "https://yourname.themessyattic.com"}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
