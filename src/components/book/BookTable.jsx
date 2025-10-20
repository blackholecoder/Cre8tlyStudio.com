import { useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import BookPartsModal from "./BookPartsModal";
import { useAuth } from "../../admin/AuthContext";
import { CheckCircle, Timer } from "lucide-react";

export default function BookTable({ books = [], onAddPrompt, onGenerateNext }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null);
  const { accessToken } = useAuth();

  function openPartsModal(bookId) {
    setActiveBookId(bookId);
    setShowPartsModal(true);
  }

  // ✅ If no books, return nothing
  if (!Array.isArray(books) || books.length === 0) return null;

  return (
    <>
      <div className="bg-[#111] hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Part</th>
              <th className="px-4 py-2 text-left">Pages</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Prompt</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((b) => (
              <tr
                key={`${b.id}-${b.part_number}`}
                className="border-t border-gray-700"
              >
                {/* Title */}
                <td className="px-4 py-2 font-semibold">
                  {b.book_name || "Untitled"}
                </td>

                {/* Part number */}
                <td className="px-4 py-2">Part {b.part_number || 1}</td>
                <td className="px-4 py-2">
                  <div className="w-24 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green to-royalPurple h-2"
                      style={{
                        width: `${Math.min((b.pages / 750) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {b.pages || 0}/750 pages
                  </p>
                </td>
                {/* Created date */}
                <td className="px-4 py-2">
                  {new Date(b.created_at).toLocaleDateString()}
                </td>
                {/* ✅ Smart Status Display */}
                <td className="px-4 py-2">
                  {b.status === "pending" ? (
                    <span className="flex items-center gap-2 text-yellow italic">
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
                    </span>
                  ) : b.status === "failed" ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Failed
                    </span>
                  ) : b.pages >= 750 ? (
                    <span className="bg-green text-black px-2 py-1 rounded-full text-xs font-semibold">
                      Completed
                    </span>
                  ) : (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      In Progress
                    </span>
                  )}
                </td>

                {/* Prompt status */}
                <td className="px-4 py-2">
                  {b.prompt ? (
                    <div className="flex items-center text-headerGreen">
                      <CheckCircle size={18} className="mr-1" />
                    </div>
                  ) : (
                    <div className="flex items-center text-grey">
                      <Timer size={18} className="mr-1" />
                    </div>
                  )}
                </td>

                {/* Action buttons */}
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {!b.prompt && (
                    <button
                      onClick={() => onAddPrompt(b.id, b.part_number)}
                      className="px-3 py-1 bg-blue rounded text-sm"
                    >
                      Add Chapter
                    </button>
                  )}
                  {b.pdf_url && (
                    <button
                      onClick={() =>
                        setPreviewUrl({
                          url: b.pdf_url,
                          title: b.title || b.book_name || "Untitled",
                          partNumber: b.part_number || 1,
                        })
                      }
                      className={`px-4 py-1 rounded text-sm ${
                        b.pages >= 750
                          ? "bg-green text-black"
                          : "bg-blue text-white"
                      }`}
                    >
                      {b.pages >= 750 ? "Download Book" : "Preview"}
                    </button>
                  )}
                  {b.pdf_url && (
                    <button
                      onClick={() => openPartsModal(b.id)}
                      className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600 transition"
                    >
                      View All Parts
                    </button>
                  )}
                  {b.prompt && b.pages < 750 && (
                    <button
                      onClick={() =>
                        onGenerateNext(b.id, (b.part_number || 1) + 1)
                      }
                      className="px-3 py-1 bg-gradient-to-r from-[#00E07A] to-[#6a5acd] text-black rounded text-sm hover:opacity-90 transition"
                    >
                      {b.pages >= 740
                        ? "🏁 Finish Book"
                        : `➕ Continue Story (Part ${(b.part_number || 1) + 1})`}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl.url}
          fileTitle={previewUrl.title}
          partNumber={previewUrl.partNumber}
          sourceType="book"
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {showPartsModal && (
        <BookPartsModal
          bookId={activeBookId}
          accessToken={accessToken}
          onClose={() => setShowPartsModal(false)}
        />
      )}
    </>
  );
}
