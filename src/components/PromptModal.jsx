import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import PromptForm from "./prompt/PromptForm";
import SmartOutlineBuilder from "./prompt/SmartOutlineBuilder";
import BookPromptForm from "./prompt/Book/BookPromptForm";
import { useAuth } from "../admin/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { normalizeLink } from "../helpers/normalizeLink";

export default function PromptModal({
  isOpen,
  onClose,
  magnetId,
  contentType,
  onSubmitted,
  setShowGenerating,
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

    // 1️⃣ Refresh latest user data
    const freshUser = await refreshUser();

    // 2️⃣ Block if trial expired
    if (freshUser?.isFreeTier && freshUser?.trialExpired) {
      toast.error("⛔ Your 7-day free trial has expired. Upgrade to continue.");
      navigate("/plans");
      return;
    }

    // 3️⃣ Prevent more than 5 pages for free users
    if (freshUser?.isFreeTier && pages > 5) {
      toast.warn(
        "Free tier limited to 5 pages maximum. Please upgrade to unlock more."
      );
      return;
    }

    // 4️⃣ Show confirmation overlay and close editor
    setShowGenerating(true);
    onClose();

    const normalizedLink = normalizeLink(link);

    // 5️⃣ Fire-and-forget generation
    axiosInstance.post("/lead-magnets/prompt", {
      magnetId,
      prompt: text,
      title,
      font_name: fontName,
      font_file: fontFile,
      bgTheme,
      pages,
      logo,
      link: normalizedLink,
      coverImage: cover,
      cta,
      contentType,
    });

    toast.success("✨ Your lead magnet is being generated");

    // 6️⃣ Optimistic dashboard refresh
    if (typeof onSubmitted === "function") {
      setTimeout(() => {
        onSubmitted(magnetId, text, fontName);
      }, 1500);
    }
  }

  async function handleBookSubmit(e) {
    e.preventDefault();

    setShowGenerating(true);
    onClose();

    try {
      axiosInstance.post("/books/prompt", {
        prompt: text,
        pages,
        logo,
        link,
        coverImage: cover,
        font_name: fontName,
        font_file: fontFile,
      });

      toast.success("📚 Your book was generated successfully!");
      setShowGenerating(false);
      onClose();
    } catch (err) {
      console.error("❌ Book generation error:", err);
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
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            p-4
            sm:p-8
            shadow-2xl
            border
            border-dashboard-border-light
            dark:border-dashboard-border-dark
            "
          >
            {/* ---------- Modal Header ---------- */}
            <div className="relative mb-6">
              {/* Mobile header */}
              <div className="sm:hidden">
                {/* Top row: back + close */}
                <div className="flex items-center justify-between mb-2">
                  {phase !== "questions" ? (
                    <button
                      type="button"
                      onClick={() => setPhase("questions")}
                      className="
                      flex items-center gap-2
                      px-4 py-2
                      text-sm font-semibold
                      bg-green
                      text-dashboard-bg-dark
                      rounded-lg shadow-md
"
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
                    className={`text-dashboard-text-light dark:text-dashboard-text-dark text-xl transition ${
                      loading
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:text-red-400"
                    }`}
                  >
                    ✕
                  </button>
                </div>

                {/* Title row */}
                <h2
                  className="text-2xl font-bold text-center
                text-dashboard-text-light
                dark:text-dashboard-text-dark"
                >
                  ✨ Create Your Digital Asset
                </h2>
              </div>

              {/* Desktop header */}
              <div className="hidden sm:flex items-center justify-center">
                {phase !== "questions" && (
                  <button
                    type="button"
                    onClick={() => setPhase("questions")}
                    className="absolute left-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-300 text-black rounded-lg shadow-md"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                )}

                <h2
                  className="text-2xl font-bold
                  text-dashboard-text-light
                  dark:text-dashboard-text-dark"
                >
                  ✨ Create Your Digital Asset
                </h2>

                <button
                  onClick={!loading ? handleClose : undefined}
                  disabled={loading}
                  className={`absolute right-0 text-dashboard-text-light dark:text-dashboard-text-dark text-xl transition ${
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
                      className="
                      text-sm underline transition
                      text-dashboard-muted-light
                      dark:text-dashboard-muted-dark
                      hover:text-dashboard-text-light
                      dark:hover:text-dashboard-text-dark
                      "
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
