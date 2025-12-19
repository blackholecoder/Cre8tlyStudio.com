import React from "react";

export default function ParagraphBlock({
  block,
  index,
  updateBlock,
  openAIModal,
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Paragraph</span>
      </div>

      <div className="pb-2">
        <button
          type="button"
          onClick={() =>
            openAIModal({
              blockType: "paragraph",
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
        value={block.text}
        onChange={(e) => updateBlock(index, "text", e.target.value)}
        onFocus={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="w-full mt-1 p-2 border rounded h-24 bg-black text-white border-gray-600"
        placeholder={
          block.bulleted
            ? "Enter list items, one per line"
            : "Enter your paragraph text"
        }
      />

      {/* Alignment + Bullet */}
      <div className="mt-3 flex items-center gap-4">
        <select
          value={block.alignment || "left"}
          onChange={(e) => updateBlock(index, "alignment", e.target.value)}
          onFocus={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="appearance-none bg-black text-white border border-gray-600 rounded-md px-3 py-2 pr-8 
                     text-sm focus:ring-2 focus:ring-silver focus:outline-none cursor-pointer w-fit"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>

        <label className="flex items-center gap-2 text-sm font-semibold text-gray-400">
          <input
            type="checkbox"
            checked={block.bulleted || false}
            onChange={(e) => updateBlock(index, "bulleted", e.target.checked)}
            onFocus={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-4 h-4 accent-green-500"
          />
          Bullet List
        </label>
      </div>
    </>
  );
}
