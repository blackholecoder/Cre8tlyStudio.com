export default function DashboardHeader({ magnets, onCheckout }) {
  const availableSlots = magnets.filter(m => !m.prompt).length;

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6">My Lead Magnets</h1>
      <p className="text-silver mb-6">
        You currently have {availableSlots} of {magnets.length} slots available.
      </p>

      {availableSlots === 0 && (
        <div className="mb-6">
          <button
            onClick={onCheckout}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            Purchase 5 More Slots
          </button>
        </div>
      )}
    </>
  );
}