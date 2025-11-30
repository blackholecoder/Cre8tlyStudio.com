import React from "react";

export default function ToggleDownloadButton({
  showDownloadButton,
  setShowDownloadButton
}) {
  return (
    <div className="mt-10 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 hover:border-silver/60 transition-all">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-silver tracking-wide">
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
              showDownloadButton ? "bg-green" : "bg-gray-600"
            }`}
          ></span>
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              showDownloadButton ? "translate-x-5" : ""
            }`}
          ></span>
        </label>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Turn this off if you want to hide the email download form on your public
        page.
      </p>
    </div>
  );
}
