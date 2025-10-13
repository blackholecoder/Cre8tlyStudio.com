import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "axios";
import PDFThemePreview from "../../PDFThemePreview";
import ThemePreviewModal from "../ThemePreviewModal";
import BookPromptForm from "../Book/BookPromptForm";

export default function BookPromptModal({
  isOpen,
  onClose,
  bookId,
  partNumber = 1,
  accessToken,
  onSubmitted,
  setShowGenerating,
  setProgress,
}) {
  const [text, setText] = useState("");
  const [pages, setPages] = useState(10);
  const [link, setLink] = useState("");
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [authorName, setAuthorName] = useState("");

  // ✅ Reset on close
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setPages(10);
      setLink("");
      setCover(null);
      setTitle("");
      setAuthorName("");
      setProgress(0);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!loading) onClose();
  };

 async function handleSubmit(e) {
  e.preventDefault();
  if (!text.trim()) {
    toast.error("Please enter your book idea or prompt first.");
    return;
  }

  setLoading(true);
  setProgress(0);
  setShowGenerating(true);
  onClose(); // ✅ closes modal so overlay shows

  let interval;
  try {
    // Simulate progress animation
    interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 4 : p));
    }, 400);

    const res = await axios.post(
      "https://cre8tlystudio.com/api/books/prompt",
      {
        bookId,
        prompt: text,
        pages,
        link,
        coverImage: cover,
        title,
        authorName,
        partNumber,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    clearInterval(interval);
    setProgress(100);
    toast.success("📚 Book section generated successfully!");

    // ✅ Hide overlay after short delay
    setTimeout(() => setShowGenerating(false), 800);

    // ✅ Refresh dashboard after generation
    if (typeof onSubmitted === "function") {
      setTimeout(() => onSubmitted(bookId, text), 1500);
    }
  } catch (err) {
    console.error("❌ Book generation error:", err);
    clearInterval(interval);
    setProgress(0);
    setShowGenerating(false);
    toast.error(err.response?.data?.message || "Book generation failed. Try again.");

    if (typeof onSubmitted === "function") {
      setTimeout(() => onSubmitted(bookId, text), 2500);
    }
  } finally {
    setLoading(false);
  }
}


  return (
    <Transition show={isOpen} appear>
      <Dialog className="relative z-50" onClose={handleClose}>
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gray-900 p-8 shadow-2xl border border-gray-700">
            <DialogTitle className="text-2xl font-bold text-white mb-6 text-center">
              📖 Build Your Novel Part {partNumber}
            </DialogTitle>

            {/* ---------- Form ---------- */}
            <div
              className={`transition-all duration-300 ${
                loading ? "pointer-events-none blur-sm opacity-50" : ""
              }`}
            >
              <BookPromptForm
                text={text}
                setText={setText}
                pages={pages}
                setPages={setPages}
                link={link}
                setLink={setLink}
                cover={cover}
                setCover={setCover}
                title={title}
                setTitle={setTitle}
                authorName={authorName}        // ✅ add these
                setAuthorName={setAuthorName} 
                onSubmit={handleSubmit}
                loading={loading}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
              />
            </div>
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className={`absolute top-4 right-4 text-white text-xl transition ${
                loading ? "opacity-30 cursor-not-allowed" : "hover:text-red-400"
              }`}
            >
              ✕
            </button>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Theme Preview Modal */}
      {showPreview && (
        <ThemePreviewModal
          showPreview={showPreview}
          onClose={() => setShowPreview(false)}
          PDFThemePreview={PDFThemePreview}
        />
      )}
    </Transition>
  );
}
