import { useState } from "react";
import { renderEmailPreview } from "../../../helpers/renderEmailPreview";

export default function EmailPreview({ subject, bodyHtml, creatorName }) {
  const [mode, setMode] = useState("desktop");

  const previewVars = {
    subscriber_name: "John Doe",
    author_name: creatorName,
  };

  const rendered = renderEmailPreview({ subject, bodyHtml }, previewVars);

  return (
    <div className="sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-300">Preview</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("desktop")}
            className={`px-2 py-1 text-xs rounded ${
              mode === "desktop"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setMode("mobile")}
            className={`px-2 py-1 text-xs rounded ${
              mode === "mobile"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      {/* Email container */}
      <div
        className={`
          mx-auto rounded-lg border border-gray-700 bg-white text-black
          ${mode === "desktop" ? "max-w-xl" : "max-w-sm"}
        `}
      >
        {/* Subject */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Subject</p>
          <p className="font-medium">{rendered.subject || "(No subject)"}</p>
        </div>

        {/* Body */}
        <div
          className="px-4 py-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: rendered.html || "<p></p>" }}
        />
      </div>
    </div>
  );
}
