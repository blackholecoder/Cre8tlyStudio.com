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
import PDFThemePreview from "./PDFThemePreview";
import PromptForm from "./prompt/PromptForm";
import ProgressBar from "./prompt/ProgressBar";
import ThemePreviewModal from "./prompt/ThemePreviewModal";
import SmartOutlineBuilder from "./prompt/SmartOutlineBuilder";
import BookPromptForm from "./prompt/Book/BookPromptForm";

export default function PromptModal({
  isOpen,
  onClose,
  magnetId,
  accessToken,
  onSubmitted,
  setShowGenerating,  
  progress,
  setProgress 
}) {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState("modern");
  const [pages, setPages] = useState(5);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [link, setLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cover, setCover] = useState(null);
  const [cta, setCta] = useState("");
  const [phase, setPhase] = useState("questions");

  // ✅ Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setTheme("modern");
      setPages(5);
      setLogo(null);
      setLogoPreview(null);
      setLink("");
      setProgress(0);
      setShowPreview(false);
      setPhase("questions"); // 👈 reset to Smart Builder every time modal closes
    } else {
      // 👇 optional: always start at questions when it opens too
      setPhase("questions");
    }
  }, [isOpen]);

  const handleClose = () => onClose();

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setProgress(0);
  setShowGenerating(true); // ✅ show the global overlay
  onClose(); // ✅ close modal right away

  let interval;
  try {
    interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 5 : p));
    }, 300);

    const res = await axios.post(
      "https://cre8tlystudio.com/api/lead-magnets/prompt",
      {
        magnetId,
        prompt: text,
        theme,
        pages,
        logo,
        link,
        coverImage: cover,
        cta,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    clearInterval(interval);
    setProgress(100);
    toast.success("🎉 Lead magnet generated successfully!");
    setShowGenerating(false);

    // ✅ Step 1: keep progress visible for a bit
    await new Promise((r) => setTimeout(r, 1000));

    // ✅ Step 2: close modal first (return to dashboard)
    onClose();

    // ✅ Step 3: trigger dashboard to refresh magnet list
    setTimeout(() => {
      if (typeof onSubmitted === "function") {
        onSubmitted(magnetId, text, theme);
      }
    }, 2000); // wait 2s for backend to finalize upload
  } catch (err) {
    console.error("❌ Prompt submission error:", err);
    clearInterval(interval);
    setProgress(0);
    setLoading(false);
    setShowGenerating(false);

    if (err.response) {
      const { status, data } = err.response;
      if (status === 413) {
        toast.error(
          data.message || "Your input is too long. Please shorten it."
        );
      } else if (status === 400) {
        toast.error(data.message || "Missing required fields.");
      } else {
        toast.error(data.message || "Something went wrong on the server.");
      }
    } else {
      toast.error("Network error — PDF is still being processed. Please refresh.");
    }

    // ✅ Close modal even if there's a "network error" (since backend succeeded)
    onClose();
    if (typeof onSubmitted === "function") {
      setTimeout(() => onSubmitted(magnetId, text, theme), 3000);
    }
  } finally {
    setLoading(false);
    onClose();
  }
}

