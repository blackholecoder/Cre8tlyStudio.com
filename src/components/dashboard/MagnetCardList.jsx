import { useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import { themeStyles } from "../../constants/index";
import { CheckCircle, Download, Timer, Plus } from "lucide-react";

export default function MagnetCardList({ magnets = [], onAddPrompt }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!Array.isArray(magnets) || magnets.length === 0) return null;

  return (
    <div className="md:hidden space-y-4">
      {magnets.map((m, i) => (
        <div
          key={m.id}
          className="bg-neo p-4 rounded-xl shadow border border-gray-700"
        >
          <p className="text-sm text-white font-semibold mb-2">
            {m.slot_number || i + 1}
          </p>

          <p className="text-sm text-silver">
            <span className="font-semibold">Purchased:</span>{" "}
            {new Date(m.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
          </p>

          <p className="text-sm text-silver mt-1">
            <span className="font-semibold">Status:</span>{" "}
            {m.status === "completed" ? (
              <span className="bg-black text-green border border-green px-2 py-1 rounded-full text-xs font-semibold">
                Completed
              </span>
            ) : m.status === "failed" ? (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Failed
              </span>
            ) : m.status === "pending" ? (
              <span className="flex items-center gap-2 text-yellow-400 italic">
                <svg
                  className="animate-spin h-4 w-4 text-yellow"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Generating your PDF…
              </span>
            ) : (
              <span className="bg-black text-purple border border-white px-7 py-1 rounded-full text-xs font-semibold">
                Idle
              </span>
            )}
          </p>

          <p className="py-2 flex items-center gap-2">
            <span className="font-semibold text-silver">Theme:</span>
            {m.theme ? (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize"
                style={{
                  background: themeStyles[m.theme]?.background || "#333",
                  color: themeStyles[m.theme]?.color || "#fff",
                  border: themeStyles[m.theme]?.border || "none",
                }}
              >
                {m.theme}
              </span>
            ) : (
              <span className="text-gray-500 italic">N/A</span>
            )}
          </p>

          <p className="text-sm text-silver mt-1">
            {m.prompt ? (
              <div className="flex items-center text-headerGreen">
                <CheckCircle size={18} className="mr-1" />
              </div>
            ) : (
              <div className="flex items-center text-grey">
                <Timer size={18} className="mr-1" />
              </div>
            )}
          </p>
          {m.created_at_prompt ? (
            <span className="text-xs text-gray-300">
              <span className="text-green font-bold" >Created</span>{" "}
              {new Date(m.created_at_prompt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}{" "}
              {new Date(m.created_at_prompt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          ) : (
            <span className="text-gray-500 italic text-xs">N/A</span>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            {!m.prompt && (
              <button
                onClick={() => onAddPrompt(m.id)}
                className="flex items-center justify-center flex-1 px-3 py-2 bg-headerGreen text-white rounded"
              >
                <Plus className="text-black" size={18} />
              </button>
            )}

            {m.pdf_url && (
              <button
                onClick={() => setPreviewUrl(m.pdf_url)}
                className="flex items-center justify-center flex-1 px-3 py-2 bg-muteGrey text-white rounded"
              >
                <Download size={18} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* ✅ Shared PDF Preview Modal */}
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl}
          sourceType="magnet"
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  );
}
