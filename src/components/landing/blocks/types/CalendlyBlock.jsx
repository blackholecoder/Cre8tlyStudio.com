import React from "react";

export default function CalendlyBlock({ block, index, updateBlock }) {
  return (
    <div className="rounded-xl p-6 mt-3 shadow-inner bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
      {/* Calendly URL */}
      <label className="text-sm font-semibold text-gray-300">
        Calendly URL
      </label>

      <input
        type="url"
        placeholder="https://calendly.com/yourname/meeting"
        value={block.calendly_url || ""}
        onChange={(e) => updateBlock(index, "calendly_url", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* Section Title */}
      <label className="text-sm font-semibold text-gray-300 mt-4">
        Section Title
      </label>

      <input
        type="text"
        placeholder="Book a Call"
        value={block.title || ""}
        onChange={(e) => updateBlock(index, "title", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* Title Color */}
      <div className="flex items-center gap-4 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Title Color
        </label>

        <input
          type="color"
          value={block.title_color || "#FFFFFF"}
          onChange={(e) => updateBlock(index, "title_color", e.target.value)}
          className="w-10 h-10 rounded cursor-pointer color-circle"
        />

        <span className="text-xs text-gray-400">
          {block.title_color || "#FFFFFF"}
        </span>
      </div>

      {/* Embed Height */}
      <label className="text-sm font-semibold text-gray-300 mt-4">
        Embed Height (px)
      </label>

      <input
        type="number"
        min="400"
        max="1200"
        step="10"
        placeholder="700"
        value={block.height || 700}
        onChange={(e) =>
          updateBlock(index, "height", parseInt(e.target.value, 10))
        }
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />
    </div>
  );
}
