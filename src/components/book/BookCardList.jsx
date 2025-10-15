import { useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import BookPartsModal from "./BookPartsModal";
import { useAuth } from "../../admin/AuthContext";
import { CheckCircle, Download, Plus, Timer } from "lucide-react";

export default function BookCardList({ books = [], onAddPrompt }) {
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
    <div className="md:hidden space-y-4">
      {books.map((b, i) => (
        <div
          key={b.id}
          className="bg-neo p-4 rounded-xl shadow border border-gray-700"
        >
          {/* Title */}
          <p className="text-sm text-white font-semibold mb-2">
            {b.title || `Book #${i + 1}`}
          </p>

          {/* Created */}
          <p className="text-sm text-silver">
            <span className="font-semibold">Created:</span>{" "}
            {new Date(b.created_at).toLocaleDateString()}{" "}
            {new Date(b.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Status */}
          <p className="text-sm text-silver mt-1">
            <span className="font-semibold">Status:</span>{" "}
            {b.status === "completed" ? (
              <span className="bg-green text-black px-2 py-1 rounded-full text-xs font-semibold">
                Completed
              </span>
            ) : b.status === "failed" ? (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Failed
              </span>
            ) : b.status === "pending" ? (
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
                Generating your book…
              </span>
            ) : (
              <span className="text-gray-400 italic">Idle...</span>
            )}
          </p>

          {/* Prompt */}
          <p className="text-sm text-silver mt-1">
           {b.prompt ? (
                  <div className="flex items-center text-headerGreen">
                    <CheckCircle size={18} className="mr-1" />
                  </div>
                ) : (
                  <div className="flex items-center text-grey">
                    <Timer size={18} className="mr-1" />
                  </div>
                )}
          </p>

          {/* Part number */}
          {b.part_number && (
            <p className="text-sm text-silver mt-1">
              <span className="font-semibold">Part:</span> {b.part_number}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-3">
            {!b.prompt && (
              <button
                onClick={() => onAddPrompt(b.id, b.part_number)}
                className="w-full px-3 py-2 bg-royalPurple text-white rounded"
              >
                Add Prompt
              </button>
            )}

            {b.pdf_url && (
              <button
                onClick={() => setPreviewUrl(b.pdf_url)}
                className="w-full px-3 py-2 bg-blue text-white rounded"
              >
                Download
              </button>
            )}

            {b.status === "completed" && (
              <button
                onClick={() => openPartsModal(b.id)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                View All Parts
              </button>
            )}
          </div>
        </div>
      ))}

      {/* ✅ Shared PDF Preview Modal */}
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {/* ✅ Shared Book Parts Modal */}
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
