import { useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import { CheckCircle, Download, Timer, Plus, Edit } from "lucide-react";

export default function MagnetCardList({
  magnets = [],
  onAddPrompt,
  onOpenEditor,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const magnetList = Array.isArray(magnets) ? magnets : magnets?.magnets || [];

  if (magnetList.length === 0) return null;

  return (
    <div className="md:hidden space-y-4">
      {magnetList.map((m, i) => (
        <div
          key={m.id}
          className="bg-neo p-4 rounded-xl shadow border border-gray-700"
        >
          <p className="text-sm text-white font-semibold mb-2">
            {m.slot_number || i + 1}
          </p>

          {/* 🧩 Inner info panel */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 space-y-2 shadow-inner">
            <p className="text-sm text-silver">
              <span className="font-semibold text-silver">Purchased:</span>{" "}
              {new Date(m.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </p>

            <p className="text-sm text-silver">
              <span className="font-semibold text-silver">Status:</span>{" "}
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

            <p className="text-sm flex items-center gap-2">
              <span className="font-semibold text-silver">Theme:</span>
              {m.theme ? (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {m.theme}
                </span>
              ) : (
                <span className="text-gray-500 italic">N/A</span>
              )}
            </p>
            <p className="text-sm text-silver">
              <span className="font-semibold text-silver">Title:</span>{" "}
              {m.title ? (
                <span className="text-white break-words">{m.title}</span>
              ) : (
                <span className="text-gray-500 italic">Untitled</span>
              )}
            </p>

            <div className="flex items-center text-sm text-silver">
              <span className="font-semibold text-silver mr-2">Prompt:</span>
              {m.prompt ? (
                <CheckCircle size={18} className="text-headerGreen" />
              ) : (
                <Timer size={18} className="text-grey" />
              )}
            </div>

            {m.created_at_prompt ? (
              <span className="text-xs text-gray-300 mt-2 block">
                <span className="text-green font-bold">Created</span>{" "}
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
              <span className="text-gray-500 italic text-xs mt-2 block">
                N/A
              </span>
            )}
          </div>

          {/* 🎯 Actions */}
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
                <Download
                  size={18}
                  className={`${m.status === "completed" ? "text-blue" : "text-white"} transition-colors`}
                />
              </button>
            )}

            {m.pdf_url && (
              <button
                onClick={() => !m.edit_used && onOpenEditor(m.id)}
                disabled={m.edit_used}
                className={`flex items-center justify-center flex-1 px-3 py-2 rounded ${
                  m.edit_used
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : " bg-gray-700 hover:bg-gray-700 text-white"
                }`}
              >
                <Edit className="text-green" size={18} />
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
          fileTitle={magnetList.find((m) => m.pdf_url === previewUrl)?.title || "Lead Magnet"}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  );
}
