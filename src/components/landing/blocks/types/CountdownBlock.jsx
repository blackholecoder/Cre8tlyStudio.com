import React from "react";
import CountdownTimerPreview from "../../../../sections/landing/Timer";

export default function CountdownBlock({ block, index, updateBlock }) {
  const previewStyles = {
    minimal: "border-gray-700 bg-transparent",
    boxed: "bg-black/60 border border-gray-600 shadow-md",
    glow: "bg-black/70 border border-green/50 shadow-[0_0_20px_rgba(34,197,94,0.35)]",
  };

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
      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Text Color
        </label>
        <input
          type="color"
          value={block.text_color || "#FFFFFF"}
          onChange={(e) => updateBlock(index, "text_color", e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
        />
        <input
          type="text"
          value={block.text_color || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
              updateBlock(
                index,
                "text_color",
                val.startsWith("#") ? val : `#${val}`
              );
            }
          }}
          placeholder="#ffffff"
          className="w-24 flex-none px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
        />
      </div>

      {block.style_variant === "glow" && (
        <div className="flex items-center gap-3 mt-4">
          <label className="text-sm font-semibold text-gray-300">
            Glow Color
          </label>
          <input
            type="color"
            value={block.glow_color || "#10b981"}
            onChange={(e) => updateBlock(index, "glow_color", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-gray-600"
          />
          <input
            type="text"
            value={block.glow_color || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                updateBlock(
                  index,
                  "glow_color",
                  val.startsWith("#") ? val : `#${val}`
                );
              }
            }}
            placeholder="#10b981"
            className="w-24 flex-none px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
          />
        </div>
      )}

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
          onChange={(e) => updateBlock(index, "style_variant", e.target.value)}
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="minimal">Minimal</option>
          <option value="boxed">Boxed</option>
          <option value="glow">Neon Glow</option>
        </select>
      </div>

      {/* Live Preview */}
      <div
        className={`
    mt-6
    p-4
    rounded-lg
    text-center
    transition-all
    duration-300
    ${previewStyles[block.style_variant || "minimal"]}
  `}
        style={{ color: block.text_color || "#FFFFFF" }}
      >
        <p className="font-semibold mb-2">{block.text}</p>
        <CountdownTimerPreview
          targetDate={block.target_date}
          variant={block.style_variant}
          textColor={block.text_color || "#FFFFFF"}
          glowColor={block.glow_color}
        />
      </div>
    </div>
  );
}
