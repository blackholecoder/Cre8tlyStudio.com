export default function VerifiedReviewsBlock({ block, index, updateBlock }) {
  return (
    <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700">
      <h3 className="text-lg font-semibold text-silver mb-4">
        Verified Reviews
      </h3>

      {/* Enable toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-300">
          Show Reviews Section
        </label>
        <input
          type="checkbox"
          checked={block.enabled !== false}
          onChange={(e) => updateBlock(index, "enabled", e.target.checked)}
        />
      </div>

      {/* Info */}
      <div className="mt-4 p-3 rounded bg-black/40 text-xs text-gray-400">
        This section automatically displays verified customer reviews. Styling
        and layout are managed by the system. This will not show in preview
        panel.
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Reviews Text Color
          <span className="block text-xs font-normal text-gray-400 mt-1">
            Used only for the reviews section on the live page
          </span>
        </label>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="color"
            value={block.reviews_text_color || "#000000"}
            onChange={(e) =>
              updateBlock(index, "reviews_text_color", e.target.value)
            }
            className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
          />

          <input
            type="text"
            value={block.reviews_text_color || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                updateBlock(
                  index,
                  "reviews_text_color",
                  val.startsWith("#") ? val : `#${val}`
                );
              }
            }}
            placeholder="#000000"
            className="w-24 px-2 py-1 text-xs bg-black text-white border border-gray-600 rounded"
          />
        </div>
      </div>
    </div>
  );
}
