import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Trash2 } from "lucide-react";
import { normalizeVideoUrl } from "./NormalizeVideoUrl";
import { adjustForLandingOverlay } from "./adjustForLandingOverlay";
import CountdownTimerPreview from "./Timer";

function SortableBlock({
  id,
  block,
  index,
  updateBlock,
  removeBlock,
  bgTheme,
  pdfList,
}) {
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

          {block.type === "divider" && (
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
          )}

          {block.type === "offer_banner" && (
            <div
              className="rounded-xl p-6 mt-3 shadow-inner transition-all relative"
              style={{
                background: block.match_main_bg
                  ? adjustForLandingOverlay(bgTheme) // ✅ keep main tone
                  : bgTheme || "linear-gradient(to bottom, #1e1e1e, #111)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                transition: "background 0.4s ease",
              }}
            >
              {/* Inner Offer Banner Preview */}
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
                {/* 📝 Banner Message */}
                <label className="text-sm font-semibold text-gray-300">
                  Banner Message
                </label>
                <textarea
                  placeholder="🔥 Limited Time Offer! Get your free eBook today!"
                  value={block.text || ""}
                  onChange={(e) => updateBlock(index, "text", e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1 resize-none h-20"
                />

                {/* 🎨 Text Color Picker */}
                <div className="flex items-center gap-4 mt-4">
                  <label className="text-sm font-semibold text-gray-300">
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
                    {block.text_color}
                  </span>
                </div>

                {/* 🎨 Gradient or Solid Background */}
                <div className="flex items-center gap-3 mt-4">
                  <label className="text-sm font-semibold text-gray-300">
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
                <div className="flex items-center gap-3 mt-3">
                  <label className="text-sm font-semibold text-gray-300">
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

                {/* 🎛 Gradient Builder */}
                {block.use_gradient ? (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-400">
                        Start Color
                      </label>
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
                          updateBlock(
                            index,
                            "gradient_direction",
                            e.target.value
                          )
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
                    <label className="text-sm font-semibold text-gray-300 mt-3">
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
                      <span className="text-xs text-gray-400">
                        {block.bg_color}
                      </span>
                    </div>
                  </>
                )}

                {/* 💰 Offer Type Dropdown (replaces unsafe external link) */}
                <div className="mt-5">
                  <label className="text-sm font-semibold text-gray-300">
                    Offer Type
                  </label>
                  <select
                    value={block.offer_type || "free"}
                    onChange={(e) =>
                      updateBlock(index, "offer_type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
                  >
                    <option value="free">Email Download</option>
                    <option value="paid">Stripe Checkout</option>
                  </select>
                </div>

                {/* 🏷 Button Text */}
                <label className="text-sm font-semibold text-gray-300 mt-4">
                  Button Text
                </label>
                <input
                  type="text"
                  placeholder="Claim Offer"
                  value={block.button_text || ""}
                  onChange={(e) =>
                    updateBlock(index, "button_text", e.target.value)
                  }
                  className="w-full p-2 border border-gray-600 rounded bg-black text-white"
                />

                {/* 🧩 Live Preview */}
                <div className="mt-6 text-center">
                  <p
                    className="text-lg font-semibold mb-4"
                    style={{ color: block.text_color || "#000000" }}
                  >
                    {block.text ||
                      "🔥 Limited Time Offer! Get your free eBook today!"}
                  </p>

                  {block.button_text && (
                    <button
                      className="inline-block px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-transform transform hover:scale-105"
                      style={{
                        background: block.use_gradient
                          ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                              block.gradient_start || "#F285C3"
                            }, ${block.gradient_end || "#7bed9f"})`
                          : block.bg_color || "#F285C3",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      }}
                    >
                      {block.button_text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {block.type === "calendly" && (
            <div className="rounded-xl p-6 mt-3 shadow-inner bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
              <label className="text-sm font-semibold text-gray-300">
                Calendly URL
              </label>
              <input
                type="url"
                placeholder="https://calendly.com/yourname/meeting"
                value={block.calendly_url || ""}
                onChange={(e) =>
                  updateBlock(index, "calendly_url", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              <label className="text-sm font-semibold text-gray-300 mt-4">
                Section Title
              </label>
              <input
                type="text"
                placeholder="Book a Call"
                value={block.title || ""}
                onChange={(e) => updateBlock(index, "title", e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              <div className="flex items-center gap-4 mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Title Color
                </label>
                <input
                  type="color"
                  value={block.title_color || "#FFFFFF"}
                  onChange={(e) =>
                    updateBlock(index, "title_color", e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer color-circle"
                />
                <span className="text-xs text-gray-400">
                  {block.title_color || "#FFFFFF"}
                </span>
              </div>

              <label className="text-sm font-semibold text-gray-300 mt-4">
                Embed Height (px)
              </label>
              <input
                type="number"
                min="400"
                max="1200"
                step="10"
                placeholder="700"
                value={block.height || 700}
                onChange={(e) =>
                  updateBlock(index, "height", parseInt(e.target.value, 10))
                }
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />
            </div>
          )}

          {block.type === "social_links" && (
            <div className="rounded-xl p-6 mt-3 bg-[#1f2937] border border-gray-700">
              <h3 className="text-white font-semibold mb-3">
                Social Links Row
              </h3>

              {/* URL Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  "instagram",
                  "threads",
                  "twitter",
                  "youtube",
                  "linkedin",
                  "facebook",
                  "tiktok",
                ].map((platform) => (
                  <input
                    key={platform}
                    type="url"
                    placeholder={`${
                      platform.charAt(0).toUpperCase() + platform.slice(1)
                    } URL`}
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
                  onChange={(e) =>
                    updateBlock(index, "alignment", e.target.value)
                  }
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
                  onChange={(e) =>
                    updateBlock(index, "icon_style", e.target.value)
                  }
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
                  onChange={(e) =>
                    updateBlock(index, "icon_color", e.target.value)
                  }
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
                  .map(([platform]) => {
                    const iconUrl = {
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
                    }[platform];

                    return (
                      <div
                        key={platform}
                        title={platform}
                        style={{
                          width: 32,
                          height: 32,
                          WebkitMask: `url(${iconUrl}) no-repeat center / contain`,
                          mask: `url(${iconUrl}) no-repeat center / contain`,
                          backgroundColor:
                            block.icon_style === "mono"
                              ? "#ffffff"
                              : block.icon_color || "#ffffff",
                          transition: "transform 0.2s ease",
                        }}
                        className="hover:scale-110"
                      />
                    );
                  })}
              </div>
            </div>
          )}
          {block.type === "verified_reviews" && (
            <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-silver mb-4">
                Verified Reviews Section
              </h3>

              {/* 🏷 Section Title */}
              <label className="text-sm font-semibold text-gray-300">
                Section Title
              </label>
              <input
                type="text"
                placeholder="Verified Buyer Reviews"
                value={block.title || ""}
                onChange={(e) => updateBlock(index, "title", e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              {/* 🎨 Text Color */}
              <div className="flex items-center gap-4 mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Text Color
                </label>
                <input
                  type="color"
                  value={block.text_color || "#FFFFFF"}
                  onChange={(e) =>
                    updateBlock(index, "text_color", e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                />
                <span className="text-xs text-gray-400">
                  {block.text_color}
                </span>
              </div>

              {/* 🎨 Background Color */}
              <div className="flex items-center gap-4 mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Background
                </label>
                <input
                  type="color"
                  value={block.bg_color || "#000000"}
                  onChange={(e) =>
                    updateBlock(index, "bg_color", e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                />
                <span className="text-xs text-gray-400">{block.bg_color}</span>
              </div>

              {/* 🌫 Glass Background */}
              <div className="flex items-center gap-3 mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Use Glass Background
                </label>
                <input
                  type="checkbox"
                  checked={block.use_glass || false}
                  onChange={(e) =>
                    updateBlock(index, "use_glass", e.target.checked)
                  }
                />
              </div>

              {/* 🧱 Layout Style */}
              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Layout Style
                </label>
                <select
                  value={block.layout || "compact"}
                  onChange={(e) => updateBlock(index, "layout", e.target.value)}
                  className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
                >
                  <option value="compact">Compact (Single Column)</option>
                  <option value="full">Full (Two Column)</option>
                </select>
              </div>

              {/* 📐 Alignment */}
              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Alignment
                </label>
                <select
                  value={block.alignment || "center"}
                  onChange={(e) =>
                    updateBlock(index, "alignment", e.target.value)
                  }
                  className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* 🧩 Live Preview */}
              <div
                className="mt-6 p-6 border border-gray-700 rounded-lg transition-all duration-300"
                style={{
                  background: block.use_glass
                    ? "rgba(255,255,255,0.08)"
                    : block.bg_color || "rgba(0,0,0,0.3)",
                  color: block.text_color || "#FFFFFF",
                  textAlign: block.alignment || "center",
                  borderRadius: "12px",
                  boxShadow: block.use_glass
                    ? "0 8px 32px rgba(0,0,0,0.3)"
                    : "0 8px 25px rgba(0,0,0,0.25)",
                  backdropFilter: block.use_glass ? "blur(10px)" : "none",
                }}
              >
                <h4 className="text-xl font-bold mb-6">
                  {block.title || "Verified Buyer Reviews"}
                </h4>

                <div
                  className={`grid ${
                    block.layout === "full"
                      ? "grid-cols-2 gap-4"
                      : "grid-cols-1"
                  }`}
                >
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#ccc",
                    }}
                  >
                    ★★★★★ “Love this product!”
                    <br />
                    <span className="text-xs text-gray-500">
                      — Verified Buyer, sample preview
                    </span>
                  </div>
                  {block.layout === "full" && (
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "#ccc",
                      }}
                    >
                      ★★★★☆ “Very helpful and easy to use.”
                      <br />
                      <span className="text-xs text-gray-500">
                        — Verified Buyer, sample preview
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {block.type === "countdown" && (
            <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-silver mb-4">
                Countdown Timer Settings
              </h3>

              <label className="text-sm font-semibold text-gray-300">
                Headline Text
              </label>
              <input
                type="text"
                placeholder="Offer Ends In:"
                value={block.text || ""}
                onChange={(e) => updateBlock(index, "text", e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              <div className="flex items-center gap-4 mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Text Color
                </label>
                <input
                  type="color"
                  value={block.text_color || "#FFFFFF"}
                  onChange={(e) =>
                    updateBlock(index, "text_color", e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                />
                <span className="text-xs text-gray-400">
                  {block.text_color}
                </span>
              </div>

              <label className="text-sm font-semibold text-gray-300 mt-4 block">
                Target Date & Time
              </label>
              <input
                type="datetime-local"
                value={
                  block.target_date
                    ? new Date(block.target_date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const val = new Date(e.target.value).toISOString();
                  updateBlock(index, "target_date", val);
                }}
                onFocus={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.showPicker?.(); // ✅ triggers native picker in Chrome/Edge/Safari
                }}
                className="w-full mt-1 p-2 border border-gray-600 rounded bg-black text-white"
                Style
              />

              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Alignment
                </label>
                <select
                  value={block.alignment || "center"}
                  onChange={(e) =>
                    updateBlock(index, "alignment", e.target.value)
                  }
                  className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Style
                </label>
                <select
                  value={block.style_variant || "minimal"}
                  onChange={(e) =>
                    updateBlock(index, "style_variant", e.target.value)
                  }
                  className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
                >
                  <option value="minimal">Minimal</option>
                  <option value="boxed">Boxed</option>
                  <option value="glow">Neon Glow</option>
                </select>
              </div>
              {/* 🔥 Live Preview */}
              <div
                className="mt-6 p-4 border border-gray-700 rounded-lg text-center"
                style={{ color: block.text_color || "#FFFFFF" }}
              >
                <p className="font-semibold mb-2">{block.text}</p>
                <CountdownTimerPreview targetDate={block.target_date} />
              </div>
            </div>
          )}
          {block.type === "stripe_checkout" && (
            <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-silver mb-4">
                Stripe Checkout Button
              </h3>

              {/* 🧾 PDF Selector */}
              <label className="text-sm font-semibold text-gray-300">
                Select PDF to Sell
              </label>
              <select
                value={block.pdf_url || ""}
                onChange={(e) => updateBlock(index, "pdf_url", e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              >
                <option value="">-- Select a Completed PDF --</option>
                {pdfList
                  .filter((lm) => lm.status === "completed" && lm.pdf_url)
                  .map((lm) => (
                    <option key={lm.id} value={lm.pdf_url}>
                      {lm.title || "Untitled PDF"} — (Ready)
                    </option>
                  ))}
              </select>

              {/* ✅ Preview link if PDF is chosen */}
              {block.pdf_url && (
                <p className="text-xs text-gray-400 mt-2">
                  Selected File:
                  <a
                    href={block.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green font-medium ml-1 underline hover:text-green transition"
                  >
                    Preview PDF
                  </a>
                </p>
              )}

              {/* 🏷 Button Label */}
              <label className="text-sm font-semibold text-gray-300 mt-4 block">
                Button Label
              </label>
              <input
                type="text"
                placeholder="Buy & Download PDF"
                value={block.button_text || ""}
                onChange={(e) =>
                  updateBlock(index, "button_text", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              {/* 💲 Price Input */}
              <label className="text-sm font-semibold text-gray-300 mt-4 block">
                Price (USD)
              </label>
              <input
                type="number"
                min="1"
                value={block.price || 10}
                onChange={(e) =>
                  updateBlock(index, "price", parseFloat(e.target.value))
                }
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              {/* 🎨 Button Colors */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mt-4">
                {/* Background Color */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-300">
                    Button Background
                  </label>
                  <input
                    type="color"
                    value={block.button_color || "#10b981"}
                    onChange={(e) =>
                      updateBlock(index, "button_color", e.target.value)
                    }
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                  />
                  <span className="text-xs text-gray-400">
                    {block.button_color || "#10b981"}
                  </span>
                </div>

                {/* Text Color */}
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <label className="text-sm font-semibold text-gray-300">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={block.text_color || "#000000"}
                    onChange={(e) =>
                      updateBlock(index, "text_color", e.target.value)
                    }
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                  />
                  <span className="text-xs text-gray-400">
                    {block.text_color || "#000000"}
                  </span>
                </div>
              </div>

              {/* 📐 Alignment */}
              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Alignment
                </label>
                <select
                  value={block.alignment || "center"}
                  onChange={(e) =>
                    updateBlock(index, "alignment", e.target.value)
                  }
                  className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* 💳 Live Preview */}
              <div
                className="mt-6 p-6 text-center border border-gray-700 rounded-lg"
                style={{ textAlign: block.alignment }}
              >
                <button
                  className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105"
                  style={{
                    background: block.button_color || "#10b981",
                    color: block.text_color || "#000000",
                  }}
                >
                  {block.button_text || "Buy & Download PDF"}
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  ${block.price?.toFixed(2) || "10.00"} USD
                </p>
              </div>
            </div>
          )}
          {block.type === "referral_button" && (
            <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-silver mb-4">
                Referral Signup Button
              </h3>

              {/* 🏷 Label */}
              <label className="text-sm font-semibold text-gray-300">
                Button Label
              </label>
              <input
                type="text"
                placeholder="Sign Up Now"
                value={block.button_text || ""}
                onChange={(e) =>
                  updateBlock(index, "button_text", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
              />

              {/* 🎨 Button Colors */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mt-4">
                {/* Background Color */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-300">
                    Button Background
                  </label>
                  <input
                    type="color"
                    value={block.button_color || "#10b981"}
                    onChange={(e) =>
                      updateBlock(index, "button_color", e.target.value)
                    }
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                  />
                  <span className="text-xs text-gray-400">
                    {block.button_color || "#10b981"}
                  </span>
                </div>

                {/* Text Color */}
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <label className="text-sm font-semibold text-gray-300">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={block.text_color || "#000000"}
                    onChange={(e) =>
                      updateBlock(index, "text_color", e.target.value)
                    }
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                  />
                  <span className="text-xs text-gray-400">
                    {block.text_color || "#000000"}
                  </span>
                </div>
              </div>

              {/* 📐 Alignment */}
              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-semibold text-gray-300">
                  Alignment
                </label>
                <select
                  value={block.alignment || "center"}
                  onChange={(e) =>
                    updateBlock(index, "alignment", e.target.value)
                  }
                  className="p-2 bg-black border border-gray-700 rounded text-white text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* 💻 Live Preview */}
              <div
                className="mt-6 p-6 text-center border border-gray-700 rounded-lg"
                style={{ textAlign: block.alignment }}
              >
                <button
                  className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105"
                  style={{
                    background: block.button_color || "#10b981",
                    color: block.text_color || "#000000",
                  }}
                >
                  {block.button_text || "Sign Up Now"}
                </button>
                <p className="text-xs text-gray-400 mt-3 italic">
                  This button will automatically track new signups under your
                  referral.
                </p>
              </div>
            </div>
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
