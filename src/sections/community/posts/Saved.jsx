import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { Heart, MessageCircle, Bookmark, Eye, Share2 } from "lucide-react";

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
    e.stopPropagation();

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

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold">Saved</h1>
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4 pb-24 max-w-3xl mx-auto space-y-2">
        {loading && posts.length === 0 && (
          <p className="text-sm opacity-60">Loading saved posts…</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-sm opacity-60">
            Posts you save to read later will show up here.
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="
    w-full
    px-4 py-3
    sm:px-6 sm:py-4
    border-b border-dashboard-border-light
    dark:border-dashboard-border-dark
    hover:bg-dashboard-hover-light
    dark:hover:bg-dashboard-hover-dark
    transition
  "
          >
            <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
              {/* TEXT BLOCK */}
              <div
                onClick={() => handlePostClick(post.id)}
                className="min-w-0 cursor-pointer group"
              >
                <h3
                  className="
          text-base sm:text-lg font-semibold
          text-dashboard-text-light dark:text-dashboard-text-dark
          line-clamp-1 sm:line-clamp-2
          group-hover:underline
        "
                >
                  {post.title}
                </h3>

                {post.subtitle && (
                  <p className="mt-1 text-sm line-clamp-1 text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    {post.subtitle}
                  </p>
                )}

                {/* Author */}
                <div className="flex items-center gap-2 mt-2">
                  {post.author_image ? (
                    <img
                      src={post.author_image}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
                  )}

                  <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    {post.author}
                  </span>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-4 mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  <div className="flex items-center justify-center gap-1">
                    <Eye size={14} />
                    {post.views ?? 0}
                  </div>

                  <button
                    onClick={(e) => togglePostLike(e, post)}
                    className="flex items-center justify-center gap-1"
                  >
                    <Heart
                      size={14}
                      className={
                        post.has_liked
                          ? "text-red-500 fill-red-500"
                          : "opacity-70"
                      }
                    />
                    {post.like_count ?? 0}
                  </button>

                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle size={14} />
                    {post.comment_count ?? 0}
                  </div>

                  <button
                    onClick={(e) => handleShare(e, post)}
                    className="flex items-center justify-center gap-1"
                  >
                    {copiedPostId === post.id ? (
                      <Check size={14} className="text-green" />
                    ) : (
                      <Share2 size={14} className="opacity-70" />
                    )}
                  </button>
                </div>
              </div>

              {/* IMAGE */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-dashboard-hover-light dark:bg-dashboard-hover-dark">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs opacity-60">
                    No image
                  </div>
                )}
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
