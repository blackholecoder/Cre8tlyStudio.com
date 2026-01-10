import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/axios";
import Cropper from "react-easy-crop";

export default function ProfileCardBlock({
  block,
  index,
  updateBlock,
  bgTheme,
  getLabelContrast,
  adjustForLandingOverlay,
  landing,
}) {
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  function canvasHasTransparency(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height).data;

    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] < 255) return true;
    }
    return false;
  }

  const previewBg = adjustForLandingOverlay(bgTheme);

  return (
    <div className="rounded-xl p-6 mt-3 border border-gray-700 bg-[#0F172A] transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <h3
          className="text-lg font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Profile Card
        </h3>
        <span className="text-xs bg-[#1E293B] text-gray-300 px-2 py-1 rounded-full border border-gray-600">
          Image + Contact
        </span>
      </div>

      {/* Image Upload */}
      <div
        className="rounded-xl border border-gray-700 p-6"
        style={{
          background: adjustForLandingOverlay(bgTheme),
        }}
      >
        {!block.image_url ? (
          <>
            <label
              htmlFor={`profileImage-${block.id}`}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl py-10 cursor-pointer hover:border-green transition"
            >
              <p className="text-sm text-gray-400">
                <span className="text-green font-medium">
                  Upload profile image
                </span>
              </p>

              <input
                id={`profileImage-${block.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const preview = URL.createObjectURL(file);

                  // Open cropper instead of uploading immediately
                  setCropSrc(preview);
                }}
              />
            </label>

            {cropSrc && (
              <div className="mt-6">
                <div
                  className="relative w-full h-[260px] rounded-lg overflow-hidden"
                  style={{
                    background: previewBg,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <Cropper
                    image={cropSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                  />
                </div>

                {/* Zoom */}
                <div className="mt-4">
                  <label className="text-xs text-gray-400">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    disabled={saving}
                    className="px-4 py-2 rounded bg-green text-black text-sm"
                    onClick={async () => {
                      if (!croppedAreaPixels) return; // 🔒 guard

                      const canvas = document.createElement("canvas");
                      const img = new Image();
                      img.crossOrigin = "anonymous";
                      img.src = cropSrc;

                      await new Promise((r) => (img.onload = r));

                      const { width, height, x, y } = croppedAreaPixels;
                      const PADDING_RATIO = 0.4;
                      const padX = Math.round(width * PADDING_RATIO);
                      const padY = Math.round(height * PADDING_RATIO);

                      // ✅ Set padded canvas size ONCE
                      canvas.width = width + padX * 2;
                      canvas.height = height + padY * 2;

                      const ctx = canvas.getContext("2d");
                      ctx.clearRect(0, 0, canvas.width, canvas.height);

                      // ✅ Draw image centered with padding
                      ctx.drawImage(
                        img,
                        x,
                        y,
                        width,
                        height,
                        padX,
                        padY,
                        width,
                        height
                      );

                      // 🔍 Detect transparency
                      const hasAlpha = canvasHasTransparency(
                        ctx,
                        width,
                        height
                      );

                      // 🧠 Choose format intelligently
                      const mimeType = hasAlpha ? "image/png" : "image/jpeg";
                      const fileName = hasAlpha ? "profile.png" : "profile.jpg";
                      const quality = hasAlpha ? undefined : 0.9;

                      const blob = await new Promise((r) =>
                        canvas.toBlob(r, mimeType, quality)
                      );

                      // Preview + upload
                      const preview = URL.createObjectURL(blob);
                      updateBlock(index, "image_url", preview);

                      const formData = new FormData();
                      formData.append("image", blob, fileName);
                      formData.append("landingId", landing.id);
                      formData.append("blockId", block.id);

                      const res = await axiosInstance.post(
                        "/landing/upload-media-block",
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                      );

                      if (res.data.success) {
                        updateBlock(index, "image_url", res.data.url);
                        toast.success("Profile image saved");
                      }

                      URL.revokeObjectURL(cropSrc);
                      URL.revokeObjectURL(preview);
                      setCropSrc(null);
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                    }}
                  >
                    Save Image
                  </button>

                  <button
                    className="px-4 py-2 rounded bg-gray-700 text-white text-sm"
                    onClick={() => {
                      URL.revokeObjectURL(cropSrc);
                      setCropSrc(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div
              className="mx-auto"
              style={{
                width: `${block.image_size || 120}px`,
                height: `${block.image_size || 120}px`,
                borderRadius: `${block.image_radius || 999}px`,
                border: `${block.image_border_width || 1}px solid ${
                  block.image_border_color || "#e5e7eb"
                }`,
                overflow: "hidden",
                background: "transparent",
              }}
            >
              <img
                src={block.image_url}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <button
              className="text-xs text-red-400 mt-3 hover:underline"
              onClick={() => updateBlock(index, "image_url", "")}
            >
              Remove image
            </button>
          </div>
        )}
      </div>

      {/* Image size */}
      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Image Size
        </label>
        <input
          type="range"
          min="60"
          max="200"
          value={block.image_size || 120}
          onChange={(e) =>
            updateBlock(index, "image_size", Number(e.target.value))
          }
          className="w-full mt-2"
        />
      </div>

      {/* Tagline */}

      <div className="mt-6">
        <label
          className="text-sm font-semibold"
          style={{ color: getLabelContrast(bgTheme) }}
        >
          Tagline
        </label>

        {/* Text input */}
        <input
          type="text"
          value={block.tagline || ""}
          placeholder="Welcome to my page"
          onChange={(e) => updateBlock(index, "tagline", e.target.value)}
          className="w-full p-2 mt-1 border border-gray-600 rounded bg-black text-white"
        />

        {/* Color controls */}
        <div className="flex items-center gap-3 mt-3">
          {/* Color picker */}
          <input
            type="color"
            value={block.tagline_color || "#FFFFFF"}
            onChange={(e) =>
              updateBlock(index, "tagline_color", e.target.value)
            }
            className="w-10 h-10 rounded cursor-pointer border border-gray-600"
          />

          {/* Hex input */}
          <input
            type="text"
            value={block.tagline_color || "#FFFFFF"}
            onChange={(e) =>
              updateBlock(index, "tagline_color", e.target.value)
            }
            className="flex-1 p-2 border border-gray-600 rounded bg-black text-white uppercase"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(bgTheme) }}
          >
            Contact Type
          </label>
          <select
            value={block.contact_type || "email"}
            onChange={(e) => updateBlock(index, "contact_type", e.target.value)}
            className="w-full p-2 mt-1 bg-black border border-gray-700 rounded text-white"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            style={{ color: getLabelContrast(bgTheme) }}
          >
            Contact Value
          </label>
          <input
            type="text"
            value={block.contact_value || ""}
            placeholder={
              block.contact_type === "phone"
                ? "555 123 4567"
                : "hello@example.com"
            }
            onChange={(e) =>
              updateBlock(index, "contact_value", e.target.value)
            }
            className="w-full p-2 mt-1 border border-gray-600 rounded bg-black text-white"
          />
        </div>
      </div>
    </div>
  );
}
