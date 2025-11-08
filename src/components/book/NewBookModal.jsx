import { useState } from "react";

export default function NewBookModal({ onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookType, setBookType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddInfo() {
    if (!title || !author || !bookType) {
      alert("Please fill in all fields, including book type.");
      return;
    }

    onCreate({
      title,
      authorName: author,
      bookType,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-md border border-gray-700 text-white space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-center">Set Up Your Book</h2>

        <div>
          <label className="block text-silver mb-1">Book Title</label>
          <input
            type="text"
            placeholder="e.g. The Burning City"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-silver mb-1">Author Name</label>
          <input
            type="text"
            placeholder="e.g. Dean Koontz"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
        </div>

        {/* 👇 New Book Type Section */}
        <div>
          <label className="block text-silver mb-2">Select Book Type</label>
          <div className="flex flex-col gap-2">
            {["Fiction", "Non-Fiction", "Educational"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="bookType"
                  value={type.toLowerCase()}
                  checked={bookType === type.toLowerCase()}
                  onChange={(e) => setBookType(e.target.value)}
                  className="accent-royalPurple"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddInfo}
            disabled={loading}
            className="bg-royalPurple px-4 py-2 rounded text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
