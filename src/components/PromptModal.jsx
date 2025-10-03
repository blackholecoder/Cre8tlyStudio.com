import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export default function PromptModal({
  isOpen,
  onClose,
  magnetId,
  accessToken,
  onSubmitted,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://cre8tlystudio.com/api/lead-magnets/prompt",
        { magnetId, prompt: text },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      onSubmitted(magnetId, text);
      setText("");
      onClose();
    } catch (err) {
      console.error("Error submitting prompt:", err);
      alert("Failed to submit prompt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Transition show={isOpen} appear>
      <Dialog className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />

        {/* Modal wrapper (centers content) */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl 
                          bg-gray-900 p-8 shadow-2xl border border-gray-700"
          >
            <DialogTitle className="text-2xl font-bold text-white mb-6 text-center">
              ✨ Create Your Lead Magnet
            </DialogTitle>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Editor Box */}
              <div className="h-[300px] overflow-hidden rounded-lg border border-gray-600 bg-white">
                <ReactQuill
                  theme="snow"
                  value={text}
                  onChange={setText}
                  placeholder="Write your prompt here..."
                  className="h-[250px] text-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green to-royalPurple 
                   text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
              >
                {loading ? "⏳ Generating..." : "🚀 Submit Prompt"}
              </button>
            </form>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-xl"
            >
              ✕
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
