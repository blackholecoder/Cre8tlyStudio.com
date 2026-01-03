import React from "react";

export default function SocialLinksBlock({ block, index, updateBlock }) {
  const showBorders = !!block.show_borders;

  const platforms = [
    "instagram",
    "threads",
    "twitter",
    "youtube",
    "linkedin",
    "facebook",
    "tiktok",
    "pinterest",
    "substack",
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
    pinterest:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/pinterest.svg",
    substack:
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/substack.svg",
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
          onChange={(e) => {
            const value = e.target.value;
            updateBlock(index, "icon_style", value);
            if (value !== "mono") {
              updateBlock(index, "show_borders", false);
            }
          }}
          className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
        >
          <option value="color">Full Color</option>
          <option value="mono">Monochrome</option>
        </select>
      </div>

      {block.icon_style === "mono" && (
        <div className="flex items-center justify-between mt-4">
          <label className="text-sm text-gray-300">Icon Borders</label>
          <button
            type="button"
            onClick={() => updateBlock(index, "show_borders", !showBorders)}
            className={`px-4 py-2 rounded-md text-sm border transition
        ${
          showBorders
            ? "bg-white text-black border-white"
            : "bg-black text-white border-gray-700"
        }`}
          >
            {showBorders ? "On" : "Off"}
          </button>
        </div>
      )}

      {/* Icon Color */}
      <div className="flex items-center mt-4">
        <label className="text-sm text-gray-300 w-32">Icon Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={block.icon_color || "#ffffff"}
            onChange={(e) => updateBlock(index, "icon_color", e.target.value)}
            className="w-10 h-10 rounded border border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={block.icon_color || "#ffffff"}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#([0-9A-Fa-f]{0,6})$/.test(value)) {
                updateBlock(index, "icon_color", value);
              }
            }}
            placeholder="#ffffff"
            className="w-24 p-2 rounded bg-black text-white text-sm border border-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2 tracking-wide">
          Live Preview
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 px-6 py-5">
          <div
            className="flex items-center gap-4 flex-wrap"
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
              .map(([platform], i) => {
                const color =
                  block.icon_style === "mono"
                    ? "rgba(255,255,255,0.75)"
                    : block.icon_color || "#ffffff";

                return (
                  <div
                    key={platform}
                    title={platform}
                    className="flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:opacity-90 hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                    style={{
                      width: showBorders ? 34 : 26,
                      height: showBorders ? 34 : 26,
                      borderRadius: showBorders ? 10 : 0,
                      border: showBorders ? `1.25px solid ${color}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        WebkitMask: `url(${iconMap[platform]}) no-repeat center / contain`,
                        mask: `url(${iconMap[platform]}) no-repeat center / contain`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
