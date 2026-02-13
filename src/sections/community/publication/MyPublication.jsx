import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import PublicationHeader from "./PublicationHeader";
import axiosInstance from "../../../api/axios";
import { PublicationListItem } from "./PublicationListItem";
import { FeaturedPost } from "./FeaturedPost";
import { getShareUrl } from "../../../helpers/getShareUrl";

export default function MyPublication() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedPostId, setCopiedPostId] = useState(null);

  const LIMIT = 10;

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    loadPublication(true);
  }, [userId]);

  async function loadPublication(initial = false) {
    if (!hasMore && !initial) return;

    initial ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await axiosInstance.get(
        `/community/authors/${userId}/publication`,
        {
          params: {
            limit: LIMIT,
            offset: initial ? 0 : offset,
          },
        },
      );

      if (initial) {
        setProfile(res.data.profile);
        setPosts(res.data.posts || []);
        setOffset(res.data.posts.length);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
        setOffset((prev) => prev + res.data.posts.length);
      }

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to load publication");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadPublication(false);
        }
      },
      { rootMargin: "200px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, offset]);

  const handleToggleLike = async (e, post) => {
    e.preventDefault();
    e.stopPropagation();

    if (!post?.id) return;

    try {
      if (post.has_liked) {
        await axiosInstance.delete("/community/delete-like", {
          data: {
            targetType: "post",
            targetId: post.id,
          },
        });
      } else {
        await axiosInstance.post("/community/likes", {
          targetType: "post",
          targetId: post.id,
        });
      }

      // update publication posts locally
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                has_liked: post.has_liked ? 0 : 1,
                like_count: Math.max(
                  (p.like_count || 0) + (post.has_liked ? -1 : 1),
                  0,
                ),
              }
            : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Failed to update like");
    }
  };

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

  if (loading) {
    return <div className="p-6 opacity-60">Loading…</div>;
  }

  if (!posts.length) {
    return <div className="p-6 opacity-60">No posts yet</div>;
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      <div className="max-w-6xl mx-auto px-0 py-8">
        <PublicationHeader profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 sm:gap-12">
          {/* LEFT – Featured */}
          <FeaturedPost
            post={featured}
            authorName={profile?.name}
            authorId={profile.id}
            onLike={handleToggleLike}
            onShare={handleShare}
            copiedPostId={copiedPostId}
          />

          {/* RIGHT – List */}
          <div className="space-y-8">
            {rest.map((post) => (
              <PublicationListItem
                key={post.id}
                post={post}
                authorId={profile.id}
                authorName={profile?.name}
                onLike={handleToggleLike}
                onShare={handleShare}
                copiedPostId={copiedPostId}
              />
            ))}

            {hasMore && <div ref={observerRef} className="h-10" />}

            {loadingMore && (
              <p className="text-xs opacity-50 text-center">
                Loading more articles…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
