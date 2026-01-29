import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import CoverUpload from "../CoverUpload";
import BookEditor from "../../book/BookEditor";
import { useAuth } from "../../../admin/AuthContext";
import FontSelector from "../FontSelector";
import {
  BookOpenCheck,
  Rocket,
  Replace,
  UploadCloud,
  Lock,
  LinkIcon,
} from "lucide-react";
import { Tooltip } from "../../tools/toolTip";
import SectionSelector from "../../../helpers/SectionSelector";

export default function BookPromptForm({
  text,
  setText,
  pageCount,
  setPageCount,
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
  fontName,
  setFontName,
  fontFile,
  setFontFile,
}) {
  const MAX_CHAPTER_WORDS = 3000;

  const [saving, setSaving] = useState(false);
  const [restored, setRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const { accessToken } = useAuth();
  const [hasShownBanner, setHasShownBanner] = useState(
    sessionStorage.getItem("shownDraftBanner") === "true",
  );
  const [draftAuthor, setDraftAuthor] = useState(authorName || "");
  const [uploading, setUploading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const [pendingDelete, setPendingDelete] = useState(null);
  const lastSavedRef = useRef("");
  const hasLoadedDraft = useRef(false);

  const [justSaved, setJustSaved] = useState(false);

  // NEW AUTHOR PAGES REFACTOR
  const [sections, setSections] = useState([
    {
      id: "section-1",
      title: "Section 1",
      content: "",
    },
  ]);

  const [activeSectionId, setActiveSectionId] = useState("section-1");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sectionTitleDraft, setSectionTitleDraft] = useState("");

  const activeSection = sections.find(
    (section) => section.id === activeSectionId,
  );

  const activeSectionWordCount = activeSection
    ? getWordCount(activeSection.content)
    : 0;

  const totalChapterWordCount = sections.reduce(
    (sum, section) => sum + getWordCount(section.content),
    0,
  );

  useEffect(() => {
    // ONLY hydrate initial empty state
    if (
      sections.length === 1 &&
      sections[0].id === "section-1" &&
      !sections[0].content &&
      text?.trim()
    ) {
      setSections((prev) => [
        {
          ...prev[0],
          content: text,
        },
      ]);
    }
  }, [text]);

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let importedText = "";

      // ---- TXT FILE ----
      if (ext === "txt") {
        importedText = await file.text();
      }

      // ---- DOCX FILE ----
      else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        importedText = result.value || "";
      }

      // ---- UNSUPPORTED ----
      else {
        toast.error("Unsupported file. Please upload .txt or .docx");
        return;
      }

      // 🔒 WORD LIMIT ENFORCEMENT
      const wordCount = getWordCount(importedText);

      if (wordCount > MAX_CHAPTER_WORDS) {
        toast.error(
          `This file contains ${wordCount.toLocaleString()} words. 
The maximum allowed per chapter is ${MAX_CHAPTER_WORDS.toLocaleString()}. 
Please split the file into multiple chapters.`,
        );
        return;
      }

      // ✅ SAFE TO INSERT
      setText(importedText);
      toast.success(
        `Imported ${wordCount.toLocaleString()} words successfully`,
      );
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to import file.");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input so same file can be reselected
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

        setCanEdit(Boolean(Number(res.data.can_edit)));

        if (res.data?.sections_json) {
          const parsedSections = Array.isArray(res.data.sections_json)
            ? res.data.sections_json
            : JSON.parse(res.data.sections_json);

          const gptSections = parsedSections.filter((s) => s.source === "gpt");

          if (gptSections.length) {
            setIsAiGenerated(true);
            setSections(gptSections);
            setActiveSectionId(gptSections[0].id);
            setText(gptSections[0].content || "");

            if (res.data.book_name) setBookName(res.data.book_name);
            if (res.data.link) setLink(res.data.link);
            if (res.data.author_name) setDraftAuthor(res.data.author_name);
            if (res.data.book_type) setBookType(res.data.book_type);

            hasLoadedDraft.current = true;
            return; // ⛔ STOP — GPT wins
          }
        }

        // -----------------------------
        // 🔥 1. Load DRAFT if available
        // -----------------------------
        if (res.data?.draft_text) {
          setIsAiGenerated(false);

          if (res.data.sections_json) {
            const parsedSections = Array.isArray(res.data.sections_json)
              ? res.data.sections_json
              : JSON.parse(res.data.sections_json);

            if (parsedSections.length) {
              setSections(parsedSections);
              setActiveSectionId(parsedSections[0].id);
              setText(parsedSections[0].content || "");
            }
            hasLoadedDraft.current = true;
          } else {
            setText(res.data.draft_text || "");
          }

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

          return;
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to load draft:", err);
        }
      }
    }

    loadDraft();
  }, [bookId, partNumber]);

  useEffect(() => {
    if (!bookId) return;
    if (!sections.length) return;
    if (saving) return;
    if (!hasLoadedDraft.current) return;

    const current = JSON.stringify(sections);

    if (current === lastSavedRef.current) return;

    const timeout = setTimeout(() => {
      autoSaveDraft();
      lastSavedRef.current = current;
    }, 1500);

    return () => clearTimeout(timeout);
  }, [sections]);

  useEffect(() => {
    if (!bookId) return;

    const handler = () => {
      const endpoint =
        partNumber > 1
          ? `/books/${bookId}/part/${partNumber}/draft`
          : `/books/draft`;

      navigator.sendBeacon(
        endpoint,
        JSON.stringify({
          bookId,
          sections,
          bookName,
          link,
          author_name: draftAuthor || authorName,
          book_type: bookType,
          font_name: fontName,
          font_file: fontFile,
        }),
      );
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [
    bookId,
    partNumber,
    sections,
    bookName,
    link,
    draftAuthor,
    authorName,
    bookType,
    fontName,
    fontFile,
  ]);

  const [, forceTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick((n) => n + 1);
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  async function autoSaveDraft() {
    try {
      setSaving(true);

      await axiosInstance.post(
        partNumber > 1
          ? `/books/${bookId}/part/${partNumber}/draft`
          : `/books/draft`,
        {
          bookId,
          draftText: text, // legacy compatibility
          sections,
          bookName,
          link,
          author_name: draftAuthor || authorName,
          book_type: bookType,
          font_name: fontName,
          font_file: fontFile,
        },
      );

      setLastSavedAt(new Date().toISOString());
      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
      }, 4000);
    } catch (err) {
      console.error("Auto-save failed", err);
    } finally {
      setSaving(false);
    }
  }

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
          ? `https://themessyattic.com/api/books/${bookId}/part/${partNumber}/draft`
          : "https://themessyattic.com/api/books/draft";

      const res = await axiosInstance.post(
        endpoint,
        {
          bookId,
          draftText: text,
          sections,
          bookName,
          link,
          author_name: draftAuthor || authorName,
          book_type: bookType,
          font_name: fontName, // ✅ added
          font_file: fontFile,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
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

    const adjustedTotalWordCount = sections.reduce((sum, section) => {
      if (section.id === activeSectionId) {
        return sum + getWordCount(text);
      }
      return sum + getWordCount(section.content);
    }, 0);

    if (adjustedTotalWordCount > MAX_CHAPTER_WORDS) {
      toast.error(
        `This chapter has ${adjustedTotalWordCount.toLocaleString()} words. The maximum allowed is ${MAX_CHAPTER_WORDS.toLocaleString()}. Please split this into another chapter.`,
      );
      return;
    }
    setSections((prev) =>
      prev.map((section) =>
        section.id === activeSectionId
          ? { ...section, content: text }
          : section,
      ),
    );

    const sectionsForSubmit = sections.map((section) =>
      section.id === activeSectionId ? { ...section, content: text } : section,
    );

    const combinedPrompt = sectionsForSubmit
      .map(
        (s, index) =>
          `Section ${index + 1}: ${s.title || "Untitled"}\n${s.content || ""}`,
      )
      .join("\n\n");

    const payload = {
      bookId,
      prompt: combinedPrompt || text,
      sections: sectionsForSubmit,
      pages: pageCount,
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

    try {
      setShowGenerating(true);
      onClose();

      axiosInstance.post("/books/prompt", payload);

      toast.success("Your chapter is being generated ✨");
      localStorage.removeItem("bookDraftLocal");
    } catch (err) {
      console.error("Generation failed to start:", err);
      toast.error("Failed to start generation");
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

  function getSavedLabel(dateString) {
    if (!dateString) return "";

    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);

    // ⛔️ DO NOT return "just now" here
    if (minutes < 1) return "";

    if (minutes === 1) return "Saved 1 minute ago";
    if (minutes < 60) return `Saved ${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    return `Saved ${hours} hour${hours !== 1 ? "s" : ""} ago`;
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

  function getWordCount(html = "") {
    const text = html
      .replace(/<[^>]*>/g, " ") // strip HTML
      .replace(/\s+/g, " ")
      .trim();

    return text ? text.split(" ").length : 0;
  }

  function handleDeleteSectionWithUndo(sectionId) {
    const sectionToDelete = sections.find((s) => s.id === sectionId);
    if (!sectionToDelete) return;

    // remove immediately from UI
    const remaining = sections.filter((s) => s.id !== sectionId);

    setSections(remaining);

    // switch active section safely
    const nextActive = remaining[0];
    if (nextActive) {
      setActiveSectionId(nextActive.id);
      setText(nextActive.content || "");
    } else {
      setActiveSectionId(null);
      setText("");
    }

    // store for undo
    setPendingDelete(sectionToDelete);

    // show undo toast
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-white">Section deleted</span>
          <button
            onClick={() => {
              // restore section
              setSections((prev) => [...prev, sectionToDelete]);
              setActiveSectionId(sectionToDelete.id);
              setText(sectionToDelete.content || "");
              setPendingDelete(null);
              toast.dismiss(t.id);
            }}
            className="text-sm px-2 py-1 rounded bg-green text-black font-medium"
          >
            Undo
          </button>
        </div>
      ),
      {
        duration: 5000,
      },
    );

    // finalize delete after timeout
    setTimeout(() => {
      setPendingDelete(null);
    }, 5000);
  }

  const showArrow = sections.length > 1;

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

      <form onSubmit={handleSubmit}>
        <div
          className="
          bg-dashboard-bg-light
          dark:bg-dashboard-bg-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          rounded-2xl
          shadow-2xl
          px-8 py-8
          space-y-6
        "
        >
          {/* ---------- Book Info ---------- */}
          <div
            className="
            rounded-xl
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            px-6 py-6
            space-y-5
          "
          >
            <div
              className="
              text-xs uppercase tracking-wide
              text-dashboard-text-muted-light
              dark:text-dashboard-text-muted-dark
            "
            >
              Book Details
            </div>
            <div>
              <label
                className="flex items-center gap-1 mb-2 font-medium
      text-dashboard-muted-light dark:text-dashboard-muted-dark"
              >
                Book Name
                <Tooltip text="You can change the book name anytime. It won’t affect your content or progress." />
              </label>

              <input
                type="text"
                placeholder="e.g. The Shining"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg
                bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                text-dashboard-text-light dark:text-dashboard-text-dark
                border border-dashboard-border-light dark:border-dashboard-border-dark
                placeholder-dashboard-muted-light dark:placeholder-dashboard-muted-dark"
              />
            </div>

            <div>
              <label
                className="flex items-center gap-1 text-dashboard-muted-light
              dark:text-dashboard-muted-dark mb-2 font-medium"
              >
                Author Name
                <Lock size={14} className="text-gray-500" />
                <Tooltip text="The author name is set when the book is first created and can’t be changed." />
              </label>
              <input
                type="text"
                value={draftAuthor || authorName || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-dashboard-bg-light
                dark:bg-dashboard-bg-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                placeholder-dashboard-muted-light
                dark:placeholder-dashboard-muted-dark"
              />
            </div>

            <div>
              <label
                className="flex items-center gap-1 text-dashboard-muted-light
                dark:text-dashboard-muted-dark mb-2 font-medium"
              >
                Book Type
                <Lock size={14} className="text-gray-500" />
                <Tooltip text="Book type is chosen before setup and can’t be changed" />
              </label>
              <input
                type="text"
                value={
                  bookType
                    ? bookType.charAt(0).toUpperCase() + bookType.slice(1)
                    : ""
                }
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-dashboard-bg-light
                dark:bg-dashboard-bg-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                placeholder-dashboard-muted-light
                dark:placeholder-dashboard-muted-dark"
              />
            </div>

            <div>
              <label
                className="block text-dashboard-muted-light
              dark:text-dashboard-muted-dark mb-2 font-medium"
              >
                Chapter Title
                <Tooltip text="Each section can have its own chapter title. This helps organize longer books." />
              </label>
              <input
                type="text"
                placeholder="e.g. The Black Widow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dashboard-bg-light
                dark:bg-dashboard-bg-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                placeholder-dashboard-muted-light
                dark:placeholder-dashboard-muted-dark"
              />
            </div>
          </div>

          {/* ---------- Import & Tools ---------- */}
          <div
            className="
            rounded-xl
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            px-6 py-5
            space-y-4
          "
          >
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Import & Tools
              <Tooltip text="Import text from a PDF, DOC, or TXT file. Nothing is published automatically. Use Find & Replace to refine content before finalizing your chapter." />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="file"
                accept=".txt,.doc,.docx"
                id="bookUpload"
                onChange={handleFileUpload}
                className="hidden"
              />

              <label
                htmlFor="bookUpload"
                className="
                cursor-pointer
                px-5 py-3
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                hover:bg-dashboard-hover-light
                dark:hover:bg-dashboard-hover-dark
                rounded-lg
                transition
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
                flex items-center gap-2
  "
              >
                <UploadCloud size={18} />
                Upload File
              </label>

              {uploading && (
                <span className="text-sm text-gray-400">Processing…</span>
              )}

              <button
                type="button"
                onClick={() => setShowFindReplace(true)}
                className="
                cursor-pointer
                px-5 py-3
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                hover:bg-dashboard-hover-light
                dark:hover:bg-dashboard-hover-dark
                rounded-lg
                transition
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
                flex items-center gap-2
  "
              >
                <Replace size={18} />
                Find & Replace
              </button>
            </div>
          </div>

          {/* ---------- Section Header ---------- */}
          <div
            className="
            rounded-xl
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            px-6 py-5
            space-y-4
          "
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500">
                Section
                <Tooltip text="Sections let you break your chapter into parts. Switching sections saves your work automatically. You can add, rename, or delete sections anytime. Each chapter can contain up to 3,000 total words across all sections. If you exceed the limit, split your content into another chapter or part." />
              </div>

              <SectionSelector
                sections={sections}
                activeSectionId={activeSectionId}
                setActiveSectionId={setActiveSectionId}
                text={text}
                setText={setText}
                setSections={setSections}
                autoSaveDraft={autoSaveDraft}
              />

              <button
                type="button"
                onClick={() => {
                  const newId = `section-${sections.length + 1}`;
                  const newSection = {
                    id: newId,
                    title: `Section ${sections.length + 1}`,
                    content: "",
                  };

                  setSections((prev) => [...prev, newSection]);
                  setActiveSectionId(newId);
                  setText("");
                }}
                className="
                sm:ml-auto
                w-full sm:w-auto
                px-4 py-2
                bg-gray-800 hover:bg-gray-700
                rounded-lg
                text-sm text-white
              "
              >
                + Add Section
              </button>
            </div>

            {/* ---------- Section Title ---------- */}
            {activeSection && (
              <div className="mb-4">
                {editingSectionId === activeSectionId ? (
                  <div className="max-w-md space-y-2">
                    <label className="text-xs text-gray-400">
                      Rename section
                    </label>

                    <input
                      autoFocus
                      value={sectionTitleDraft}
                      onChange={(e) => setSectionTitleDraft(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSectionId(null);
                          setSectionTitleDraft("");
                        }}
                        className="px-3 py-1 text-sm bg-gray-700 rounded text-white"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSections((prev) =>
                            prev.map((section) =>
                              section.id === activeSectionId
                                ? {
                                    ...section,
                                    title:
                                      sectionTitleDraft.trim() || section.title,
                                  }
                                : section,
                            ),
                          );
                          setEditingSectionId(null);
                        }}
                        className="px-3 py-1 text-sm bg-green rounded text-black font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2
                        className="text-xl font-semibold text-white cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setEditingSectionId(activeSectionId);
                          setSectionTitleDraft(activeSection.title || "");
                        }}
                      >
                        ✏️ {activeSection.title || "Untitled Section"}
                      </h2>

                      <div className="mt-1 space-y-1">
                        <div className="text-xs text-gray-400">
                          Section, {activeSectionWordCount.toLocaleString()}{" "}
                          words
                        </div>

                        <div
                          className={`text-xs ${
                            totalChapterWordCount > MAX_CHAPTER_WORDS
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          Chapter total,{" "}
                          {totalChapterWordCount.toLocaleString()} /{" "}
                          {MAX_CHAPTER_WORDS.toLocaleString()} words
                        </div>
                      </div>
                    </div>

                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSectionWithUndo(activeSectionId)
                        }
                        className="text-xs px-3 py-1 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-green mb-2">
            <div className="h-4 text-xs text-green">
              <span
                className={`transition-opacity duration-300 ${
                  justSaved || lastSavedAt ? "opacity-100" : "opacity-0"
                }`}
              >
                {justSaved
                  ? "Saved just now"
                  : lastSavedAt
                    ? getSavedLabel(lastSavedAt)
                    : ""}
              </span>
            </div>

            {saving && <span className="text-gray-500 italic">Saving…</span>}
          </div>

          <div className="border border-gray-700 bg-black/30 rounded-xl">
            {totalChapterWordCount > MAX_CHAPTER_WORDS * 0.9 && (
              <div className="mb-2 text-xs text-yellow-400">
                You’re approaching the chapter word limit. Consider splitting
                into a new chapter.
              </div>
            )}
            {!partLocked || canEdit ? (
              <BookEditor
                content={text}
                setContent={(html) => {
                  // 1️⃣ Keep existing behavior (temporary bridge)
                  setText(html);

                  // 2️⃣ Write into the active section
                  setSections((prev) =>
                    prev.map((section) =>
                      section.id === activeSectionId
                        ? { ...section, content: html }
                        : section,
                    ),
                  );
                }}
              />
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
              <label
                className="block text-dashboard-muted-light
dark:text-dashboard-muted-dark mb-2 font-medium"
              >
                Number of Pages
              </label>
              <div className="relative w-full max-w-xs">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={pageCount ?? ""}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full py-3 pr-20 pl-4 rounded-lg bg-gray-800 text-white border border-gray-600 text-lg"
                />
              </div>
            </div>
          )}

          <div>
            <label
              className="flex items-center gap-2 text-dashboard-muted-light
            dark:text-dashboard-muted-dark mb-2 font-medium"
            >
              <LinkIcon size={16} className="text-gray-400" />
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
          <div
            className="
            mt-8
            pt-6
            border-t border-gray-700
            flex flex-col sm:flex-row gap-3
          "
          >
            {!partLocked && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className={`flex-1 px-6 py-3 rounded-xl bg-gray-700 text-white font-semibold text-lg shadow-lg transition ${
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
                className="flex-1 px-6 py-3 rounded-xl bg-bookBtnColor text-black font-semibold text-lg shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {isAiGenerated ? (
                  <>
                    <BookOpenCheck size={18} className="text-black" />
                    Commit Final Chapter
                  </>
                ) : (
                  <>
                    <Rocket size={18} className="text-black" />
                    Generate Chapter
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

                  <label
                    className="text-dashboard-muted-light
                  dark:text-dashboard-muted-dark text-sm"
                  >
                    Find
                  </label>
                  <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                  />

                  <label
                    className="text-dashboard-muted-light
                  dark:text-dashboard-muted-dark text-sm"
                  >
                    Replace With
                  </label>
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
        </div>
      </form>
    </>
  );
}
