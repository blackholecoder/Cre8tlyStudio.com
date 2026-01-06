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
        and layout are managed by the system.
      </div>
    </div>
  );
}
