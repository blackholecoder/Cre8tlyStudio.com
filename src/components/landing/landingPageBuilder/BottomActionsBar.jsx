import React, { useState } from "react";

export default function BottomActionsBar({
  landing,
  user,
  handleSaveTemplate,
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="
      flex flex-col sm:flex-row sm:items-center sm:justify-between
      mt-16 pt-8
      border-t
      border-dashboard-border-light dark:border-dashboard-border-dark
    "
    >
      {/* Left: Save buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
        <button
          type="submit"
          name="save-landing"
          className="bg-green text-black px-6 py-3 rounded-lg shadow hover:bg-green transition"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={handleSaveTemplate}
          className="
          bg-dashboard-hover-light dark:bg-dashboard-hover-dark
          text-dashboard-text-light dark:text-dashboard-text-dark
          px-6 py-3
          rounded-lg
          shadow
          border
          border-dashboard-border-light dark:border-dashboard-border-dark
          hover:bg-dashboard-bg-light dark:hover:bg-dashboard-bg-dark
          transition
        "
        >
          Save Version
        </button>
      </div>

      {/* Right: View Live Page */}
      <div className="flex flex-col items-center sm:items-end mt-6 sm:mt-0 gap-2">
        <a
          href={
            landing.username
              ? `https://${landing.username}.cre8tlystudio.com?owner_preview=${encodeURIComponent(
                  user?.id || ""
                )}`
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`
      inline-flex items-center gap-2
      px-4 py-1.5
      rounded-full
      text-xs font-semibold
      border
      transition-all
      ${
        landing.username
          ? `
                bg-green/10
                text-dashboard-muted-light dark:text-dashboard-muted-dark
                border-green/30
                hover:bg-green/20
                hover:text-blue
              `
          : `
                bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                text-dashboard-muted-light dark:text-dashboard-muted-dark
                border-dashboard-border-light dark:border-dashboard-border-dark
                cursor-not-allowed
              `
      }
        `}
          onClick={(e) => {
            if (!landing.username) e.preventDefault();
          }}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {landing.username ? "View Live Page" : "Set username to view page"}
        </a>

        {/* Copy URL */}
        <p
          className="
          text-xs
          text-dashboard-muted-light dark:text-dashboard-muted-dark
          flex items-center gap-2
        "
        >
          Copy Live URL:
          {landing.username ? (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://${landing.username}.cre8tlystudio.com`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="text-silver font-medium hover:opacity-80"
            >
              {copied
                ? "Copied!"
                : `https://${landing.username}.cre8tlystudio.com`}
            </button>
          ) : (
            <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark">
              Not set
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
