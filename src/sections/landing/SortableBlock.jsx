import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Trash2 } from "lucide-react";
import { normalizeVideoUrl } from "./NormalizeVideoUrl";

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
      className="mb-6 bg-black/70 border border-gray-600 hover:border-gray-400 
                 rounded-xl p-5 relative shadow-inner text-white transition-all duration-300"
    >
      {/* 🧩 Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab bg-gray-300 hover:bg-gray-400 
                   text-xs px-1 py-0.5 rounded"
      >
        ☰
      </div>

      {/* 🧩 Collapse / Expand Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => updateBlock(index, "collapsed", !block.collapsed)}
      >
        <h3 className="font-semibold text-lg text-green capitalize">
          {block.type.replace("_", " ")} Block
        </h3>
        <span
          className={`text-gray-400 text-sm transform transition-transform duration-300 ${
            block.collapsed ? "rotate-0" : "rotate-180"
          }`}
        >
          ▼
        </span>
      </div>

      {/* 🪄 Editable Fields (Collapsible) */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          block.collapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        }`}
      >
        <div
          className={`transform transition-transform duration-500 ${
            block.collapsed ? "scale-y-95" : "scale-y-100"
          }`}
        >
          {["heading", "subheading", "subsubheading"].includes(block.type) && (
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
          )}

          {block.type === "list_heading" && (
            <>
              <label className="font-semibold text-sm mb-1">
                List Heading (bold line above bullet list)
              </label>
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
            </>
          )}

          {block.type === "paragraph" && (
            <>
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(index, "text", e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full mt-1 p-2 border rounded h-24"
                placeholder={
                  block.bulleted
                    ? "Enter list items, one per line"
                    : "Enter your paragraph text"
                }
              />

              {/* 🧭 Alignment + Bullet */}
              <div className="mt-3 flex items-center gap-4">
                <select
                  value={block.alignment || "left"}
                  onChange={(e) =>
                    updateBlock(index, "alignment", e.target.value)
                  }
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
                    onChange={(e) =>
                      updateBlock(index, "bulleted", e.target.checked)
                    }
                    onFocus={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="w-4 h-4 accent-green-500"
                  />
                  Bullet List
                </label>
              </div>
            </>
          )}

          {block.type === "button" && (
            <>
              <label className="font-semibold text-sm mb-1">Button Text</label>
              <input
                type="text"
                placeholder="Enter button label"
                value={block.text || ""}
                onChange={(e) => updateBlock(index, "text", e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-black text-white"
              />

              <label className="font-semibold text-sm mt-3 mb-1">
                Button Link URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={block.url || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const normalized = normalizeVideoUrl(value);
                  updateBlock(index, "url", normalized);
                }}
                className="w-full mt-1 p-2 border rounded bg-black text-white"
              />

              <div className="flex items-center mt-3">
                <input
                  id={`new-tab-${id}`}
                  type="checkbox"
                  checked={block.new_tab || false}
                  onChange={(e) =>
                    updateBlock(index, "new_tab", e.target.checked)
                  }
                  className="w-4 h-4 mr-2 accent-green-500"
                />
                <label
                  htmlFor={`new-tab-${id}`}
                  className="text-sm font-semibold text-gray-400"
                >
                  Open in new tab
                </label>
              </div>
            </>
          )}

          {block.type === "video" && (
            <>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Video URL (YouTube or Vimeo)
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=xxxx"
                value={block.url || ""}
                onChange={(e) => updateBlock(index, "url", e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-[#0F172A] border border-gray-700 text-gray-100"
              />

              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Caption (optional)
              </label>
              <input
                type="text"
                placeholder="Enter caption text"
                value={block.caption || ""}
                onChange={(e) => updateBlock(index, "caption", e.target.value)}
                className="w-full mb-4 p-2 rounded-md bg-[#0F172A] border border-gray-700 text-gray-100"
              />

              {block.url && (
                <div className="mt-4">
                  <iframe
                    src={normalizeVideoUrl(block.url)}
                    title="Video Preview"
                    className="w-full aspect-video rounded-lg border border-gray-700 shadow-md"
                    allow="autoplay; fullscreen"
                  ></iframe>
                </div>
              )}
            </>
          )}
        </div>

        {/* 🗑 Remove Button (collapses with content) */}
        <button
          type="button"
          onClick={() => removeBlock(index)}
          className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-all"
        >
          <Trash2 size={16} className="opacity-80" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}

export const MemoizedSortableBlock = React.memo(SortableBlock);
