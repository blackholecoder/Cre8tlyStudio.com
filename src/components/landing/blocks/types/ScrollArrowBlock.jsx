import { SCROLL_ARROW_STYLES } from "../../../../constants";

export default function ScrollArrowBlock({
  block,
  index,
  updateBlock,
  bgTheme,
  getLabelContrast,
}) {
  const styleConfig = SCROLL_ARROW_STYLES[block.arrow_style || "single"];

  return (
    <div className="rounded-xl p-6 mt-3 border border-gray-700 bg-[#0F172A] transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <h3
          className="text-lg font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Scroll Arrow
        </h3>

        <span className="text-xs bg-[#1E293B] text-gray-300 px-2 py-1 rounded-full border border-gray-600">
          Call to Action
        </span>
      </div>

      {/* Preview */}
      <div
        className="flex justify-center items-center mb-6"
        style={{
          justifyContent:
            block.alignment === "left"
              ? "flex-start"
              : block.alignment === "right"
                ? "flex-end"
                : "center",
        }}
      >
        <div
          style={{
            width: block.size || 36,
            cursor: "pointer",
            touchAction: "manipulation",
            ["--arrow-speed"]: `${block.animation_speed || 1.2}s`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {Array.from({ length: styleConfig.count }).map((_, i) => (
            <svg
              key={i}
              className={`scroll-arrow-item ${block.animation_type || "bounce"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke={block.color || "#ffffff"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="100%"
              height="100%"
              style={{
                display: "block",
                marginTop: i === 0 ? 0 : "-10px",
                animationDelay: `${i * styleConfig.stagger}s`,
                animationDuration: `${block.animation_speed || 1.2}s`,
              }}
            >
              <path d="M19 12l-7 7-7-7" />
            </svg>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="mt-4">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Alignment
        </label>

        <div className="flex gap-2 mt-2">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => updateBlock(index, "alignment", align)}
              className={`px-3 py-1 text-xs rounded border transition-all
                ${
                  block.alignment === align
                    ? "bg-green-600/20 border-green-500 text-green-400"
                    : "border-gray-600 text-gray-400 hover:border-gray-400"
                }
              `}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow Style */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Arrow Style
        </label>

        <div className="flex gap-2 mt-2">
          {Object.entries(SCROLL_ARROW_STYLES).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => updateBlock(index, "arrow_style", key)}
              className={`px-3 py-1 text-xs rounded border transition-all
          ${
            (block.arrow_style || "single") === key
              ? "bg-green/80 border-green/70 text-green"
              : "border-gray-600 text-gray-400 hover:border-gray-400"
          }
        `}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Type */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Animation
        </label>

        <div className="flex gap-2 mt-2">
          {["bounce", "float", "pulse"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateBlock(index, "animation_type", type)}
              className={`px-3 py-1 text-xs rounded border transition-all
          ${
            block.animation_type === type
              ? "bg-green-600/20 border-green-500 text-green-400"
              : "border-gray-600 text-gray-400 hover:border-gray-400"
          }
        `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Speed */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Animation Speed
        </label>

        <input
          type="range"
          min="0.6"
          max="3"
          step="0.1"
          value={block.animation_speed || 1.2}
          onChange={(e) =>
            updateBlock(index, "animation_speed", Number(e.target.value))
          }
          className="w-full mt-2"
        />

        <div className="text-xs text-gray-400 mt-1">
          {block.animation_speed || 1.2}s
        </div>
      </div>

      {/* Color */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Arrow Color
        </label>

        <div className="flex items-center gap-3 mt-2">
          <input
            type="color"
            value={block.color || "#ffffff"}
            onChange={(e) => updateBlock(index, "color", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-gray-600"
          />

          <input
            type="text"
            value={block.color || "#ffffff"}
            onChange={(e) => updateBlock(index, "color", e.target.value)}
            className="flex-1 p-2 border border-gray-600 rounded bg-black text-white uppercase"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Size */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Arrow Size
        </label>

        <input
          type="range"
          min="16"
          max="96"
          value={block.size || 36}
          onChange={(e) => updateBlock(index, "size", Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>
    </div>
  );
}
