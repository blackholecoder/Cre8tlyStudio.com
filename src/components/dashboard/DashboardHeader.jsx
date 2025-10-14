import { useAuth } from "../../admin/AuthContext";

export default function DashboardHeader({ items = [], onCheckout, type = "magnet" }) {
  const { user } = useAuth();

  console.log("USER DATA:", user);
console.log("ITEMS:", items);

  // ✅ Pull correct slot count from the actual DB column names
  const totalSlots =
    type === "book"
      ? user?.book_slots ?? 0
      : user?.magnet_slots ?? 0;

  // ✅ Each record = one used slot
  const usedSlots =
  type === "book"
    ? items.filter(i => i.pages >= 750).length // ✅ Only count books that hit 750+ pages
    : items.filter(i => i.status === "completed").length; // ✅ Normal logic for magnets

  // ✅ Remaining slots (never negative)
  const availableSlots = Math.max(totalSlots - usedSlots, 0);

  // ✅ Dynamic title
  const title = type === "book" ? "My Books" : "My Lead Magnets";

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>

      <p className="text-silver mb-6">
        You currently have {availableSlots} of {totalSlots} slots remaining.
      </p>

      {/* ✅ Button reappears only when user runs out */}
      {availableSlots === 0 && (
        <div className="mb-6">
          <button
            onClick={onCheckout}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            Purchase More Slots
          </button>
        </div>
      )}
    </>
  );
}