async function handleBookSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setProgress(0);
  setShowGenerating(true);
  onClose();

  let interval;
  try {
    interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 4 : p));
    }, 350);

    const res = await axios.post(
      "https://cre8tlystudio.com/api/books/prompt",
      {
        prompt: text,
        theme,
        pages,
        logo,
        link,
        coverImage: cover,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    clearInterval(interval);
    setProgress(100);
    toast.success("📚 Your book was generated successfully!");
    setShowGenerating(false);

    await new Promise((r) => setTimeout(r, 1000));
    onClose();
  } catch (err) {
    console.error("❌ Book generation error:", err);
    clearInterval(interval);
    setProgress(0);
    setLoading(false);
    setShowGenerating(false);
    toast.error("Something went wrong while generating your book.");
  } finally {
    setLoading(false);
  }
}



  return (
    <Transition show={isOpen} appear>
      {/* ✅ Main Prompt Modal */}
      <Dialog
        className="relative z-50"
        // ✅ Don’t close when preview is open
        onClose={() => {
          if (!showPreview) onClose();
        }}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gray-900 p-8 shadow-2xl border border-gray-700">
            <DialogTitle className="text-2xl font-bold text-white mb-6 text-center">
             ✨ Create Your Lead Magnet
            </DialogTitle>

            {/* ---------- Form Wrapper ---------- */}
            <div className="relative">
              {/* ---------- STEP 0: Choose Creation Type ---------- */}
              {/* ---------- STEP 1: Smart Prompt Builder ---------- */}
              {phase === "questions" && (
                <SmartOutlineBuilder
                  onPromptReady={(generatedPrompt) => {
                    setText(generatedPrompt); // auto-fill the prompt field
                    setPhase("generator"); // move to the next step
                  }}
                />
              )}

              {/* ---------- STEP 2: Main Generator Form ---------- */}
              {phase === "generator" && (
                <div
                  className={`transition-all duration-300 ${
                    loading ? "pointer-events-none blur-sm opacity-50" : ""
                  }`}
                >
                  {/* 👇 Add Back Button */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={() => setPhase("questions")}
                      className="text-sm text-gray-400 underline hover:text-gray-200 transition"
                    >
                      ← Back to Smart Prompt Builder
                    </button>
                  </div>
                  <PromptForm
                    text={text}
                    setText={setText}
                    theme={theme}
                    setTheme={setTheme}
                    pages={pages}
                    setPages={setPages}
                    logo={logo}
                    setLogo={setLogo}
                    logoPreview={logoPreview}
                    setLogoPreview={setLogoPreview}
                    link={link}
                    setLink={setLink}
                    cover={cover}
                    setCover={setCover}
                    cta={cta}
                    setCta={setCta}
                    showPreview={showPreview}
                    setShowPreview={setShowPreview}
                    onSubmit={handleSubmit}
                    loading={loading}
                  />
                </div>
              )}

              {phase === "bookBuilder" && (
  <div
    className={`transition-all duration-300 ${
      loading ? "pointer-events-none blur-sm opacity-50" : ""
    }`}
  >
    <div className="flex justify-between items-center mb-4">
      <button
        type="button"
        onClick={() => setPhase("selection")}
        className="text-sm text-gray-400 underline hover:text-gray-200 transition"
      >
        ← Back to Selection
      </button>
    </div>

    {/* This will be your new book form */}
    <BookPromptForm
      text={text}
      setText={setText}
      theme={theme}
      setTheme={setTheme}
      pages={pages}
      setPages={setPages}
      logo={logo}
      setLogo={setLogo}
      logoPreview={logoPreview}
      setLogoPreview={setLogoPreview}
      link={link}
      setLink={setLink}
      cover={cover}
      setCover={setCover}
      cta={cta}
      setCta={setCta}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      onSubmit={handleBookSubmit}
      loading={loading}
    />
  </div>
)}


              {/* Progress bar overlay */}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl z-20 text-center">
                  <h2 className="text-white text-xl sm:text-2xl font-semibold mb-4 animate-pulse">
                    🚀 Creating your lead magnet...
                  </h2>
                  <div className="w-3/4">
                    <ProgressBar progress={progress} />
                  </div>
                  <p className="text-gray-400 text-sm mt-4 italic">
                    This might take a moment, crafting something powerful ✨
                  </p>
                </div>
              )}
            </div>

            {/* Close button (disabled while loading) */}
            <button
              onClick={!loading ? handleClose : undefined}
              className={`absolute top-4 right-4 text-white text-xl transition ${
                loading ? "opacity-30 cursor-not-allowed" : "hover:text-red-400"
              }`}
              disabled={loading}
            >
              ✕
            </button>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ✅ Separate Theme Preview Modal */}
      {showPreview && (
        <ThemePreviewModal
          showPreview={showPreview}
          onClose={() => setShowPreview(false)}
          theme={theme}
          PDFThemePreview={PDFThemePreview}
        />
      )}
    </Transition>
  );
}
