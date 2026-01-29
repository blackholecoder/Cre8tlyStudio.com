export default function OutOfSlotsModal({
  open,
  onClose,
  onRefresh,
  isFirstTime = false,
}) {
  if (!open) return null;

  const title = isFirstTime
    ? "Welcome to The Messy Attic"
    : "Out of Lead Magnet Slots";

  const message = isFirstTime
    ? `Welcome to The Messy Attic, your creative command center for building
       high-converting lead magnets in minutes. 
       To start creating, visit themessyattic.com in your browser and
       purchase your first token pack. 
       Once purchased, click below to refresh your account and begin.`
    : `You’ve reached your current plan’s limit.
       To purchase more tokens or lifetime unlocks, visit themessyattic.com
       in your browser and log in with the same account.
       Once purchased, click below to refresh your slots instantly.`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn font-montserrat">
      <div className="relative bg-gradient-to-br from-[#0b0b0b] via-[#111827] to-[#1f2937] border border-[#00E07A]/40 shadow-[0_0_25px_rgba(0,224,122,0.3)] rounded-2xl p-8 max-w-md mx-auto text-center">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#00E07A] to-[#6A5ACD] opacity-20 blur-2xl" />

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-[#00E07A] to-[#6A5ACD] bg-clip-text text-transparent">
            {title}
          </h2>

          <p className="text-gray-300 mb-6 leading-relaxed text-[15px] whitespace-pre-line">
            {message}
          </p>

          <button
            onClick={async () => {
              if (onRefresh) await onRefresh();
              if (onClose) onClose();
            }}
            className="bg-gradient-to-r from-[#00E07A] to-[#6A5ACD] text-white px-8 py-3 rounded-xl font-semibold tracking-wide shadow-[0_0_12px_rgba(0,224,122,0.6)] hover:shadow-[0_0_20px_rgba(106,90,205,0.8)] hover:scale-[1.03] transition-all duration-200"
          >
            {isFirstTime
              ? "I’ve Purchased My First Pack"
              : "I’ve Purchased Tokens"}
          </button>

          <button
            onClick={onClose}
            className="block mx-auto mt-4 text-sm text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
