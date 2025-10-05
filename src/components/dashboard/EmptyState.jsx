export default function EmptyState({ onCheckout }) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      <p className="text-silver mb-6">
        You haven’t created any lead magnets yet.
      </p>
      <button
        onClick={onCheckout}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
      >
        Generate My First Lead Magnet
      </button>
    </div>
  );
}
