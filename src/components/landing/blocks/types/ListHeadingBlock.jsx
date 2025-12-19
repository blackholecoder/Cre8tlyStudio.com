import React from "react";

export default function ListHeadingBlock({
  block,
  index,
  updateBlock,
  openAIModal,
}) {
  return (
    <>
      <label className="font-semibold text-sm mb-1">
        List Heading (bold line above bullet list)
      </label>

      <div className="pb-2">
        <button
          type="button"
          onClick={() =>
            openAIModal({
              blockType: "list_heading",
              blockIndex: index,
              currentText: block.text,
              role: block.aiRole || "body",
            })
          }
          onPointerDown={(e) => e.stopPropagation()}
          className="
      text-xs font-semibold px-3 py-1 rounded-md
      bg-royalPurple text-white
      hover:bg-royalPurple/80
      transition
    "
          title="Use AI to write or improve this copy"
        >
          AI
        </button>
      </div>

      <textarea
        rows={2}
        placeholder="e.g. LABEL FOR YOUR BULLETED LISTS"
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
      <div className="flex gap-2 mt-3">
        {["left", "center", "right"].map((align) => (
          <button
            key={align}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              updateBlock(index, "alignment", align);
            }}
            className={`px-3 py-1 text-xs rounded border transition-all
              ${
                block.alignment === align
                  ? "bg-green-600/20 border-green-500 text-green-400"
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }
            `}
          >
            {align.charAt(0).toUpperCase() + align.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
}
