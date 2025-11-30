import React from "react";
import { normalizeVideoUrl } from "../../../../sections/landing/NormalizeVideoUrl";

export default function VideoBlock({ block, index, updateBlock }) {
  return (
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
  );
}
