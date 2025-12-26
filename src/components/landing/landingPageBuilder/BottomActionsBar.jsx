import React, { useState } from "react";

export default function BottomActionsBar({
  landing,
  user,
  handleSaveTemplate,
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-16 pt-8 border-t border-gray-700">
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
          className="bg-blue text-white px-6 py-3 rounded-lg shadow hover:bg-green transition"
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
          ? "bg-green/10 text-green border-green/30 hover:bg-green/20 hover:text-white"
          : "bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed"
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
        <p className="text-xs text-gray-500 flex items-center gap-2">
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
            <span className="text-gray-400">Not set</span>
          )}
        </p>
      </div>
    </div>
  );
}
