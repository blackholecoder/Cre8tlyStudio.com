import React from "react";

export default function DividerBlock({ block, index, updateBlock }) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <label>Height (px)</label>

      <input
        type="number"
        value={block.height || 40}
        onChange={(e) =>
          updateBlock(index, "height", parseInt(e.target.value))
        }
        className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
      />

      <label>Line Color</label>

      <input
        type="color"
        value={block.color || "#FFFFFF"}
        onChange={(e) => updateBlock(index, "color", e.target.value)}
      />

      <label>Style</label>

      <select
        value={block.style || "line"}
        onChange={(e) => updateBlock(index, "style", e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
      >
        <option value="line">Line Divider</option>
        <option value="space">Spacer Only</option>
      </select>
    </div>
  );
}
