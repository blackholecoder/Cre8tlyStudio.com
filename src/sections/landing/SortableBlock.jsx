import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";



function SortableBlock({ id, block, index, updateBlock, removeBlock }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-6 bg-gray-50 border border-gray-200 p-4 rounded-lg relative"
    >
      <div
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab bg-gray-300 hover:bg-gray-400 text-xs px-1 py-0.5 rounded"
      >
        ☰
      </div>

      {/* Editable fields */}
      {["heading", "subheading", "subsubheading"].includes(block.type) && (
  <>
    <label className="font-semibold text-sm mb-1">
      {block.type === "heading"
        ? "Heading (H1)"
        : block.type === "subheading"
        ? "Subheading (H2)"
        : "Sub-Subheading (H3)"}
    </label>
    <input
      type="text"
      placeholder={
        block.type === "heading"
          ? "Enter your main headline"
          : block.type === "subheading"
          ? "Enter your subheading"
          : "Enter your supporting header"
      }
      value={block.text}
      onChange={(e) => updateBlock(index, "text", e.target.value)}
      onFocus={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className="w-full mt-1 p-2 border rounded"
    />
  </>
)}


      {block.type === "paragraph" && (
        <textarea
          value={block.text}
          onChange={(e) => updateBlock(index, "text", e.target.value)}
          onFocus={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full mt-1 p-2 border rounded h-24"
        />
      )}

      {block.type === "button" && (
        <input
          type="text"
          value={block.text}
          onChange={(e) => updateBlock(index, "text", e.target.value)}
          onFocus={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full mt-1 p-2 border rounded"
        />
      )}

      <button
        className="mt-3 text-red-500 text-sm hover:underline"
        onClick={() => removeBlock(index)}
      >
        Remove
      </button>
    </div>
  );
}

export const MemoizedSortableBlock = React.memo(SortableBlock);
