import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoreHorizontal } from "lucide-react";
import axiosInstance from "../../../api/axios";
import { toast } from "react-toastify";

const GRID_COLS = "grid-cols-[2.5fr_120px_160px_48px]";

export default function MySubscriptions() {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);

  function toggleMenu(id) {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  async function fetchMySubscriptions() {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/community/subscriptions/my");

      setSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMySubscriptions();
  }, []);

  const filtered = subscriptions.filter(
    (s) =>
      s.author_name.toLowerCase().includes(search.toLowerCase()) ||
      s.author_username.toLowerCase().includes(search.toLowerCase()),
  );

  function openCancelModal(subscription) {
    navigate(`/subscriptions/${subscription.author_user_id}/cancel`, {
      state: subscription,
    });
  }

  // fix the change plan to actually allow users to upgrade their plans, its commented out now

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-dashboard-border-light dark:border-dashboard-border-dark px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg font-semibold">My Subscriptions</h1>
          <p className="text-xs opacity-60">
            {subscriptions.length} active subscription
            {subscriptions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-0 py-4 max-w-6xl mx-auto">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by author..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="
              w-full pl-9 pr-3 py-2 rounded-lg text-sm
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              outline-none
            "
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block px-4 max-w-6xl mx-auto">
        <div
          className={`
          grid ${GRID_COLS}
          items-center
          px-4 py-3
          text-xs font-medium
          text-white/50
          bg-dashboard-hover-light
          dark:bg-dashboard-hover-dark
          rounded-t-xl
          border
          border-dashboard-border-light
          dark:border-dashboard-border-dark
        `}
        >
          <div>Author</div>
          <div>Plan</div>
          <div>Renews</div>
          <div />
        </div>

        <div className="space-y-1 mt-1">
          {filtered.map((s) => {
            const isPaid = s.paid_subscription === 1;
            return (
              <div
                key={s.id}
                className={`
                grid ${GRID_COLS}
                items-center
                px-4 py-3
                rounded-xl
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border
                border-dashboard-border-light
                dark:border-dashboard-border-dark
                hover:bg-dashboard-hover-light
                dark:hover:bg-dashboard-hover-dark
                transition
              `}
              >
                {/* Author (avatar + name ONLY ONCE) */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() =>
                      navigate(`/community/authors/${s.author_user_id}`)
                    }
                    className="flex-shrink-0"
                  >
                    {s.author_image_url ? (
                      <img
                        src={s.author_image_url}
                        alt={s.author_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark flex items-center justify-center text-xs">
                        {s.author_name.charAt(0)}
                      </div>
                    )}
                  </button>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {s.author_name}
                    </p>
                    <p className="text-xs opacity-60 truncate">
                      @{s.author_username}
                    </p>
                  </div>
                </div>

                {/* Plan */}
                <div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      !s.paid_subscription
                        ? "bg-gray-500/20 text-gray-400"
                        : s.type === "monthly"
                          ? "bg-green/20 text-green"
                          : s.type === "annual"
                            ? "bg-blue/20 text-blue"
                            : "bg-purple/20 text-purple"
                    }`}
                  >
                    {!s.paid_subscription
                      ? "Free"
                      : s.type === "monthly"
                        ? "Monthly"
                        : s.type === "annual"
                          ? "Annual"
                          : "VIP"}
                  </span>
                </div>

                {/* Renewal */}
                <div className="text-sm opacity-70">
                  {!s.paid_subscription
                    ? "—"
                    : s.cancel_at_period_end
                      ? `Ends ${formatDate(s.current_period_end)}`
                      : "Renews monthly"}
                </div>

                {/* Menu */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative flex justify-center"
                >
                  <button
                    onClick={() => toggleMenu(s.id)}
                    className="p-2 rounded-md hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {openMenuId === s.id && (
                    <div
                      className="
                    absolute right-0 top-10
                    w-44
                    rounded-xl
                    shadow-xl
                    z-50
                    bg-dashboard-sidebar-light
                    dark:bg-dashboard-sidebar-dark
                    border
                    border-dashboard-border-light
                    dark:border-dashboard-border-dark
                  "
                    >
                      {/* ALWAYS AVAILABLE */}
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          navigate(`/community/authors/${s.author_user_id}`);
                        }}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                      >
                        View author
                      </button>

                      {/* PAID ONLY */}
                      {isPaid && (
                        <>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setCancelTarget(s);
                              setCancelModalOpen(true);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-500/10"
                          >
                            Cancel subscription
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {openMenuId && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenMenuId(null)}
          />
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden px-0 space-y-3">
        {filtered.map((s) => {
          const isPaid = s.paid_subscription === 1;
          return (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    navigate(`/community/authors/${s.author_user_id}`)
                  }
                >
                  {s.author_image_url ? (
                    <img
                      src={s.author_image_url}
                      alt={s.author_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark flex items-center justify-center text-xs">
                      {s.author_name.charAt(0)}
                    </div>
                  )}
                </button>

                <div className="min-w-0">
                  <p className="font-medium truncate">{s.author_name}</p>

                  <p className="text-xs opacity-60">
                    {!s.paid_subscription
                      ? "Free"
                      : `${s.type === "monthly" ? "Monthly" : s.type === "annual" ? "Annual" : "VIP"} · ${
                          s.cancel_at_period_end
                            ? `Ends ${formatDate(s.current_period_end)}`
                            : "Renews monthly"
                        }`}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <button
                  onClick={() => toggleMenu(s.id)}
                  className="w-full py-2 rounded-lg bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-sm flex items-center justify-center gap-2"
                >
                  <MoreHorizontal size={16} />
                  Options
                </button>

                {openMenuId === s.id && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-dashboard-border-light dark:border-dashboard-border-dark">
                    {/* ALWAYS */}
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        navigate(`/community/authors/${s.author_user_id}`);
                      }}
                      className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                    >
                      View author
                    </button>

                    {/* PAID ONLY */}
                    {isPaid && (
                      <>
                        {/* <button
                          onClick={() => {
                            setOpenMenuId(null);
                            navigate(`/subscriptions/${s.id}/change-plan`);
                          }}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                        >
                          Change plan
                        </button> */}

                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            setCancelTarget(s);
                            setCancelModalOpen(true);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-500/10"
                        >
                          Cancel subscription
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-sm opacity-60 px-4 py-6">Loading subscriptions…</p>
      )}

      {cancelModalOpen && cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark p-6">
            <h2 className="text-lg font-semibold">Cancel subscription?</h2>

            <p className="mt-2 text-sm opacity-70">
              You’ll keep access until the end of the current billing period.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2 rounded-lg border"
              >
                Keep subscription
              </button>

              <button
                onClick={() => {
                  openCancelModal(cancelTarget);
                  setCancelModalOpen(false);
                  setCancelTarget(null);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white"
              >
                Cancel anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
