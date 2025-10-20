import { themeStyles } from "../../constants/index";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import { useState } from "react";
import { CheckCircle, Download, Plus, Timer } from "lucide-react";

export default function MagnetTable({ magnets = [], onAddPrompt }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  if (!Array.isArray(magnets) || magnets.length === 0) return null;

  return (
    <div className="bg-[#111] hidden md:block overflow-x-auto">
      <table className="min-w-full border border-gray-700 text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-center">Slot</th>
            <th className="px-4 py-2 text-center">Created</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Theme</th>
            <th className="px-4 py-2 text-center">Prompt</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {magnets.map((m) => (
            <tr key={m.id} className="border-t border-gray-700">
              <td className="px-4 py-2 text-center">{m.slot_number}</td>
              <td className="px-4 py-2 text-center">
                {new Date(m.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
              </td>
              <td className="px-4 py-2 text-center">
                {m.status === "completed" ? (
                  <span className="bg-black text-green border border-green px-2 py-1 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                ) : m.status === "failed" ? (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Failed
                  </span>
                ) : m.status === "pending" ? (
                  <div className="flex items-center justify-center gap-2 text-yellow italic">
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
                  </div>
                ) : (
                  <span className="bg-black text-purple border border-white px-7 py-1 rounded-full text-xs font-semibold">
                    Idle
                  </span>
                )}
              </td>

              <td className="px-4 py-2 text-center">
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
              </td>
              <td className="px-4 py-2 text-center">
                {m.prompt ? (
                  <div className="flex items-center justify-center text-headerGreen">
                    <CheckCircle size={18} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-grey">
                    <Timer size={18} />
                  </div>
                )}
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  {!m.prompt && (
                    <button
                      onClick={() => onAddPrompt(m.id)}
                      className="flex items-center justify-center p-2 bg-headerGreen rounded"
                      title="Add Prompt"
                    >
                      <Plus className="text-black" size={18} />
                    </button>
                  )}
                  {m.pdf_url && (
                    <button
                      onClick={() => setPreviewUrl(m.pdf_url)}
                      className="flex items-center justify-center p-2 bg-muteGrey text-white rounded"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
