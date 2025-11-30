import React from "react";

export default function SocialLinksBlock({ block, index, updateBlock }) {
  const platforms = [
    "instagram",
    "threads",
    "twitter",
    "youtube",
    "linkedin",
    "facebook",
    "tiktok",
  ];

  const iconMap = {
    instagram:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
    threads:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/threads.svg",
    twitter:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg",
    youtube:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg",
    linkedin:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
    facebook:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
    tiktok:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg",
  };

  return (
    <div className="rounded-xl p-6 mt-3 bg-[#1f2937] border border-gray-700">
      <h3 className="text-white font-semibold mb-3">Social Links Row</h3>

      {/* URLs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <input
            key={platform}
            type="url"
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
            value={block.links?.[platform] || ""}
            onChange={(e) =>
              updateBlock(index, "links", {
                ...block.links,
                [platform]: e.target.value,
              })
            }
            className="w-full p-2 rounded bg-black text-white text-sm border border-gray-700 placeholder-gray-400"
          />
        ))}
      </div>

      {/* Alignment */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm text-gray-300">Alignment</label>
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

      {/* Icon Style */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm text-gray-300">Icon Style</label>
        <select
          value={block.icon_style || "color"}
          onChange={(e) => updateBlock(index, "icon_style", e.target.value)}
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="color">Full Color</option>
          <option value="mono">Monochrome</option>
        </select>
      </div>

      {/* Icon Color */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm text-gray-300">Icon Color</label>
        <input
          type="color"
          value={block.icon_color || "#ffffff"}
          onChange={(e) => updateBlock(index, "icon_color", e.target.value)}
          className="w-10 h-10 rounded border border-gray-600 cursor-pointer"
        />
      </div>

      {/* Live Preview */}
      <div
        className="flex justify-center items-center gap-4 mt-6 flex-wrap"
        style={{
          justifyContent:
            block.alignment === "center"
              ? "center"
              : block.alignment === "right"
              ? "flex-end"
              : "flex-start",
        }}
      >
        {Object.entries(block.links || {})
          .filter(([_, url]) => url)
          .map(([platform]) => (
            <div
              key={platform}
              title={platform}
              style={{
                width: 32,
                height: 32,
                WebkitMask: `url(${iconMap[platform]}) no-repeat center / contain`,
                mask: `url(${iconMap[platform]}) no-repeat center / contain`,
                backgroundColor:
                  block.icon_style === "mono"
                    ? "#ffffff"
                    : block.icon_color || "#ffffff",
                transition: "transform 0.2s ease",
              }}
              className="hover:scale-110"
            />
          ))}
      </div>
    </div>
  );
}
