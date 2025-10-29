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
  const [partLocked, setPartLocked] = useState(false);

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

  useEffect(() => {
  async function fetchDraft() {
    if (!bookId) return;
    try {
      const res = await axios.get(`https://cre8tlystudio.com/books/draft/${bookId}`);
      const draft = res.data;

      if (draft?.draft_text) {
        setText(draft.draft_text);
        if (draft.title) setBookName(draft.title); 
        if (draft.link) setLink(draft.link);
        if (draft.author_name) setAuthorName(draft.author_name);
        if (draft.book_type) setBookType(draft.book_type);
        toast.info(`Loaded last draft from ${new Date(draft.last_saved_at).toLocaleString()}`);
      } else {
        console.log("No draft found for this book.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("No saved draft yet.");
      } else {
        console.error("Failed to fetch draft:", err);
        toast.error("Failed to fetch saved draft.");
      }
    }
  }

  fetchDraft();
}, [bookId]);

// useEffect(() => {
//   async function checkIfPartExists() {
//     if (!bookId) return;

//     try {
//       const res = await axios.get(
//         `https://cre8tlystudio.com/api/books/${bookId}/parts`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );

//       const parts = res.data || [];
//       const exists = parts.some((p) => Number(p.part_number) === Number(partNumber));
//      console.log("Parts found:", parts);


//       setPartLocked(exists);
//     } catch (err) {
//       console.error("Failed to check part existence:", err);
//       setPartLocked(false);
//     }
//   }

//   checkIfPartExists();
// }, [bookId, partNumber]);


  // ✅ Fetch book info
useEffect(() => {
  async function fetchDraft() {
    if (!bookId) return;

    try {
      // ✅ Use part-specific route after part 1
      const endpoint =
        partNumber > 1
          ? `https://cre8tlystudio.com/api/books/${bookId}/part/${partNumber}/draft`
          : `https://cre8tlystudio.com/api/books/draft/${bookId}`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const draft = res.data;

      if (draft?.draft_text) {
        setText(draft.draft_text);
        if (draft.title) setTitle(draft.title);
        if (draft.link) setLink(draft.link);
        if (draft.author_name) setAuthorName(draft.author_name);
        if (draft.book_type) setBookType(draft.book_type);

        toast.info(
          `Loaded last draft from ${new Date(
            draft.last_saved_at || draft.updated_at || Date.now()
          ).toLocaleString()}`
        );
      } else {
        console.log("No draft found for this book or part.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("No saved draft yet.");
      } else {
        console.error("Failed to fetch draft:", err);
        toast.error("Failed to fetch saved draft.");
      }
    }
  }

  fetchDraft();
}, [bookId, partNumber]);

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
          setProgress={setProgress}
        />
      </div>
    </div>
  );
}
