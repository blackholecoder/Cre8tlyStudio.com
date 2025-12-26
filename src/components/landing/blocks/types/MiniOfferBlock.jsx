import React, { useEffect, useMemo } from "react";
import axiosInstance from "../../../../api/axios";
import { toast } from "react-toastify";
import MiniOfferAdvanced from "./MiniOfferAdvanced";

export default function MiniOfferBlock({
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
  const [coverLoading, setCoverLoading] = React.useState(false);

  const availablePdfs = useMemo(
    () => pdfList?.filter((p) => p.status === "completed" && p.pdf_url) || [],
    [pdfList]
  );

  const updateField = (key, value) => {
    if (containerIndex !== undefined && updateChildBlock) {
      updateChildBlock(index, key, value);
    } else {
      updateBlock(index, key, value);
    }
  };

  useEffect(() => {
    if (!block.offer_page) {
      updateField("offer_page", {
        enabled: false,
        blocks: [],
        bullets: [],
        trust_items: [],
      });
    }
  }, []);

  const safeHexColor = (color, fallback = "#000000") => {
    if (!color) return fallback;
    if (color.startsWith("#") && color.length === 7) return color;
    return fallback;
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
        { headers: { "Content-Type": "multipart/form-data" } }
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
              value={safeHexColor(block.bg_color)}
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
              value={safeHexColor(block.gradient_start) || "#F285C3"}
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
              value={safeHexColor(block.gradient_end) || "#7bed9f"}
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

      {/* BODY TEXT COLOR */}
      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-semibold text-gray-300">
          Main Text Color
        </label>
        <input
          type="color"
          value={safeHexColor(block.text_color) || "#ffffff"}
          onChange={(e) => updateField("text_color", e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-700"
        />
        <span className="text-xs text-gray-400">{block.text_color}</span>
      </div>

      {/* OFFERS GRID */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {(() => {
          const imageToShow = block.use_pdf_cover
            ? block.cover_url
            : block.image_url || "";

          return (
            <div
              className="border border-gray-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{
                color: textColor,
                width: "100%",
                maxWidth: "980px",
                minHeight: "420px",
              }}
            >
              {/* TOP IMAGE */}
              <div className="relative bg-black aspect-square w-full overflow-hidden">
                {coverLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                    <div className="w-10 h-10 border-4 border-gray-500 border-t-green rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 mt-3">
                      Loading PDF cover…
                    </p>
                  </div>
                ) : imageToShow ? (
                  <>
                    <img
                      src={imageToShow}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt=""
                    />

                    {!block.use_pdf_cover && (
                      <button
                        type="button"
                        className="absolute top-3 right-3 bg-black/70 text-red-400 text-xs px-3 py-1 rounded hover:bg-black"
                        onClick={() => {
                          if (block.use_pdf_cover) {
                            updateField("cover_url", "");
                            updateField("use_pdf_cover", false);
                          } else {
                            updateField("image_url", "");
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </>
                ) : (
                  <label className="flex items-center justify-center h-full border border-dashed border-gray-600 cursor-pointer">
                    <span className="text-gray-400 text-sm">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadImage(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              <div
                className="flex flex-col p-8 gap-4"
                style={{
                  background: block.use_gradient
                    ? `linear-gradient(${block.gradient_direction || "135deg"},
          ${block.gradient_start || "#a855f7"},
          ${block.gradient_end || "#ec4899"})`
                    : block.bg_color || "#111827",
                  color: block.text_color || "#ffffff",
                }}
              >
                {/* PDF SELECT */}
                <label className="text-sm font-semibold text-gray-300 mt-3 block">
                  Select PDF
                </label>
                <select
                  value={block.pdf_url || ""}
                  // onChange={async (e) => {
                  //   const selectedUrl = e.target.value;

                  //   console.log("🟡 PDF SELECTED", {
                  //     selectedUrl,
                  //     blockId: block.id,
                  //     containerIndex,
                  //     isContainerChild: containerIndex !== undefined,
                  //     before: {
                  //       pdf_url: block.pdf_url,
                  //       product_source: block.product_source,
                  //     },
                  //   });

                  //   updateField("pdf_url", selectedUrl);
                  //   updateField("pdf_name", "");
                  //   setCoverLoading(true);

                  //   if (!selectedUrl) {
                  //     updateField("cover_url", "");
                  //     updateField("image_url", "");
                  //     updateField("use_pdf_cover", false);
                  //     setCoverLoading(false);
                  //     return;
                  //   }

                  //   const selectedPdf = availablePdfs.find(
                  //     (p) => p.pdf_url === selectedUrl
                  //   );

                  //   if (selectedPdf) {
                  //     updateField("pdf_name", selectedPdf.title || "PDF");
                  //     updateField("product_source", "internal");
                  //     updateField("pdf_url", selectedPdf.pdf_url);

                  //     updateField("use_pdf_cover", true);
                  //   }

                  //   setTimeout(() => {
                  //     console.log("🟢 AFTER UPDATEFIELD", {
                  //       blockId: block.id,
                  //       containerIndex,
                  //       after: {
                  //         pdf_url: block.pdf_url,
                  //         product_source: block.product_source,
                  //         use_pdf_cover: block.use_pdf_cover,
                  //       },
                  //     });
                  //   }, 0);

                  //   try {
                  //     const res = await axiosInstance.get(
                  //       `/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(selectedUrl)}`
                  //     );

                  //     if (res.data?.cover_image) {
                  //       updateField("cover_url", res.data.cover_image);
                  //     }
                  //   } catch (err) {
                  //     console.error("❌ Error loading PDF cover:", err);
                  //   } finally {
                  //     setCoverLoading(false);
                  //   }
                  // }}
                  onChange={async (e) => {
                    const selectedUrl = e.target.value;

                    console.log("🟡 PDF SELECTED", {
                      selectedUrl,
                      blockId: block.id,
                      containerIndex,
                      isContainerChild: containerIndex !== undefined,
                    });

                    // If cleared
                    if (!selectedUrl) {
                      updateField("pdf_url", "");
                      updateField("pdf_name", "");
                      updateField("cover_url", "");
                      updateField("image_url", "");
                      updateField("use_pdf_cover", false);
                      setCoverLoading(false);
                      return;
                    }

                    const selectedPdf = availablePdfs.find(
                      (p) => p.pdf_url === selectedUrl
                    );

                    if (!selectedPdf) {
                      setCoverLoading(false);
                      return;
                    }

                    // ✅ SINGLE source of truth
                    updateField("pdf_url", selectedPdf.pdf_url);
                    updateField("pdf_name", selectedPdf.title || "PDF");
                    updateField("product_source", "internal");
                    updateField("use_pdf_cover", true);

                    setCoverLoading(true);

                    try {
                      const res = await axiosInstance.get(
                        `/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(selectedPdf.pdf_url)}`
                      );

                      if (res.data?.cover_image) {
                        updateField("cover_url", res.data.cover_image);
                      }
                    } catch (err) {
                      console.error("❌ Error loading PDF cover:", err);
                    } finally {
                      setCoverLoading(false);
                    }
                  }}
                  className="w-full p-2 bg-black text-white border border-gray-600 rounded mt-1"
                >
                  <option value="">-- Select PDF --</option>
                  {availablePdfs.map((p) => (
                    <option key={p.id} value={p.pdf_url}>
                      {p.title || "PDF"}
                    </option>
                  ))}
                </select>

                {block.pdf_url && (
                  <p className="text-xs text-gray-400 mt-1">
                    Selected PDF:{" "}
                    <span className="text-white font-semibold">
                      {block.pdf_name || "PDF"}
                    </span>
                  </p>
                )}

                {/* USE PDF COVER */}
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Use PDF Cover Image
                  </label>
                  <input
                    type="checkbox"
                    checked={!!block.use_pdf_cover}
                    disabled={!block.cover_url}
                    onChange={(e) => {
                      updateField("use_pdf_cover", e.target.checked);
                    }}
                  />
                </div>

                {/* PREVIEW PDF */}
                {block.pdf_url && (
                  <p className="text-xs text-gray-400 mt-1">
                    <a
                      href={block.pdf_url}
                      target="_blank"
                      className="text-green underline"
                      rel="noopener noreferrer"
                    >
                      Preview PDF
                    </a>
                  </p>
                )}

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

                <MiniOfferAdvanced
                  block={block}
                  updateField={updateField}
                  landing={landing}
                  openAIModal={openAIModal}
                />

                {/* PRICE */}
                <label className="text-sm text-gray-300 mt-3 block">
                  Price
                </label>
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

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={safeHexColor(block.button_color) || "#000000"}
                    onChange={(e) =>
                      updateField("button_color", e.target.value)
                    }
                    className="w-8 h-8 p-0 border border-gray-600 rounded cursor-pointer bg-transparent"
                  />

                  <input
                    type="text"
                    value={block.button_color || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateField(
                          "button_color",
                          val.startsWith("#") ? val : `#${val}`
                        );
                      }
                    }}
                    placeholder="#000000"
                    className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
                  />
                </div>

                {/* BUTTON TEXT COLOR */}
                <label className="text-sm text-gray-300 mt-3 block">
                  Button Text Color
                </label>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={safeHexColor(block.button_text_color) || "#000000"}
                    onChange={(e) =>
                      updateField("button_text_color", e.target.value)
                    }
                    className="w-8 h-8 p-0 border border-gray-600 rounded cursor-pointer bg-transparent"
                  />

                  <input
                    type="text"
                    value={block.button_text_color || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                        updateField(
                          "button_text_color",
                          val.startsWith("#") ? val : `#${val}`
                        );
                      }
                    }}
                    placeholder="#ffffff"
                    className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
                  />
                </div>

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
                {/* END RIGHT PANEL BELOW */}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
