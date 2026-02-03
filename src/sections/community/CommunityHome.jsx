import { useEffect, useState, useMemo, useRef } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { headerLogo } from "../../assets/images";
import { Check, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CommunityHome() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const [viewedTopics, setViewedTopics] = useState(new Set());

  const [posts, setPosts] = useState([]);
  const [activeTopic, setActiveTopic] = useState("all");

  const [topicsOpen, setTopicsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [recap, setRecap] = useState({
    hasActivity: false,
    summary: {
      commentsOnYourPosts: 0,
      repliesToYourComments: 0,
      mentions: 0,
    },
  });
  const [recapDismissed, setRecapDismissed] = useState(false);

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
    const fetchRecap = async () => {
      try {
        const res = await axiosInstance.get("/community/recap");

        if (res.data?.hasActivity) {
          setRecap(res.data);
        }
      } catch (err) {
        // recap should never block the page
        console.error("Failed to fetch recap:", err);
      }
    };

    fetchRecap();
  }, []);

  const dismissRecap = async () => {
    setRecapDismissed(true);

    try {
      await axiosInstance.post("/community/mark-seen");
    } catch {
      // ignore, UI already updated
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

  const handleShare = async (e, post) => {
    e.stopPropagation(); // 🚫 prevents post navigation

    const shareUrl = `${window.location.origin}/p/${post.slug}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedPostId(post.id);

      setTimeout(() => setCopiedPostId(null), 1500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const togglePostLike = async (e, post) => {
    e.stopPropagation(); // ⛔ prevent navigation

    if (!post?.id) return;

    try {
      if (post.has_liked) {
        await axiosInstance.delete(`/community/${post.id}/like`);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  has_liked: 0,
                  like_count: Math.max((p.like_count || 1) - 1, 0),
                }
              : p,
          ),
        );
      } else {
        await axiosInstance.post(`/community/${post.id}/like`);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  has_liked: 1,
                  like_count: (p.like_count || 0) + 1,
                }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle post like:", err);
      toast.error("Failed to update like");
    }
  };

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
    w-full min-h-screen
    px-0 py-0
    bg-dashboard-bg-light
    dark:bg-dashboard-bg-dark
  "
    >
      {/* Header */}
      <div className="w-full flex justify-center">
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
            The Messy Attic
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
            where writers come together to share work, encourage one another,
            <br />
            and grow through honest feedback and connection.
          </p>

          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => navigate("/community/create-post")}
              className="
              w-full sm:w-auto
              px-6 py-4 sm:py-3
              rounded-xl
              font-semibold
              bg-green text-black
              hover:opacity-90
              transition
              text-center shadow-sm
            "
            >
              Write a post
            </button>
          </div>

          {recap.hasActivity && !recapDismissed && (
            <div className="mb-6">
              <div
                className="
                max-w-4xl mx-auto
                rounded-xl
                border border-dashboard-border-light dark:border-dashboard-border-dark
                bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                p-5
                shadow-sm
                flex flex-col gap-3
              "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
                      Welcome back
                    </h3>
                    <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-1">
                      Here’s what’s happened since your last visit.
                    </p>
                  </div>

                  <button
                    onClick={dismissRecap}
                    className="
            text-xs
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
            hover:opacity-80
          "
                  >
                    Dismiss
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  {recap.summary.commentsOnYourPosts > 0 && (
                    <button
                      onClick={dismissRecap}
                      className="block text-left hover:underline"
                    >
                      💬 {recap.summary.commentsOnYourPosts} new comment
                      {recap.summary.commentsOnYourPosts > 1 ? "s" : ""} on your
                      posts
                    </button>
                  )}

                  {recap.summary.repliesToYourComments > 0 && (
                    <button
                      onClick={dismissRecap}
                      className="block text-left hover:underline"
                    >
                      ↩️ {recap.summary.repliesToYourComments} repl
                      {recap.summary.repliesToYourComments > 1 ? "ies" : "y"} to
                      your comments
                    </button>
                  )}

                  {recap.summary.mentions > 0 && (
                    <button
                      onClick={dismissRecap}
                      className="block text-left hover:underline"
                    >
                      🔔 You were mentioned {recap.summary.mentions} time
                      {recap.summary.mentions > 1 ? "s" : ""}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Topics */}
          <div
            ref={dropdownRef}
            className="relative mb-6 flex-shrink-0 flex justify-center"
          >
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
          <div className="w-full mt-4">
            <div className="max-w-4xl mx-auto space-y-2 px-0 sm:px-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="
              w-full
              px-4 py-3
              sm:px-6 sm:py-4
              lg:px-8 lg:py-6
              border-b border-dashboard-border-light
              dark:border-dashboard-border-dark
              hover:bg-dashboard-hover-light
              dark:hover:bg-dashboard-hover-dark
              transition
            "
                >
                  <div className="grid grid-cols-[1fr_auto] gap-3 sm:gap-4 lg:gap-6 items-start">
                    {/* Post image */}

                    {/* Right content TEXT BLOCK */}
                    <div
                      onClick={() => handlePostClick(post.id)}
                      className="min-w-0 cursor-pointer group"
                    >
                      <h3
                        className="
                    text-base sm:text-lg font-semibold
                    text-dashboard-text-light dark:text-dashboard-text-dark
                    line-clamp-1 lg:line-clamp-2
                    group-hover:underline
                    
                  "
                      >
                        {post.title}
                      </h3>

                      {post.subtitle && (
                        <p
                          className="
                        mt-1 text-sm
                        text-dashboard-muted-light dark:text-dashboard-muted-dark
                        line-clamp-1 lg:line-clamp-2
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
                      <div className="grid grid-cols-4 mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                        <div className="flex items-center justify-center gap-[3px]">
                          <Eye size={14} className="opacity-70" />
                          <span>{post.views ?? 0}</span>
                        </div>

                        <button
                          onClick={(e) => togglePostLike(e, post)}
                          className="flex items-center justify-center gap-[3px] hover:opacity-80 transition"
                        >
                          <Heart
                            size={14}
                            className={`${
                              post.has_liked
                                ? "text-red-500 fill-red-500"
                                : "opacity-70"
                            }`}
                          />
                          <span>{post.like_count ?? 0}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePostClick(post.id);
                          }}
                          className="flex items-center justify-center gap-[3px] hover:opacity-80 transition"
                        >
                          <MessageCircle size={14} className="opacity-70" />
                          <span>{post.comment_count ?? 0}</span>
                        </button>

                        <button
                          onClick={(e) => handleShare(e, post)}
                          className="flex items-center justify-center gap-[3px] hover:opacity-80 transition"
                        >
                          {copiedPostId === post.id ? (
                            <>
                              <Check size={14} className="text-green-500" />
                              <span className="text-green-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 size={14} className="opacity-70" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div
                      className="
                  w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                  rounded-lg
                  flex-shrink-0
                  border border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  overflow-hidden
                  bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                "
                    >
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                      w-full h-full
                      flex items-center justify-center
                      bg-gradient-to-br
                      from-sky-400/80
                      via-sky-300/90
                      to-blue/80
                    "
                        >
                          <span
                            className="
                        text-[10px] sm:text-xs
                        font-medium
                        uppercase
                        tracking-wide
                       text-dashboard-text-light dark:text-dashboard-text-dark
                        select-none
                      "
                          >
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
