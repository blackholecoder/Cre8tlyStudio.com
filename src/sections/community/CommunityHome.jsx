import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { headerLogo } from "../../assets/images";
import {
  Check,
  Eye,
  Heart,
  MessageSquare,
  MessageSquareLock,
  Plus,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import { FragmentItem } from "./fragments/FragmentItem";
import { MobilePostCard } from "./posts/MobilePostCard";
import MobileCreateFAB from "./posts/MobileCreateFAB";
import { formatDate, timeAgo } from "../../helpers/date";

export default function CommunityHome() {
  const PAGE_SIZE = 20;
  const loadMoreRef = useRef(null);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const [viewedTopics, setViewedTopics] = useState(new Set());
  const [feedItems, setFeedItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [activeTopic, setActiveTopic] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const createMenuRef = useRef(null);

  const [showFab, setShowFab] = useState(true);
  const lastScrollY = useRef(0);

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

  const fetchFeed = useCallback(
    async (reset = false) => {
      if (loadingFeed) return;
      if (!reset && !hasMore) return;

      try {
        setLoadingFeed(true);

        if (reset) {
          setOffset(0);
          setHasMore(true);
        }

        const res = await axiosInstance.get("/community/feed", {
          params: {
            limit: PAGE_SIZE,
            offset: reset ? 0 : offset,
          },
        });

        const newItems = res.data.items || [];

        setFeedItems((prev) => (reset ? newItems : [...prev, ...newItems]));

        setOffset((prev) => prev + newItems.length);

        if (!res.data.hasMore) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setLoadingFeed(false);
      }
    },
    [PAGE_SIZE, offset, hasMore, loadingFeed],
  );

  function isFeedCommentsLocked(post) {
    // owner always sees comments
    if (post.is_owner === 1) return false;

    // admin hard lock always wins
    if (post.comments_locked === 1) return true;

    // paid comments are locked in feed
    if (post.comments_visibility === "paid") return true;

    // private comments: lock ONLY if viewer is NOT subscribed
    if (post.comments_visibility === "private" && post.is_subscribed !== 1) {
      return true;
    }

    return false;
  }

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;

      // scrolling down → hide
      if (currentY > lastScrollY.current && currentY > 80) {
        setShowFab(false);
      }

      // scrolling up → show
      if (currentY < lastScrollY.current) {
        setShowFab(true);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && hasMore && !loadingFeed) {
          fetchFeed();
        }
      },
      {
        root: null, // viewport
        rootMargin: "200px", // preload before bottom
        threshold: 0,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingFeed, fetchFeed]);

  const dismissRecap = async () => {
    setRecapDismissed(true);

    try {
      await axiosInstance.post("/community/mark-seen");
    } catch {
      // ignore, UI already updated
    }
  };

  useEffect(() => {
    fetchFeed(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setCreateOpen(false);
      }
    }

    if (createOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [createOpen]);

  const filteredPosts = useMemo(() => {
    const postsOnly = feedItems
      .filter((item) => item.type === "post")
      .map((item) => item.data);

    if (activeTopic === "all") {
      return postsOnly;
    }

    return postsOnly.filter((p) => p.topic_id === activeTopic);
  }, [feedItems, activeTopic]);

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
    e.stopPropagation();

    if (!post?.id) return;

    try {
      if (post.has_liked) {
        await axiosInstance.delete("/community/delete-like", {
          data: { targetType: "post", targetId: post.id },
        });
      } else {
        await axiosInstance.post("/community/likes", {
          targetType: "post",
          targetId: post.id,
        });
      }

      // 🔥 FIX: update feedItems, not posts
      setFeedItems((prev) =>
        prev.map((item) =>
          item.type === "post" && item.data.id === post.id
            ? {
                ...item,
                data: {
                  ...item.data,
                  has_liked: post.has_liked ? 0 : 1,
                  like_count: Math.max(
                    (item.data.like_count || 0) + (post.has_liked ? -1 : 1),
                    0,
                  ),
                },
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle post like:", err);
      toast.error("Failed to update like");
    }
  };

  const toggleFragmentLike = async (fragment) => {
    try {
      if (fragment.has_liked) {
        await axiosInstance.delete("/community/delete-like", {
          data: {
            targetType: "fragment",
            targetId: fragment.id,
          },
        });
      } else {
        await axiosInstance.post("/community/likes", {
          targetType: "fragment",
          targetId: fragment.id,
        });
      }

      setFeedItems((prev) =>
        prev.map((item) =>
          item.type === "fragment" && item.data.id === fragment.id
            ? {
                ...item,
                data: {
                  ...item.data,
                  has_liked: fragment.has_liked ? 0 : 1,
                  like_count:
                    (item.data.like_count || 0) + (fragment.has_liked ? -1 : 1),
                },
              }
            : item,
        ),
      );
    } catch (err) {
      toast.error("Failed to update fragment like");
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
              alt="Messy Attic Logo"
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
            where writers come together
          </p>

          <div
            ref={createMenuRef}
            className="hidden md:flex justify-center mb-8 relative"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // 👈 THIS IS THE KEY
                setCreateOpen((v) => !v);
              }}
              className="
              w-full
              px-6 py-4
              rounded-xl

              sm:w-12 sm:h-12
              sm:px-0 sm:py-0
              sm:rounded-xl

              flex items-center justify-center
              font-semibold
              bg-green
              text-black
              hover:opacity-90
              transition
              shadow-sm
            "
              aria-label="Create"
            >
              <Plus
                size={22}
                className={`transition-transform ${
                  createOpen ? "rotate-45" : ""
                }`}
              />
            </button>

            {createOpen && (
              <div
                className="
                absolute top-full mt-2
                w-40
                rounded-lg
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                shadow-xl
                overflow-hidden
                z-50
              "
              >
                <button
                  onClick={() => {
                    setCreateOpen(false);
                    navigate("/community/create-post");
                  }}
                  className="
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-dashboard-hover-light
                  dark:hover:bg-dashboard-hover-dark
                "
                >
                  Post
                </button>

                <button
                  onClick={() => {
                    setCreateOpen(false);
                    navigate("/community/fragments/create");
                  }}
                  className="
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-dashboard-hover-light
                  dark:hover:bg-dashboard-hover-dark
                "
                >
                  Fragment
                </button>
              </div>
            )}
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
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTopicsOpen(false)}
                />
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
              </>
            )}
          </div>
          <div className="w-full mt-4">
            <div className="max-w-4xl mx-auto space-y-2 px-0 sm:px-6">
              {(activeTopic === "all"
                ? feedItems
                : filteredPosts.map((p) => ({
                    type: "post",
                    data: p,
                  }))
              ).map((item) => {
                if (item.type === "post") {
                  const post = item.data;

                  return (
                    <div key={post.id} className="space-y-2">
                      {/* MOBILE ONLY */}
                      <div className="md:hidden">
                        <MobilePostCard
                          post={post}
                          onOpen={() => handlePostClick(post.id)}
                          onLike={(e) => togglePostLike(e, post)}
                          onShare={(e) => handleShare(e, post)}
                          isCommentsLocked={isFeedCommentsLocked(post)}
                          copiedPostId={copiedPostId}
                        />
                      </div>

                      {/* DESKTOP ONLY */}
                      <div
                        className="
                        hidden md:block
                        px-4 py-4 sm:px-6
                        rounded-lg
                        border border-dashboard-border-light
                        dark:border-dashboard-border-dark
                        bg-dashboard-sidebar-light
                        dark:bg-dashboard-sidebar-dark
                        hover:bg-dashboard-hover-light
                        dark:hover:bg-dashboard-hover-dark
                        transition
                        cursor-pointer
                      "
                      >
                        <div className="grid grid-cols-[1fr_auto] gap-6 items-start">
                          {/* LEFT COLUMN */}
                          <div
                            onClick={() => handlePostClick(post.id)}
                            className="min-w-0 cursor-pointer"
                          >
                            {/* SHARED GRID FOR ALIGNMENT */}
                            <div className="grid grid-cols-[32px_1fr] gap-3">
                              {/* AVATAR */}
                              {post.author_image ? (
                                <img
                                  src={post.author_image}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
                              )}

                              {/* TEXT COLUMN */}
                              <div className="min-w-0">
                                {/* AUTHOR + META */}
                                <div className="mb-2">
                                  <span className="text-xs font-medium text-dashboard-muted-light dark:text-dashboard-muted-dark">
                                    {post.author}
                                  </span>

                                  <div className="flex items-center gap-1 text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
                                    <span>{timeAgo(post.created_at)}</span>
                                    <span>·</span>
                                    <span>{formatDate(post.created_at)}</span>
                                    <span>·</span>
                                    <span>{post.topic_name}</span>
                                  </div>
                                </div>

                                {/* TITLE */}
                                <h3
                                  className="
              text-base sm:text-lg font-semibold
              text-dashboard-text-light dark:text-dashboard-text-dark
              line-clamp-2
              mb-1
            "
                                >
                                  {post.title}
                                </h3>

                                {/* SUBTITLE */}
                                {post.subtitle && (
                                  <p
                                    className="
                text-sm
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
                line-clamp-2
                mb-2
              "
                                  >
                                    {post.subtitle}
                                  </p>
                                )}
                                <p
                                  className="
                                  mb-4
                                  mt-2
                                  text-sm
                                  leading-relaxed
                                  text-dashboard-muted-light
                                  dark:text-dashboard-muted-dark
                                  opacity-60
                                  line-clamp-3
                                "
                                >
                                  {post.body_preview}
                                </p>

                                {/* ACTIONS */}
                                <div className="flex items-center gap-6 text-sm  text-dashboard-muted-light dark:text-dashboard-muted-dark">
                                  <div className="flex items-center gap-[4px]">
                                    <Eye size={14} className="opacity-70" />
                                    <span>{post.views ?? 0}</span>
                                  </div>

                                  <button
                                    onClick={(e) => togglePostLike(e, post)}
                                    className="flex items-center gap-[4px] hover:opacity-80 transition"
                                  >
                                    <Heart
                                      size={14}
                                      className={
                                        post.has_liked
                                          ? "text-red-500 fill-red-500"
                                          : "opacity-70"
                                      }
                                    />
                                    <span>{post.like_count ?? 0}</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePostClick(post.id);
                                    }}
                                    className="flex items-center gap-[4px] hover:opacity-80 transition"
                                  >
                                    {isFeedCommentsLocked(post) ? (
                                      <MessageSquareLock
                                        size={14}
                                        className="opacity-70"
                                      />
                                    ) : (
                                      <MessageSquare
                                        size={14}
                                        className="opacity-70"
                                      />
                                    )}
                                    <span>{post.comment_count ?? 0}</span>
                                  </button>

                                  <button
                                    onClick={(e) => handleShare(e, post)}
                                    className="flex items-center gap-[4px] hover:opacity-80 transition"
                                  >
                                    {copiedPostId === post.id ? (
                                      <Check size={14} className="text-green" />
                                    ) : (
                                      <Share2
                                        size={14}
                                        className="opacity-70"
                                      />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT IMAGE COLUMN */}
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
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[10px] uppercase opacity-70">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === "fragment") {
                  return (
                    <FragmentItem
                      key={item.data.id}
                      fragment={item.data}
                      onOpen={() =>
                        navigate(`/community/fragments/${item.data.id}`)
                      }
                      onToggleLike={() => toggleFragmentLike(item.data)}
                    />
                  );
                }

                return null;
              })}
            </div>
            {loadingFeed && hasMore && (
              <div className="py-4 text-center text-xs opacity-60 text-dashboard-text-light dark:text-dashboard-text-dark">
                Loading more…
              </div>
            )}
            <div ref={loadMoreRef} className="h-10" />
          </div>
        </div>
      </div>
      <MobileCreateFAB
        className={`
    transition-all duration-200 ease-out
    ${showFab ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
  `}
        open={createOpen}
        setOpen={setCreateOpen}
        containerRef={createMenuRef}
        onCreatePost={() => navigate("/community/create-post")}
        onCreateFragment={() => navigate("/community/fragments/create")}
      />
    </div>
  );
}
