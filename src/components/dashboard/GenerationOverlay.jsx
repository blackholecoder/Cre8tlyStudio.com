export default function GenerationOverlay({ visible, type = "lead", onClose }) {
  const label =
    type === "book" ? "book" : type === "lead" ? "lead magnet" : "content";

  if (!visible) return null;

  return (
    <div
      className="
      fixed inset-0 z-[9999]
      flex items-center justify-center
      bg-black/80
      backdrop-blur-sm
      px-6
    "
    >
      <div
        className="
        w-full max-w-md rounded-3xl
        bg-[#0b0b0b]
        border border-white/15
        px-10 py-9
        text-center
        shadow-[0_30px_90px_rgba(0,0,0,0.7)]
      "
      >
        {/* Title */}
        <h2 className="text-white text-[22px] font-semibold tracking-tight mb-3">
          In progress
        </h2>

        {/* Body */}
        <p className="text-gray-300 text-[15px] leading-relaxed mb-1">
          We’re creating your {label}.
        </p>

        <p className="text-gray-400 text-[14px] leading-relaxed mb-8">
          You’ll be notified by email when it’s ready.
        </p>

        {/* Action */}
        <button
          onClick={onClose}
          className="
          inline-flex items-center justify-center
          px-7 py-2.5
          rounded-full
          bg-green
          text-black
          text-[14px] font-medium
          transition
          hover:opacity-90
          focus:outline-none
          focus:ring-2 focus:ring-green/40
        "
        >
          Continue
        </button>
      </div>
    </div>
  );
}
