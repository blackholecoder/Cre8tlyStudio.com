import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Timer, Plus, Layers, Rocket } from "lucide-react";
import BookPartsModal from "./BookPartsModal";
import { Tooltip } from "../tools/toolTip";
import { useAuth } from "../../admin/AuthContext";

export default function BookCardList({
  books = [],
  onAddPrompt,
  onGenerateNext,
}) {
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null);
  const { accessToken } = useAuth();

  function openPartsModal(bookId) {
    setActiveBookId(bookId);
    setShowPartsModal(true);
  }

  if (!Array.isArray(books) || books.length === 0) return null;

  return (
    <div className="md:hidden flex flex-col gap-4 p-4">
      {books.map((b) => {
        const isFinalized = b.is_complete === 1;
        const canContinue = !isFinalized && b.pages < 750;

        return (
          <motion.div
            key={b.id}
            whileTap={{ scale: 0.98 }}
            className="
            relative group
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            rounded-xl p-4
            transition-all
          "
          >
            {/* Title */}
            <h3 className="text-dashboard-text-light dark:text-dashboard-text-dark text-sm font-semibold truncate mb-1">
              {b.book_name || "Untitled Book"}
            </h3>

            {/* Part + Date */}
            <div
              className="text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark
              flex justify-between mb-2"
            >
              <span>Part {b.part_number || 1}</span>
            </div>

            {/* Progress */}
            <div className="flex flex-col items-center mb-3">
              <div
                className="w-full rounded-full h-2
              bg-dashboard-border-light
              dark:bg-dashboard-border-dark"
              >
                <div
                  className="bg-gradient-to-r from-green to-royalPurple h-2"
                  style={{ width: `${Math.min((b.pages / 750) * 100, 100)}%` }}
                />
              </div>
              <p
                className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark
"
              >
                {b.pages || 0}/750 pages used
              </p>

              <Tooltip text="Pages are counted across the entire book. You can write, edit, and export PDFs freely until you reach 750 total pages. Downloads do not lock your book." />
            </div>

            {/* ✅ Book Status Pills */}
            <div className="book-status text-xs font-semibold text-center mt-3">
              {b.status === "pending" ? (
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Generating…
                </div>
              ) : b.status === "failed" ? (
                <span className="bg-red-500 text-white px-3 py-[3px] rounded-full">
                  Failed
                </span>
              ) : b.is_complete === 1 ? (
                <span className="bg-green text-black px-3 py-[3px] rounded-full">
                  Finalized
                </span>
              ) : b.pages > 0 ? (
                <span className="bg-blue text-white px-3 py-[3px] rounded-full">
                  In Progress
                </span>
              ) : (
                <span className="bg-gray-600 text-white px-3 py-[3px] rounded-full">
                  Idle
                </span>
              )}
            </div>

            {/* Prompt Indicator */}
            <div className="flex justify-center items-center mt-3">
              {b.prompt ? (
                <CheckCircle size={18} className="text-headerGreen" />
              ) : (
                <Timer
                  size={18}
                  className="text-dashboard-muted-light dark:text-dashboard-muted-dark
"
                />
              )}
            </div>

            {/* Created Timestamp */}
            <div
              className="text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark
              text-center mt-2 flex items-center justify-center gap-1"
            >
              {b.created_at_prompt ? (
                <>
                  <span>
                    {new Date(b.created_at_prompt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {new Date(b.created_at_prompt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>

                  <Tooltip text="This is the date and time this chapter was generated. Purchase dates are shown in Settings." />
                </>
              ) : (
                <span
                  className="italic text-dashboard-muted-light dark:text-dashboard-muted-dark
"
                >
                  Not generated yet
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-stretch gap-2 mt-3 w-full">
              {/* Add Chapter */}
              {!b.prompt && (
                <button
                  onClick={() => onAddPrompt(b.id, b.part_number)}
                  className="
                  w-full
                  bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                  text-dashboard-text-light
                  dark:text-dashboard-text-dark
                  rounded-lg py-2 text-sm font-semibold
                  hover:bg-green hover:text-black
                  transition-all
                "
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={16} />
                    <span>Add Chapter</span>
                  </div>
                </button>
              )}

              {/* View All Parts */}
              {b.pdf_url && (
                <button
                  onClick={() => openPartsModal(b.id)}
                  className="w-full bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                  text-dashboard-text-light
                  dark:text-dashboard-text-dark
                  hover:opacity-90 rounded-lg py-2 text-sm flex items-center justify-center gap-2 transition"
                >
                  <Layers size={16} />
                  <span>View All Parts</span>
                </button>
              )}

              {/* Continue Story */}
              {/* Continue Story */}
              {b.prompt && canContinue && (
                <button
                  onClick={() =>
                    b.pages >= 750
                      ? openPartsModal(b.id)
                      : onGenerateNext(b.id, (b.part_number || 1) + 1)
                  }
                  className="w-full bg-royalPurple text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-3"
                >
                  <Rocket size={16} />
                  <span>
                    {b.pages >= 750
                      ? "Finish Book"
                      : `Continue Story (Part ${(b.part_number || 1) + 1})`}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* ✅ Book Parts Modal */}
      {showPartsModal && (
        <BookPartsModal
          bookId={activeBookId}
          accessToken={accessToken}
          onClose={() => setShowPartsModal(false)}
        />
      )}
    </div>
  );
}
