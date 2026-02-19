import { useRef, useState, useEffect, useCallback } from "react";
import { FragmentItem } from "../fragments/FragmentItem";
import { MobilePostCard } from "../posts/MobilePostCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { Ellipsis } from "lucide-react";

export default function AuthorFeed({ userId, isOwner = false }) {
  const PAGE_SIZE = 20;
  const loadMoreRef = useRef(null);

  const [feedItems, setFeedItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

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

        const res = await axiosInstance.get(
          `/community/authors/${userId}/feed`,
          {
            params: {
              limit: PAGE_SIZE,
              offset: reset ? 0 : offset,
            },
          },
        );

        const newItems = res.data.items || [];

        setFeedItems((prev) => (reset ? newItems : [...prev, ...newItems]));

        setOffset((prev) => prev + newItems.length);

        if (!res.data.hasMore) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load author feed:", err);
      } finally {
        setLoadingFeed(false);
      }
    },
    [PAGE_SIZE, offset, hasMore, loadingFeed, userId],
  );

  useEffect(() => {
    function closeMenu() {
      setOpenMenuId(null);
    }

    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  function isFeedCommentsLocked(post) {
    if (post.is_owner === 1) return false;
    if (post.comments_locked === 1) return true;
    if (post.comments_visibility === "paid") return true;
    if (post.comments_visibility === "private" && post.is_subscribed !== 1) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchFeed(true);
  }, [userId]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && hasMore && !loadingFeed) {
          fetchFeed();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingFeed, fetchFeed]);

  const togglePostLike = async (post) => {
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

      setFeedItems((prev) =>
        prev.map((item) =>
          item.type === "post" && item.data.id === post.id
            ? {
                ...item,
                data: {
                  ...item.data,
                  has_liked: post.has_liked ? 0 : 1,
                  like_count:
                    (item.data.like_count || 0) + (post.has_liked ? -1 : 1),
                },
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Like failed:", err);
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
      console.error("Fragment like failed:", err);
    }
  };

  function getSafePreview(post) {
    if (!post?.body_preview) return "";

    const dividerIndex = post.body_preview.indexOf("data-subscriber-divider");

    if (dividerIndex !== -1) {
      return post.body_preview.substring(0, dividerIndex);
    }

    return post.body_preview;
  }

  return (
    <div className="space-y-4">
      {feedItems.map((item) => {
        if (item.type === "post") {
          const post = item.data;

          return (
            <div key={post.id} className="relative">
              <MobilePostCard
                post={{
                  ...post,
                  body_preview: getSafePreview(post),
                }}
                onOpen={() => navigate(`/community/post/${post.id}`)}
                onLike={(e) => {
                  e?.stopPropagation?.();
                  togglePostLike(post);
                }}
                isCommentsLocked={isFeedCommentsLocked(post)}
              />

              {isOwner && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === post.id ? null : post.id);
                    }}
                    className="p-2 rounded-md hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  >
                    <Ellipsis size={18} />
                  </button>

                  {openMenuId === post.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
                      absolute right-0 mt-2 z-30
                      w-48
                      rounded-xl
                      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                      border border-dashboard-border-light dark:border-dashboard-border-dark
                      shadow-xl
                      overflow-hidden
                    "
                    >
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          navigate(`/community/edit-post/${post.id}`);
                        }}
                        className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          // add delete logic if needed
                        }}
                        className="w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        if (item.type === "fragment") {
          return (
            <div key={item.data.id} className="relative">
              <FragmentItem
                fragment={item.data}
                onOpen={() => navigate(`/community/fragments/${item.data.id}`)}
                onToggleLike={() => toggleFragmentLike(item.data)}
              />

              {isOwner && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === item.data.id ? null : item.data.id,
                      );
                    }}
                    className="p-2 rounded-md hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  >
                    <Ellipsis size={18} />
                  </button>

                  {openMenuId === item.data.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
            absolute right-0 mt-2 z-30
            w-48
            rounded-xl
            bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light dark:border-dashboard-border-dark
            shadow-xl
            overflow-hidden
          "
                    >
                      <button
                        onClick={() =>
                          navigate(`/community/fragments/edit/${item.data.id}`)
                        }
                        className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          // add delete logic
                        }}
                        className="w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}

      {loadingFeed && (
        <div className="text-center text-xs opacity-60 py-4">Loading more…</div>
      )}

      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
