import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { FragmentItem } from "./FragmentItem";

export default function FragmentFeed() {
  const navigate = useNavigate();

  const LIMIT = 20;

  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const didInitRef = useRef(false);
  const didInitialLoadRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    loadMoreFragments(true);
  }, []);

  const loadMoreFragments = async (initial = false) => {
    if (loadingMore || (!hasMore && !initial)) return;

    if (initial) {
      setLoading(true);
      setOffset(0);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await axiosInstance.get("/fragments/feed", {
        params: {
          limit: LIMIT,
          offset: initial ? 0 : offset,
        },
      });

      console.log("📦 API response", {
        initial,
        offsetUsed: initial ? 0 : offset,
        count: res.data.fragments?.length,
        ids: res.data.fragments?.map((f) => f.id),
      });

      const newFragments = res.data.fragments || [];

      console.log("🧠 before setFragments", {
        existingCount: fragments.length,
        existingIds: fragments.map((f) => f.id),
      });

      setFragments((prev) =>
        initial ? newFragments : [...prev, ...newFragments],
      );

      setOffset((prev) => prev + newFragments.length);

      if (newFragments.length < LIMIT) {
        setHasMore(false);
      }
      if (initial) {
        didInitialLoadRef.current = true;
      }
    } catch (err) {
      console.error("Failed to load fragments:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const toggleFragmentLike = async (fragmentId, hasLiked) => {
    try {
      if (hasLiked) {
        await axiosInstance.delete("/community/delete-like", {
          data: { targetType: "fragment", targetId: fragmentId },
        });
      } else {
        await axiosInstance.post("/community/likes", {
          targetType: "fragment",
          targetId: fragmentId,
        });
      }

      // ✅ update state HERE (where setFragments exists)
      setFragments((prev) =>
        prev.map((f) =>
          f.id === fragmentId
            ? {
                ...f,
                has_liked: !hasLiked,
                like_count: Math.max(
                  (f.like_count || 0) + (hasLiked ? -1 : 1),
                  0,
                ),
              }
            : f,
        ),
      );
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("👀 observer fired", {
          isIntersecting: entries[0].isIntersecting,
          hasMore,
          loadingMore,
          offset,
        });

        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingMore &&
          didInitialLoadRef.current
        ) {
          loadMoreFragments();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  return (
    <div
      className="
        w-full min-h-screen
        px-0 py-0
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
      "
    >
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
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-dashboard-text-light dark:text-dashboard-text-dark mb-2">
            Fragments
          </h1>

          <p className="text-center text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark mb-8">
            Small thoughts, half-ideas, lines that don’t need a home yet.
          </p>

          <div className="flex justify-center mb-10">
            <button
              onClick={() => navigate("/community/fragments/create")}
              className="
              w-full sm:w-auto
              px-5 py-3
              rounded-lg
              text-sm font-medium
              bg-green
              text-black
              hover:bg-green/90
              transition
              active:scale-95
            "
            >
              Write a Fragment
            </button>
          </div>

          {/* Feed */}
          <div className="max-w-3xl mx-auto w-full space-y-2">
            {loading && (
              <p className="text-center text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
                Loading…
              </p>
            )}

            {!loading && fragments.length === 0 && (
              <p className="text-center text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
                No fragments yet.
              </p>
            )}

            {fragments.map((fragment) => (
              <FragmentItem
                key={fragment.id}
                fragment={fragment}
                onOpen={() => navigate(`/community/fragments/${fragment.id}`)}
                onToggleLike={toggleFragmentLike}
              />
            ))}
          </div>
          {hasMore && (
            <div
              ref={observerRef}
              className="h-10 flex items-center justify-center text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark"
            >
              {loadingMore && "Loading more…"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
