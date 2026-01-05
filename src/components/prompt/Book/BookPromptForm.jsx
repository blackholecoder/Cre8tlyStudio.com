import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import CoverUpload from "../CoverUpload";
import BookEditor from "../../book/BookEditor";
import { useAuth } from "../../../admin/AuthContext";
import FontSelector from "../FontSelector";
import { BookOpenCheck, Rocket, Replace } from "lucide-react";

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
  setProgress,
  fontName,
  setFontName,
  fontFile,
  setFontFile,
}) {
  const [saving, setSaving] = useState(false);
  const [restored, setRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const { accessToken } = useAuth();
  const [hasShownBanner, setHasShownBanner] = useState(
    sessionStorage.getItem("shownDraftBanner") === "true"
  );
  const [draftAuthor, setDraftAuthor] = useState(authorName || "");
  const [uploading, setUploading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const ext = file.name.split(".").pop().toLowerCase();

      // ---- TXT FILE ----
      if (ext === "txt") {
        const textContent = await file.text();
        setText(textContent);
        toast.success("Text imported!");
      }

      // ---- DOCX FILE ----
      else if (ext === "docx") {
        const mammoth = await import("mammoth");

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        setText(result.value || "");
        toast.success("DOCX imported!");
      }

      // ---- UNSUPPORTED ----
      else {
        toast.error("Unsupported file. Please upload .txt or .docx");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to import file.");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    async function loadDraft() {
      if (!bookId) return;

      try {
        // Decide which endpoint to hit
        const endpoint =
          partNumber > 1
            ? `/books/${bookId}/part/${partNumber}/draft`
            : `/books/draft/${bookId}`;

        const res = await axiosInstance.get(endpoint);

        console.log("🔥 Draft/GPT response:", res.data);

        setCanEdit(Boolean(Number(res.data.can_edit)));

        // -----------------------------
        // 🔥 1. Load DRAFT if available
        // -----------------------------
        if (res.data?.draft_text) {
          setText(res.data.draft_text);
          setIsAiGenerated(false);

          if (res.data.book_name) setBookName(res.data.book_name);
          if (res.data.link) setLink(res.data.link);
          if (res.data.last_saved_at) setLastSavedAt(res.data.last_saved_at);
          if (res.data.author_name) setDraftAuthor(res.data.author_name);
          if (res.data.book_type) setBookType(res.data.book_type);

          // Banner only for drafts
          if (!hasShownBanner) {
            setRestored(true);
            toast.info("Loaded saved draft ✍️");
            setTimeout(() => setRestored(false), 4000);
            sessionStorage.setItem("shownDraftBanner", "true");
            setHasShownBanner(true);
          }

          return; // stop here — drafts override GPT
        }

        // ----------------------------------------
        // 🔥 2. Otherwise load GPT-generated text
        // ----------------------------------------
        if (res.data?.gpt_output) {
          setText(res.data.gpt_output);
          setIsAiGenerated(true);

          if (res.data.book_name) setBookName(res.data.book_name);
          if (res.data.link) setLink(res.data.link);
          if (res.data.author_name) setDraftAuthor(res.data.author_name);
          if (res.data.book_type) setBookType(res.data.book_type);

          console.log("Loaded GPT-generated text");
          return;
        }

        // Otherwise nothing found
        console.log("No draft or GPT text found for this chapter.");
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
          bookName,
          link,
          author_name: draftAuthor || authorName,
          book_type: bookType,
          font_name: fontName, // ✅ added
          font_file: fontFile,
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
        prompt: text,
        pages,
        link,
        coverImage: cover,
        bookName,
        authorName,
        bookType,
        title,
        font_name: fontName,
        font_file: fontFile,
        partNumber,
        isEditing: canEdit ? true : false,
      };

      const res = await axiosInstance.post("/books/prompt", payload);

      console.log("PAYLOAD", payload);

      clearInterval(interval);
      setProgress(100);
      toast.success("Chapter generation successful! 🚀");

      // ✅ Hide overlay after short delay
      setTimeout(() => setShowGenerating(false), 1500);

      localStorage.removeItem("bookDraftLocal");
      console.log("Book generated:", res.data);
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        console.warn("backend still processing...please wait");
        toast.info("⏳ Your book is still generating — please wait");
        return; // ✅ don’t mark as failed
      }
      console.error("Book generation failed:", err);
      // toast.error("Failed to generate book");
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

  function handleFindReplace() {
    if (!findText.trim()) {
      toast.warn("Enter text to find");
      return;
    }

    const regex = new RegExp(findText, "gi");
    const updated = text.replace(regex, replaceText);

    setText(updated);
    toast.success("Replaced!");
    setShowFindReplace(false);
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
            placeholder="e.g. The Shining"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
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
            placeholder="e.g. The Black Widow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green focus:outline-none"
          />
        </div>

        {/* ---------- Editor ---------- */}
        <div className="mb-4 flex items-center gap-4">
          <input
            type="file"
            accept=".txt,.doc,.docx"
            id="bookUpload"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="bookUpload"
            className="cursor-pointer px-5 py-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition text-silver"
          >
            📤 Upload Text or DOCX
          </label>

          {uploading && <span className="text-gray-400">Processing...</span>}
          <button
            type="button"
            onClick={() => setShowFindReplace(true)}
            className="px-5 py-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition text-silver flex items-center gap-2"
          >
            <Replace size={18} />
            Find & Replace
          </button>
        </div>

        <div className="border border-gray-700 rounded-xl">
          {!partLocked || canEdit ? (
            <BookEditor content={text} setContent={setText} />
          ) : (
            <div className="p-4 bg-gray-800 text-gray-400 rounded-lg border border-gray-700">
              Chapter is locked.
            </div>
          )}
        </div>
        <FontSelector
          fontName={fontName}
          setFontName={setFontName}
          fontFile={fontFile}
          setFontFile={setFontFile}
        />
        {/* ---------- Cover Upload ---------- */}
        <CoverUpload cover={cover} setCover={setCover} />

        {/* ---------- Other Fields ---------- */}
        {bookType !== "non-fiction" && (
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
        )}

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
              disabled={partLocked && !canEdit}
              className="flex-1 px-6 py-3 rounded-xl bg-royalPurple text-white font-semibold text-lg shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {isAiGenerated ? (
                <>
                  <BookOpenCheck size={18} className="text-white" />
                  Commit Final Chapter
                </>
              ) : (
                <>
                  <Rocket size={18} className="text-white" />
                  Generate Book PDF
                </>
              )}
            </button>
          )}
          {showFindReplace && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-md">
                <h2 className="text-xl text-white mb-4 font-semibold">
                  Find & Replace
                </h2>

                <label className="text-silver text-sm">Find</label>
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                />

                <label className="text-silver text-sm">Replace With</label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowFindReplace(false)}
                    className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleFindReplace}
                    className="px-4 py-2 bg-green text-black font-semibold rounded-lg text-sm"
                  >
                    Replace
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
