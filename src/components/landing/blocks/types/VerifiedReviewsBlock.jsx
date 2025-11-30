import React from "react";

export default function VerifiedReviewsBlock({ block, index, updateBlock }) {
  return (
    <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-silver mb-4">
        Verified Reviews Section
      </h3>

      {/* Section Title */}
      <label className="text-sm font-semibold text-gray-300">
        Section Title
      </label>
      <input
        type="text"
        placeholder="Verified Buyer Reviews"
        value={block.title || ""}
        onChange={(e) => updateBlock(index, "title", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* Text Color */}
      <div className="flex items-center gap-4 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Text Color
        </label>
        <input
          type="color"
          value={block.text_color || "#FFFFFF"}
          onChange={(e) => updateBlock(index, "text_color", e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
        />
        <span className="text-xs text-gray-400">
          {block.text_color || "#FFFFFF"}
        </span>
      </div>

      {/* Background Color */}
      <div className="flex items-center gap-4 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Background
        </label>
        <input
          type="color"
          value={block.bg_color || "#000000"}
          onChange={(e) => updateBlock(index, "bg_color", e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
        />
        <span className="text-xs text-gray-400">
          {block.bg_color || "#000000"}
        </span>
      </div>

      {/* Glass Background */}
      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Use Glass Background
        </label>
        <input
          type="checkbox"
          checked={block.use_glass || false}
          onChange={(e) => updateBlock(index, "use_glass", e.target.checked)}
        />
      </div>

      {/* Layout Style */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Layout Style
        </label>
        <select
          value={block.layout || "compact"}
          onChange={(e) => updateBlock(index, "layout", e.target.value)}
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="compact">Compact (Single Column)</option>
          <option value="full">Full (Two Column)</option>
        </select>
      </div>

      {/* Alignment */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Alignment
        </label>
        <select
          value={block.alignment || "center"}
          onChange={(e) => updateBlock(index, "alignment", e.target.value)}
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Live Preview */}
      <div
        className="mt-6 p-6 border border-gray-700 rounded-lg transition-all duration-300"
        style={{
          background: block.use_glass
            ? "rgba(255,255,255,0.08)"
            : block.bg_color || "rgba(0,0,0,0.3)",
          color: block.text_color || "#FFFFFF",
          textAlign: block.alignment || "center",
          borderRadius: "12px",
          boxShadow: block.use_glass
            ? "0 8px 32px rgba(0,0,0,0.3)"
            : "0 8px 25px rgba(0,0,0,0.25)",
          backdropFilter: block.use_glass ? "blur(10px)" : "none",
        }}
      >
        <h4 className="text-xl font-bold mb-6">
          {block.title || "Verified Buyer Reviews"}
        </h4>

        <div
          className={`grid ${
            block.layout === "full" ? "grid-cols-2 gap-4" : "grid-cols-1"
          }`}
        >
          <div
            className="p-4 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#ccc",
            }}
          >
            ★★★★★ “Love this product!”
            <br />
            <span className="text-xs text-gray-500">
              — Verified Buyer, sample preview
            </span>
          </div>

          {block.layout === "full" && (
            <div
              className="p-4 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#ccc",
              }}
            >
              ★★★★☆ “Very helpful and easy to use.”
              <br />
              <span className="text-xs text-gray-500">
                — Verified Buyer, sample preview
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
