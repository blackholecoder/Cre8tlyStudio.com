import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import BookPromptForm from "../Book/BookPromptForm";
import PDFThemePreview from "../../PDFThemePreview";
import ThemePreviewModal from "../ThemePreviewModal";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [pages, setPages] = useState(10);
  const [link, setLink] = useState("");
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookInfo, setBookInfo] = useState(null);

  // ✅ Reset when closing
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

  // ✅ Fetch book info
  useEffect(() => {
    async function fetchBook() {
      if (!bookId) return;
      try {
        const res = await fetch(`https://cre8tlystudio.com/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setBookInfo(data);
      } catch (err) {
        console.error("Failed to load book info:", err);
      }
    }
    fetchBook();
  }, [bookId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter your book idea or prompt first.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setShowGenerating(true);

    let interval;
    try {
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
          bookName,
          partNumber,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      clearInterval(interval);
      setProgress(100);
      toast.success("📚 Book section generated successfully!");
      setTimeout(() => setShowGenerating(false), 800);

      if (typeof onSubmitted === "function") {
        setTimeout(() => onSubmitted(bookId, text), 1500);
      }
      setTimeout(() => {
  onClose(); // this hides the modal
  window.dispatchEvent(new Event("refreshBooks")); // custom event to refresh
}, 2000);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setShowGenerating(false);
      toast.error(err.response?.data?.message || "Book generation failed. Try again.");
      console.error("❌ Book generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  // ✅ Full-screen layout replaces modal
  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b0b] text-white flex flex-col overflow-hidden">
      {/* Header Bar */}
      {/* Header Bar */}
<div className="relative flex items-center justify-center px-6 py-5 border-b border-gray-700 bg-[#111]">
  {/* Centered Title */}
  <h1 className="text-2xl font-semibold text-white text-center">
    📖 Build Your Novel — Part {partNumber}
  </h1>

  {/* Back button absolutely positioned left */}
  <button
    onClick={onClose}
    className="absolute left-6 text-silver hover:text-white transition text-lg"
  >
    ← Back
  </button>
</div>

      {/* Writing Area */}
      <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
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
          authorName={bookInfo?.author_name || ""}
          setAuthorName={() => {}}
          bookName={bookInfo?.title || ""}
          setBookName={() => {}}
          onSubmit={handleSubmit}
          loading={loading}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <ThemePreviewModal
          showPreview={showPreview}
          onClose={() => setShowPreview(false)}
          PDFThemePreview={PDFThemePreview}
        />
      )}
    </div>
  );
}
