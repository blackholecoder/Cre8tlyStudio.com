import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CoverUpload from "../CoverUpload";

export default function BookPromptForm({
  text,
  setText,
  pages,
  setPages,
  link,
  setLink,
  cover,
  setCover,
  title,
  setTitle,
  authorName,        // ✅ new
  setAuthorName, 
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* ---------- Book Title ---------- */}
      <div>
        <label className="block text-silver mb-2 font-medium">
          Book or Chapter Title
        </label>
        <input
          type="text"
          placeholder="e.g. The Midnight Promise or Part 1: Awakening"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          This will be used as the title of your generated book PDF.
        </p>
      </div>
      <div>
  <label className="block text-silver mb-2 font-medium">Author Name</label>
  <input
    type="text"
    placeholder="e.g. John Carter or Pen Name"
    value={authorName}
    onChange={(e) => setAuthorName(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
  />
  <p className="text-xs text-gray-400 mt-1">
    This name will appear as the author in your generated book PDF.
  </p>
</div>

      {/* ---------- Prompt Editor ---------- */}
      <div
        className="h-[250px] overflow-hidden rounded-lg border border-gray-600 bg-white"
        style={{ color: "#111" }}
      >
        <ReactQuill
          theme="snow"
          value={text}
          onChange={setText}
          modules={{ toolbar: false }}
          placeholder="Write your story..."
          className="h-[250px] bg-[#111] text-white rounded-lg quill-dark"
        />
      </div>

      {/* ---------- Cover Upload ---------- */}
      <CoverUpload cover={cover} setCover={setCover} />

      {/* ---------- Page Count ---------- */}
      <div>
        <label className="block text-silver mb-2 font-medium">
          Number of Pages
        </label>

        <div className="relative w-full max-w-xs">
          <input
            type="number"
            min="10"
            max="150"
            value={pages ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") setPages("");
              else setPages(Math.min(150, Math.max(10, Number(value))));
            }}
            className="w-full py-3 pr-20 pl-4 rounded-lg bg-gray-800 text-white border border-gray-600 text-lg appearance-none"
          />

          <div className="absolute inset-y-0 right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPages((prev) => Math.max(10, Number(prev || 10) - 1))
              }
              className="px-2 py-1 rounded-md bg-gray-700 text-white text-lg font-bold hover:bg-gray-600 transition"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() =>
                setPages((prev) => Math.min(150, Number(prev || 10) + 1))
              }
              className="px-2 py-1 rounded-md bg-gray-700 text-white text-lg font-bold hover:bg-gray-600 transition"
            >
              ▶
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Each part can generate up to 150 pages. You can create additional parts later.
        </p>
      </div>


      {/* ---------- Optional Website Link ---------- */}
      <div>
        <label className="block text-silver mb-2 font-medium">
          Optional Website or Author Link
        </label>
        <input
          type="url"
          placeholder="https://yourwebsite.com"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Appears at the bottom of your book PDF.
        </p>
      </div>

      {/* ---------- Submit Button ---------- */}
      {!loading && (
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green to-royalPurple text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
        >
          🚀 Generate Book PDF
        </button>
      )}
    </form>
  );
}
