import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import LogoUploader from "./LogoUploader";
import CoverUpload from "./CoverUpload";
import PromptSelect from "./PromptSelect";
import ColorThemeChooser from "../ColorThemeChooser";
import { useAuth } from "../../admin/AuthContext";
import FontSelector from "./FontSelector";

export default function PromptForm({
  text,
  setText,
  title,
  setTitle,
  fontName,
  setFontName,
  fontFile,
  setFontFile,
  bgTheme,
  setBgTheme,
  pages,
  setPages,
  setLogo,
  logoPreview,
  setLogoPreview,
  link,
  setLink,
  cover,
  setCover,
  cta,
  setCta,
  onSubmit,
  loading,
  contentType,
  disabled,
  isFreePlan,
}) {
  const { user } = useAuth();
  const [warning, setWarning] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [tooLong, setTooLong] = useState(false);
  const [error, setError] = useState("");

  const MAX_CHARS = 300;

  useEffect(() => {
    if (user?.cta && (!cta || cta.trim() === "")) {
      setCta(user.cta);
    }
  }, [user, user?.cta]);

  useEffect(() => {
    const plainText = text?.replace(/<[^>]+>/g, "").trim() || "";
    const length = plainText.length;
    const limit = 100000;
    const softLimit = limit * 0.9;

    setCharCount(length);

    // ⚠️ handle limits + show toast
    if (length > limit) {
      if (!tooLong) {
        toast.error(
          `Your prompt is too long (${length.toLocaleString()} / ${limit.toLocaleString()} characters). Please shorten it before submitting.`,
          { autoClose: 6000 }
        );
      }
      setTooLong(true);
      setWarning("⚠️ Your prompt exceeds the limit. Please shorten it.");
    } else if (length > softLimit) {
      setTooLong(false);
      setWarning(
        `Approaching limit — ${length.toLocaleString()} / ${limit.toLocaleString()} characters.`
      );
    } else {
      setTooLong(false);
      setWarning("");
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanPrompt = text.replace(/<[^>]+>/g, "").trim();

    // Validation: ensure prompt not empty
    if (!cleanPrompt) {
      setError("Prompt is required before submission.");
      toast.error("Please enter a prompt before submitting.");
      return;
    }

    setError(""); // clear any prior error
    onSubmit(e, contentType); // ✅ pass contentType as before
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }}
      className="space-y-6"
    >
      <div>
        {/* Pages */}
        <div>
          <label className="block text-silver mb-2 font-medium">
            Number of Pages (25 max)
          </label>

          <div className="relative w-full max-w-xs">
            <input
              type="number"
              min="1"
              max="25"
              value={pages ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") setPages("");
                else setPages(Math.min(25, Math.max(1, Number(value))));
              }}
              className="
              w-full
              py-3
              pr-20
              pl-4
              rounded-lg
              bg-dashboard-bg-light
              dark:bg-dashboard-bg-dark
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
              text-dashboard-text-light
              dark:text-dashboard-text-dark
              text-lg
              appearance-none
              placeholder-dashboard-muted-light
              dark:placeholder-dashboard-muted-dark
              focus:outline-none
              focus:ring-2
              focus:ring-green
              "
            />

            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPages((prev) => Math.max(1, Number(prev || 1) - 1))
                }
                className="
                px-2
                py-1
                rounded-md
                bg-dashboard-hover-light
                dark:bg-dashboard-hover-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                text-lg
                font-bold
                hover:opacity-90
                transition
                "
              >
                ◀
              </button>

              <button
                type="button"
                onClick={() => {
                  const limit = isFreePlan ? 5 : 25;
                  setPages((prev) => {
                    const next = Number(prev || 1) + 1;
                    if (next > limit) {
                      if (isFreePlan) {
                        toast.info(
                          "🚀 Upgrade your plan to unlock more than 5 pages."
                        );
                      }
                      return limit;
                    }
                    return next;
                  });
                }}
                className="
                px-2
                py-1
                rounded-md
                bg-dashboard-hover-light
                dark:bg-dashboard-hover-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                text-lg
                font-bold
                hover:opacity-90
                transition
                "
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        <label className="block text-silver mb-2 mt-4 font-medium">
          Document Title
        </label>
        <input
          type="text"
          placeholder="Enter a title for your project or document..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          This title will appear at the top of your generated document.
        </p>
      </div>

      {/* Pre-Made Prompts (only for paid users) */}
      {!isFreePlan ? (
        <PromptSelect setText={setText} />
      ) : (
        <div className="p-4 rounded-xl border border-gray-700 bg-[#111827]/80 text-center">
          <p className="text-gray-400 text-sm">
            🔒 Pre-Made Prompts are available on paid plans.
          </p>
          <button
            type="button"
            onClick={() => (window.location.href = "/plans")}
            className="mt-2 text-green font-semibold text-sm hover:underline"
          >
            Upgrade to Unlock
          </button>
        </div>
      )}

      {/* Prompt Editor */}
      <div>
        <div
          className={`relative h-[250px] overflow-hidden rounded-lg border border-gray-600 ${
            isFreePlan ? "bg-gray-50" : "bg-white"
          }`}
          style={{ color: "#111" }}
        >
          <ReactQuill
            theme="snow"
            value={text}
            onChange={(value) => {
              if (isFreePlan && value.length > MAX_CHARS) {
                setError("Upgrade to continue writing");
                return;
              }
              setText(value);
            }}
            readOnly={false}
            modules={{ toolbar: false }}
            placeholder="Write your prompt..."
            className="h-[250px]"
          />

          {/* Prevent highlight & copy for free users */}
          {isFreePlan && (
            <div
              className="absolute inset-0 z-10 cursor-default select-none"
              style={{
                background: "transparent",
                userSelect: "none",
                pointerEvents: "auto",
              }}
            />
          )}
        </div>

        {/* Inline Error */}
        {error && (
          <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
        )}

        {/* Warning + Counter */}
        <div className="flex justify-between items-center mt-2">
          <p
            className={`text-sm font-medium ${
              warning.includes("⚠️")
                ? "text-red-500"
                : warning
                  ? "text-yellow"
                  : "text-gray-400"
            }`}
          >
            {warning || " "}
          </p>
          <p
            className={`text-xs ${tooLong ? "text-red-500" : "text-gray-400"}`}
          >
            {charCount.toLocaleString()} / 100,000
          </p>
        </div>
      </div>

      <CoverUpload cover={cover} setCover={setCover} />

      {/* Logo Upload */}
      {!isFreePlan ? (
        <LogoUploader
          logoPreview={logoPreview}
          setLogo={setLogo}
          setLogoPreview={setLogoPreview}
        />
      ) : (
        <div
          className="
          p-4
          mt-6
          rounded-xl
          text-center
          bg-dashboard-hover-light
          dark:bg-dashboard-hover-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
        "
        >
          <p
            className="
            text-sm
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
          "
          >
            🔒 Logo upload is available on paid plans.
          </p>
          <button
            type="button"
            onClick={() => (window.location.href = "/plans")}
            className="mt-2 text-green font-semibold text-sm hover:underline"
          >
            Upgrade to Unlock
          </button>
        </div>
      )}

      <ColorThemeChooser
        bgTheme={bgTheme}
        setBgTheme={setBgTheme}
        includeGradients={false}
        isPro={!!user?.pro_status}
      />

      {/* Theme Selector */}
      <FontSelector
        fontName={fontName}
        setFontName={setFontName}
        fontFile={fontFile}
        setFontFile={setFontFile}
        isFreePlan={isFreePlan}
      />

      {/* Author Call-to-Action */}
      <div className="mt-6">
        <label className="block text-silver mb-2 font-medium">
          Add a Closing Message or Call-to-Action
        </label>

        <div className="relative w-[30%] mb-2">
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected === "saved") setCta(user.cta);
              else if (selected === "custom") setCta("");
            }}
            className="
            w-full
            appearance-none
            px-4
            py-2
            rounded-lg
            text-sm
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            placeholder-dashboard-muted-light
            dark:placeholder-dashboard-muted-dark
            focus:ring-2
            focus:ring-green
            focus:outline-none
            hover:border-green
            transition
            "
          >
            <option value="">Choose CTA</option>
            <option value="saved">Use My Saved CTA</option>
            <option value="custom">Write New CTA</option>
          </select>

          {/* 👇 Custom chevron icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            h-4
            w-4
            pointer-events-none
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </div>

        {/* Editable text area */}
        <textarea
          placeholder={`Example:\nCreate your first lead magnet today with Cre8tlyStudio or join my free newsletter...`}
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          rows={5}
          className="
          w-full
          px-4
          py-3
          rounded-lg
          bg-dashboard-bg-light
          dark:bg-dashboard-bg-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          placeholder-dashboard-muted-light
          dark:placeholder-dashboard-muted-dark
          focus:ring-2
          focus:ring-green
          focus:outline-none
          "
        />

        <p
          className="
          text-xs
          mt-1
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark
          "
        >
          This message will appear at the end of your lead magnet.
        </p>
      </div>

      {/* Optional Link */}
      <div>
        <label
          className="
          block
          mb-2
          font-medium
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          "
        >
          Optional Link or Call-to-Action
        </label>
        <input
          type="text"
          placeholder="https://yourwebsite.com"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="
          w-full
          px-4
          py-2
          rounded-lg
          bg-dashboard-bg-light
          dark:bg-dashboard-bg-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          placeholder-dashboard-muted-light
          dark:placeholder-dashboard-muted-dark
          "
        />
        <p
          className="
          text-xs
          mt-1
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark
          "
        >
          This link will appear at the bottom of your PDF as a button and a QR
          code. Websites and email addresses are supported.
        </p>
      </div>

      {disabled && (
        <p
          className="
          text-center
          text-sm
          mb-3
          text-red-500
          "
        >
          Your trial has expired — please upgrade to continue generating.
        </p>
      )}

      {!loading && (
        <button
          type={disabled ? "button" : "submit"}
          disabled={
            disabled || !text.trim() || text === "<p><br></p>" || tooLong
          }
          onClick={() => {
            if (disabled) {
              toast.error("Trial expired — please upgrade to continue.");
            }
          }}
          className={`w-full px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition ${
            disabled || !text.trim() || text === "<p><br></p>" || tooLong
              ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-muted-light dark:text-dashboard-muted-dark cursor-not-allowed"
              : "bg-green text-dashboard-bg-dark hover:opacity-90"
          }`}
        >
          {disabled
            ? "Trial Expired — Upgrade to Continue"
            : "🚀 Submit Prompt"}
        </button>
      )}
    </form>
  );
}
