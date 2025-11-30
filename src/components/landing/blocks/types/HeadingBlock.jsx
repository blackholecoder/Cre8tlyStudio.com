import React from "react";

export default function HeadingBlock({ block, index, updateBlock }) {
  return (
    <>
      <label className="font-semibold text-sm mb-1">
        {block.type === "heading"
          ? "Heading (H1)"
          : block.type === "subheading"
            ? "Subheading (H2)"
            : "Sub-Subheading (H3)"}
      </label>

      <textarea
        rows={2}
        placeholder={
          block.type === "heading"
            ? "Enter your main headline"
            : block.type === "subheading"
              ? "Enter your subheading"
              : "Enter your supporting header"
        }
        value={block.text}
        onChange={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
          updateBlock(index, "text", e.target.value);
        }}
        onFocus={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="w-full mt-1 p-2 border border-gray-600 rounded-lg bg-black text-white 
                   focus:ring-2 focus:ring-green focus:border-gray-400 
                   placeholder-gray-400 leading-snug resize-none transition-all duration-200"
        style={{ minHeight: "3.5rem", lineHeight: "1.4" }}
      />
    </>
  );
}
