import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { Img } from "react-image";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/notifications");
        setItems(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    load();
  }, []);

  const openNotification = async (notif) => {
    if (notif.post_id) {
      navigate(
        `/community/post/${notif.post_id}?highlight=${notif.reference_id}`
      );
    }
  };

  useEffect(() => {
    // Always restore scrolling when this page mounts
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";

    return () => {
      // Ensure scroll is restored if you navigate away and come back
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center min-h-[80vh] px-6 py-12">
      {/* 🔥 Background Container */}
      <div
        className="
        w-full max-w-2xl rounded-2xl p-8 shadow-xl backdrop-blur-sm
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
  "
      >
        <h1
          className="
          text-2xl font-bold mb-6 text-center normal-case
          text-dashboard-text-light
          dark:text-dashboard-text-dark
  "
        >
          Notifications 🔔
        </h1>

        <div className="space-y-4">
          {items.length === 0 && (
            <p
              className="
              text-center py-6
              text-dashboard-muted-light
              dark:text-dashboard-muted-dark
  "
            >
              No notifications yet.
            </p>
          )}

          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => openNotification(n)}
              className="
              w-full text-left p-4 rounded-lg transition
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
              hover:border-green
"
            >
              <div className="flex items-center gap-3">
                {n.actor_image ? (
                  <Img
                    src={n.actor_image}
                    loader={
                      <div
                        className="
                        w-10 h-10 rounded-full object-cover transition-opacity duration-300
                        border border-dashboard-border-light
                        dark:border-dashboard-border-dark
                      animate-pulse"
                      />
                    }
                    unloader={
                      <div
                        className="
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                        bg-dashboard-sidebar-light
                        dark:bg-dashboard-sidebar-dark
                        border border-dashboard-border-light
                        dark:border-dashboard-border-dark
                        text-dashboard-text-light
                        dark:text-dashboard-text-dark
  "
                      >
                        {n.actor_name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    }
                    decode={true}
                    alt="User avatar"
                    className="
                    w-10 h-10 rounded-full object-cover transition-opacity duration-300
                    border border-dashboard-border-light
                    dark:border-dashboard-border-dark
"
                  />
                ) : (
                  <div
                    className="
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    bg-dashboard-sidebar-light
                    dark:bg-dashboard-sidebar-dark
                    border border-dashboard-border-light
                    dark:border-dashboard-border-dark
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark
  "
                  >
                    {n.actor_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div>
                  <p
                    className="
                    text-sm
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark
  "
                  >
                    {n.actor_name ? (
                      <>
                        <span
                          className="
                          font-semibold
                          text-dashboard-text-light
                          dark:text-dashboard-text-dark
  "
                        >
                          {n.actor_name}
                        </span>{" "}
                        {n.message.replace("Someone", "").trim()}
                      </>
                    ) : (
                      n.message
                    )}
                  </p>

                  <p
                    className="
                    text-[11px] mt-1
                    text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
                  "
                  >
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
