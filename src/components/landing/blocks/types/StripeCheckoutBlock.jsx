import { useState } from "react";
import { adjustForLandingOverlay } from "../../../../sections/landing/adjustForLandingOverlay";
import axiosInstance from "../../../../api/axios";

export default function StripeCheckoutBlock({
  block,
  index,
  updateBlock,
  pdfList,
  bgTheme,
  landing,
}) {
  const [uploading, setUploading] = useState(false);

  const productSource = block.product_source || "internal";

  const hasProduct = Boolean(block.pdf_url) || Boolean(block.external_file_url);

  return (
    <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-silver mb-4">
        Stripe Checkout Button
      </h3>

      {/* LIVE PREVIEW */}
      <div
        className="mt-6 mb-12 p-6 text-center border border-gray-700 rounded-lg"
        style={{
          textAlign: block.alignment,
          background: block.match_main_bg
            ? adjustForLandingOverlay(bgTheme)
            : bgTheme || "#0F172A",
        }}
      >
        <button
          disabled={!hasProduct}
          style={{
            pointerEvents: hasProduct ? "auto" : "none",
            background: block.button_color || "#10b981",
            color: block.text_color || "#000000",
          }}
          className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform
    ${hasProduct ? "hover:scale-105" : "opacity-50 cursor-not-allowed"}
  `}
        >
          {block.button_text || "Buy & Download PDF"}
        </button>

        <p className="text-xs text-gray-400 mt-2">
          {hasProduct
            ? `$${Number(block.price) > 0 ? Number(block.price).toFixed(2) : "10.00"}`
            : "Select a product to enable checkout"}
        </p>
      </div>

      {block.external_file_url && (
        <p className="text-xs text-gray-400 mt-2">
          Uploaded File:
          <a
            href={block.external_file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline ml-1"
          >
            Preview File
          </a>
        </p>
      )}

      <label className="text-sm font-semibold text-gray-300">
        Product Source
      </label>
      <select
        value={productSource}
        onChange={(e) => {
          const source = e.target.value;

          updateBlock(index, "product_source", source);

          if (source === "internal") {
            updateBlock(index, "external_file_url", "");
            updateBlock(index, "external_file_name", "");
          }

          if (source === "external") {
            updateBlock(index, "pdf_url", "");
          }
        }}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      >
        <option value="" disabled>
          Select product source
        </option>
        <option value="internal">Cre8tly Studio Product</option>
        <option value="external">Upload Existing Product</option>
      </select>

      {/* PDF SELECTOR */}
      {block.product_source === "internal" && (
        <>
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
              ?.filter((lm) => lm.status === "completed" && lm.pdf_url)
              .map((lm) => (
                <option key={lm.id} value={lm.pdf_url}>
                  {lm.title || "Untitled PDF"} — (Ready)
                </option>
              ))}
          </select>
        </>
      )}

      {block.product_source === "external" && (
        <>
          <label className="text-sm font-semibold text-gray-300 mt-4">
            Upload Your Product
          </label>

          <input
            type="file"
            accept=".pdf,.zip"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (uploading) return;

              setUploading(true);

              try {
                if (
                  !["application/pdf", "application/zip"].includes(file.type)
                ) {
                  alert("Only PDF or ZIP files are allowed");
                  return;
                }

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
                  }
                );

                const data = res.data;

                if (!data?.success) {
                  console.error("❌ Upload failed:", data);
                  alert(data?.message || "Upload failed");
                  return;
                }

                updateBlock(index, "product_source", "external");
                updateBlock(index, "external_file_url", data.url);
                updateBlock(
                  index,
                  "external_file_name",
                  data.file_name || file.name
                );
                e.target.value = "";
              } catch (err) {
                console.error(
                  "❌ Upload error:",
                  err.response?.data || err.message
                );
                alert(err.response?.data?.message || "Upload failed");
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading}
            className={`w-full p-2 bg-black border border-gray-700 rounded text-white
    ${uploading ? "opacity-50 cursor-not-allowed" : ""}
  `}
          />

          {block.external_file_url && (
            <p className="text-xs text-green mt-2">
              Uploaded: {block.external_file_name}
            </p>
          )}
        </>
      )}

      {/* Preview link */}
      {block.pdf_url && (
        <p className="text-xs text-gray-400 mt-2">
          Selected File:
          <a
            href={block.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline ml-1"
          >
            Preview PDF
          </a>
        </p>
      )}

      {/* Button Label */}
      <label className="text-sm font-semibold text-gray-300 mt-4 block">
        Button Label
      </label>
      <input
        type="text"
        placeholder="Buy & Download PDF"
        value={block.button_text || ""}
        onChange={(e) => updateBlock(index, "button_text", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* PRICE */}
      <label className="text-sm font-semibold text-gray-300 mt-4 block">
        Price (USD)
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={block.price ?? ""}
        onChange={(e) => updateBlock(index, "price", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* COLORS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mt-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-300">
            Button Background
          </label>
          <input
            type="color"
            value={block.button_color || "#10b981"}
            onChange={(e) => updateBlock(index, "button_color", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-600"
          />
          {/* Manual Input */}
          <input
            type="text"
            placeholder="Enter hex"
            value={block.button_color || ""}
            onChange={(e) => updateBlock(index, "button_color", e.target.value)}
            className="flex-1 p-2 rounded bg-black text-white border border-gray-700 text-sm"
          />
          <span className="text-xs text-gray-400">{block.button_color}</span>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <label className="text-sm font-semibold text-gray-300">
            Text Color
          </label>
          <input
            type="color"
            value={block.text_color || "#000000"}
            onChange={(e) => updateBlock(index, "text_color", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-600"
          />
          <span className="text-xs text-gray-400">{block.text_color}</span>
          <input
            type="text"
            placeholder="Enter hex"
            value={block.text_color || ""}
            onChange={(e) => updateBlock(index, "text_color", e.target.value)}
            className="flex-1 p-2 rounded bg-black text-white border border-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Alignment */}
      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-semibold text-gray-300">Alignment</label>
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
    </div>
  );
}
