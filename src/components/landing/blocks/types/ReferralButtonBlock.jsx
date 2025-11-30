import React from "react";

export default function ReferralButtonBlock({
  block,
  index,
  updateBlock,
}) {
  return (
    <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-silver mb-4">
        Referral Signup Button
      </h3>

      {/* Label */}
      <label className="text-sm font-semibold text-gray-300">
        Button Label
      </label>
      <input
        type="text"
        placeholder="Sign Up Now"
        value={block.button_text || ""}
        onChange={(e) =>
          updateBlock(index, "button_text", e.target.value)
        }
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* Button Colors */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mt-4">

        {/* Background */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-300">
            Button Background
          </label>
          <input
            type="color"
            value={block.button_color || "#10b981"}
            onChange={(e) =>
              updateBlock(index, "button_color", e.target.value)
            }
            className="w-8 h-8 rounded cursor-pointer border border-gray-600"
          />
          <span className="text-xs text-gray-400">
            {block.button_color || "#10b981"}
          </span>
        </div>

        {/* Text Color */}
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <label className="text-sm font-semibold text-gray-300">
            Text Color
          </label>
          <input
            type="color"
            value={block.text_color || "#000000"}
            onChange={(e) =>
              updateBlock(index, "text_color", e.target.value)
            }
            className="w-8 h-8 rounded cursor-pointer border border-gray-600"
          />
          <span className="text-xs text-gray-400">
            {block.text_color || "#000000"}
          </span>
        </div>

      </div>

      {/* Alignment */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Alignment
        </label>
        <select
          value={block.alignment || "center"}
          onChange={(e) =>
            updateBlock(index, "alignment", e.target.value)
          }
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Live Preview */}
      <div
        className="mt-6 p-6 text-center border border-gray-700 rounded-lg"
        style={{ textAlign: block.alignment }}
      >
        <button
          className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105"
          style={{
            background: block.button_color || "#10b981",
            color: block.text_color || "#000000",
          }}
        >
          {block.button_text || "Sign Up Now"}
        </button>

        <p className="text-xs text-gray-400 mt-3 italic">
          This button will automatically track new signups under your referral.
        </p>
      </div>
    </div>
  );
}
