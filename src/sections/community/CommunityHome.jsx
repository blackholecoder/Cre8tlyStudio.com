import { useEffect, useState, useMemo, useRef } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { headerLogo } from "../../assets/images";
import { Eye, MessageCircle } from "lucide-react";

export default function CommunityHome() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const [viewedTopics, setViewedTopics] = useState(new Set());

  const [posts, setPosts] = useState([]);
  const [activeTopic, setActiveTopic] = useState("all");

  const [topicsOpen, setTopicsOpen] = useState(false);
  const dropdownRef = useRef(null);

  async function handlePostClick(postId) {
    try {
      await axiosInstance.post(`/community/posts/${postId}/view`);
    } catch (err) {
      // intentionally silent, view tracking should never block navigation
    }

    navigate(`/community/post/${postId}`);
  }

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/community/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicsOpen(false);
      }
    }

    if (topicsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [topicsOpen]);

  const filteredPosts = useMemo(() => {
    return activeTopic === "all"
      ? posts
      : posts.filter((p) => p.topic_id === activeTopic);
  }, [posts, activeTopic]);

  const generalTopicId = useMemo(() => {
    const general = topics.find((t) => t.slug === "general");
    return general?.id || "";
  }, [topics]);

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

        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => navigate("/community/create-post")}
            className="
    px-6 py-3
    rounded-xl
    font-semibold
    bg-green text-black
    hover:opacity-90
    transition
  "
          >
            Write a post
          </button>
        </div>

        {/* Scrollable Topics */}
        <div ref={dropdownRef} className="relative mb-6 flex-shrink-0">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setTopicsOpen((v) => !v)}
            className="
      w-full sm:w-64
      h-10
      px-4
      flex items-center justify-between
      rounded-lg
      border border-dashboard-border-light dark:border-dashboard-border-dark
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      text-sm font-medium
      text-dashboard-text-light dark:text-dashboard-text-dark
      hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
      transition
    "
          >
            <span>
              {activeTopic === "all"
                ? "All topics"
                : topics.find((t) => t.id === activeTopic)?.name ||
                  "Select topic"}
            </span>

            <svg
              className={`w-4 h-4 transition-transform ${
                topicsOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Menu */}
          {topicsOpen && (
            <div
              className="
        absolute z-50 mt-2 w-full sm:w-64
        rounded-lg
        border border-dashboard-border-light dark:border-dashboard-border-dark
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        shadow-xl
        max-h-[400px] overflow-y-auto
      "
            >
              {/* All */}
              <button
                onClick={() => {
                  setActiveTopic("all");
                  setTopicsOpen(false);
                }}
                className="
          w-full px-4 py-2 text-left text-sm
          hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
        "
              >
                All topics
              </button>

              {/* Topics */}
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTopic(t.id);
                    navigate(`/community/topic/${t.id}`);
                    setTopicsOpen(false);
                  }}
                  className="
            w-full px-4 py-2 text-left text-sm
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
          "
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="
              relative
              w-full text-left
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              p-4 sm:p-5 rounded-xl
              border border-dashboard-border-light dark:border-dashboard-border-dark
              hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
              transition
            "
            >
              <div className="flex gap-4 items-start">
                {/* Post image */}
                {post.image_url && (
                  <div
                    className="
                    w-16 h-16
                    rounded-lg
                    overflow-hidden
                    border border-dashboard-border-light
                    dark:border-dashboard-border-dark
                    flex-shrink-0
                  "
                  >
                    <img
                      src={post.image_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Right content */}
                <div className="flex-1">
                  <h3
                    className="
                    text-base sm:text-lg font-semibold
                    text-dashboard-text-light dark:text-dashboard-text-dark
                    line-clamp-2
                  "
                  >
                    {post.title}
                  </h3>

                  {post.subtitle && (
                    <p
                      className="
                        mt-1 text-sm
                        text-dashboard-muted-light dark:text-dashboard-muted-dark
                        line-clamp-2
                      "
                    >
                      {post.subtitle}
                    </p>
                  )}

                  {/* Author row */}
                  <div className="flex items-center gap-2 mt-2">
                    {post.author_image ? (
                      <img
                        src={post.author_image}
                        alt=""
                        className="
                        w-6 h-6 rounded-full object-cover
                        border border-dashboard-border-light
                        dark:border-dashboard-border-dark
                      "
                      />
                    ) : (
                      <div
                        className="
                        w-6 h-6 rounded-full
                        bg-dashboard-hover-light
                        dark:bg-dashboard-hover-dark
                      "
                      />
                    )}

                    <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      {post.author} · {post.topic_name}
                    </span>
                  </div>
                  {/* Meta stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    <div className="flex items-center gap-[3px]">
                      <Eye size={14} className="opacity-70" />
                      <span>{post.views ?? 0}</span>
                      <span>views</span>
                    </div>

                    <div className="flex items-center gap-[3px]">
                      <MessageCircle size={14} className="opacity-70" />
                      <span>{post.comment_count ?? 0}</span>
                      <span>comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
