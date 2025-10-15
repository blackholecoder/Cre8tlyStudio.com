import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify"; // 🆕 import Toastify
import LogoUploader from "./LogoUploader";
import ThemeSelector from "./ThemeSelector";
import CoverUpload from "./CoverUpload";
import PromptSelect from "./PromptSelect";

export default function PromptForm({
  text,
  setText,
  theme,
  setTheme,
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
  setShowPreview,
  onSubmit,
  loading,
}) {
  const [warning, setWarning] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [tooLong, setTooLong] = useState(false);

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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Pre-Made Prompt */}
      <PromptSelect setText={setText} />

      {/* Prompt Editor */}
      <div>
        <div
          className="h-[250px] overflow-hidden rounded-lg border border-gray-600 bg-white"
          style={{ color: "#111" }}
        >
          <ReactQuill
            theme="snow"
            value={text}
            onChange={setText}
            modules={{ toolbar: false }}
            placeholder="Write your prompt..."
            className="h-[250px]"
          />
        </div>

        {/* Warning + Counter */}
        <div className="flex justify-between items-center mt-2">
          <p
            className={`text-sm font-medium ${
              warning.includes("⚠️")
                ? "text-red-500"
                : warning
                ? "text-yellow-500"
                : "text-gray-400"
            }`}
          >
            {warning || " "}
          </p>
          <p
            className={`text-xs ${
              tooLong ? "text-red-500" : "text-gray-400"
            }`}
          >
            {charCount.toLocaleString()} / 100,000
          </p>
        </div>
      </div>

      <CoverUpload cover={cover} setCover={setCover} />

      {/* Logo Upload */}
      <LogoUploader
        logoPreview={logoPreview}
        setLogo={setLogo}
        setLogoPreview={setLogoPreview}
      />

      {/* Pages */}
      <div>
        <label className="block text-silver mb-2 font-medium">
          Number of Pages (50 max)
        </label>

        <div className="relative w-full max-w-xs">
          <input
            type="number"
            min="1"
            max="50"
            value={pages ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") setPages("");
              else setPages(Math.min(50, Math.max(1, Number(value))));
            }}
            className="w-full py-3 pr-20 pl-4 rounded-lg bg-gray-800 text-white border border-gray-600 text-lg appearance-none"
          />

          <div className="absolute inset-y-0 right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPages((prev) => Math.max(1, Number(prev || 1) - 1))
              }
              className="px-2 py-1 rounded-md bg-gray-700 text-white text-lg font-bold hover:bg-gray-600 transition"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() =>
                setPages((prev) => Math.min(50, Number(prev || 1) + 1))
              }
              className="px-2 py-1 rounded-md bg-gray-700 text-white text-lg font-bold hover:bg-gray-600 transition"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <ThemeSelector
        theme={theme}
        setTheme={setTheme}
        setShowPreview={setShowPreview}
      />

      {/* Author Call-to-Action */}
      <div className="mt-6">
        <label className="block text-silver mb-2 font-medium">
          Add a Closing Message or Call-to-Action
        </label>
        <textarea
          placeholder={`Example:\nCreate your first lead magnet today with Cre8tlyStudio or join my free newsletter at https://yourwebsite.com.\n\nLet’s keep this journey going together, no tech overwhelm, no burnout, just steady growth.`}
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          This message will appear at the end of your lead magnet.
        </p>
      </div>

      {/* Optional Link */}
      <div>
        <label className="block text-silver mb-2 font-medium">
          Optional Link or Call-to-Action
        </label>
        <input
          type="url"
          placeholder="https://yourwebsite.com"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          This link will appear at the bottom of your PDF.
        </p>
      </div>

      {!loading && (
        <button
          type="submit"
          disabled={tooLong}
          className={`w-full px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition ${
            tooLong
              ? "bg-gray-600 cursor-not-allowed text-gray-300"
              : "bg-gradient-to-r from-green to-royalPurple text-white hover:opacity-90"
          }`}
        >
          🚀 Submit Prompt
        </button>
      )}
    </form>
  );
}
