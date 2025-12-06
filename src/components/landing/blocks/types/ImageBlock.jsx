import React from "react";

import { toast } from "react-toastify";
import axiosInstance from "../../../../api/axios";

export default function ImageBlock({
  block,
  index,
  updateBlock,
  bgTheme,
  getLabelContrast,
  adjustForLandingOverlay,
  landing,
}) {
  return (
    <div className="rounded-xl p-6 mt-3 border border-gray-700 transition-all duration-300 bg-[#0F172A]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Image Upload
        </h3>
        <span className="text-xs bg-[#1E293B] text-gray-300 px-2 py-1 rounded-full border border-gray-600">
          Max 5 MB
        </span>
      </div>

      {/* Background Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Background color */}
        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Background
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={block.bg_color || "#000000"}
              onChange={(e) => updateBlock(index, "bg_color", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-600"
            />
            <span className="text-xs text-gray-400">
              {block.bg_color || "#000000"}
            </span>
          </div>
        </div>

        {/* Match page bg */}
        <div className="flex items-center gap-3 mt-6">
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Match Page Background
          </label>
          <input
            type="checkbox"
            checked={block.match_main_bg || false}
            onChange={(e) =>
              updateBlock(index, "match_main_bg", e.target.checked)
            }
          />
        </div>

        {/* Gradient toggle */}
        <div className="flex items-center gap-3 mt-2">
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Use Gradient
          </label>
          <input
            type="checkbox"
            checked={block.use_gradient || false}
            onChange={(e) =>
              updateBlock(index, "use_gradient", e.target.checked)
            }
          />
        </div>

        {/* No bg */}
        <div className="flex items-center gap-3 mt-2">
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            No Background
          </label>
          <input
            type="checkbox"
            checked={block.use_no_bg || false}
            onChange={(e) => updateBlock(index, "use_no_bg", e.target.checked)}
          />
        </div>
      </div>

      {/* Gradient settings */}
      {block.use_gradient && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              className="text-sm font-semibold"
              style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
            >
              Start
            </label>
            <input
              type="color"
              value={block.gradient_start || "#F285C3"}
              onChange={(e) =>
                updateBlock(index, "gradient_start", e.target.value)
              }
              className="w-full h-10 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div>
            <label
              className="text-sm font-semibold"
              style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
            >
              End
            </label>
            <input
              type="color"
              value={block.gradient_end || "#7bed9f"}
              onChange={(e) =>
                updateBlock(index, "gradient_end", e.target.value)
              }
              className="w-full h-10 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div className="col-span-2">
            <label
              className="text-sm font-semibold"
              style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
            >
              Direction
            </label>
            <select
              value={block.gradient_direction || "90deg"}
              onChange={(e) =>
                updateBlock(index, "gradient_direction", e.target.value)
              }
              className="w-full p-2 bg-black border border-gray-700 rounded text-white"
            >
              <option value="90deg">Left → Right</option>
              <option value="180deg">Top → Bottom</option>
              <option value="45deg">Diagonal ↘</option>
              <option value="135deg">Diagonal ↙</option>
            </select>
          </div>
        </div>
      )}

      {/* Image Preview & Upload */}
      <div
        className="rounded-xl border border-gray-700 p-6 mt-4"
        style={{
          background: block.use_no_bg
            ? "transparent"
            : block.use_gradient
              ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                  block.gradient_start || "#F285C3"
                }, ${block.gradient_end || "#7bed9f"})`
              : block.match_main_bg
                ? adjustForLandingOverlay(bgTheme)
                : block.bg_color || "transparent",
        }}
      >
        {!block.image_url ? (
          <label
            htmlFor={`imageUpload-${block.id}`}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-green rounded-xl py-10 px-6 cursor-pointer transition-all group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-500 group-hover:text-green transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-6-9l-3-3m0 0l-3 3m3-3V15"
              />
            </svg>

            <p className="mt-3 text-sm text-gray-400">
              <span className="text-green font-medium">Click to upload</span> or
              drag image
            </p>

            <input
              id={`imageUpload-${block.id}`}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const preview = URL.createObjectURL(file);
                updateBlock(index, "image_url", preview);

                const formData = new FormData();
                formData.append("image", file);
                formData.append("landingId", landing.id);
                formData.append("blockId", block.id);

                try {
                  const res = await axiosInstance.post(
                    "/landing/upload-image-block",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                  );

                  if (res.data.success) {
                    updateBlock(index, "image_url", res.data.url);
                    toast.success("Image uploaded!");
                  } else {
                    toast.error("Upload failed");
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Upload error");
                } finally {
                  URL.revokeObjectURL(preview);
                }
              }}
              className="hidden"
            />
          </label>
        ) : (
          <div>
            {(() => {
              const isPng =
  block.image_url &&
  block.image_url.toLowerCase().match(/\.png(\?.*)?$/);


              return (
                <div
                  style={{
                    background: isPng
                      ? `repeating-conic-gradient(#e0e0e0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px`
                      : "transparent",
                    padding: "10px",
                    borderRadius: `${block.radius || 0}px`,
                  }}
                >
                  <img
                    src={block.image_url}
                    alt=""
                    className="rounded-lg mx-auto"
                    style={{
                      maxWidth: block.full_width
                        ? "100%"
                        : block.width
                          ? `${block.width}%`
                          : "100%",
                      width: "100%",
                      padding: `${block.padding || 0}px`,
                      borderRadius: `${block.radius || 0}px`,
                      boxShadow: block.shadow
                        ? (() => {
                            const angle =
                              ((block.shadow_angle || 135) * Math.PI) / 180;
                            const x = Math.round(
                              Math.cos(angle) * (block.shadow_offset || 10)
                            );
                            const y = Math.round(
                              Math.sin(angle) * (block.shadow_offset || 10)
                            );
                            return `${x}px ${y}px ${
                              block.shadow_depth || 25
                            }px ${block.shadow_color || "rgba(0,0,0,0.5)"}`;
                          })()
                        : "none",
                    }}
                  />
                </div>
              );
            })()}

            <button
              type="button"
              className="text-red-400 text-xs mt-3 hover:underline mx-auto block text-center"
              onClick={(e) => {
                e.stopPropagation();
                updateBlock(index, "image_url", "");
              }}
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Padding */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Padding (px)
        </label>
        <input
          type="number"
          value={block.padding || 0}
          onChange={(e) =>
            updateBlock(index, "padding", Number(e.target.value))
          }
          className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
        />
      </div>
      {/* Image Width */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Image Width (%)
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={block.width || 100}
          onChange={(e) => updateBlock(index, "width", Number(e.target.value))}
          className="w-full mt-2"
        />
        <p className="text-xs text-gray-400 mt-1">{block.width || 100}%</p>
      </div>

      {/* Border Radius */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Rounded Corners (px)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={block.radius || 0}
          onChange={(e) => updateBlock(index, "radius", Number(e.target.value))}
          className="w-full mt-2"
        />
        <p className="text-xs text-gray-400 mt-1">{block.radius || 0}px</p>
      </div>

      {/* Shadow controls */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Shadow Color
          </label>
          <input
            type="color"
            value={block.shadow_color || "#000000"}
            onChange={(e) => updateBlock(index, "shadow_color", e.target.value)}
            className="w-full h-10 rounded cursor-pointer border border-gray-600 mt-1"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Shadow Depth
          </label>
          <input
            type="range"
            min="5"
            max="60"
            value={block.shadow_depth || 25}
            onChange={(e) =>
              updateBlock(index, "shadow_depth", Number(e.target.value))
            }
            className="w-full mt-3"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Shadow Angle (°)
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={block.shadow_angle || 135}
            onChange={(e) =>
              updateBlock(index, "shadow_angle", Number(e.target.value))
            }
            className="w-full mt-3"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
          >
            Shadow Offset
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={block.shadow_offset || 10}
            onChange={(e) =>
              updateBlock(index, "shadow_offset", Number(e.target.value))
            }
            className="w-full mt-3"
          />
        </div>
      </div>

      {/* Caption */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Caption
        </label>
        <input
          type="text"
          value={block.caption || ""}
          placeholder="Optional caption"
          onChange={(e) => updateBlock(index, "caption", e.target.value)}
          className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center justify-between mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Enable Shadow
        </label>
        <input
          type="checkbox"
          checked={block.shadow || false}
          onChange={(e) => updateBlock(index, "shadow", e.target.checked)}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Full Width
        </label>
        <input
          type="checkbox"
          checked={block.full_width || false}
          onChange={(e) => updateBlock(index, "full_width", e.target.checked)}
        />
      </div>
    </div>
  );
}
