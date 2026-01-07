import React from "react";

export default function ButtonBlock({
  block,
  index,
  updateBlock,
  bgTheme,
  landing,
}) {
  const background = block.use_gradient
    ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
        block.gradient_start || "#22c55e"
      }, ${block.gradient_end || "#3b82f6"})`
    : block.bg_color || "#22c55e";

  const previewBackground =
    bgTheme ||
    (landing?.bg_theme && landing.bg_theme !== "" ? landing.bg_theme : null) ||
    "#0b1220";

  const shadowOpacity =
    typeof block.shadow_opacity === "number"
      ? block.shadow_opacity / 100
      : 0.35;

  const shadow = `${block.shadow_offset_x ?? 0}px ${
    block.shadow_offset_y ?? 8
  }px ${block.shadow_blur ?? 20}px rgba(0,0,0,${shadowOpacity})`;

  const isValidHex = (value) =>
    /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value);

  return (
    <div className="rounded-xl p-6 mt-3 shadow-inner bg-[#0F172A]/60 border border-gray-700 transition-all duration-300 space-y-4">
      {/* Button Text */}
      <label className="text-sm font-semibold text-gray-300">Button Text</label>
      <input
        type="text"
        placeholder="Click Here"
        value={block.text || ""}
        onChange={(e) => updateBlock(index, "text", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white"
      />

      {/* Button URL */}
      <label className="text-sm font-semibold text-gray-300">Button URL</label>
      <input
        type="url"
        placeholder="https://example.com"
        value={block.url || ""}
        onChange={(e) => updateBlock(index, "url", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white"
      />

      {/* Open in New Tab */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={block.open_new_tab ?? true}
          onChange={(e) => updateBlock(index, "open_new_tab", e.target.checked)}
        />
        <span className="text-sm text-gray-300">Open in new tab</span>
      </div>

      {/* Button Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-300">
            Width (px)
          </label>
          <input
            type="number"
            min="80"
            max="600"
            value={block.width || 220}
            onChange={(e) =>
              updateBlock(index, "width", parseInt(e.target.value, 10))
            }
            className="w-full p-2 border border-gray-600 rounded bg-black text-white"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">
            Height (px)
          </label>
          <input
            type="number"
            min="32"
            max="100"
            value={block.height || 48}
            onChange={(e) =>
              updateBlock(index, "height", parseInt(e.target.value, 10))
            }
            className="w-full p-2 border border-gray-600 rounded bg-black text-white"
          />
        </div>
      </div>

      {/* Border Radius */}
      <label className="text-sm font-semibold text-gray-300">
        Corner Radius
      </label>
      <input
        type="range"
        min="0"
        max="40"
        value={block.radius || 8}
        onChange={(e) =>
          updateBlock(index, "radius", parseInt(e.target.value, 10))
        }
        className="w-full"
      />

      {/* Stroke */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-300">
            Stroke Width
          </label>
          <input
            type="number"
            min="0"
            max="6"
            value={block.stroke_width || 0}
            onChange={(e) =>
              updateBlock(index, "stroke_width", parseInt(e.target.value, 10))
            }
            className="w-full p-2 border border-gray-600 rounded bg-black text-white"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">
            Stroke Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={block.stroke_color || "#000000"}
              onChange={(e) =>
                updateBlock(index, "stroke_color", e.target.value)
              }
              className="w-10 h-10 rounded cursor-pointer"
            />

            <input
              type="text"
              value={block.stroke_color || "#000000"}
              onChange={(e) => {
                const val = e.target.value;
                if (isValidHex(val)) {
                  updateBlock(index, "stroke_color", val);
                }
              }}
              placeholder="#000000"
              className="w-24 px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs uppercase"
            />
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-300">Shadow</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Offset X</label>
            <input
              type="range"
              min="-40"
              max="40"
              value={block.shadow_offset_x || 0}
              onChange={(e) =>
                updateBlock(
                  index,
                  "shadow_offset_x",
                  parseInt(e.target.value, 10)
                )
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Offset Y</label>
            <input
              type="range"
              min="-40"
              max="40"
              value={block.shadow_offset_y || 8}
              onChange={(e) =>
                updateBlock(
                  index,
                  "shadow_offset_y",
                  parseInt(e.target.value, 10)
                )
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Blur</label>
            <input
              type="range"
              min="0"
              max="60"
              value={block.shadow_blur || 20}
              onChange={(e) =>
                updateBlock(index, "shadow_blur", parseInt(e.target.value, 10))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={block.shadow_opacity ?? 35}
              onChange={(e) =>
                updateBlock(
                  index,
                  "shadow_opacity",
                  parseInt(e.target.value, 10)
                )
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400">Shadow Color</label>

          <input
            type="color"
            value={block.shadow_color || "#000000"}
            onChange={(e) => updateBlock(index, "shadow_color", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />

          <input
            type="text"
            value={block.shadow_color || "#000000"}
            onChange={(e) => {
              const val = e.target.value;
              if (isValidHex(val)) {
                updateBlock(index, "shadow_color", val);
              }
            }}
            placeholder="#000000"
            className="w-24 px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs uppercase"
          />
        </div>
      </div>

      {/* Background Type */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={block.use_gradient || false}
          onChange={(e) => updateBlock(index, "use_gradient", e.target.checked)}
        />
        <span className="text-sm text-gray-300">Use Gradient</span>
      </div>

      {/* Solid Background */}
      {!block.use_gradient && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-300">
            Background Color
          </label>

          <input
            type="color"
            value={block.bg_color || "#22c55e"}
            onChange={(e) => updateBlock(index, "bg_color", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />

          <input
            type="text"
            value={block.bg_color || "#22c55e"}
            onChange={(e) => {
              const val = e.target.value;
              if (isValidHex(val)) {
                updateBlock(index, "bg_color", val);
              }
            }}
            placeholder="#22c55e"
            className="w-24 px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs uppercase"
          />
        </div>
      )}

      {/* Gradient Controls */}
      {block.use_gradient && (
        <>
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-300">
              Gradient Start
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={block.gradient_start || "#22c55e"}
                onChange={(e) =>
                  updateBlock(index, "gradient_start", e.target.value)
                }
                className="w-10 h-10 rounded cursor-pointer"
              />

              <input
                type="text"
                value={block.gradient_start || "#22c55e"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidHex(val)) {
                    updateBlock(index, "gradient_start", val);
                  }
                }}
                placeholder="#22c55e"
                className="w-24 px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs uppercase"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-300">
              Gradient End
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={block.gradient_end || "#3b82f6"}
                onChange={(e) =>
                  updateBlock(index, "gradient_end", e.target.value)
                }
                className="w-10 h-10 rounded cursor-pointer"
              />

              <input
                type="text"
                value={block.gradient_end || "#3b82f6"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidHex(val)) {
                    updateBlock(index, "gradient_end", val);
                  }
                }}
                placeholder="#3b82f6"
                className="w-24 px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs uppercase"
              />
            </div>
          </div>

          <label className="text-sm font-semibold text-gray-300">
            Gradient Direction
          </label>
          <select
            value={block.gradient_direction || "90deg"}
            onChange={(e) =>
              updateBlock(index, "gradient_direction", e.target.value)
            }
            className="w-full p-2 border border-gray-600 rounded bg-black text-white"
          >
            <option value="0deg">Top to Bottom</option>
            <option value="45deg">Diagonal</option>
            <option value="90deg">Left to Right</option>
            <option value="135deg">Reverse Diagonal</option>
            <option value="180deg">Bottom to Top</option>
          </select>
        </>
      )}

      {/* Text Color */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-300">
          Text Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={block.text_color || "#000000"}
            onChange={(e) => updateBlock(index, "text_color", e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />

          <input
            type="text"
            value={block.text_color || "#000000"}
            onChange={(e) => {
              const val = e.target.value;
              if (isValidHex(val)) {
                updateBlock(index, "text_color", val);
              }
            }}
            placeholder="#000000"
            className="w-24 px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs uppercase"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
          Preview (Live Background)
        </p>

        <div
          style={{
            background: previewBackground,
            padding: "48px 24px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",

                width: `${block.width ?? 220}px`,
                height: `${block.height ?? 48}px`,
                padding: `${block.padding_y ?? 12}px ${block.padding_x ?? 24}px`,

                background,
                color: block.text_color || "#000000",

                fontSize: `${block.font_size ?? 16}px`,
                fontWeight: block.font_weight ?? 600,

                borderRadius: `${block.radius ?? 8}px`,
                border: `${block.stroke_width ?? 0}px solid ${block.stroke_color || "#000"}`,

                boxShadow: shadow,

                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {block.text || "Click Here"}
            </div>
          </div>
        </div>

        {block.url && (
          <p className="mt-2 text-xs text-gray-400 text-center break-all">
            → {block.url}
          </p>
        )}
      </div>
    </div>
  );
}
