import { adjustForLandingOverlay } from "../../../../sections/landing/adjustForLandingOverlay";

const getLabelContrast = (hex) => {
    if (!hex) return "#1f2937"; // default dark gray

    const color = hex.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 160 ? "#1f2937" : "#f3f4f6";
  };



export default function OfferBannerBlock({
  block,
  index,
  updateBlock,
  bgTheme,
}) {
  return (
    <div
      className="rounded-xl p-6 mt-3 shadow-inner transition-all relative"
      style={{
        background: block.match_main_bg
          ? adjustForLandingOverlay(bgTheme)
          : bgTheme || "linear-gradient(to bottom, #1e1e1e, #111)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        transition: "background 0.4s ease",
      }}
    >
      <div
        className="rounded-xl p-6 shadow-lg transition-all duration-300"
        style={{
          background: block.match_main_bg
            ? adjustForLandingOverlay(bgTheme)
            : block.use_gradient
              ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                  block.gradient_start || "#F285C3"
                }, ${block.gradient_end || "#7bed9f"})`
              : block.bg_color || "#F285C3",
          color: block.text_color || "#fff",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          transition: "background 0.4s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Match Content BG */}
        <div className="flex items-center gap-3 mt-3">
          <label
            className="text-sm font-semibold"
            style={{
              color: getLabelContrast(block.bg_color || bgTheme),
            }}
          >
            Match Content Background
          </label>
          <input
            type="checkbox"
            checked={block.match_main_bg || false}
            onChange={(e) =>
              updateBlock(index, "match_main_bg", e.target.checked)
            }
          />
        </div>

        {/* Preview heading */}
        <div className="mt-20 text-center">
          <p
            className="text-lg font-semibold mb-4"
            style={{ color: block.text_color || "#000000" }}
          >
            {block.text ||
              "🔥 Limited Time Offer! Get your free eBook today!"}
          </p>

          {block.button_text && (
            <button
              className="inline-block px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
              style={{
                background: block.use_gradient
                  ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                      block.gradient_start || "#F285C3"
                    }, ${block.gradient_end || "#7bed9f"})`
                  : block.bg_color || "#F285C3",
                color:
                  block.button_text_color || block.text_color || "#ffffff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              {block.button_text}
            </button>
          )}
        </div>

        {/* Banner Message */}
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(block.bg_color || bgTheme) }}
        >
          Banner Message
        </label>
        <textarea
          placeholder="🔥 Limited Time Offer! Get your free eBook today!"
          value={block.text || ""}
          onChange={(e) => updateBlock(index, "text", e.target.value)}
          className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1 resize-none h-20"
        />

        {/* Text Color */}
        <div className="flex items-center gap-4 mt-4">
          <label
            className="text-sm font-semibold"
            style={{
              color: getLabelContrast(block.bg_color || bgTheme),
            }}
          >
            Text Color
          </label>

          <input
            type="color"
            value={block.text_color || "#000000"}
            onChange={(e) =>
              updateBlock(index, "text_color", e.target.value)
            }
            className="w-10 h-10 rounded cursor-pointer color-circle"
          />
          <span className="text-xs text-gray-400">
            {block.text_color || "#ffffff"}
          </span>
        </div>

        {/* Use Gradient */}
        <div className="flex items-center gap-3 mt-4">
          <label
            className="text-sm font-semibold"
            style={{
              color: getLabelContrast(block.bg_color || bgTheme),
            }}
          >
            Use Gradient Background
          </label>
          <input
            type="checkbox"
            checked={block.use_gradient || false}
            onChange={(e) =>
              updateBlock(index, "use_gradient", e.target.checked)
            }
          />
        </div>

        {/* Gradient section */}
        {block.use_gradient ? (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">Start Color</label>
              <input
                type="color"
                value={block.gradient_start || "#F285C3"}
                onChange={(e) =>
                  updateBlock(index, "gradient_start", e.target.value)
                }
                className="w-full h-10 rounded cursor-pointer color-circle"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">End Color</label>
              <input
                type="color"
                value={block.gradient_end || "#7bed9f"}
                onChange={(e) =>
                  updateBlock(index, "gradient_end", e.target.value)
                }
                className="w-full h-10 rounded cursor-pointer color-circle"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-gray-400">Direction</label>
              <select
                value={block.gradient_direction || "90deg"}
                onChange={(e) =>
                  updateBlock(index, "gradient_direction", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded bg-black text-white"
              >
                <option value="90deg">Left → Right</option>
                <option value="180deg">Top → Bottom</option>
                <option value="45deg">Diagonal ↘</option>
                <option value="135deg">Diagonal ↙</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <label
              className="text-sm font-semibold mt-3"
              style={{
                color: getLabelContrast(block.bg_color || bgTheme),
              }}
            >
              Solid Background Color
            </label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="color"
                value={block.bg_color || "#F285C3"}
                onChange={(e) =>
                  updateBlock(index, "bg_color", e.target.value)
                }
                className="color-circle"
              />
              <div className="w-24">
                <input
                  type="text"
                  value={(block.bg_color || "#F285C3").toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    updateBlock(index, "bg_color", val);
                  }}
                  className="w-full text-xs bg-black border border-gray-700 rounded px-2 py-1 text-gray-300"
                  placeholder="#F285C3"
                />
              </div>
            </div>
          </>
        )}

        {/* Button Text Color */}
        <div className="flex items-center gap-4 mt-4 mb-4">
          <label
            className="text-sm font-semibold"
            style={{
              color: getLabelContrast(block.bg_color || bgTheme),
            }}
          >
            Button Text Color
          </label>
          <input
            type="color"
            value={block.button_text_color || "#ffffff"}
            onChange={(e) =>
              updateBlock(index, "button_text_color", e.target.value)
            }
            className="w-10 h-10 rounded cursor-pointer color-circle"
          />
          <span className="text-xs text-gray-400">
            {block.button_text_color}
          </span>
        </div>

        <input
          type="text"
          placeholder="Claim Offer"
          value={block.button_text || ""}
          onChange={(e) => updateBlock(index, "button_text", e.target.value)}
          className="w-full p-2 border border-gray-600 rounded bg-black text-white"
        />

        <div className="mt-5">
          <label
            className="text-sm font-semibold"
            style={{
              color: getLabelContrast(block.bg_color || bgTheme),
            }}
          >
            Offer Type
          </label>

          <div className="relative w-full">
            <select
              value={block.offer_type || "free"}
              onChange={(e) =>
                updateBlock(index, "offer_type", e.target.value)
              }
              className="w-full p-2 pr-10 border border-gray-600 rounded bg-black text-white appearance-none"
            >
              <option value="free">Email Download</option>
              <option value="paid">Stripe Checkout</option>
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}