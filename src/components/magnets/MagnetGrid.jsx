import { motion } from "framer-motion";
import { useState } from "react";
import { themeStyles } from "../../constants/index";
import { CheckCircle, Edit, Plus, Timer, Eye, Pencil } from "lucide-react";
import NewContentModal from "../NewContentModal";
import PDFPreviewModal from "../dashboard/PDFPreviewModal";

export default function MagnetGrid({
  magnets = [],
  onAddPrompt,
  onOpenEditor,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const magnetList = Array.isArray(magnets) ? magnets : magnets?.magnets || [];
  if (!Array.isArray(magnetList) || magnetList.length === 0) return null;

  // ✅ When user continues after new prompt modal
  function handleCreate(data) {
    setShowNewModal(false);
    onAddPrompt(selectedSlot, data.contentType);
  }

  return (
    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {magnetList.map((m) => (
        <motion.div
          key={m.id}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative group bg-[#0a0a0a]/90 rounded-2xl p-4 border border-gray-800 hover:border-green hover:shadow-[0_0_15px_rgba(0,255,150,0.25)] transition-all"
        >
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[25deg] opacity-0 group-hover:opacity-100 animate-glimmer" />
  </div>
          {/* Glow accent */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl -z-10 transition-all"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Cover / Preview */}
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center overflow-hidden border border-gray-700 relative">
            {m.cover_image ? (
              <img
                src={m.cover_image}
                alt={m.title || "Lead Magnet Cover"}
                className="object-cover w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            ) : m.pdf_url ? (
              <img
                src={`https://cre8tlystudio.com/api/preview/${m.id}`}
                alt={m.title}
                className="object-cover w-full h-full rounded-xl opacity-80"
              />
            ) : (
              <span className="text-gray-600 text-xs italic">No Preview</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          </div>

          {/* Slot + Purchase date */}
          <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400">
            <span>Slot #{m.slot_number}</span>
            <span>
              {new Date(m.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white text-sm font-semibold mt-2 truncate">
            {m.title || "Untitled Magnet"}
          </h3>

          {/* Theme + Prompt */}
          <div className="flex items-center justify-between mt-2">
            {m.theme ? (
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold capitalize"
                style={{
                  background: themeStyles[m.theme]?.background || "#333",
                  color: themeStyles[m.theme]?.color || "#fff",
                  border: themeStyles[m.theme]?.border || "none",
                }}
              >
                {m.theme}
              </span>
            ) : (
              <span className="text-gray-500 italic text-[10px]">N/A</span>
            )}
            {m.prompt ? (
              <CheckCircle size={16} className="text-headerGreen" />
            ) : (
              <Timer size={16} className="text-gray-500" />
            )}
          </div>

          {/* Status */}
          <div className="mt-3 text-xs font-semibold text-center">
            {m.status === "completed" ? (
              <span className="bg-black text-green border border-green px-3 py-[3px] rounded-full">
                Completed
              </span>
            ) : m.status === "failed" ? (
              <span className="bg-red-500 text-white px-3 py-[3px] rounded-full">
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
                building...
              </div>
            ) : (
              <span className="bg-black text-purple border border-white px-4 py-[3px] rounded-full">
                Idle
              </span>
            )}
          </div>

          {/* Created prompt timestamp */}
          <div className="mt-2 text-[11px] text-gray-400 text-center">
            {m.created_at_prompt ? (
              <>
                {new Date(m.created_at_prompt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(m.created_at_prompt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </>
            ) : (
              <span className="italic text-gray-500">N/A</span>
            )}
          </div>

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

      {/* ✅ PDF Preview Modal */}
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
