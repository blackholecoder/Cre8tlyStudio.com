import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import {
  Heart,
  Eye,
  Share2,
  Check,
  MessageSquare,
  MessageSquareLock,
} from "lucide-react";
import { MobilePostCard } from "./MobilePostCard";
import { getShareUrl } from "../../../helpers/getShareUrl";
import { timeAgo } from "../../../helpers/date";

export default function Saved() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [copiedPostId, setCopiedPostId] = useState(null);

  useEffect(() => {
    fetchSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSaved() {
    if (!hasMore) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/community/saved-user-bookmarks?page=${page}`,
      );

      setPosts((prev) => [...prev, ...(res.data.posts || [])]);

      if (res.data.nextPage) {
        setPage(res.data.nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load saved posts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostClick(postId) {
    try {
      await axiosInstance.post(`/community/posts/${postId}/view`);
    } catch {
      // silent
    }

    navigate(`/community/post/${postId}`);
  }

  const handleShare = async (e, post) => {
    e.preventDefault();
    e.stopPropagation();

    if (!post) return;

    const shareUrl = getShareUrl(post, "post");

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
    } catch {
      toast.error("Failed to update like");
    }
  };

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

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold">Saved</h1>
        </div>
      </div>

      {/* List */}
      <div className="px-0 py-4 pb-24 max-w-3xl mx-auto space-y-2">
        {loading && posts.length === 0 && (
          <p className="text-sm opacity-60">Loading saved posts…</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-sm opacity-60">
            Posts you save to read later will show up here.
          </p>
        )}

        {posts.map((post) => (
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
                {/* LEFT */}
                <div
                  onClick={() => handlePostClick(post.id)}
                  className="min-w-0 cursor-pointer"
                >
                  {/* AVATAR + AUTHOR */}
                  <div className="flex items-start gap-3 mb-3">
                    {post.author_image ? (
                      <img
                        src={post.author_image}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
                    )}

                    <div>
                      <div className="text-xs font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
                        {post.author}
                      </div>

                      <div className="text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
                        {timeAgo(post.created_at)}
                      </div>
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
                mb-3
              "
                    >
                      {post.subtitle}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="flex items-center gap-6 text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} className="opacity-70" />
                      <span>{post.views ?? 0}</span>
                    </div>

                    <button
                      onClick={(e) => togglePostLike(e, post)}
                      className="flex items-center gap-1.5 hover:opacity-80 transition"
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
                      className="flex items-center gap-1.5 hover:opacity-80 transition"
                    >
                      {isFeedCommentsLocked(post) ? (
                        <MessageSquareLock size={14} className="opacity-70" />
                      ) : (
                        <MessageSquare size={14} className="opacity-70" />
                      )}
                      <span>{post.comment_count ?? 0}</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(e, post)}
                      className="flex items-center gap-1.5 hover:opacity-80 transition"
                    >
                      {copiedPostId === post.id ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Share2 size={14} className="opacity-70" />
                      )}
                    </button>
                  </div>
                </div>

                {/* IMAGE */}
                <div
                  className="
            w-16 h-16
            rounded-lg
            overflow-hidden
            flex-shrink-0
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
        ))}

        {hasMore && !loading && (
          <button
            onClick={fetchSaved}
            className="w-full py-3 text-sm opacity-60 hover:opacity-100 transition"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
