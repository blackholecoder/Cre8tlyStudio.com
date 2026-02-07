import React, { useMemo } from "react";
import axiosInstance from "../../../../api/axios";
import { toast } from "react-toastify";

export default function SingleOfferBlock({
  block,
  index,
  updateBlock,
  bgTheme,
  landing,
  pdfList,
  updateChildBlock,
  openAIModal,
  containerIndex,
}) {
  const [coverPreview, setCoverPreview] = React.useState("");
  const [coverLoading, setCoverLoading] = React.useState(false);

  const availablePdfs = useMemo(
    () => pdfList?.filter((p) => p.status === "completed" && p.pdf_url) || [],
    [pdfList],
  );

  const updateField = (key, value) => {
    updateBlock(index, key, value);
  };

  // -----------------------------
  //  IMAGE UPLOAD
  // -----------------------------
  const uploadImage = async (file) => {
    const preview = URL.createObjectURL(file);
    updateField("image_url", preview);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("landingId", landing?.id);
      formData.append("blockId", block.id);

      const res = await axiosInstance.post(
        "/landing/upload-media-block",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (res.data.url) {
        updateField("image_url", res.data.url);
        updateField("use_pdf_cover", false);
        toast.success("Image uploaded!");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      URL.revokeObjectURL(preview);
    }
  };

  // -----------------------------
  //  BACKGROUND PREVIEW
  // -----------------------------
  const previewBackground = block.use_no_bg
    ? "transparent"
    : block.use_gradient
      ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
          block.gradient_start || "#F285C3"
        }, ${block.gradient_end || "#7bed9f"})`
      : block.match_main_bg
        ? bgTheme
        : block.bg_color || "#111827";

  const textColor = block.text_color || "#ffffff";

  return (
    <div
      className="rounded-xl p-6 mt-6 border border-gray-700 transition-all duration-300"
      style={{
        background: previewBackground,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h3 className="text-lg font-semibold text-green mb-6">Single Offer</h3>

      {/* BACKGROUND CONTROLS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Background Color */}
        <div>
          <label className="text-sm font-semibold text-gray-300">
            Background Color
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={block.bg_color || "#000000"}
              onChange={(e) => updateField("bg_color", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-700"
            />
            <span className="text-xs text-gray-400">{block.bg_color}</span>
          </div>
        </div>

        {/* Match Main Background */}
        <div className="flex items-center gap-3 mt-6">
          <label className="text-sm font-semibold text-gray-300">
            Match Page Background
          </label>
          <input
            type="checkbox"
            checked={block.match_main_bg || false}
            onChange={(e) => updateField("match_main_bg", e.target.checked)}
          />
        </div>

        {/* Use Gradient */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-300">
            Use Gradient
          </label>
          <input
            type="checkbox"
            checked={block.use_gradient || false}
            onChange={(e) => updateField("use_gradient", e.target.checked)}
          />
        </div>

        {/* No Background */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-300">
            No Background
          </label>
          <input
            type="checkbox"
            checked={block.use_no_bg || false}
            onChange={(e) => updateField("use_no_bg", e.target.checked)}
          />
        </div>
      </div>

      {/* GRADIENT CONTROLS */}
      {block.use_gradient && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Gradient Start
            </label>
            <input
              type="color"
              value={block.gradient_start || "#F285C3"}
              onChange={(e) => updateField("gradient_start", e.target.value)}
              className="w-full h-10 border border-gray-700 rounded mt-1 bg-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Gradient End
            </label>
            <input
              type="color"
              value={block.gradient_end || "#7bed9f"}
              onChange={(e) => updateField("gradient_end", e.target.value)}
              className="w-full h-10 border border-gray-700 rounded mt-1 bg-black"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-300">
              Gradient Direction
            </label>
            <select
              value={block.gradient_direction || "90deg"}
              onChange={(e) =>
                updateField("gradient_direction", e.target.value)
              }
              className="w-full p-2 mt-1 bg-black border border-gray-700 rounded text-white"
            >
              <option value="90deg">Left → Right</option>
              <option value="180deg">Top → Bottom</option>
              <option value="45deg">Diagonal ↘</option>
              <option value="135deg">Diagonal ↙</option>
            </select>
          </div>
        </div>
      )}

      {/* TEXT COLOR */}
      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-semibold text-gray-300">
          Button Text Color
        </label>
        <input
          type="color"
          value={block.button_text_color || "#000000"}
          onChange={(e) => updateField("button_text_color", e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-700"
        />
        <span className="text-xs text-gray-400">{block.button_text_color}</span>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300">
          Card Width ({block.card_width || 360}px)
        </label>
        <input
          type="range"
          min={260}
          max={520}
          step={10}
          value={block.card_width || 360}
          onChange={(e) => updateField("card_width", Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300">
          Card Height
        </label>

        <div className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            checked={block.card_height === "auto"}
            onChange={(e) =>
              updateField("card_height", e.target.checked ? "auto" : 420)
            }
          />
          <span className="text-sm text-gray-400">Auto height</span>
        </div>

        {block.card_height !== "auto" && (
          <input
            type="range"
            min={300}
            max={700}
            step={10}
            value={block.card_height || 420}
            onChange={(e) => updateField("card_height", Number(e.target.value))}
            className="w-full mt-2"
          />
        )}
      </div>

      {/* OFFERS GRID */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {(() => {
          const imageToShow =
            coverPreview || block.cover_url || block.image_url || "";

          return (
            <div
              className="border border-gray-700 rounded-xl p-4 bg-black/40 backdrop-blur-md shadow-lg"
              style={{
                color: textColor,
                width: block.card_width ? `${block.card_width}px` : "360px",
                height:
                  block.card_height === "auto"
                    ? "auto"
                    : `${block.card_height}px`,
                display: "flex",
                flexDirection: "column",
                overflow: block.card_height === "auto" ? "visible" : "auto",
              }}
            >
              {/* IMAGE */}
              {/* IMAGE / COVER AREA */}
              <div className="mt-3 relative">
                {coverLoading ? (
                  // LOADING STATE
                  <div className="w-full h-56 flex flex-col items-center justify-center rounded-lg bg-black/40 border border-gray-700">
                    <div className="w-10 h-10 border-4 border-gray-500 border-t-green rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 mt-3">
                      Loading Book cover…
                    </p>
                  </div>
                ) : imageToShow ? (
                  // IMAGE STATE
                  <>
                    <img
                      src={imageToShow}
                      className="rounded-lg w-full mb-3"
                      alt=""
                    />

                    {!block.use_pdf_cover && (
                      <button
                        type="button"
                        className="text-red-400 text-xs hover:underline"
                        onClick={() => {
                          updateField("image_url", "");
                          updateField("cover_url", "");
                          setCoverPreview("");
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </>
                ) : (
                  // EMPTY STATE
                  <label className="block border border-gray-600 border-dashed rounded-xl p-6 text-center cursor-pointer">
                    <span className="text-gray-300 text-sm">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadImage(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              {/* Book SELECT */}
              <label className="text-sm font-semibold text-gray-300 mt-3 block">
                Choose Book
              </label>
              <select
                value={block.pdf_url || ""}
                onChange={async (e) => {
                  const selectedUrl = e.target.value;

                  updateField("pdf_url", selectedUrl);
                  updateField("pdf_name", "");
                  setCoverPreview("");
                  setCoverLoading(true);

                  if (!selectedUrl) {
                    updateField("cover_url", "");
                    updateField("image_url", "");
                    updateField("use_pdf_cover", false);
                    setCoverLoading(false);
                    return;
                  }

                  const selectedPdf = availablePdfs.find(
                    (p) => p.pdf_url === selectedUrl,
                  );

                  if (selectedPdf) {
                    updateField("pdf_name", selectedPdf.title || "Book");
                  }

                  try {
                    const res = await axiosInstance.get(
                      `/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(selectedUrl)}`,
                    );

                    if (res.data?.cover_image) {
                      setCoverPreview(res.data.cover_image);

                      updateField("cover_url", res.data.cover_image);
                      updateField("image_url", res.data.cover_image);
                      updateField("use_pdf_cover", true);
                    }
                  } catch (err) {
                    console.error("❌ Error loading Book cover:", err);
                  } finally {
                    setCoverLoading(false);
                  }
                }}
                className="w-full p-2 bg-black text-white border border-gray-600 rounded mt-1"
              >
                <option value="">-- Choose Book --</option>
                {availablePdfs.map((p) => (
                  <option key={p.id} value={p.pdf_url}>
                    {p.title || "Book"}
                  </option>
                ))}
              </select>

              {block.pdf_url && (
                <p className="text-xs text-gray-400 mt-1">
                  Selected Book:{" "}
                  <span className="text-white font-semibold">
                    {block.pdf_name || "Book"}
                  </span>
                </p>
              )}

              {/* USE Book COVER */}
              <div className="flex items-center gap-3 mt-2">
                <label className="text-sm font-semibold text-gray-300">
                  Use Book Cover Image
                </label>
                <input
                  type="checkbox"
                  checked={block.use_pdf_cover || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateField("use_pdf_cover", checked);

                    if (checked && block.cover_url) {
                      updateField("image_url", block.cover_url);
                    }

                    if (!checked) {
                      updateField("image_url", "");
                    }
                  }}
                />
              </div>

              {/* PREVIEW Book */}
              {block.pdf_url && (
                <p className="text-xs text-gray-400 mt-1">
                  <a
                    href={block.pdf_url}
                    target="_blank"
                    className="text-green underline"
                    rel="noopener noreferrer"
                  >
                    Preview Book
                  </a>
                </p>
              )}

              <div className="flex items-center gap-3 mb-8">
                <label className="text-sm font-semibold text-gray-300">
                  Text Color
                </label>
                <input
                  type="color"
                  value={block.text_color || "#ffffff"}
                  onChange={(e) => updateField("text_color", e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-700"
                />
                <span className="text-xs text-gray-400">
                  {block.text_color}
                </span>
              </div>

              <label className="text-sm font-semibold text-gray-300 mt-3 block">
                Offer Title
              </label>
              <input
                type="text"
                value={block.title || ""}
                maxLength={60}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full p-2 bg-black text-white border border-gray-600 rounded mt-1"
                placeholder="Offer Title"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {block.title?.length || 0}/60
              </p>

              {/* DESCRIPTION */}
              {!block.use_long_description && (
                <textarea
                  value={block.text}
                  onChange={(e) => updateField("text", e.target.value)}
                  className="w-full p-3 bg-black text-white placeholder-gray-500 border mt-3 resize-y min-h-[120px]"
                  rows={6}
                  placeholder="Short description"
                />
              )}

              <div className="flex items-center gap-3 mt-3">
                <label className="text-sm font-semibold text-gray-300">
                  Use Long Description
                </label>
                <input
                  type="checkbox"
                  checked={block.use_long_description || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateField("use_long_description", checked);
                    if (checked) updateField("text", "");
                  }}
                />
              </div>

              {block.use_long_description && (
                <div className="mt-3">
                  <label className="text-sm font-semibold text-gray-300 block mb-1">
                    Description Type
                  </label>
                  <select
                    value={block.description_type || "text"}
                    onChange={(e) =>
                      updateField("description_type", e.target.value)
                    }
                    className="w-full p-2 bg-black text-white border border-gray-600 rounded"
                  >
                    <option value="text">Rich Text</option>
                    <option value="bullets">Bullet Points</option>
                  </select>
                </div>
              )}

              {block.use_long_description && (
                <div className="flex justify-between items-center mt-4">
                  <label className="text-sm font-semibold text-gray-300">
                    Long Description
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      openAIModal({
                        blockType: "offer_long_description",
                        blockIndex: index,
                        updateChildBlock,
                        containerIndex,
                        currentText: block.long_text || "",
                        role: "sales",
                      })
                    }
                    onPointerDown={(e) => e.stopPropagation()}
                    className="
                    text-xs font-semibold px-3 py-1 rounded-md
                    bg-royalPurple text-white
                    hover:bg-royalPurple/80
                    transition
                  "
                  >
                    AI
                  </button>
                </div>
              )}

              {block.use_long_description && (
                <textarea
                  value={block.long_text || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (containerIndex !== undefined && updateChildBlock) {
                      updateChildBlock(index, "long_text", value);
                    } else {
                      updateBlock(index, "long_text", value);
                    }
                  }}
                  rows={8}
                  placeholder={
                    block.description_type === "bullets"
                      ? "• Benefit one\n• Benefit two\n• Benefit three"
                      : "Write a detailed sales description..."
                  }
                  className="w-full p-3 text-white mt-2 bg-black border border-gray-600 rounded
resize-y min-h-[180px] flex-shrink-0"
                />
              )}

              {/* PRICE */}
              <label className="text-sm text-gray-300 mt-3 block">Price</label>
              <input
                type="number"
                value={block.price}
                onChange={(e) =>
                  updateField("price", Number(e.target.value) || 0)
                }
                className="w-full p-2 bg-black text-white border mt-1"
              />

              {/* BUTTON TEXT */}
              <label className="text-sm text-gray-300 mt-3 block">
                Button Label
              </label>
              <input
                type="text"
                value={block.button_text}
                onChange={(e) => updateField("button_text", e.target.value)}
                className="w-full p-2 bg-black border mt-1"
                style={{ color: "#000000" }}
              />

              {/* BUTTON COLOR */}
              <label className="text-sm text-gray-300 mt-3 block">
                Button Background
              </label>
              <input
                type="color"
                value={block.button_color}
                onChange={(e) => updateField("button_color", e.target.value)}
                className="w-8 h-8 mt-1 border border-gray-600 rounded"
              />

              {/* BUTTON TEXT COLOR */}
              <label className="text-sm text-gray-300 mt-3 block">
                Button Text Color
              </label>
              <input
                type="color"
                value={block.button_text_color || "#000000"}
                onChange={(e) =>
                  updateField("button_text_color", e.target.value)
                }
                className="w-8 h-8 mt-1 border border-gray-600 rounded"
              />

              <div style={{ marginTop: "auto" }}>
                <button
                  style={{
                    backgroundColor: block.button_color,
                    color: block.button_text_color || "#000000",
                  }}
                  className="w-full mt-4 py-2 rounded-lg font-semibold transition"
                >
                  {block.button_text}
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
