import { useState } from "react";
import { motion } from "framer-motion";
import { themeStyles } from "../../constants/index";
import { CheckCircle, Timer, Eye, Edit, Plus, Pencil } from "lucide-react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import NewContentModal from "../NewContentModal";

export default function MagnetCardList({
  magnets = [],
  onAddPrompt,
  onOpenEditor,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const magnetList = Array.isArray(magnets) ? magnets : magnets?.magnets || [];
  if (!magnetList.length) return null;

  function handleCreate(data) {
    setShowNewModal(false);
    onAddPrompt(selectedSlot, data.contentType);
  }

  return (
    <div className="md:hidden flex flex-col gap-4 p-4">
      {magnetList.map((m) => (
        <motion.div
          key={m.id}
          whileTap={{ scale: 0.98 }}
          className="bg-[#0a0a0a]/90 rounded-xl border border-gray-800 p-4 shadow hover:shadow-[0_0_10px_rgba(0,255,150,0.15)] transition-all"
        >
          {/* Cover */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-700 mb-3">
            {m.cover_image ? (
              <img
                src={m.cover_image}
                alt={m.title || "Cover"}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-500 italic">
                No Preview
              </div>
            )}
          </div>

          {/* Title + Theme */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white text-sm font-semibold truncate max-w-[70%]">
              {m.title || "Untitled Magnet"}
            </h3>
            {m.theme ? (
              <span
                className="px-2 py-[2px] rounded-full text-[10px]"
                style={{
                  background: themeStyles[m.theme]?.background || "#333",
                  color: themeStyles[m.theme]?.color || "#fff",
                }}
              >
                {m.theme}
              </span>
            ) : (
              <span className="text-gray-500 text-[10px]">N/A</span>
            )}
          </div>

          {/* Slot + Date */}
          <div className="text-[11px] text-gray-400 flex justify-between mb-2">
            <span>Slot #{m.slot_number}</span>
            <span>
              {new Date(m.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            </span>
          </div>

          {/* Prompt status */}
          <div className="flex justify-center items-center gap-2 mb-2">
            {m.prompt ? (
              <CheckCircle size={16} className="text-headerGreen" />
            ) : (
              <Timer size={16} className="text-gray-500" />
            )}
            <span className="text-xs text-gray-400">
              {m.status === "completed"
                ? "Completed"
                : m.status === "pending"
                  ? "Building..."
                  : m.status === "failed"
                    ? "Failed"
                    : "Idle"}
            </span>
          </div>

          {/* Actions */}
          {/* Actions */}
          <div className="flex flex-col items-stretch gap-2 mt-4 w-full">
            {!m.prompt && (
              <button
                onClick={() => {
                  setSelectedSlot(m.id);
                  setShowNewModal(true);
                }}
                className="w-full bg-green text-black rounded-lg py-2 text-sm font-semibold hover:bg-green transition-all"
                title="Create New Document"
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus size={16} />
                  <span>New Document</span>
                </div>
              </button>
            )}

            {m.pdf_url && (
              <>
                <button
                  onClick={() => setPreviewUrl(m.pdf_url)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 text-sm transition-all"
                  title="Preview PDF"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye
                      size={16}
                      className={`${
                        m.status === "completed" ? "text-green" : "text-white"
                      } transition-colors`}
                    />
                    <span>View</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!m.edit_used) onOpenEditor(m.id);
                  }}
                  disabled={m.edit_used}
                  className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    m.edit_used
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                  title="Open Editor"
                >
                  <Pencil
                    size={16}
                    className={`${
                      m.edit_used ? "text-gray-500" : "text-white"
                    } transition-colors`}
                  />
                  <span>{m.edit_used ? "Closed" : "Edit"}</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      ))}

      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl}
          sourceType="magnet"
          fileTitle={
            magnetList.find((m) => m.pdf_url === previewUrl)?.title ||
            "Lead Magnet"
          }
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {showNewModal && (
        <NewContentModal
          onCreate={handleCreate}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
}
