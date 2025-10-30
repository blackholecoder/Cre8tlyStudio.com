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
  theme,
  setTheme,
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
}) {
  const { user } = useAuth(); 
  const [warning, setWarning] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [tooLong, setTooLong] = useState(false);
  const [error, setError] = useState("");

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
    <form onSubmit={handleSubmit} className="space-y-6">
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
                setPages((prev) => Math.min(25, Number(prev || 1) + 1))
              }
              className="px-2 py-1 rounded-md bg-gray-700 text-white text-lg font-bold hover:bg-gray-600 transition"
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
            onChange={(value) => {
              setText(value);
              if (error) setError(""); // clear inline error as user types
            }}
            modules={{ toolbar: false }}
            placeholder="Write your prompt..."
            className="h-[250px]"
          />
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

     
      <ColorThemeChooser bgTheme={bgTheme} setBgTheme={setBgTheme} />

      {/* Theme Selector */}
      <FontSelector
        theme={theme}
        setTheme={setTheme}
      />

      {/* Author Call-to-Action */}
      <div className="mt-6">
  <label className="block text-silver mb-2 font-medium">
    Add a Closing Message or Call-to-Action
  </label>

  {/* Dropdown for saved CTA */}
  {user?.cta && (
    <div className="flex items-center justify-between mb-2">
      <select
        onChange={(e) => {
          const selected = e.target.value;
          if (selected === "saved") setCta(user.cta);
          else if (selected === "custom") setCta("");
        }}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
      >
        <option value="">Choose CTA</option>
        <option value="saved">Use My Saved CTA</option>
        <option value="custom">Write New CTA</option>
      </select>
      <span className="text-xs text-gray-500 italic ml-2">
        {cta === user.cta ? "Using saved CTA" : ""}
      </span>
    </div>
  )}

  {/* Editable text area */}
  <textarea
    placeholder={`Example:\nCreate your first lead magnet today with Cre8tlyStudio or join my free newsletter...`}
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
          This link will appear at the bottom of your PDF as a button.
        </p>
      </div>

      {!loading && (
        <button
          disabled={
            !text.trim() ||
            text === "<p><br></p>" ||
            tooLong
          }
          type="submit"
          className={`w-full px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition ${
            !text.trim() || text === "<p><br></p>" || tooLong
              ? "bg-gray-600 cursor-not-allowed text-gray-300"
              : "bg-green font-semibold text-black hover:opacity-90"
          }`}
        >
          🚀 Submit Prompt
        </button>
      )}
    </form>
  );
}
