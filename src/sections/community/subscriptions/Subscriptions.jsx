import { useEffect, useState } from "react";
import {
  Users,
  MoreHorizontal,
  Search,
  Copy,
  MessageCircle,
  Trash2,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import AddSubscribersModal from "./AddSubscribersModal";
import PendingInvites from "./PendingInvites";
import { useNavigate } from "react-router-dom";

const GRID_COLS = "grid-cols-[48px_2.2fr_140px_160px_160px_120px_48px]";

export default function Subscriptions() {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteRefreshKey, setInviteRefreshKey] = useState(0);

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

  async function fetchSubscribers() {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/community/subscriptions/me");

      setSubscribers(res.data.subscribers || []);
      setCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  function copyEmail(email) {
    navigator.clipboard.writeText(email);
    toast.success("Email copied");
    setOpenMenuId(null);
  }

  function sendMessage(email) {
    toast.info(`Message flow for ${email} (next step)`);
    setOpenMenuId(null);
  }

  async function removeSubscriber(subscriberId) {
    try {
      await axiosInstance.delete(`/community/subscriptions/${subscriberId}`);

      setSubscribers((prev) => prev.filter((s) => s.id !== subscriberId));

      toast.success("Subscriber removed");
    } catch (err) {
      toast.error("Failed to remove subscriber");
    }

    setOpenMenuId(null);
  }

  {
    loading && <p className="text-sm opacity-60 px-4">Loading subscribers…</p>;
  }

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-dashboard-border-light dark:border-dashboard-border-dark px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Subscribers</h1>
            <p className="text-xs opacity-60">{count} subscribers</p>
          </div>

          <button
            onClick={() => setInviteOpen(true)}
            className="hidden md:inline-flex px-3 py-2 rounded-lg text-sm bg-blue text-white hover:opacity-90"
          >
            Add subscribers
          </button>
        </div>
      </div>
      {/* Mobile action bar */}
      <div className="md:hidden px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
        <button
          onClick={() => setInviteOpen(true)}
          className="
      w-full
      py-2.5
      rounded-lg
      text-sm
      font-medium
      bg-blue
      text-white
      hover:opacity-90
    "
        >
          Add subscribers
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
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

      {/* Desktop grid */}

      <div className="hidden md:block px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`
          grid ${GRID_COLS}
          items-center
          px-4 py-3
          text-xs
          font-medium
          text-white/50
          bg-dashboard-hover-light
          dark:bg-dashboard-hover-dark
          rounded-t-xl
          border
          border-dashboard-border-light
          dark:border-dashboard-border-dark
        `}
        >
          {/* Checkbox */}
          <div className="flex justify-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-transparent accent-white/70"
            />
          </div>

          <div>Subscriber</div>
          <div>Type</div>
          <div className="text-center">Activity</div>
          <div className="flex items-center gap-1">Start date</div>
          <div className="text-right">Revenue</div>
          <div />
        </div>

        {/* Rows */}
        <div className="space-y-1 mt-1">
          {filtered.map((s) => (
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
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-transparent accent-white/70"
                />
              </div>
              {/* Subscriber */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!s.has_profile) {
                      toast.info("This author hasn’t set up their profile yet");
                      return;
                    }

                    navigate(`/community/authors/${s.id}`);
                  }}
                  className="
                  flex-shrink-0"
                >
                  {s.profile_image_url ? (
                    <img
                      src={s.profile_image_url}
                      alt={s.email}
                      className="
                      w-8 h-8
                      rounded-full
                      object-cover
                      border
                      border-dashboard-border-light
                      dark:border-dashboard-border-dark
                    "
                    />
                  ) : (
                    <div
                      className="
                      w-8 h-8
                      rounded-full
                      bg-dashboard-hover-light
                      dark:bg-dashboard-hover-dark
                      flex
                      items-center
                      justify-center
                      text-xs
                    "
                    >
                      {s.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                <span className="text-sm truncate">{s.email}</span>
              </div>

              {/* Type */}
              <div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    s.type === "Monthly Paid"
                      ? "bg-green/20 text-green"
                      : "bg-gray-500/20"
                  }`}
                >
                  {s.type}
                </span>
              </div>

              {/* Activity */}
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={10}
                    className={
                      i <= s.activity ? "text-yellow fill-yellow" : "opacity-30"
                    }
                  />
                ))}
              </div>

              {/* Start date */}
              <div className="text-sm text-white/70">
                {formatDate(s.created_at)}
              </div>

              {/* Revenue */}
              <div className="text-sm tabular-nums text-right text-white/70">
                ${s.revenue.toFixed(2)}
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
                absolute
                top-10
                right-0
                w-44
                rounded-xl
                shadow-xl
                z-50
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border
                border-dashboard-border-light
                dark:border-dashboard-border-dark
                transition-all duration-150
              "
                  >
                    <button
                      onClick={() => copyEmail(s.email)}
                      className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                    >
                      <Copy size={14} />
                      Copy email
                    </button>
                    <button
                      onClick={() => sendMessage(s.email)}
                      className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                    >
                      <MessageCircle size={14} />
                      Send message
                    </button>
                    <button
                      onClick={() => removeSubscriber(s.id)}
                      className="w-full px-4 py-2 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {openMenuId && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenMenuId(null)}
          />
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden px-4 space-y-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl border border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (!s.has_profile) {
                        toast.info(
                          "This author hasn’t set up their profile yet",
                        );
                        return;
                      }

                      navigate(`/community/authors/${s.id}`);
                    }}
                    className="
                    flex-shrink-0"
                  >
                    {s.profile_image_url ? (
                      <img
                        src={s.profile_image_url}
                        alt={s.email}
                        className="
                        w-8 h-8
                        rounded-full
                        object-cover
                        border
                        border-dashboard-border-light
                        dark:border-dashboard-border-dark
                      "
                      />
                    ) : (
                      <div
                        className="
                        w-8 h-8
                        rounded-full
                        bg-dashboard-hover-light
                        dark:bg-dashboard-hover-dark
                        flex
                        items-center
                        justify-center
                        text-xs
                      "
                      >
                        {s.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  <div>
                    <p className="font-medium">{s.email}</p>
                    <p className="text-xs opacity-60">
                      Started {formatDate(s.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i <= s.activity ? "text-yellow fill-yellow" : "opacity-30"
                  }
                />
              ))}
            </div>

            <p className="mt-1 text-xs">Revenue ${s.revenue.toFixed(2)}</p>
            {/* Mobile menu button */}
            <div onClick={(e) => e.stopPropagation()} className="mt-3">
              <button
                onClick={() => toggleMenu(s.id)}
                className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-2
                rounded-lg
                text-sm
                bg-dashboard-hover-light
                dark:bg-dashboard-hover-dark
                hover:opacity-90
                transition-all duration-150
              "
              >
                <MoreHorizontal size={16} />
                Options
              </button>

              {openMenuId === s.id && (
                <div
                  className="
                  mt-2
                  w-full
                  rounded-xl
                  shadow-xl
                  bg-dashboard-sidebar-light
                  dark:bg-dashboard-sidebar-dark
                  border
                  border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  overflow-hidden
                "
                >
                  <button
                    onClick={() => copyEmail(s.email)}
                    className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  >
                    Copy email
                  </button>
                  <button
                    onClick={() => sendMessage(s.email)}
                    className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  >
                    Send message
                  </button>
                  <button
                    onClick={() => removeSubscriber(s.id)}
                    className="w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 max-w-6xl mx-auto mt-10">
        <PendingInvites refreshKey={inviteRefreshKey} />
      </div>

      <AddSubscribersModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => {
          fetchSubscribers();
          setInviteRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
