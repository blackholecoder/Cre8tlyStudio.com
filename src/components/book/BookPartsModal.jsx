import { useEffect, useState } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";

export default function BookPartsModal({ bookId, accessToken, onClose }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    async function fetchParts() {
      try {
        const res = await fetch(
          `https://cre8tlystudio.com/api/books/${bookId}/parts`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await res.json();
        setParts(data);
      } catch (err) {
        console.error("❌ Failed to load book parts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchParts();
  }, [bookId, accessToken]);

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
                  className="flex justify-between items-center border-b border-gray-700 pb-3"
                >
                  <div>
                    <p className="text-white font-semibold">
                      Part {p.part_number}: {p.title || "Untitled"}
                    </p>
                    <p className="text-white">Total pages: {p.pages}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setPreviewUrl({
                        url: p.file_url,
                        title: p.title,
                        partNumber: p.part_number,
                      })
                    }
                    className="px-3 py-1 bg-gradient-to-r from-[#00E07A] to-[#6A5ACD] rounded text-sm text-black font-semibold hover:opacity-90 transition"
                  >
                    Open PDF
                  </button>
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
