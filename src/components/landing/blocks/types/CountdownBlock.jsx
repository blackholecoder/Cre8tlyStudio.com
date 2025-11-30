import React from "react";
import CountdownTimerPreview from "../../../../sections/landing/Timer";


export default function CountdownBlock({ block, index, updateBlock }) {
  return (
    <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-silver mb-4">
        Countdown Timer Settings
      </h3>

      {/* Headline */}
      <label className="text-sm font-semibold text-gray-300">
        Headline Text
      </label>
      <input
        type="text"
        placeholder="Offer Ends In:"
        value={block.text || ""}
        onChange={(e) => updateBlock(index, "text", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* Text color */}
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
        <span className="text-xs text-gray-400">{block.text_color}</span>
      </div>

      {/* Target Date */}
      <label className="text-sm font-semibold text-gray-300 mt-4 block">
        Target Date & Time
      </label>
      <input
        type="datetime-local"
        value={
          block.target_date
            ? new Date(block.target_date).toISOString().slice(0, 16)
            : ""
        }
        onChange={(e) => {
          const val = new Date(e.target.value).toISOString();
          updateBlock(index, "target_date", val);
        }}
        onFocus={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          e.currentTarget.showPicker?.();
        }}
        className="w-full mt-1 p-2 border border-gray-600 rounded bg-black text-white"
      />

      {/* Alignment */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-semibold text-gray-300">Alignment</label>
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

      {/* Style Variant */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-semibold text-gray-300">Style</label>
        <select
          value={block.style_variant || "minimal"}
          onChange={(e) =>
            updateBlock(index, "style_variant", e.target.value)
          }
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="minimal">Minimal</option>
          <option value="boxed">Boxed</option>
          <option value="glow">Neon Glow</option>
        </select>
      </div>

      {/* Live Preview */}
      <div
        className="mt-6 p-4 border border-gray-700 rounded-lg text-center"
        style={{ color: block.text_color || "#FFFFFF" }}
      >
        <p className="font-semibold mb-2">{block.text}</p>
        <CountdownTimerPreview targetDate={block.target_date} />
      </div>
    </div>
  );
}
