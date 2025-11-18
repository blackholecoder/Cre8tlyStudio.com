import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="w-full flex justify-center items-center min-h-[80vh] px-6 py-12">
      {/* 🔥 Background Container */}
      <div className="w-full max-w-2xl bg-gray-900/40 border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        
        <h1 className="text-2xl font-bold mb-6 text-center">
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
                {n.actor_image && (
                  <img
                    src={n.actor_image}
                    className="w-10 h-10 rounded-full object-cover"
                  />
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
