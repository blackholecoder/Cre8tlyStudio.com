// export default function DashboardHeader({ magnets, onCheckout }) {
//   const availableSlots = magnets.filter(m => !m.prompt).length;

//   return (
//     <>
//       <h1 className="text-2xl font-bold text-white mb-6">My Lead Magnets</h1>
//       <p className="text-silver mb-6">
//         You currently have {availableSlots} of {magnets.length} slots available.
//       </p>

//       {availableSlots === 0 && (
//         <div className="mb-6">
//           <button
//             onClick={onCheckout}
//             className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
//           >
//             Purchase 5 More Slots
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

export default function DashboardHeader({ items = [], onCheckout, type = "magnet" }) {
  // ✅ Calculate available slots (same logic as your CustomerDashboard)
  const availableSlots = items.filter(i => !i.pdf_url && i.status !== "pending").length;

  // ✅ Dynamic title based on dashboard type
  const title =
    type === "book" ? "My Books" : "My Lead Magnets";

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>

      <p className="text-silver mb-6">
        You currently have {availableSlots} of {items.length} slots available.
      </p>

      {/* ✅ Only show "Purchase More Slots" if all are used */}
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



