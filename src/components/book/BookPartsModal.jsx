import { useEffect, useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import axiosInstance from "../../api/axios";

export default function BookPartsModal({ bookId, onEditChapter, onClose }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [epubUrl, setEpubUrl] = useState(null);
  const [isComplete, setIsComplete] = useState(null);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const isBookMetaLoaded = isComplete !== null;

  useEffect(() => {
    async function fetchParts() {
      try {
        const res = await axiosInstance.get(`/books/${bookId}/parts`);
        setParts(res.data);
      } catch (err) {
        console.error("❌ Failed to load book parts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchParts();
  }, [bookId]);

  useEffect(() => {
    async function fetchBookMeta() {
      try {
        const res = await axiosInstance.get(`/books/${bookId}`);
        setEpubUrl(res.data.epub_url || null);
        setIsComplete(Boolean(res.data.is_complete));
      } catch (err) {
        console.error("❌ Failed to load book metadata:", err);
      }
    }

    fetchBookMeta();
  }, [bookId]);

  const isPublishable = parts.length > 0 && parts.every((p) => p.file_url);

  async function handlePublishEPUB() {
    setPublishing(true);
    setPublishError(null);

    try {
      const res = await axiosInstance.post(`/books/${bookId}/epub/generate`);

      setEpubUrl(res.data.epubUrl); // ✅ correct
    } catch (err) {
      console.error("❌ EPUB publish failed:", err);
      setPublishError(err?.response?.data?.error || "Failed to generate EPUB");
    } finally {
      setPublishing(false);
    }
  }

  async function handleFinalizeBook() {
    setFinalizing(true);

    try {
      await axiosInstance.post(`/books/${bookId}/finalize`);

      // ✅ Lock UI immediately
      setIsComplete(true);
      setParts((prev) => prev.map((p) => ({ ...p, can_edit: 0 })));

      setShowFinalizeModal(false);
    } catch (err) {
      console.error("❌ Finalize failed:", err);
      alert(err?.response?.data?.error || "Failed to finalize book");
    } finally {
      setFinalizing(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0b0b0b] border border-gray-700 rounded-2xl w-full max-w-3xl p-6 relative">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📚 Book Parts
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center">Loading parts...</p>
          ) : parts.length === 0 ? (
            <p className="text-gray-400 text-center">No parts found yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {parts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between border-b border-gray-700 pb-3"
                >
                  <div className="min-w-0 pr-6">
                    <p className="text-white font-semibold break-words leading-snug">
                      Part {p.part_number}: {p.title || "Untitled"}
                    </p>
                    <p className="text-white">Total pages: {p.pages}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setPreviewUrl({
                          url: p.file_url,
                          title: p.title,
                          partNumber: p.part_number,
                        })
                      }
                      className="px-3 py-1 bg-bookBtnColor rounded text-sm text-black font-semibold hover:opacity-90 transition"
                    >
                      Open PDF
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onEditChapter(bookId, p.part_number);
                      }}
                      disabled={isComplete || !p.can_edit}
                      className={`px-3 py-1 rounded text-sm font-semibold transition
  ${
    !isComplete && p.can_edit
      ? "bg-gray-900 border border-gray-700 text-white hover:bg-gray-700"
      : "bg-gray-800 text-gray-500 cursor-not-allowed"
  }`}
                    >
                      Edit Chapter
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 border-t border-gray-700 pt-6">
            <h3 className="text-white font-semibold text-lg mb-2">
              Book Status
            </h3>

            {isBookMetaLoaded &&
              (!isComplete ? (
                <>
                  <p className="text-gray-400 text-sm mb-3">
                    When you finalize this book, all chapters will be locked and
                    the book can be published as a full EPUB.
                  </p>

                  <button
                    onClick={() => setShowFinalizeModal(true)}
                    className="w-full py-3 rounded-xl font-semibold bg-yellow hover:bg-yellow/80 text-black transition"
                  >
                    Finalize Book
                  </button>
                </>
              ) : (
                <p className="text-green font-medium">
                  ✅ This book has been finalized
                </p>
              ))}
          </div>

          {/* ✅ Publish EPUB Section */}

          {isComplete && (
            <div className="mt-6 border-t border-gray-700 pt-6 flex flex-col items-center gap-3">
              {publishError && (
                <p className="text-red-400 text-sm text-center">
                  {publishError}
                </p>
              )}

              <button
                onClick={handlePublishEPUB}
                disabled={!isPublishable || publishing}
                className={`w-full py-3 rounded-xl font-semibold transition
        ${
          isPublishable
            ? "bg-green hover:bg-green/80 text-black"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
              >
                {publishing
                  ? "Publishing EPUB..."
                  : "Publish Full Book as EPUB"}
              </button>

              {!isPublishable && (
                <p className="text-gray-500 text-xs text-center">
                  All chapters must be completed before publishing
                </p>
              )}

              {epubUrl && (
                <a
                  href={epubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-xl font-semibold bg-blue hover:bg-blue/80 text-white transition"
                >
                  Download EPUB
                </a>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-xl hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {showFinalizeModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#0b0b0b] border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Finalize Book?
            </h3>

            <p className="text-gray-400 text-sm text-center mb-6">
              <strong>This action cannot be undone.</strong>
              <br /> Once finalized, chapters can no longer be edited <br />
              and the book will be prepared for EPUB publishing.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFinalizeModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleFinalizeBook}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition"
                disabled={finalizing}
              >
                {finalizing ? "Finalizing..." : "Yes, Finalize"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ PDF Viewer Modal */}
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl.url}
          fileTitle={previewUrl.title}
          partNumber={previewUrl.partNumber}
          sourceType="book"
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </>
  );
}
