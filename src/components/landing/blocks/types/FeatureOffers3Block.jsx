import React from "react";
import axiosInstance from "../../../../api/axios";
import { toast } from "react-toastify";

export default function FeatureOffers3Block({
  block,
  index,
  updateBlock,
  bgTheme,
  landing,
  pdfList,
}) {
  const defaultItems = [
    {
      image_url: "",
      cover_url: "",
      title: "Offer One",
      text: "Short description.",
      price: 10,
      pdf_url: "",
      use_pdf_cover: false,
      button_text: "Buy Now",
      button_color: "#22c55e",
    },
    {
      image_url: "",
      cover_url: "",
      title: "Offer Two",
      text: "Short description.",
      price: 20,
      pdf_url: "",
      use_pdf_cover: false,
      button_text: "Buy Now",
      button_color: "#22c55e",
    },
  ];

  // Default items
  const items =
    Array.isArray(block.items) && block.items.length > 0
      ? block.items
      : [...defaultItems];

  // -----------------------------
  //  UPDATE ITEM HELPER
  // -----------------------------
  const updateItem = (i, key, value) => {
    const updated = [...items];
    updated[i][key] = value;
    updateBlock(index, "items", updated);
  };

  // -----------------------------
  //  LOAD PDF COVER IMAGE
  // -----------------------------
  const handlePdfChange = async (itemIndex, selectedUrl) => {
    // 1. Always update pdf_url
    updateItem(itemIndex, "pdf_url", selectedUrl);
    updateItem(itemIndex, "cover_url", "");
    updateItem(itemIndex, "image_url", "");

    if (!selectedUrl) return;

    try {
      const res = await axiosInstance.get(
        `/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(selectedUrl)}`
      );

      if (res.data.success && res.data.cover_image) {
        // 2. Save the cover URL
        updateItem(itemIndex, "cover_url", res.data.cover_image);

        // 3. If "use PDF cover" is true, update the preview immediately
        if (items[itemIndex]?.use_pdf_cover) {
          updateItem(itemIndex, "image_url", res.data.cover_image);
        }
      }
    } catch (err) {
      console.error("❌ Failed loading cover image:", err);
    }
  };

  // -----------------------------
  //  IMAGE UPLOAD
  // -----------------------------
  const uploadImage = async (file, itemIndex) => {
    const preview = URL.createObjectURL(file);
    updateItem(itemIndex, "image_url", preview);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("landingId", landing?.id);
      formData.append("blockId", block.id);

      const res = await axiosInstance.post(
        "/landing/upload-media-block",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.url) {
        updateItem(itemIndex, "image_url", res.data.url);
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

  return (
    <div
      className="rounded-xl p-6 mt-6 border border-gray-700 transition-all duration-300"
      style={{ background: previewBackground }}
    >
      <h3 className="text-lg font-semibold text-green mb-6">
        Two-Column Offer Grid
      </h3>

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
              onChange={(e) => updateBlock(index, "bg_color", e.target.value)}
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
            onChange={(e) =>
              updateBlock(index, "match_main_bg", e.target.checked)
            }
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
            onChange={(e) =>
              updateBlock(index, "use_gradient", e.target.checked)
            }
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
            onChange={(e) => updateBlock(index, "use_no_bg", e.target.checked)}
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
              onChange={(e) =>
                updateBlock(index, "gradient_start", e.target.value)
              }
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
              onChange={(e) =>
                updateBlock(index, "gradient_end", e.target.value)
              }
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
                updateBlock(index, "gradient_direction", e.target.value)
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

      {/* BUTTON TEXT COLOR */}
      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-semibold text-gray-300">
          Button Text Color
        </label>
        <input
          type="color"
          value={block.button_text_color || "#000000"}
          onChange={(e) =>
            updateBlock(index, "button_text_color", e.target.value)
          }
          className="w-8 h-8 rounded cursor-pointer border border-gray-700"
        />
        <span className="text-xs text-gray-400">{block.button_text_color}</span>
      </div>

      {/* OFFERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, i) => {
          const imageToShow = item.use_pdf_cover
            ? item.cover_url || item.image_url || ""
            : item.image_url || item.cover_url || "";

          return (
            <div
              key={i}
              className="border border-gray-700 rounded-xl p-4 bg-black/40 backdrop-blur-md shadow-lg"
            >
              {/* IMAGE */}
              {!imageToShow ? (
                <label className="block border border-gray-600 border-dashed rounded-xl p-6 text-center cursor-pointer mt-3">
                  <span className="text-gray-300 text-sm">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadImage(e.target.files[0], i)}
                  />
                </label>
              ) : (
                <div className="mt-3">
                  <img
                    src={imageToShow}
                    className="rounded-lg w-full mb-3"
                    alt=""
                  />
                  {!item.use_pdf_cover && (
                    <button
                      className="text-red-400 text-xs hover:underline"
                      onClick={() => updateItem(i, "image_url", "")}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {/* PDF SELECT */}
              <label className="text-sm font-semibold text-gray-300 mt-3 block">
                Select PDF
              </label>
              <select
                value={item.pdf_url || ""}
                onChange={(e) => handlePdfChange(i, e.target.value)}
                className="w-full p-2 bg-black text-white border border-gray-600 rounded mt-1"
              >
                <option value="">-- Select PDF --</option>
                {pdfList
                  ?.filter((p) => p.status === "completed" && p.pdf_url)
                  .map((p) => (
                    <option key={p.id} value={p.pdf_url}>
                      {p.title || "PDF"} (Ready)
                    </option>
                  ))}
              </select>

              {/* USE PDF COVER */}
              <div className="flex items-center gap-3 mt-2">
                <label className="text-sm font-semibold text-gray-300">
                  Use PDF Cover Image
                </label>
                <input
                  type="checkbox"
                  checked={item.use_pdf_cover || false}
                  onChange={(e) => {
                    updateItem(i, "use_pdf_cover", e.target.checked);
                    if (e.target.checked && item.pdf_url) {
                      handlePdfChange(i, item.pdf_url);
                    }
                  }}
                />
              </div>

              {/* PREVIEW PDF */}
              {item.pdf_url && (
                <p className="text-xs text-gray-400 mt-1">
                  <a
                    href={item.pdf_url}
                    target="_blank"
                    className="text-green underline"
                    rel="noopener noreferrer"
                  >
                    Preview PDF
                  </a>
                </p>
              )}

              {/* TITLE */}
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(i, "title", e.target.value)}
                className="w-full p-2 bg-black text-white border mt-3"
                placeholder="Title"
              />

              {/* DESCRIPTION */}
              <textarea
                value={item.text}
                onChange={(e) => updateItem(i, "text", e.target.value)}
                className="w-full p-2 bg-black text-white border mt-3"
                rows={2}
                placeholder="Description"
              />

              {/* PRICE */}
              <label className="text-sm text-gray-300 mt-3 block">Price</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(i, "price", Number(e.target.value) || 0)
                }
                className="w-full p-2 bg-black text-white border mt-1"
              />

              {/* BUTTON TEXT */}
              <label className="text-sm text-gray-300 mt-3 block">
                Button Label
              </label>
              <input
                type="text"
                value={item.button_text}
                onChange={(e) => updateItem(i, "button_text", e.target.value)}
                className="w-full p-2 bg-black text-white border mt-1"
              />

              {/* BUTTON COLOR */}
              <label className="text-sm text-gray-300 mt-3 block">
                Button Background
              </label>
              <input
                type="color"
                value={item.button_color}
                onChange={(e) => updateItem(i, "button_color", e.target.value)}
                className="w-8 h-8 mt-1 border border-gray-600 rounded"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
