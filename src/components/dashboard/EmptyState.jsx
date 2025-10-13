export default function EmptyState({ onCheckout, type = "magnet" }) {
  const isBook = type === "book";

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      <p className="text-silver mb-6">
        {isBook
          ? "You haven’t written any books yet."
          : "You haven’t created any lead magnets yet."}
      </p>

      <button
        onClick={onCheckout}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
      >
        {isBook ? "Write My First Book" : "Generate My First Lead Magnet"}
      </button>
    </div>
  );
}
