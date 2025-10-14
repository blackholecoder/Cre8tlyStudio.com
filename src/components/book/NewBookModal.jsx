import { useState } from "react";

export default function NewBookModal({ bookId, accessToken, onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddInfo() {
    if (!title || !author) {
      alert("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://cre8tlystudio.com/api/books/update-info/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, authorName: author }),
      });

      if (!res.ok) throw new Error("Failed to update book info");
      onCreate(title, author); // open the writing prompt modal next
    } catch (err) {
      console.error("Error saving book info:", err);
      alert("Something went wrong while saving your book info.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-md border border-gray-700 text-white space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-center">Set Up Your Book</h2>

        <div>
          <label className="block text-silver mb-1">Book Title</label>
          <input
            type="text"
            placeholder="e.g. The Clockmaker’s Secret"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-silver mb-1">Author Name</label>
          <input
            type="text"
            placeholder="e.g. Elias Monroe"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
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
            className="bg-gradient-to-r from-green to-royalPurple px-4 py-2 rounded text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
