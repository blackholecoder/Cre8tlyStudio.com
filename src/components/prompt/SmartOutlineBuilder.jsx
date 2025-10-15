import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SmartPromptBuilder({ onPromptReady }) {
  const [audience, setAudience] = useState("");
  const [pain, setPain] = useState("");
  const [promise, setPromise] = useState("");
  const [offer, setOffer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGeneratePrompt = async () => {
    if (!audience || !pain || !promise) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://cre8tlystudio.com/api/lead-magnets/prompt-builder",
        { audience, pain, promise, offer }
      );

      onPromptReady(res.data.prompt);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate prompt. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-700 space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">Smart Prompt Builder</h2>
      <p className="text-gray-400 text-sm mb-4">
        Answer a few quick questions so we can craft a personalized lead magnet prompt for you.
      </p>
      <div>
        <label className="block text-gray-300 mb-1">Who is this for?</label>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Example: entrepreneurs, creators, small business owners"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">What problem are they facing?</label>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Example: struggling to grow an email list or convert leads"
          value={pain}
          onChange={(e) => setPain(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">What transformation or result do they want?</label>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Example: consistently attract qualified leads every week"
          value={promise}
          onChange={(e) => setPromise(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">What’s your offer or next step? (optional)</label>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Example: join my course, book a free strategy call"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center mt-6 space-x-3">
        <button
          onClick={handleGeneratePrompt}
          disabled={loading}
          className="flex-1 px-6 py-2 bg-headerGreen text-black font-semibold rounded hover:bg-green-500 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={() => onPromptReady("")}
          disabled={loading}
          className="flex-1 px-6 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
