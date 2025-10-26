import { themeStyles } from "../../constants/index";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import { useState } from "react";
import { CheckCircle, Download, Edit, Plus, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewContentModal from "../NewContentModal";

export default function MagnetTable({
  magnets = [],
  onAddPrompt,
  onOpenEditor,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  if (!Array.isArray(magnets) || magnets.length === 0) return null;

  // ✅ handle modal "Continue"
  function handleCreate(data) {
    setShowNewModal(false);
    onAddPrompt(selectedSlot, data.contentType); // pass to Dashboard logic
  }

  return (
    <div className="bg-[#111] hidden md:block overflow-x-auto rounded-xl overflow-hidden border border-gray-700">
      <table className="min-w-full text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-center">Slot</th>
            <th className="px-4 py-2 text-center">Purchased</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Theme</th>
            <th className="px-4 py-2 text-center">Prompt</th>
            <th className="px-4 py-2 text-center">Created</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {magnets.map((m) => (
            <tr key={m.id} className="border-t border-gray-700">
              <td className="px-4 py-2 text-center">{m.slot_number}</td>
              <td className="px-4 py-2 text-center">
                <span className="text-xs text-gray-300">
                  {new Date(m.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                </span>
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
              <td className="px-4 py-2 text-center">
                {m.created_at_prompt ? (
                  <span className="text-xs text-gray-300">
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
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  {!m.prompt && (
                    <button
                      onClick={() => {
                        setSelectedSlot(m.id);
                        setShowNewModal(true);
                      }}
                      className="flex items-center justify-center p-2 bg-headerGreen rounded"
                      title="Create New Document"
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
                  {m.pdf_url && !m.edit_used && (
                  <button
                    disabled={m.edit_used}
                    onClick={() => onOpenEditor(m.id)}
                    className="flex items-center justify-center p-2 bg-blue rounded"
                    title="Open Editor"
                  >
                    <Edit size={18} />
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

      {/* 🧠 New Project Modal */}
      {showNewModal && (
        <NewContentModal
          onCreate={handleCreate}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
}
