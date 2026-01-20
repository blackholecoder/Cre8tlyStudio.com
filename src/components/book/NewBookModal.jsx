import { useState } from "react";
import { toast } from "react-toastify";

export default function NewBookModal({ onCreate, onClose }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookType, setBookType] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleAddInfo() {
    if (!bookName?.trim()) {
      toast.error("Please enter a book name");
      return;
    }

    if (!author?.trim()) {
      toast.error("Please enter an author name");
      return;
    }

    if (!bookType) {
      toast.error("Please select a book type before continuing");
      return;
    }

    setConfirmOpen(true);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-0">
      <div
        className="
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        p-4 sm:p-6
        rounded-xl
        w-full max-w-2xl
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        shadow-lg
        max-h-[90vh] overflow-y-auto
      "
      >
        <h2 className="text-xl font-semibold text-center text-dashboard-text-light dark:text-dashboard-text-dark">
          Set Up Your Book
        </h2>

        <div>
          <label className="block text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
            Book Name
          </label>
          <input
            type="text"
            placeholder="e.g. The Burning City"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="
            w-full p-2 rounded
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            focus:outline-none
            focus:ring-2 focus:ring-green
          "
          />
        </div>

        <div>
          <label className="block text-silver mb-1">Author Name</label>
          <input
            type="text"
            placeholder="e.g. Dean Koontz"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="
            w-full p-2 rounded
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            focus:outline-none
            focus:ring-2 focus:ring-green
          "
          />
        </div>

        {/* 👇 New Book Type Section */}
        <div>
          <label className="block text-silver mb-3">Select Book Type</label>

          <div className="flex flex-col gap-3">
            {/* Fiction */}
            <label
              className="flex items-start gap-3 cursor-pointer rounded-lg p-3 border border-dashboard-border-light
              dark:border-dashboard-border-dark
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              hover:opacity-90
              transition"
            >
              <input
                type="radio"
                name="bookType"
                value="fiction"
                checked={bookType === "fiction"}
                onChange={(e) => setBookType(e.target.value)}
                className="mt-1 accent-royalPurple"
              />

              <div>
                <p className="text-dashboard-text-light dark:text-dashboard-text-dark font-medium">
                  Fiction
                </p>
                <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark leading-relaxed">
                  For novels, short stories, and narrative driven work. This
                  mode collaborates with you to develop characters, expand
                  scenes, and shape a cinematic narrative arc. It may introduce
                  supporting characters and story elements while staying aligned
                  with your vision, tone, and story world.
                </p>
              </div>
            </label>

            {/* Non-Fiction */}
            <label
              className="flex items-start gap-3 cursor-pointer rounded-lg p-3 border border-dashboard-border-light
              dark:border-dashboard-border-dark
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              hover:opacity-90
              transition "
            >
              <input
                type="radio"
                name="bookType"
                value="non-fiction"
                checked={bookType === "non-fiction"}
                onChange={(e) => setBookType(e.target.value)}
                className="mt-1 accent-royalPurple"
              />

              <div>
                <p className="text-dashboard-text-light dark:text-dashboard-text-dark font-medium">
                  Non-Fiction
                </p>
                <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark leading-relaxed">
                  For true stories, memoirs, and personal histories. Non Fiction
                  mode does not invent or add details. It works strictly with
                  your words, refining clarity, structure, pacing, and voice
                  while keeping every fact, event, and meaning intact.
                </p>
              </div>
            </label>

            {/* Educational */}
            <label
              className="flex items-start gap-3 cursor-pointer rounded-lg p-3 border border-dashboard-border-light
              dark:border-dashboard-border-dark
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              hover:opacity-90
              transition"
            >
              <input
                type="radio"
                name="bookType"
                value="educational"
                checked={bookType === "educational"}
                onChange={(e) => setBookType(e.target.value)}
                className="mt-1 accent-royalPurple"
              />

              <div>
                <p className="text-dashboard-text-light dark:text-dashboard-text-dark font-medium">
                  Educational
                </p>
                <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark leading-relaxed">
                  For guides, courses, workbooks, and instructional material.
                  Educational mode acts as a strict editor, improving clarity
                  and readability without adding, removing, or restructuring
                  content. Your instructional logic and sequencing remain fully
                  intact.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className=" px-4 py-2 rounded font-semibold transition bg-dashboard-hover-light
            dark:bg-dashboard-hover-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            hover:opacity-90"
          >
            Cancel
          </button>
          <button
            onClick={handleAddInfo}
            disabled={loading}
            className="bg-bookBtnColor px-4 py-2 rounded text-black font-semibold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
      {confirmOpen && (
        <div
          className="
      fixed inset-0 
      backdrop-blur-md 
      bg-black/60 
      flex items-center justify-center 
      z-[9999] 
      animate-fadeIn
    "
        >
          <div
            className="
        bg-black/90 
        border border-white/10 
        shadow-[0_0_30px_rgba(0,0,0,0.6)] 
        rounded-2xl 
        px-6 py-5 
        w-[90%] max-w-sm 
        text-center 
        animate-slideDown
      "
          >
            <h3 className="text-xl font-semibold text-[#7bed9f] drop-shadow-sm">
              Confirm Action
            </h3>

            <p className="text-dashboard-muted-light dark:text-gray-300 text-sm leading-relaxed mt-3">
              You will <span className="text-white font-semibold">NOT</span> be
              able to change the book type or author name after continuing.
            </p>

            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="
            px-4 py-2 
            rounded-lg 
            bg-gray-700 
            text-gray-300 
            hover:bg-gray-600 
            transition
          "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setConfirmOpen(false);
                  onCreate({
                    bookName,
                    authorName: author,
                    bookType,
                  });
                }}
                className="
            px-5 py-2 
            rounded-lg 
            bg-[#7bed9f] 
            text-black 
            font-semibold 
            hover:bg-[#63e28b] 
            transition 
            shadow-[0_0_12px_rgba(123,237,159,0.6)]
          "
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
