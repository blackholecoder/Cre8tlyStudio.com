import { useEffect, useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import axiosInstance from "../../api/axios";

export default function BookPartsModal({ bookId, onEditChapter, onClose }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl p-6 relative">
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
                      className="px-3 py-1 bg-royalPurple rounded text-sm text-white font-semibold hover:opacity-90 transition"
                    >
                      Open PDF
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onEditChapter(bookId, p.part_number);
                      }}
                      className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 transition"
                    >
                      Edit Chapter
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-xl hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>
      </div>

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
