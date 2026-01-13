import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Timer,
  Eye,
  Plus,
  Layers,
  Rocket,
  Pencil,
} from "lucide-react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import BookPartsModal from "./BookPartsModal";
import { useAuth } from "../../admin/AuthContext";
import { Tooltip } from "../tools/toolTip";

export default function BookCardList({
  books = [],
  onAddPrompt,
  onGenerateNext,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
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
      {books.map((b) => (
        <motion.div
          key={b.id}
          whileTap={{ scale: 0.98 }}
          className="bg-[#0a0a0a]/90 rounded-xl border border-gray-800 p-4 shadow hover:shadow-[0_0_10px_rgba(0,255,150,0.15)] transition-all"
        >
          {/* Title */}
          <h3 className="text-white text-sm font-semibold truncate mb-1">
            {b.book_name || "Untitled Book"}
          </h3>

          {/* Part + Date */}
          <div className="text-[11px] text-gray-400 flex justify-between mb-2">
            <span>Part {b.part_number || 1}</span>
            <span>
              {new Date(b.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Progress */}
          <div className="flex flex-col items-center mb-3">
            <div className="w-full bg-gray-800 rounded-full overflow-hidden h-2">
              <div
                className="bg-gradient-to-r from-green to-royalPurple h-2"
                style={{ width: `${Math.min((b.pages / 750) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Generating…
              </div>
            ) : b.status === "failed" ? (
              <span className="bg-red-500 text-white px-3 py-[3px] rounded-full">
                Failed
              </span>
            ) : b.pages >= 750 ? (
              <span className="bg-green text-black px-3 py-[3px] rounded-full">
                Completed
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
              <Timer size={18} className="text-gray-500" />
            )}
          </div>

          {/* Created Timestamp */}
          <div className="text-[11px] text-gray-400 text-center mt-2">
            {b.created_at_prompt ? (
              <>
                {new Date(b.created_at_prompt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(b.created_at_prompt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </>
            ) : (
              <span className="italic text-gray-500">N/A</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-stretch gap-2 mt-3 w-full">
            {/* Add Chapter */}
            {!b.prompt && (
              <button
                onClick={() => onAddPrompt(b.id, b.part_number)}
                className="w-full bg-gray-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green hover:text-black transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus size={16} />
                  <span>Add Chapter</span>
                </div>
              </button>
            )}

            {/* Preview */}
            {b.has_part_1 === 0 && (b.is_draft === 1 || b.draft_text) && (
              <button
                onClick={() => onAddPrompt(b.id, b.part_number || 1)}
                className="w-full bg-blue hover:bg-blue text-white rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Rocket size={16} />
                <span>Continue Draft</span>
              </button>
            )}

            {b.can_edit === 1 && (
              <button
                onClick={() => onAddPrompt(b.id, b.part_number)}
                className="w-full bg-gray-900 hover:bg-gray-700 text-white rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all border border-gray-700"
              >
                <Pencil size={16} className="text-green" />
                <span>Edit Chapter</span>
              </button>
            )}

            {/* View All Parts */}
            {b.pdf_url && (
              <button
                onClick={() => openPartsModal(b.id)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2 transition"
              >
                <Layers size={16} />
                <span>View All Parts</span>
              </button>
            )}

            {/* Continue Story */}
            {b.prompt && b.pages < 750 && (
              <button
                onClick={() => onGenerateNext(b.id, (b.part_number || 1) + 1)}
                className="w-full bg-royalPurple text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Rocket size={16} />
                <span>
                  {b.pages >= 740
                    ? "Finish Book"
                    : `Continue Story (Part ${(b.part_number || 1) + 1})`}
                </span>
              </button>
            )}
          </div>
        </motion.div>
      ))}

      {/* ✅ PDF Preview Modal */}
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl.url}
          fileTitle={previewUrl.title}
          partNumber={previewUrl.partNumber}
          sourceType="book"
          onClose={() => setPreviewUrl(null)}
        />
      )}

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
