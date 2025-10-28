import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
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
  initialBookData,
}) {
  const [text, setText] = useState("");
  const [pages, setPages] = useState(10);
  const [link, setLink] = useState("");
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [bookName, setBookName] = useState(initialBookData?.title || "");
  const [authorName, setAuthorName] = useState(
    initialBookData?.authorName || ""
  );
  const [bookType, setBookType] = useState(
    initialBookData?.bookType || "fiction"
  );

  useEffect(() => {
    if (initialBookData) {
      console.log("🩵 Syncing initialBookData to state:", initialBookData);
      setBookName(initialBookData.title || "");
      setAuthorName(initialBookData.authorName || "");
      setBookType(initialBookData.bookType || "fiction");
    }
  }, [initialBookData]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter your book idea or prompt first.");
      return;
    }

    // ✅ Close modal *immediately* to prevent Tauri race
    onClose();

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
          bookType,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      clearInterval(interval);
      setProgress(100);
      toast.success("📚 Book section generated successfully!");
      setShowGenerating(false);

      // ✅ Wait a short moment so DB finishes writing the new book part
      await new Promise((r) => setTimeout(r, 1000));

      // ✅ Trigger dashboard refresh + callback safely
      window.dispatchEvent(new Event("refreshBooks"));
      if (typeof onSubmitted === "function") {
        setTimeout(() => onSubmitted(bookId, text), 1000);
      }
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setShowGenerating(false);
      toast.error(
        err.response?.data?.message || "Book generation failed. Try again."
      );
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
      <div className="relative flex items-center justify-center px-6 py-5 border-b border-gray-700 bg-[#111]">
        {/* Centered Title */}
        <h1 className="text-2xl font-semibold text-white text-center">
          📖 Build Your Novel — Part {partNumber}
        </h1>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-6 md:left-36 text-silver hover:text-white transition text-lg"
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
          authorName={authorName}
          setAuthorName={setAuthorName}
          bookName={bookName}
          setBookName={setBookName}
          bookType={bookType}
          onSubmit={handleSubmit}
          loading={loading}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      </div>
    </div>
  );
}
