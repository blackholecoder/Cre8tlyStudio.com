import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { headerLogo } from "../../assets/images";

export default function CommunityHome() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const [viewedTopics, setViewedTopics] = useState(new Set());

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await axiosInstance.get("/community/views");
        // returns: { viewedTopics: ["id1", "id2", ...] }
        setViewedTopics(new Set(res.data.viewedTopics));
      } catch (err) {
        console.error("Failed to load viewed topics:", err);
      }
    };

    fetchViews();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axiosInstance.get("/community/topics");
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    };

    fetchTopics();
  }, []);

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
    <div
      className="
      w-full flex justify-center items-start min-h-screen px-6 py-20
    bg-dashboard-bg-light
    dark:bg-dashboard-bg-dark
  "
    >
      <div
        className="
      bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light
      dark:border-dashboard-border-dark
      rounded-xl p-10 backdrop-blur-sm shadow-xl space-y-10
  "
      >
        {/* Logo */}
        <div className="flex items-center justify-center text-center">
          <img
            src={headerLogo}
            alt="Cre8tly"
            width={100}
            height={100}
            className="
    block
    select-none
  "
          />
        </div>

        {/* Page Title */}
        <h1
          className="
          text-3xl font-bold mb-4 pb-8 text-center normal-case
          text-dashboard-text-light
          dark:text-dashboard-text-dark
  "
        >
          Cre8tly Community 💬
        </h1>

        {/* Scrollable Topics */}
        <div className="max-w-5xl w-full overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/community/topic/${t.id}`)}
                className="
                relative p-6 rounded-xl transition-all text-left
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                hover:border-green
                hover:shadow-[0_0_12px_rgba(34,197,94,0.3)]
"
              >
                {/* NEW BADGE */}
                {t.has_new && (
                  <span className="absolute top-3 right-3 bg-green text-black text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    NEW
                  </span>
                )}

                <h2
                  className="
                  text-xl font-semibold mb-2
                text-dashboard-text-light
                dark:text-dashboard-text-dark
  "
                >
                  {t.name}
                </h2>
                <p
                  className="
                 text-sm
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
  "
                >
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
