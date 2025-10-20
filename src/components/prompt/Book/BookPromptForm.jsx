import CoverUpload from "../CoverUpload";
import BookEditor from "../../book/BookEditor";

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
  authorName,
  bookName,
  bookType,
  onSubmit,
  loading,
}) {
  return (
    <div className="space-y-6">
      {/* ---------- Book Info ---------- */}
      <div>
        

        <label className="block text-silver mb-2 font-medium">Book Name</label>
        <input
          type="text"
          placeholder="e.g. The Clockmaker’s Secret"
          value={bookName}
          readOnly
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          This is your book’s main title.
        </p>
      </div>

      <div>
        <label className="block text-silver mb-2 font-medium">
          Author Name
        </label>
        <input
          type="text"
          placeholder="e.g. John Carter or Pen Name"
          value={authorName}
          readOnly
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500"
        />
        <p className="text-xs text-gray-400 mt-2">
          This name will appear as the author in your generated book PDF.
        </p>
      </div>
      <div>
          <label className="block text-silver mb-2 font-medium">
            Book Type
          </label>
          <input
            type="text"
            value={bookType}
            readOnly
            className="w-full px-4 py-3 mb-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>

      <div>
        <label className="block text-silver mb-2 font-medium">
          Chapter Title
        </label>
        <input
          type="text"
          placeholder="e.g. The Midnight Promise or Part 1: Awakening"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-green focus:outline-none"
        />
      </div>

      {/* ---------- Editor (Outside Form) ---------- */}
      <div className="border border-gray-700 rounded-xl">
        <BookEditor content={text} setContent={setText} />
      </div>

      {/* ---------- Cover Upload + Other Fields ---------- */}
      <form onSubmit={onSubmit} className="space-y-6">
        <CoverUpload cover={cover} setCover={setCover} />

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
            Each part can generate up to 150 pages. You can create additional
            parts later.
          </p>
        </div>

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

        {!loading && (
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green to-royalPurple text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
          >
            🚀 Generate Book PDF
          </button>
        )}
      </form>
    </div>
  );
}
