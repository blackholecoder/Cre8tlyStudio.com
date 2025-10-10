import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cannedPrompts } from "../../constants/index";
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
  cover, // 👈 add
  setCover,
  cta, // 👈 new
  setCta,
  setShowPreview,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* Pre-Made Prompt */}
      <PromptSelect setText={setText} />

      {/* Prompt Editor */}
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
          Number of Pages
        </label>

        <div className="relative w-full max-w-xs">
          {/* Number input */}
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

          {/* Horizontal arrows inside input */}
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
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green to-royalPurple text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
        >
          🚀 Submit Prompt
        </button>
      )}
    </form>
  );
}
