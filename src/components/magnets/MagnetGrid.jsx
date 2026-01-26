import { motion } from "framer-motion";
import { useState } from "react";
import { themeStyles } from "../../constants/index";
import {
  CheckCircle,
  Plus,
  Timer,
  Eye,
  Pencil,
  Package,
  Trash2,
  Lock,
} from "lucide-react";
import NewContentModal from "../NewContentModal";
import PDFPreviewModal from "../dashboard/PDFPreviewModal";
import { useAuth } from "../../admin/AuthContext";
import { toast } from "react-toastify";

export default function MagnetGrid({
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
  if (!Array.isArray(magnetList) || magnetList.length === 0) return null;

  // ✅ When user continues after new prompt modal
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
      "bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark border border-dashboard-border-light dark:border-dashboard-border-dark rounded-xl p-6 text-center text-dashboard-text-light dark:text-dashboard-text-dark shadow-xl";
    toastContent.style.width = "340px";
    toastContent.innerHTML = `
  <p class="text-sm font-medium mb-4
     text-dashboard-text-light
     dark:text-dashboard-text-dark">
    Are you sure you want to delete this magnet?
  </p>
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
    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {magnetList.map((m) => {
        const isLocked = Number(m.export_count || 0) > 0;

        return (
          <motion.div
            key={m.id}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="
            relative group
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            rounded-2xl p-4
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            hover:border-green
            hover:shadow-[0_0_15px_rgba(0,255,150,0.25)]
            transition-all
            "
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
            <div
              className="
              aspect-[4/3]
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              rounded-xl
              flex items-center justify-center
              overflow-hidden
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
              relative
              "
            >
              {m.cover_image && m.cover_image.trim() !== "" ? (
                <img
                  src={m.cover_image}
                  alt={m.title || "Lead Magnet Cover"}
                  className="object-cover w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-xs italic">
                  No Cover Selected
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>

            {/* Slot + Page Count + Date */}
            <div className="flex items-center justify-between mt-3 text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
              <div className="flex items-center gap-3">
                <span>Slot #{m.slot_number}</span>

                {typeof m.page_count === "number" && (
                  <span className="flex items-center gap-1 text-dashboard-text-light dark:text-dashboard-text-dark">
                    📄 {m.page_count} page{m.page_count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-dashboard-text-light dark:text-dashboard-text-dark text-sm font-semibold mt-2 line-clamp-1">
              {m.title || "Digital Asset"}
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
                <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark italic text-[10px]">
                  N/A
                </span>
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
                <span className="bg-dashboard-hover-light dark:bg-dashboard-bg-dark text-green border border-green px-3 py-[3px] rounded-full">
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
                <span className="bg-dashboard-hover-light dark:bg-dashboard-bg-dark text-purple border border-dashboard-border-light dark:border-dashboard-border-dark px-4 py-[3px] rounded-full">
                  Idle
                </span>
              )}
            </div>

            {/* Created prompt timestamp */}
            <div className="mt-2 text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark text-center">
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
                <span className="italic text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  N/A
                </span>
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
                  {/* View Button */}
                  <button
                    onClick={() => setPreviewUrl(m.pdf_url)}
                    className="
                    w-full
                    bg-dashboard-hover-light
                    dark:bg-dashboard-hover-dark
                    hover:opacity-90
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark
                    rounded-lg py-2 text-sm
                    transition-all
                    "
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

                  {/* Edit / Reversal / Locked Button */}
                  <button
                    onClick={() => {
                      if (isFreePlan) {
                        toast.error("Editing is available on Pro plans only.");
                        window.location.href = "/plans";
                        return;
                      }

                      if (isLocked) return;

                      onOpenEditor(m.id);
                    }}
                    disabled={isLocked || isFreePlan}
                    className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all
    ${
      isLocked || isFreePlan
        ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-muted-light dark:text-dashboard-muted-dark cursor-not-allowed opacity-70"
        : "bg-dashboard-hover-light dark:bg-dashboard-hover-dark hover:opacity-90 text-dashboard-text-light dark:text-dashboard-text-dark"
    }
  `}
                    title={
                      isFreePlan
                        ? "Upgrade to unlock editing"
                        : isLocked
                          ? "Editing locked after export"
                          : "Edit document"
                    }
                  >
                    {isLocked || isFreePlan ? (
                      <>
                        <Lock size={16} />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <Pencil size={16} />
                        <span>Edit</span>
                      </>
                    )}
                  </button>

                  {/* Canvas Editor Button */}
                  <button
                    onClick={() => {
                      if (isFreePlan) {
                        window.location.href = "/plans";
                        return;
                      }
                      if (!m.id || !m.pdf_url) {
                        alert("Missing lead magnet ID or PDF URL.");
                        return;
                      }
                      const canvasUrl = `/canvas-editor?id=${m.id}&pdf=${encodeURIComponent(
                        m.pdf_url,
                      )}`;
                      window.open(canvasUrl, "_blank");
                    }}
                    className={`hidden md:flex w-full font-semibold rounded-lg py-2 text-sm items-center justify-center gap-2 transition-all ${
                      isFreePlan
                        ? "bg-hotPink/70 text-gray-200 hover:bg-hotPink/70 cursor-pointer"
                        : "bg-mediaBlue dark:text-black hover:bg-mediaBlue/90"
                    }`}
                    title={
                      isFreePlan
                        ? "Upgrade to unlock Canvas Editor"
                        : "Open in Canvas Editor"
                    }
                  >
                    <Package size={16} />
                    <span>
                      {isFreePlan ? "Unlock Canvas Editor" : "Canvas Editor"}
                    </span>
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteConfirm(m.id, onDelete)}
                    className="w-full bg-gray-200 text-red-600 rounded-lg py-2 text-sm font-semibold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} className="text-red" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* ✅ PDF Preview Modal */}
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl}
          sourceType="magnet"
          magnetId={magnetList.find((m) => m.pdf_url === previewUrl)?.id}
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
