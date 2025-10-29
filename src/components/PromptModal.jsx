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
import PromptForm from "./prompt/PromptForm";
import SmartOutlineBuilder from "./prompt/SmartOutlineBuilder";
import BookPromptForm from "./prompt/Book/BookPromptForm";

export default function PromptModal({
  isOpen,
  onClose,
  magnetId,
  accessToken,
  contentType, 
  onSubmitted,
  setShowGenerating,
  setProgress,
}) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
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
  const [bgTheme, setBgTheme] = useState("#ffffff");

  // ✅ Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setTitle("");
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


async function handleSubmit(e, contentType) {
  e.preventDefault();
  setLoading(true);
  setProgress(0);
  setShowGenerating(true);
  onClose(); // ✅ close modal right away

  let interval;
  try {
     let progressValue = 0;
    interval = setInterval(() => {
      // Smooth climb logic with slowdown near the end
      progressValue +=
        progressValue < 60
          ? Math.random() * 4.5 // faster early
          : progressValue < 85
          ? Math.random() * 2.5 // steady middle
          : Math.random() * 1.2; // slow near the end

      if (progressValue >= 96) progressValue = 96; // hold near finish
      setProgress(progressValue);
    }, 200);


    const res = await axios.post(
      "https://cre8tlystudio.com/api/lead-magnets/prompt",
      {
        magnetId,
        prompt: text,
        title,
        theme,
        bgTheme,
        pages,
        logo,
        link,
        coverImage: cover,
        cta,
        contentType,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 180000, // ⏰ allow up to 3 minutes
      }
    );

    clearInterval(interval);
    setProgress(100);

    toast.success("🎉 Your digital asset has been generated successfully!");
    setShowGenerating(false);
    onClose();

    await new Promise((r) => setTimeout(r, 1000));

    

    // ✅ Refresh magnet list
    setTimeout(() => {
      if (typeof onSubmitted === "function") {
        onSubmitted(magnetId, text, theme);
      }
    }, 2000);
  } catch (err) {
    clearInterval(interval);
    setProgress(0);
    setLoading(false);
    setShowGenerating(false);

    console.error("❌ Prompt submission error:", err);

    // 🧩 Distinguish between real failure and slow processing
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      toast.info("⏳ Please wait — your document is still being created. It will appear shortly.");
    } 
    else if (err.response) {
      const { status, data } = err.response;

      if (status === 413) {
        toast.error(data.message || "Your input is too long. Please shorten it.");
      } 
      else if (status === 400) {
        toast.error(data.message || "Missing required fields.");
      } 
      else if (status === 429) {
        toast.error("Rate limit reached. Please wait a moment and try again.");
      }
      else if (
        data.message?.includes("context_length_exceeded") ||
        data.message?.includes("too large")
      ) {
        toast.error("⚠️ This document is too large. Try fewer pages or smaller content.");
      } 
      else {
        // 🧠 Instead of "server error", assume it’s just taking time
        toast.info("📄 Your document is still generating — it will appear soon.");
      }
    } 
    else {
      // 🌐 Network disconnection or backend still processing
      toast.info("⚙️ Document generation still in progress. Please refresh your dashboard shortly.");
    }

    // ✅ Still trigger dashboard refresh after short delay
    onClose();
    if (typeof onSubmitted === "function") {
      setTimeout(() => onSubmitted(magnetId, text, theme), 5000);
    }
  } finally {
    setLoading(false);
  }
}



  // async function handleBookSubmit(e) {
  //   e.preventDefault();
  //   setLoading(true);
  //   setProgress(0);
  //   setShowGenerating(true);
  //   onClose();

  //   let interval;
  //   try {
  //    let progressValue = 0;
  //   interval = setInterval(() => {
  //     // Smooth climb logic with slowdown near the end
  //     progressValue +=
  //       progressValue < 60
  //         ? Math.random() * 4.5 // faster early
  //         : progressValue < 85
  //         ? Math.random() * 2.5 // steady middle
  //         : Math.random() * 1.2; // slow near the end

  //     if (progressValue >= 96) progressValue = 96; // hold near finish
  //     setProgress(progressValue);
  //   }, 200);
  //     const res = await axios.post(
  //       "https://cre8tlystudio.com/api/books/prompt",
  //       {
  //         prompt: text,
  //         theme,
  //         pages,
  //         logo,
  //         link,
  //         coverImage: cover,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       }
  //     );

  //     clearInterval(interval);
  //     setProgress(100);


  //     toast.success("📚 Your book was generated successfully!");
  //     setShowGenerating(false);

  //     await new Promise((r) => setTimeout(r, 1000));
  //     onClose();
  //   } catch (err) {
  //     console.error("❌ Book generation error:", err);
  //     clearInterval(interval);
  //     setProgress(0);
  //     setLoading(false);
  //     setShowGenerating(false);
  //     toast.error("Something went wrong while generating your book.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  async function handleBookSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setProgress(0);
  setShowGenerating(true);
  onClose();

  let interval;
  try {
    let progressValue = 0;
    interval = setInterval(() => {
      // Smooth climb logic with slowdown near the end
      progressValue +=
        progressValue < 60
          ? Math.random() * 4.5 // faster early
          : progressValue < 85
          ? Math.random() * 2.5 // steady middle
          : Math.random() * 1.2; // slow near the end

      if (progressValue >= 96) progressValue = 96; // hold near finish
      setProgress(progressValue);
    }, 200);

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
        timeout: 180000,
      }
    );

    clearInterval(interval);
    setProgress(100);

    toast.success("📚 Your book was generated successfully!");
    await new Promise((r) => setTimeout(r, 800));
    setShowGenerating(false);
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
                    title={title}
                    setTitle={setTitle}
                    theme={theme}
                    setTheme={setTheme}
                    bgTheme={bgTheme}
                    setBgTheme={setBgTheme}
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
                    contentType={contentType}
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
    </Transition>
  );
}
