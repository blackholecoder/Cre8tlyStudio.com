import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import CoverUpload from "../CoverUpload";
import BookEditor from "../../book/BookEditor";
import { useAuth } from "../../../admin/AuthContext";

export default function BookPromptForm({
  text,
  setText,
  pages,
  setPages,
  link,
  setLink,
  cover,
  setCover,
  title,
  setTitle,
  authorName,
  bookName,
  setBookName,
  bookType,
  setBookType,
  loading,
  bookId,
  setBookId, // may be undefined when editing existing book
  partLocked,
  partNumber,
  onClose,
  setShowGenerating,
  setProgress
}) {
  const [saving, setSaving] = useState(false);
  const [restored, setRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const { accessToken } = useAuth();
  const [hasShownBanner, setHasShownBanner] = useState(
    sessionStorage.getItem("shownDraftBanner") === "true"
  );
  const [draftAuthor, setDraftAuthor] = useState(authorName || "");


  useEffect(() => {
  async function loadDraft() {
    if (!bookId) return;

    try {
      // ✅ Decide which endpoint to hit based on part number
      const endpoint =
        partNumber > 1
          ? `https://cre8tlystudio.com/api/books/${bookId}/part/${partNumber}/draft`
          : `https://cre8tlystudio.com/api/books/draft/${bookId}`;

      const res = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.draft_text) {
        setText(res.data.draft_text);
        if (res.data.title) setBookName(res.data.title);
        if (res.data.link) setLink(res.data.link);
        if (res.data.last_saved_at) setLastSavedAt(res.data.last_saved_at);
        if (res.data.author_name) setDraftAuthor(res.data.author_name);
        if (res.data.book_type) setBookType(res.data.book_type);

        // ✅ Only show banner once per session
        if (!hasShownBanner) {
          setRestored(true);
          toast.info("Loaded saved draft ✍️");
          setTimeout(() => setRestored(false), 4000);
          sessionStorage.setItem("shownDraftBanner", "true");
          setHasShownBanner(true);
        }
      } else {
        console.log("No saved draft found for this book or part.");
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to load draft:", err);
      }
    }
  }

  loadDraft();
}, [bookId, partNumber]);


  async function handleSaveDraft() {
  if (!text?.trim()) {
    toast.warn("Write something before saving!");
    return;
  }

  setSaving(true);

  try {
    // ✅ Choose correct endpoint based on part number
    const endpoint =
      partNumber > 1
        ? `https://cre8tlystudio.com/api/books/${bookId}/part/${partNumber}/draft`
        : "https://cre8tlystudio.com/api/books/draft";

    const res = await axiosInstance.post(
      endpoint,
      {
        bookId,
        draftText: text,
        book_name: bookName,
        link,
        author_name: draftAuthor || authorName,
        book_type: bookType,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // ✅ Only setBookId if prop exists and new id was returned
    if (res.data.id && typeof setBookId === "function") {
      setBookId(res.data.id);
    }

    toast.success("Draft saved successfully 💾");
  } catch (err) {
    console.error("Save draft failed:", err);
    toast.error("Failed to save draft");
  } finally {
    setSaving(false);
  }
}


  // ✅ Submit for generation (finalize book)
 async function handleSubmit(e) {
  e.preventDefault();

  try {
    setShowGenerating(true);
    setProgress(0);
    onClose();

    // 🔹 Start fake progress simulation
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue +=
        progressValue < 60
          ? Math.random() * 4.5
          : progressValue < 85
          ? Math.random() * 2.5
          : Math.random() * 1.2;
      if (progressValue >= 96) progressValue = 96;
      setProgress(progressValue);
    }, 200);

    const payload = {
      bookId,
      title,
      prompt: text,
      pages,
      link,
      cover,
      bookName,
      authorName,
      bookType,
    };

    const res = await axiosInstance.post(
      "https://cre8tlystudio.com/api/books/prompt",
      payload
    );

    clearInterval(interval);
    setProgress(100);
    toast.success("Chapter generation successful! 🚀");

    // ✅ Hide overlay after short delay
    setTimeout(() => setShowGenerating(false), 1500);

    localStorage.removeItem("bookDraftLocal");
    console.log("Book generated:", res.data);
  } catch (err) {
    console.error("Book generation failed:", err);
    toast.error("Failed to generate book");
    setShowGenerating(false);
  }
}

  function formatTimeAgo(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  return (
    <>
      {restored && (
        <div className="mb-4 text-center py-2 px-4 bg-green/20 border border-green text-green rounded-lg animate-fadeIn transition-all duration-500 ease-out transform">
          ✨ Restored your last saved draft{" "}
          {lastSavedAt && (
            <span className="text-sm text-gray-400">
              (saved {formatTimeAgo(lastSavedAt)})
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ---------- Book Info ---------- */}
        <div>
          <label className="block text-silver mb-2 font-medium">
            Book Name
          </label>
          <input
            type="text"
            placeholder="e.g. The Clockmaker’s Secret"
            value={bookName}
            readOnly
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            This is your book’s main title.
          </p>
        </div>

        <div>
          <label className="block text-silver mb-2 font-medium">
            Author Name
          </label>
          <input
            type="text"
            value={draftAuthor || authorName || ""}
            readOnly
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-medium">
            Book Type
          </label>
          <input
            type="text"
            value={bookType}
            readOnly
            className="w-full px-4 py-3 mb-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-medium">
            Chapter Title
          </label>
          <input
            type="text"
            placeholder="e.g. The Midnight Promise"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green focus:outline-none"
          />
        </div>

        {/* ---------- Editor ---------- */}
        <div className="border border-gray-700 rounded-xl">
          <BookEditor content={text} setContent={setText} />
        </div>

        {/* ---------- Cover Upload ---------- */}
        <CoverUpload cover={cover} setCover={setCover} />

        {/* ---------- Other Fields ---------- */}
        <div>
          <label className="block text-silver mb-2 font-medium">
            Number of Pages
          </label>
          <div className="relative w-full max-w-xs">
            <input
              type="number"
              min="1"
              max="10"
              value={pages ?? ""}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full py-3 pr-20 pl-4 rounded-lg bg-gray-800 text-white border border-gray-600 text-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-silver mb-2 font-medium">
            Optional Website or Author Link
          </label>
          <input
            type="url"
            placeholder="https://yourwebsite.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>

        {/* ---------- Buttons ---------- */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!partLocked && (
    <button
      type="button"
      onClick={handleSaveDraft}
      disabled={saving}
      className={`flex-1 px-6 py-3 rounded-xl bg-green text-black font-semibold text-lg shadow-lg transition ${
        saving
          ? "opacity-70 cursor-not-allowed"
          : "hover:bg-green hover:text-black"
      }`}
    >
      {saving ? "Saving..." : "Save Draft"}
    </button>
          )}

          {!loading && (
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-royalPurple text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
            >
              🚀 Generate Book PDF
            </button>
          )}
        </div>
      </form>
    </>
  );
}
