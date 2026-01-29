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
  const productSource = block.product_source || "internal";
  const hasProduct = Boolean(block.pdf_url) || Boolean(block.external_file_url);

  const [coverLoading, setCoverLoading] = React.useState(false);

  const availablePdfs = useMemo(
    () => pdfList?.filter((p) => p.status === "completed" && p.pdf_url) || [],
    [pdfList],
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

  const previewBackground = block.match_main_bg
    ? bgTheme // can already be gradient OR solid
    : "#000000";

  const cardPanelBackground = block.use_no_bg
    ? "transparent"
    : block.use_gradient
      ? `linear-gradient(${block.gradient_direction || "135deg"},
        ${block.gradient_start || "#a855f7"},
        ${block.gradient_end || "#ec4899"})`
      : block.bg_color || "#111827";

  const fullPreviewText = (
    block.offer_page?.blocks?.map((b) => b.text)?.join(" ") || ""
  ).replace(/•/g, "");

  const hasDescription = fullPreviewText.trim().length > 0;

  const isLongPreview =
    hasDescription && fullPreviewText.trim().split(/\s+/).length > 20;

  const price = Number(block.price || 0);

  const textColor = block.text_color || "#ffffff";

  return (
    <div
      className="rounded-xl p-6 mt-6 border border-gray-700 transition-all duration-300"
      style={{
        background: "#0b1220",
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
            {/* Color Picker */}
            <input
              type="color"
              value={safeHexColor(block.bg_color, "#111827")}
              onChange={(e) => updateField("bg_color", e.target.value)}
              className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
            />

            {/* Hex Input */}
            <input
              type="text"
              value={block.bg_color || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                  updateField(
                    "bg_color",
                    val.startsWith("#") ? val : `#${val}`,
                  );
                }
              }}
              placeholder="#111827"
              className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
            />
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

      {/* Main Text Color */}
      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-semibold text-gray-300">
          Main Text Color
        </label>

        {/* Color Picker */}
        <input
          type="color"
          value={safeHexColor(block.text_color, "#ffffff")}
          onChange={(e) => updateField("text_color", e.target.value)}
          className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
        />

        {/* Hex Input */}
        <input
          type="text"
          value={block.text_color || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
              updateField("text_color", val.startsWith("#") ? val : `#${val}`);
            }
          }}
          placeholder="#ffffff"
          className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
        />
      </div>

      {/* SECONDARY TEXT COLOR */}
      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-semibold text-gray-300">
          Secondary Text Color
          <span className="block text-xs font-normal text-gray-400 mt-1">
            Used on the offer preview page for Title and Sub-title text
          </span>
        </label>

        <input
          type="color"
          value={safeHexColor(block.secondary_text_color, "#9ca3af")}
          onChange={(e) => updateField("secondary_text_color", e.target.value)}
          className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
        />

        <input
          type="text"
          value={block.secondary_text_color || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
              updateField(
                "secondary_text_color",
                val.startsWith("#") ? val : `#${val}`,
              );
            }
          }}
          placeholder="#9ca3af"
          className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
        />
      </div>

      {/* UTILITY TEXT COLOR */}
      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-semibold text-gray-300">
          Utility Text Color
          <span className="block text-xs font-normal text-gray-400 mt-1">
            Used on the offer preview page for links and navigation text
          </span>
        </label>

        <input
          type="color"
          value={safeHexColor(block.utility_text_color, "#60a5fa")}
          onChange={(e) => updateField("utility_text_color", e.target.value)}
          className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
        />

        <input
          type="text"
          value={block.utility_text_color || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
              updateField(
                "utility_text_color",
                val.startsWith("#") ? val : `#${val}`,
              );
            }
          }}
          placeholder="#60a5fa"
          className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
        />
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
              <div
                className="relative bg-black w-full overflow-hidden rounded-xl"
                style={{
                  height: "320px", // 👈 desktop height
                  maxHeight: "340px",
                }}
              >
                {coverLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                    <div className="w-10 h-10 border-4 border-gray-500 border-t-green rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 mt-3">
                      Loading PDF cover…
                    </p>
                  </div>
                ) : imageToShow ? (
                  <>
                    {/* Preview canvas */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: previewBackground }}
                    >
                      {hasDescription || block.title || price > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            width: "90%",
                            maxWidth: "480px", // 🔑 smaller, square-safe
                            height: "200px",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
                            background: block.use_gradient
                              ? `linear-gradient(${block.gradient_direction || "135deg"},
              ${block.gradient_start || "#a855f7"},
              ${block.gradient_end || "#ec4899"})`
                              : block.bg_color || "#111827",
                          }}
                        >
                          {/* LEFT IMAGE – only render if image exists */}
                          {(block.use_pdf_cover && block.cover_url) ||
                          block.image_url ? (
                            <div
                              style={{
                                flex: "0 0 30%",
                                background: "#000",
                                borderTopLeftRadius: "16px",
                                borderBottomLeftRadius: "16px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={
                                  block.use_pdf_cover
                                    ? block.cover_url
                                    : block.image_url
                                }
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderTopLeftRadius: "16px",
                                  borderBottomLeftRadius: "16px",
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                }}
                              />
                            </div>
                          ) : null}

                          {/* RIGHT CONTENT */}
                          <div
                            style={{
                              flex: 1,
                              padding: "16px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              color: block.text_color || "#ffffff",
                              background: cardPanelBackground,
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: 800,
                                marginBottom: "6px",
                              }}
                            >
                              {block.title || "Offer Title"}
                            </h3>

                            <div
                              style={{
                                fontSize: "0.8rem",
                                lineHeight: 1.4,
                                opacity: 0.9,
                                maxWidth: "420px",
                                marginBottom: "8px",
                              }}
                            >
                              <span
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {fullPreviewText}
                              </span>

                              {isLongPreview && (
                                <span
                                  style={{
                                    display: "block",
                                    marginTop: "6px",
                                    fontWeight: 700,
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    opacity: 0.95,
                                  }}
                                >
                                  See more
                                </span>
                              )}
                            </div>

                            <button
                              style={{
                                marginTop: "auto",
                                width: "100%",
                                maxWidth: "180px",
                                padding: "8px",
                                borderRadius: "8px",
                                fontWeight: 700,
                                border: "none",
                                background: block.button_color || "#22c55e",
                                color: block.button_text_color || "#000000",
                                fontSize: "0.8rem",
                                opacity: hasProduct ? 1 : 0.6,
                              }}
                            >
                              {block.button_text || "Buy Now"}
                            </button>

                            {price > 0 && (
                              <div
                                style={{
                                  marginTop: "6px",
                                  fontSize: "0.85rem",
                                  opacity: 0.85,
                                }}
                              >
                                ${price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.85rem",
                            textAlign: "center",
                            padding: "20px",
                          }}
                        >
                          Fill in the fields to see your card preview
                        </div>
                      )}
                    </div>

                    {(block.image_url || block.cover_url) && (
                      <button
                        type="button"
                        className="absolute top-3 right-3 bg-black/70 text-red-400 text-xs px-3 py-1 rounded hover:bg-black"
                        onClick={() => {
                          if (block.use_pdf_cover) {
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
                  background: "#0f172a",
                  color: block.text_color || "#ffffff",
                }}
              >
                <label className="text-sm font-semibold text-gray-300 mt-6 block">
                  Product Source
                </label>

                <select
                  value={productSource}
                  onChange={(e) => {
                    const source = e.target.value;
                    updateField("product_source", source);

                    if (source === "internal") {
                      updateField("external_file_url", "");
                      updateField("external_file_name", "");
                    }

                    if (source === "external") {
                      updateField("pdf_url", "");
                      updateField("pdf_name", "");
                      updateField("cover_url", "");
                      updateField("use_pdf_cover", false);
                    }
                  }}
                  className="w-full p-2 bg-black border border-gray-600 rounded text-white mt-1"
                >
                  <option value="internal">The Messy Attic PDF</option>
                  <option value="external">Upload Existing Product</option>
                </select>

                {productSource === "external" && (
                  <>
                    <label className="text-sm font-semibold text-gray-300 mt-4 block">
                      Upload Your Product
                    </label>

                    <input
                      type="file"
                      accept=".pdf,.zip"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("landingId", landing.id);
                          formData.append("blockId", block.id);

                          const res = await axiosInstance.post(
                            "/landing/upload-product",
                            formData,
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            },
                          );

                          if (!res.data?.success) {
                            toast.error("Upload failed");
                            return;
                          }

                          updateField("external_file_url", res.data.url);
                          updateField(
                            "external_file_name",
                            res.data.file_name || file.name,
                          );
                          updateField("product_source", "external");

                          toast.success("Product uploaded!");
                          e.target.value = "";
                        } catch (err) {
                          toast.error("Upload failed");
                        }
                      }}
                      className="w-full p-2 bg-black border border-gray-700 rounded text-white"
                    />

                    {block.external_file_url && (
                      <p className="text-xs text-green mt-2">
                        Uploaded: {block.external_file_name}
                      </p>
                    )}
                  </>
                )}

                {/* PDF SELECT */}
                {productSource === "internal" && (
                  <>
                    <label className="text-sm font-semibold text-gray-300 mt-3 block">
                      Select PDF
                    </label>
                    <select
                      value={block.pdf_url || ""}
                      onChange={async (e) => {
                        const selectedUrl = e.target.value;

                        // If cleared
                        if (!selectedUrl) {
                          updateField("pdf_url", "");
                          updateField("pdf_name", "");
                          updateField("cover_url", "");
                          updateField("image_url", "");
                          updateField("use_pdf_cover", false);
                          updateField("page_count", null);
                          setCoverLoading(false);
                          return;
                        }

                        const selectedPdf = availablePdfs.find(
                          (p) => p.pdf_url === selectedUrl,
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
                        updateField("image_url", "");
                        updateField(
                          "page_count",
                          selectedPdf.page_count || null,
                        );

                        setCoverLoading(true);

                        try {
                          const res = await axiosInstance.get(
                            `/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(selectedPdf.pdf_url)}`,
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
                  </>
                )}

                {block.pdf_url && (
                  <p className="text-xs text-gray-400 mt-1">
                    Selected PDF:{" "}
                    <span className="text-white font-semibold">
                      {block.pdf_name || "PDF"}
                    </span>
                    {block.page_count && (
                      <span className="ml-2 opacity-80">
                        • {block.page_count} pages
                      </span>
                    )}
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
                <label className="text-sm font-semibold text-gray-300 mt-3 block">
                  Product Name (Checkout)
                </label>
                <input
                  type="text"
                  value={block.product_name || ""}
                  maxLength={80}
                  onChange={(e) => updateField("product_name", e.target.value)}
                  className="w-full p-2 bg-black text-white border border-gray-600 rounded mt-1"
                  placeholder="What buyers will see on checkout"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This appears on Stripe checkout and receipts
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
                          val.startsWith("#") ? val : `#${val}`,
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
                          val.startsWith("#") ? val : `#${val}`,
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
