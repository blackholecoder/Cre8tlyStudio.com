import React from "react";

export default function ToggleDownloadButton({
  showDownloadButton,
  setShowDownloadButton,
}) {
  return (
    <div
      className="
      mt-10
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light dark:border-dashboard-border-dark
      rounded-2xl
      shadow-inner
      p-6
      transition-all
      hover:border-dashboard-muted-light dark:hover:border-dashboard-muted-dark
    "
    >
      <div className="flex items-center justify-between">
        <label
          className="text-lg font-semibold tracking-wide
          text-dashboard-text-light dark:text-dashboard-text-dark"
        >
          Show “Download Now” Button
        </label>

        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showDownloadButton}
            onChange={(e) => setShowDownloadButton(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`block w-11 h-6 rounded-full transition-all duration-300 ${
              showDownloadButton
                ? "bg-green"
                : "bg-dashboard-border-light dark:bg-dashboard-border-dark"
            }`}
          ></span>
          <span
            className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300
          bg-dashboard-bg-light dark:bg-dashboard-bg-dark ${
            showDownloadButton ? "translate-x-5" : ""
          }`}
          ></span>
        </label>
      </div>

      <p
        className="text-xs mt-2
        text-dashboard-muted-light dark:text-dashboard-muted-dark"
      >
        Turn this off to hide the email capture form for free PDF downloads.
      </p>
    </div>
  );
}
