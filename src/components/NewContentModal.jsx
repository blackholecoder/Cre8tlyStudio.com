import { useState } from "react";
import { toast } from "react-toastify";


export default function NewContentModal({ onCreate, onClose }) {
  const [contentType, setContentType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
  if (!contentType) {
    toast.error("Please select a document type.", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
    return;
  }

  setLoading(true);
  onCreate({ contentType });
}

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-md border border-gray-700 text-white space-y-6 shadow-lg">
        <h2 className="text-xl font-semibold text-center">
          Select Document Type
        </h2>

        <div className="flex flex-col gap-3">
          {[
            {
              label: "Lead Magnet",
              value: "lead_magnet",
              description:
                "Generate a persuasive, marketing-focused guide designed to attract and convert readers.",
            },
            {
              label: "Learning Document",
              value: "learning_doc",
              description:
                "Create a detailed, step-by-step educational document that teaches practical real-world skills.",
            },
          ].map((type) => (
            <label
              key={type.value}
              className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3 transition ${
                contentType === type.value
                  ? "border-green bg-green/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name="contentType"
                value={type.value}
                checked={contentType === type.value}
                onChange={(e) => setContentType(e.target.value)}
                className="accent-green mt-1"
              />
              <div>
                <span className="font-semibold text-base">
                  {type.label}
                </span>
                <p className="text-sm text-gray-400">{type.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={loading}
            className="bg-muteGrey px-4 py-2 rounded text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
