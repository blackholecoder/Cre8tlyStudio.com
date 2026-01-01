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
      <div className="w-full max-w-2xl bg-gray-900/40 border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-6 text-center normal-case">
          Notifications 🔔
        </h1>

        <div className="space-y-4">
          {items.length === 0 && (
            <p className="text-gray-400 text-center py-6">
              No notifications yet.
            </p>
          )}

          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => openNotification(n)}
              className="w-full text-left bg-gray-900/70 border border-gray-700 p-4 rounded-lg hover:border-green transition"
            >
              <div className="flex items-center gap-3">
                {n.actor_image ? (
                  <Img
                    src={n.actor_image}
                    loader={
                      <div className="w-10 h-10 rounded-full bg-gray-700/40 animate-pulse" />
                    }
                    unloader={
                      <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                        {n.actor_name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    }
                    decode={true}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-700 transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                    {n.actor_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-300">
                    {n.actor_name ? (
                      <>
                        <span className="font-semibold text-white">
                          {n.actor_name}
                        </span>{" "}
                        {n.message.replace("Someone", "").trim()}
                      </>
                    ) : (
                      n.message
                    )}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
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
