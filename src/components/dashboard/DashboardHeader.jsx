import { useAuth } from "../../admin/AuthContext";

export default function DashboardHeader({ items = [], onCheckout, type = "magnet" }) {
  const { user } = useAuth();

  // ✅ Handle if backend returns { magnets, summary }
  const magnetsArray = Array.isArray(items.magnets) ? items.magnets : items;
  const summary = items.summary || {};

  const totalSlots =
    type === "book"
      ? user?.book_slots ?? 0
      : summary.total_slots ?? user?.magnet_slots ?? 0;

  const usedSlots =
    type === "book"
      ? magnetsArray.filter((i) => i.pages >= 750).length
      : summary.used_slots ?? magnetsArray.filter((i) => i.status === "completed").length;

  const availableSlots =
    summary.available_slots ?? Math.max(totalSlots - usedSlots, 0);

  const title = type === "book" ? "My Books" : "My Digital Products";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      {/* Left section */}
      <div>
        <h1 className="text-3xl font-bold text-white design-text">{title}</h1>
        {user && (
        <div className="text-[14px] text-gray-400 mt-1 mb-2">
          Welcome,{" "}
          <span className="text-white font-semibold tracking-wide">
            {user?.name?.split(" ")[0] || "User"}
          </span>
        </div>
      )}
        <p className="text-silver mt-1">
          You currently have {availableSlots} of {totalSlots} slots remaining.
        </p>

        {availableSlots === 0 && (
          <div className="mt-4">
            <button
              onClick={onCheckout}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
            >
              Purchase More Slots
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

