import { useAuth } from "../../admin/AuthContext";

export default function DashboardHeader({
  items = [],
  summary = {},
  onCheckout,
  type = "magnet",
}) {
  const { user } = useAuth();

  const isDataLoading =
    !user ||
    user.magnet_slots === undefined ||
    user.magnet_slots === null ||
    summary === undefined ||
    summary.total_slots === undefined;

  if (isDataLoading) return null;

  const isFreeTier = user?.has_free_magnet === 1 && user?.magnet_slots === 1;
  const trialExpired = user?.trialExpired;

  let totalSlots;
  let usedSlots;
  let availableSlots;

  // BOOK LOGIC (unchanged)
  if (type === "book") {
    const bookArray = Array.isArray(items) ? items : [];

    totalSlots = user?.book_slots ?? 0;
    usedSlots = bookArray.filter((b) => b.pages >= 750).length;
    availableSlots = Math.max(totalSlots - usedSlots, 0);
  }

  // MAGNET LOGIC (your rules)
  else {
    const magnetsArray = Array.isArray(items) ? items : [];

    totalSlots = summary.total_slots ?? user?.magnet_slots ?? 0;

    const completed = magnetsArray.filter(
      (m) => m.status === "completed"
    ).length;
    const awaiting = magnetsArray.filter(
      (m) => m.status === "awaiting_prompt"
    ).length;

    usedSlots = completed;
    availableSlots = awaiting;
  }

  // 🧩 Determine if the free user has used their only slot
  const freeUsedAll = isFreeTier && (availableSlots <= 0 || trialExpired);

  const title = type === "book" ? "My Books" : "My Digital Products";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      {/* ---------- Left Section ---------- */}
      <div>
        <h1 className="text-3xl font-bold text-white design-text normal-case">
          {title}
        </h1>

        {user && (
          <div className="text-[14px] text-gray-400 mt-1 mb-2">
            Welcome,{" "}
            <span className="text-white font-semibold tracking-wide">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </div>
        )}

        <p className="text-silver mt-1">
          You currently have {availableSlots} slots remaining.
        </p>

        {isFreeTier && !trialExpired && (
          <p className="text-yellow-400 text-sm mt-2">
            🆓 You’re on a Free Trial, 1 slot, up to 5 pages, expires in 7 days.
          </p>
        )}

        {freeUsedAll ? (
          <div className="mt-4">
            <button
              onClick={onCheckout}
              className="px-6 py-3 rounded-lg bg-royalPurple text-white font-semibold hover:bg-green/80 transition shadow-lg"
            >
              {trialExpired ? "Upgrade Plan" : "Upgrade Your Account"}
            </button>

            <p className="text-xs text-gray-400 mt-2">
              {trialExpired
                ? "Your free trial has ended. Upgrade to unlock downloads, the Live Editor, the Design Canvas, and unlimited magnet creation."
                : "You’ve used your free trial slot. Upgrade to unlock unlimited creation, downloads, Live Editor, and Design Canvas."}
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
