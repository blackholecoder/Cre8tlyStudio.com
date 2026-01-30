export default function OutOfSlotsModal({
  open,
  onClose,
  context = "books", // "books" | "leadMagnets"
}) {
  if (!open) return null;

  const COPY = {
    books: {
      title: "Book Limit Reached",
      message: `You can only have 3 active books at one time. Finish or archive an existing book\n to create a new one.`,
    },
    leadMagnets: {
      title: "Monthly Limit Reached",
      message: `You’ve used all 15 lead magnet slots for this month. Your slots will automatically reset at the start of your next billing cycle.`,
    },
  };

  const { title, message } = COPY[context];

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
            onClick={onClose}
            className="bg-gradient-to-r from-[#00E07A] to-[#6A5ACD] text-white px-8 py-3 rounded-xl font-semibold tracking-wide shadow-[0_0_12px_rgba(0,224,122,0.6)] hover:shadow-[0_0_20px_rgba(106,90,205,0.8)] hover:scale-[1.03] transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
