import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

export default function CommunitySubscribers() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const { authorUserId } = useParams();

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    try {
      const url = authorUserId
        ? `/community/subscriptions/authors/${authorUserId}/subscribers`
        : "/community/subscriptions/all-user-subscribers";

      const res = await axiosInstance.get(url);

      setSubscribers(res.data.subscribers || []);
    } catch (err) {
      console.error("Failed to load subscribers", err);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 opacity-60">Loading subscribers…</div>;
  }

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      <div className="max-w-3xl mx-auto px-0 py-14 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-lg font-semibold">Subscribers</h1>
        </div>

        {/* Empty state */}
        {subscribers.length === 0 && (
          <div className="opacity-60 text-sm">
            You don’t have any subscribers yet.
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {subscribers.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (!s.has_profile) {
                  toast.info("This user hasn’t set up a profile yet");
                  return;
                }
                navigate(`/community/authors/${s.id}`);
              }}
              className="
                w-full
                flex items-center gap-4
                p-4
                rounded-xl
                text-left
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border
                border-dashboard-border-light
                dark:border-dashboard-border-dark
                hover:bg-dashboard-hover-light
                dark:hover:bg-dashboard-hover-dark
                transition
              "
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-dashboard-hover-light dark:bg-dashboard-hover-dark flex items-center justify-center">
                {s.profile_image_url ? (
                  <img
                    src={s.profile_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold opacity-50">
                    {s.name?.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{s.name}</span>

                {s.username && (
                  <span className="text-xs opacity-60">@{s.username}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
