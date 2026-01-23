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
    w-full h-screen overflow-hidden
    flex justify-center items-start
    px-6 py-20
    bg-dashboard-bg-light
    dark:bg-dashboard-bg-dark
  "
    >
      <div
        className="
    w-full max-w-5xl

    /* mobile */
    bg-transparent
    border-none
    rounded-none
    shadow-none
    p-0

    /* desktop */
    sm:bg-dashboard-sidebar-light
    sm:dark:bg-dashboard-sidebar-dark
    sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
    sm:rounded-xl
    sm:p-8
    lg:p-10
    sm:shadow-xl
    sm:backdrop-blur-sm

    max-h-[calc(100vh-160px)]
    flex flex-col
  "
      >
        {/* Logo */}
        <div className="flex items-center justify-center text-center">
          <img
            src={headerLogo}
            alt="Cre8tly"
            width={75}
            height={75}
            className="
    block
    select-none
  "
          />
        </div>

        {/* Page Title */}
        <h1
          className="
          text-3xl font-bold text-center normal-case
          text-dashboard-text-light
          dark:text-dashboard-text-dark mb-2
  "
        >
          Cre8tly Community
        </h1>
        <p
          className="
    text-center text-sm sm:text-base
    max-w-xl mx-auto
    text-dashboard-muted-light
    dark:text-dashboard-muted-dark
     mb-8
  "
        >
          A shared space for ideas, questions, discussions, and learning.
        </p>

        {/* Scrollable Topics */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid gap-3 sm:gap-6 md:grid-cols-2 pb-6 pt-6">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/community/topic/${t.id}`)}
                className="
                relative text-left transition-all

                /* mobile */
                bg-transparent
                border-b border-dashboard-border-light
                dark:border-dashboard-border-dark
                rounded-none
                px-1 py-4
                shadow-none
                hover:bg-dashboard-bg-light/40
                dark:hover:bg-dashboard-bg-dark/40

                /* desktop */
                sm:bg-dashboard-sidebar-light
                sm:dark:bg-dashboard-sidebar-dark
                sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
                sm:rounded-xl
                sm:p-6
                sm:hover:border-bookBtnColor
                sm:hover:-translate-y-[2px]
                sm:hover:shadow-lg
              "
              >
                {t.has_new && (
                  <span className="absolute top-3 right-3 bg-green text-black text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    NEW
                  </span>
                )}

                <h2 className="text-xl font-semibold mb-2">{t.name}</h2>

                <p className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
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
