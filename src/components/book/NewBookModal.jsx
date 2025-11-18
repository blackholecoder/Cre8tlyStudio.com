import { useState } from "react";


export default function NewBookModal({ onCreate, onClose }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookType, setBookType] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleAddInfo() {
  if (!bookName || !author || !bookType) {
    toast.error("Please fill in all fields, including book type.");
    return;
  }

  setConfirmOpen(true); // open confirmation
}


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-md border border-gray-700 text-white space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-center">Set Up Your Book</h2>

        <div>
          <label className="block text-silver mb-1">Book Name</label>
          <input
            type="text"
            placeholder="e.g. The Burning City"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
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
      {confirmOpen && (
  <div className="
      fixed inset-0 
      backdrop-blur-md 
      bg-black/60 
      flex items-center justify-center 
      z-[9999] 
      animate-fadeIn
    ">
    
    <div className="
        bg-black/90 
        border border-white/10 
        shadow-[0_0_30px_rgba(0,0,0,0.6)] 
        rounded-2xl 
        px-6 py-5 
        w-[90%] max-w-sm 
        text-center 
        animate-slideDown
      ">
      
      <h3 className="text-xl font-semibold text-[#7bed9f] drop-shadow-sm">
        Confirm Action
      </h3>

      <p className="text-gray-300 text-sm leading-relaxed mt-3">
        You will <span className="text-white font-semibold">NOT</span> be able 
        to change the book type or author name after continuing.
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
