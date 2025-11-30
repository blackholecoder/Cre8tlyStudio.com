import React from "react";

export default function BottomActionsBar({
  landing,
  user,
  handleSaveTemplate,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-16 pt-8 border-t border-gray-700">
      {/* Left: Save buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
        <button
          type="submit"
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
      <div className="flex flex-col items-center sm:items-end mt-6 sm:mt-0">
        <a
          href={
            landing.username
              ? `https://${landing.username}.cre8tlystudio.com?owner_preview=${encodeURIComponent(
                  user?.id || ""
                )}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            landing.username
              ? "text-green font-semibold underline hover:text-white"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {landing.username ? "View Live Page" : "Set Username to View Page"}
        </a>

        <p className="text-xs text-gray-500 mt-1">
          Live URL:{" "}
          <span className="text-silver font-medium">
            {landing.username
              ? `https://${landing.username}.cre8tlystudio.com`
              : "Not set"}
          </span>
        </p>
      </div>
    </div>
  );
}
