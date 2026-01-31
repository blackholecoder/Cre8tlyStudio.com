import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BookPromptForm from "../Book/BookPromptForm";
import axiosInstance from "../../../api/axios";

export default function BookPromptModal({
  isOpen,
  onClose,
  bookId,
  partNumber = 1,
  onSubmitted,
  onCompleted,
  setShowGenerating,
  initialBookData,
}) {
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(10);
  const [link, setLink] = useState("");
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [partLocked, setPartLocked] = useState(false);

  const [bookName, setBookName] = useState(initialBookData?.bookName || "");
  const [authorName, setAuthorName] = useState(
    initialBookData?.authorName || "",
  );
  const [bookType, setBookType] = useState(
    initialBookData?.bookType || "fiction",
  );
  const [fontName, setFontName] = useState("Classic AdobeArabic");
  const [fontFile, setFontFile] = useState("/fonts/AdobeArabic-Regular.ttf");

  useEffect(() => {
    if (initialBookData) {
      console.log("🩵 Syncing initialBookData to state:", initialBookData);
      setBookName(initialBookData.bookName || "");
      setAuthorName(initialBookData.authorName || "");
      setBookType(initialBookData.bookType || "fiction");
    }
  }, [initialBookData]);

  // ✅ Reset when closing
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setPageCount(10);
      setLink("");
      setCover(null);
      setTitle("");
      setAuthorName("");
    }
  }, [isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter your book idea or prompt first.");
      return;
    }

    // ✅ Close modal *immediately* to prevent Tauri race
    onClose();
    setShowGenerating(true);

    try {
      axiosInstance.post("/books/prompt", {
        bookId,
        prompt: text,
        sections,
        pages: pageCount,
        link,
        coverImage: cover,
        title,
        authorName,
        bookName,
        partNumber,
        bookType,
      });

      toast.success("📚 Book section generated successfully!");

      // ✅ notify parent the generation is complete
      if (typeof onCompleted === "function") {
        onCompleted();
      }

      // optional: still mark pending state
      if (typeof onSubmitted === "function") {
        onSubmitted(bookId, text);
      }
    } catch (err) {
      setShowGenerating(false);
      toast.error(
        err.response?.data?.message || "Book generation failed. Try again.",
      );
      console.error("❌ Book generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  // ✅ Full-screen layout replaces modal
  return (
    <div
      className="
        fixed inset-0 z-50
        flex flex-col overflow-hidden
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
      "
    >
      {/* Header Bar */}
      <div
        className="
    relative flex items-center justify-center
    px-6 py-5
    border-b border-dashboard-border-light
    dark:border-dashboard-border-dark
    bg-dashboard-sidebar-light
    dark:bg-dashboard-sidebar-dark
  "
      >
        {/* Centered Title */}
        <h1 className="text-2xl font-semibold text-center text-dashboard-text-light dark:text-dashboard-text-dark">
          📖 Build Your Novel — Part {partNumber}
        </h1>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="
            absolute left-6 md:left-36
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
            hover:text-dashboard-text-light
            dark:hover:text-dashboard-text-dark
            transition
            text-lg
          "
        >
          ← Back
        </button>
      </div>

      {/* Writing Area */}
      <div
        className="
        flex-1 overflow-y-auto
        p-8
        max-w-5xl mx-auto w-full
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
      "
      >
        <BookPromptForm
          key={`${bookId}-${partNumber}`}
          text={text}
          setText={setText}
          pageCount={pageCount}
          setPageCount={setPageCount}
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
          setBookType={setBookType}
          onSubmit={handleSubmit}
          loading={loading}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          setShowGenerating={setShowGenerating}
          bookId={bookId}
          setBookId={() => {}}
          partLocked={partLocked}
          partNumber={partNumber}
          onClose={onClose}
          fontName={fontName}
          setFontName={setFontName}
          fontFile={fontFile}
          setFontFile={setFontFile}
        />
      </div>
    </div>
  );
}
