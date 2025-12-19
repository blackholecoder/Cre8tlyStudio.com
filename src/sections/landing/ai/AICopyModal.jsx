import React, { useState, useEffect } from "react";
import { X, Sparkles, RotateCcw } from "lucide-react";
import axiosInstance from "../../../api/axios";

export default function AICopyModal({ aiContext, onApply, onClose }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    setResult("");
  }, [prompt]);

  // ✅ Auto-prefill prompt with existing block text
  useEffect(() => {
    if (aiContext?.currentText) {
      setPrompt(aiContext.currentText);
    }
  }, [aiContext]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await axiosInstance.post("/landing/generate-copy", {
        prompt,
        blockType: aiContext.blockType,
      });

      setResult(res.data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ One-click rewrite shortcut
  const handleRewriteExisting = () => {
    if (!aiContext?.currentText) return;
    setPrompt(
      `Rewrite the following text to be clearer and more engaging:\n\n${aiContext.currentText}`
    );
  };

  const handleRewriteResult = async () => {
    const textToRewrite = result || aiContext?.currentText;
    if (!textToRewrite) return;

    setLoading(true);

    try {
      const res = await axiosInstance.post("/landing/generate-copy", {
        prompt: `Rewrite the following copy to be clearer, more engaging, and more effective:\n\n${textToRewrite}`,
        blockType: aiContext.blockType,
      });

      setResult(res.data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#0B0F19] border border-gray-800 rounded-2xl shadow-xl p-5 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-green w-5 h-5" />
          <h2 className="text-lg font-bold text-white">AI Assistant</h2>
        </div>

        {/* Block info */}
        <p className="text-xs text-gray-400 mb-4">
          Editing{" "}
          <span className="text-gray-200 font-semibold">
            {aiContext.blockType}
          </span>{" "}
          block
        </p>

        {/* Rewrite shortcut */}
        {aiContext?.currentText && (
          <button
            type="button"
            onClick={handleRewriteExisting}
            className="flex items-center gap-2 text-xs mb-3 px-3 py-1.5 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
          >
            <RotateCcw size={14} />
            Rewrite existing text
          </button>
        )}

        {/* Prompt */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">
            What is this block about?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what this section should say. You can paste text from your PDF here."
            className="w-full h-28 p-3 bg-black border border-gray-700 rounded-md text-sm text-white resize-none"
          />
        </div>

        {/* Result */}
        <div className="mb-5">
          <label className="text-xs text-gray-400 mb-1 block">
            AI generated copy
          </label>

          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="AI output will appear here"
            className="w-full h-32 p-3 bg-black border border-gray-700 rounded-md text-sm text-white resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`
        px-4 py-2 rounded-md text-sm font-bold transition
        ${
          loading || !prompt.trim()
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-green text-black hover:bg-emerald-500"
        }
      `}
            >
              {loading ? "Writing..." : "Generate"}
            </button>

            <button
              onClick={handleRewriteResult}
              disabled={loading || (!result && !aiContext?.currentText)}
              className={`
        px-4 py-2 rounded-md text-sm font-bold transition
        ${
          loading || (!result && !aiContext?.currentText)
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-500"
        }
      `}
            >
              Rewrite
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={() => onApply(result)}
              disabled={!result}
              className={`
        px-4 py-2 rounded-md text-sm font-bold transition
        ${
          result
            ? "bg-blue text-white hover:bg-blue/80"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }
      `}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
