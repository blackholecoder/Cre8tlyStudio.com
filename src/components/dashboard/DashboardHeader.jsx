import { useAuth } from "../../admin/AuthContext";

export default function DashboardHeader({ items = [], onCheckout, type = "magnet" }) {
  const { user } = useAuth();

  const isFreeTier = user?.has_free_magnet === 1 && user?.magnet_slots === 1;
  const trialExpired = user?.trialExpired;

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

  // 🧩 Determine if the free user has used their only slot
  const freeUsedAll = isFreeTier && (availableSlots <= 0 || trialExpired);

  const title = type === "book" ? "My Books" : "My Digital Products";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      {/* ---------- Left Section ---------- */}
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

        {isFreeTier && !trialExpired && (
          <p className="text-yellow-400 text-sm mt-2">
            🆓 You’re on a Free Trial — 1 slot, up to 5 pages, expires in 7 days.
          </p>
        )}

        {freeUsedAll ? (
          <div className="mt-4">
            <button
              onClick={onCheckout}
              className="px-6 py-3 rounded-lg bg-green text-black font-semibold hover:bg-green/80 transition shadow-lg"
            >
              {trialExpired ? "Upgrade Plan" : "Buy Magnets"}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              {trialExpired
                ? "Your free trial has ended. Upgrade to unlock more lead magnet slots and features."
                : "You’ve used your free slot. Upgrade now to add more magnets."}
            </p>
          </div>
        ) : availableSlots === 0 ? (
          <div className="mt-4">
            <button
              onClick={onCheckout}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
            >
              Purchase More Slots
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
