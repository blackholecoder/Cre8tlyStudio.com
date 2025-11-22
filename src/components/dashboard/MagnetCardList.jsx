import { useState } from "react";
import { motion } from "framer-motion";
import { themeStyles } from "../../constants/index";
import { CheckCircle, Timer, Eye, Plus, Pencil, Trash2 } from "lucide-react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import NewContentModal from "../NewContentModal";
import { useAuth } from "../../admin/AuthContext";
import { toast } from "react-toastify";

export default function MagnetCardList({
  magnets = [],
  onAddPrompt,
  onOpenEditor,
  onDelete,
}) {
  const { user } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const magnetList = Array.isArray(magnets) ? magnets : magnets?.magnets || [];
  if (!magnetList.length) return null;

  function handleCreate(data) {
    setShowNewModal(false);
    onAddPrompt(selectedSlot, data.contentType);
  }

  const isFreePlan = user?.has_free_magnet === 1 && user?.magnet_slots === 1;

    function handleDeleteConfirm(id, onDelete) {
      toast.dismiss();
  
      // Create overlay for blur + dim background
      const overlay = document.createElement("div");
      overlay.className =
        "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]";
      document.body.appendChild(overlay);
  
      // Centered modal box
      const toastContent = document.createElement("div");
      toastContent.className =
        "bg-[#0B0F19] border border-gray-700 rounded-xl p-6 text-center text-gray-100 shadow-xl";
      toastContent.style.width = "340px";
      toastContent.innerHTML = `
      <p class="text-sm font-medium text-gray-100 mb-4">Are you sure you want to delete this magnet?</p>
      <div class="flex justify-center gap-3">
        
        <button id="cancelDelete" class="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-xs font-semibold hover:bg-gray-600 transition">Cancel</button>
        <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition">Delete</button>
      </div>
    `;
      overlay.appendChild(toastContent);
  
      // ✅ Confirm delete
      document.getElementById("confirmDelete").onclick = async () => {
        try {
          onDelete(id);
          toast.success("Magnet deleted successfully.", {
            position: "top-right",
          });
        } catch (err) {
          toast.error("Failed to delete magnet.", {
            position: "top-right",
            style: {
              background: "#0B0F19",
              color: "#E5E7EB",
              border: "1px solid #1F2937",
              borderRadius: "0.5rem",
            },
          });
        } finally {
          overlay.remove();
        }
      };
  
      // ❌ Cancel delete
      document.getElementById("cancelDelete").onclick = () => {
        overlay.remove();
      };
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
              {m.title || "Digital Asset"}
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

                {/* EDIT BUTTON (from MagnetGrid) */}
                <button
                  onClick={() => {
                    if (isFreePlan) {
                      window.location.href = "/plans";
                      return;
                    }
                    if (!m.edit_used) onOpenEditor(m.id);
                  }}
                  disabled={m.edit_used}
                  className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    m.edit_used
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                      : isFreePlan
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-700 cursor-pointer"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                  title={
                    isFreePlan ? "Upgrade to unlock editing" : "Open Editor"
                  }
                >
                  <Pencil
                    size={16}
                    className={`${m.edit_used ? "text-gray-500" : "text-white"} transition-colors`}
                  />
                  <span>
                    {isFreePlan
                      ? "Unlock Edit"
                      : m.edit_used
                        ? "Closed"
                        : "Edit"}
                  </span>
                </button>
                {/* <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this lead magnet?"
                      )
                    ) {
                      onDelete(m.id);
                    }
                  }}
                  className="w-full bg-red-600/70 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} className="text-white" />
                  <span>Delete</span>
                </button> */}
                <button
                  onClick={() => handleDeleteConfirm(m.id, onDelete)}
                  className="w-full bg-red-600/70 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} className="text-white" />
                  <span>Delete</span>
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
