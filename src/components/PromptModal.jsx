import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import PromptForm from "./prompt/PromptForm";
import SmartOutlineBuilder from "./prompt/SmartOutlineBuilder";
import BookPromptForm from "./prompt/Book/BookPromptForm";
import { useAuth } from "../admin/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

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
  const [pages, setPages] = useState(5);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [link, setLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, refreshUser } = useAuth();
  console.log("isFreePlan =", Number(user?.has_free_magnet) === 1);
  const navigate = useNavigate();

  const isFreePlan = Number(user?.has_free_magnet) === 1;

  const [cover, setCover] = useState(null);
  const [cta, setCta] = useState("");
  const [phase, setPhase] = useState("questions");
  const [bgTheme, setBgTheme] = useState("#ffffff");

  const [fontName, setFontName] = useState("Montserrat");
  const [fontFile, setFontFile] = useState("/fonts/Montserrat-Regular.ttf");

  // ✅ Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setTitle("");
      setPages(5);
      setLogo(null);
      setLogoPreview(null);
      setLink("");
      setCover(null);
      setProgress(0);
      setShowPreview(false);
      setPhase("questions");
      setFontName(null);
      setFontFile(null);
    } else {
      // 👇 optional: always start at questions when it opens too
      setPhase("questions");
    }
  }, [isOpen]);

  const handleClose = () => onClose();

  async function handleSubmit(e, contentType) {
    e.preventDefault();

    // 🧩 1️⃣ Refresh latest user data
    const freshUser = await refreshUser();

    // 🧩 2️⃣ Block if trial expired
    if (freshUser?.isFreeTier && freshUser?.trialExpired) {
      toast.error("⛔ Your 7-day free trial has expired. Upgrade to continue.");
      navigate("/plans");
      return;
    }

    // 🧩 3️⃣ Prevent more than 5 pages for free users
    if (freshUser?.isFreeTier && pages > 5) {
      toast.warn(
        "Free tier limited to 5 pages maximum. Please upgrade to unlock more."
      );
      return;
    }

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

      const res = await axiosInstance.post(
        "/lead-magnets/prompt",
        {
          magnetId,
          prompt: text,
          title,
          font_name: fontName,
          font_file: fontFile,
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
          onSubmitted(magnetId, text, fontName);
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
        toast.info(
          "⏳ Please wait — your document is still being created. It will appear shortly."
        );
      } else if (err.response) {
        const { status, data } = err.response;

        if (status === 413) {
          toast.error(
            data.message || "Your input is too long. Please shorten it."
          );
        } else if (status === 400) {
          toast.error(data.message || "Missing required fields.");
        } else if (status === 429) {
          toast.error(
            "Rate limit reached. Please wait a moment and try again."
          );
        } else if (
          data.message?.includes("context_length_exceeded") ||
          data.message?.includes("too large")
        ) {
          toast.error(
            "⚠️ This document is too large. Try fewer pages or smaller content."
          );
        } else {
          // 🧠 Instead of "server error", assume it’s just taking time
          toast.info(
            "📄 Your document is still generating — it will appear soon."
          );
        }
      } else {
        // 🌐 Network disconnection or backend still processing
        toast.info(
          "⚙️ Document generation still in progress. Please refresh your dashboard shortly."
        );
      }

      // ✅ Still trigger dashboard refresh after short delay
      onClose();
      if (typeof onSubmitted === "function") {
        setTimeout(() => onSubmitted(magnetId, text, fontName), 5000);
      }
    } finally {
      setLoading(false);
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
          pages,
          logo,
          link,
          coverImage: cover,
          font_name: fontName,
          font_file: fontFile,
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
          <DialogPanel
            className="
            relative
            w-full
            max-w-3xl
            max-h-[90vh]
            sm:max-h-[85vh]
            overflow-y-auto
            rounded-2xl
            bg-gray-900
            p-4
            sm:p-8
            shadow-2xl
            border
            border-gray-700"
          >
            {/* ---------- Modal Header ---------- */}
            <div className="relative mb-6">
              {/* Mobile header */}
              {/* Mobile header */}
              <div className="sm:hidden">
                {/* Top row: back + close */}
                <div className="flex items-center justify-between mb-2">
                  {phase !== "questions" ? (
                    <button
                      type="button"
                      onClick={() => setPhase("questions")}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green text-black rounded-lg shadow-md"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div /> // keeps spacing balanced when no back button
                  )}

                  <button
                    onClick={!loading ? handleClose : undefined}
                    disabled={loading}
                    className={`text-white text-xl transition ${
                      loading
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:text-red-400"
                    }`}
                  >
                    ✕
                  </button>
                </div>

                {/* Title row */}
                <h2 className="text-2xl font-bold text-white text-center">
                  ✨ Create Your Digital Asset
                </h2>
              </div>

              {/* Desktop header */}
              <div className="hidden sm:flex items-center justify-center">
                {phase !== "questions" && (
                  <button
                    type="button"
                    onClick={() => setPhase("questions")}
                    className="absolute left-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green text-black rounded-lg shadow-md"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                )}

                <h2 className="text-2xl font-bold text-white">
                  ✨ Create Your Digital Asset
                </h2>

                <button
                  onClick={!loading ? handleClose : undefined}
                  disabled={loading}
                  className={`absolute right-0 text-white text-xl transition ${
                    loading
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:text-red-400"
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>

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

                  <PromptForm
                    text={text}
                    setText={setText}
                    title={title}
                    setTitle={setTitle}
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
                    disabled={user?.isFreeTier && user?.trialExpired}
                    isFreePlan={isFreePlan}
                    onSubmit={handleSubmit}
                    loading={loading}
                    contentType={contentType}
                    fontName={fontName}
                    setFontName={setFontName}
                    fontFile={fontFile}
                    setFontFile={setFontFile}
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
                    fontName={fontName}
                    setFontName={setFontName}
                    fontFile={fontFile}
                    setFontFile={setFontFile}
                  />
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
