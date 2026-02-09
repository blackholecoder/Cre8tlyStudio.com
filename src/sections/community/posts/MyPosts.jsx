import { useEffect, useState, useMemo, useRef } from "react";
import {
  MessageCircle,
  Ellipsis,
  Pencil,
  Link as LinkIcon,
  Trash2,
  Heart,
} from "lucide-react";
import axiosInstance from "../../../api/axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import MobileCreateFAB from "./MobileCreateFAB";

export default function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [topics, setTopics] = useState([]);
  const { postId } = useParams();
  const isEdit = Boolean(postId);
  const [loadingPost, setLoadingPost] = useState(isEdit);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const createMenuRef = useRef(null);

  const [showFab, setShowFab] = useState(true);
  const lastScrollY = useRef(0);

  const [loading, setLoading] = useState(true);

  const menuItem =
    "w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-colors";

  useEffect(() => {
    fetchPosts();
    fetchTopics();
  }, []);

  useEffect(() => {
    function closeMenu() {
      setOpenMenuId(null);
    }
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    async function fetchPost() {
      try {
        const res = await axiosInstance.get(`/community/posts/${postId}`);
        const p = res.data.post;

        setTitle(p.title || "");
        setSubtitle(p.subtitle || "");
        setBody(p.body || "");
        setImagePreview(p.image_url || null);
        setSelectedTopicId(p.topic_id || "");
        setRelatedTopicIds(p.related_topic_ids || []);
      } catch (err) {
        console.error("Failed to load post:", err);
        navigate("/community/my-posts");
      } finally {
        setLoadingPost(false);
      }
    }

    fetchPost();
  }, [postId, isEdit]);

  async function fetchTopics() {
    try {
      const res = await axiosInstance.get("/community/topics");
      setTopics(res.data.topics || []);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/community/posts/user");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

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

  function confirmDeletePost(postId) {
    const toastId = toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm font-medium">Delete this post?</p>

          <p className="text-xs opacity-70">This action cannot be undone.</p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeToast}
              className="
              px-3 py-1.5 text-xs rounded-md
              border border-dashboard-border-light
              hover:bg-dashboard-hover-light
            "
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await axiosInstance.delete(`/community/posts/${postId}`);

                  // Optimistic UI
                  setPosts((prev) => prev.filter((p) => p.id !== postId));
                  setOpenMenuId(null);

                  toast.dismiss(toastId);
                  toast.success("Post deleted");
                } catch (err) {
                  console.error("Failed to delete post:", err);
                  toast.error("Failed to delete post");
                }
              }}
              className="
              px-3 py-1.5 text-xs rounded-md
              bg-red-600 text-white
              hover:bg-red-700
            "
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        closeButton: false,
        className: "rounded-xl",
      },
    );
  }

  function copyPostLink(post) {
    const url = `${window.location.origin}/p/${post.slug}`;

    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Failed to copy link"),
    );

    setOpenMenuId(null);
  }

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;

    const q = search.toLowerCase();

    return posts.filter((post) => {
      return (
        post.title?.toLowerCase().includes(q) ||
        post.subtitle?.toLowerCase().includes(q)
      );
    });
  }, [posts, search]);

  if (loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-60">Loading post…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      {/* Header */}

      <div className="sticky top-0 z-20 px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold">My Posts</h1>

          <button
            onClick={() => navigate("/community/create-post")}
            className="
    hidden md:inline-flex
    px-3 py-2 rounded-lg text-sm font-medium
    bg-dashboard-text-light dark:bg-dashboard-text-dark
    text-dashboard-bg-light dark:text-dashboard-bg-dark
    hover:opacity-90
    transition
  "
          >
            Create new
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4 pb-24 max-w-3xl mx-auto space-y-2">
        {loading && <p className="text-sm opacity-60">Loading posts…</p>}

        {!loading && filteredPosts.length === 0 && (
          <p className="text-sm opacity-60">
            {search
              ? "No posts match your search."
              : "You haven’t posted anything yet."}
          </p>
        )}

        <div className="max-w-3xl mx-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your posts by title or subtitle…"
            className="
        w-full
        px-4 py-2.5
        rounded-lg
        text-sm
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        placeholder:text-dashboard-muted-light
        dark:placeholder:text-dashboard-muted-dark
        focus:outline-none
        focus:ring-2
        focus:ring-green
      "
          />
        </div>

        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="
              flex items-center gap-4 p-4 rounded-xl
              border border-dashboard-border-light dark:border-dashboard-border-dark
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
            "
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-md overflow-hidden bg-dashboard-hover-light dark:bg-dashboard-hover-dark flex-shrink-0">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-50">
                  —
                </div>
              )}
            </div>

            {/* Content + right stats */}
            <div className="flex-1 flex items-center gap-4">
              {/* Left text */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold line-clamp-1">
                  <Link
                    to={`/community/post/${post.id}`}
                    className="
                    hover:underline
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark
                  "
                  >
                    {post.title}
                  </Link>
                </h3>

                {post.subtitle && (
                  <p
                    className="
                    mt-0.5
                    text-xs
                    leading-snug
                    line-clamp-1
                    text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
                  "
                  >
                    {post.subtitle}
                  </p>
                )}

                <p className="mt-1 text-xs opacity-60">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>

                {/* Left stats */}
                <div className="mt-2 flex items-center gap-6 text-sm sm:text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  <div className="flex items-center gap-1.5">
                    <Heart
                      size={16}
                      className={
                        post.has_liked
                          ? "text-red-500 fill-red-500"
                          : "opacity-70"
                      }
                    />
                    <span>{post.like_count ?? 0}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={16} className="opacity-70" />
                    <span>{post.comment_count ?? 0}</span>
                  </div>

                  {post.is_pinned === 1 && <span>Pinned</span>}
                  {post.is_locked === 1 && <span>Locked</span>}
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Views */}
                <div className="flex flex-col items-center text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  <span className="text-sm font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
                    {post.views}
                  </span>
                  <span>views</span>
                </div>

                {/* Ellipsis */}
                <div className="relative">
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
                      absolute left-1/2 mt-2 -translate-x-1/2 z-30
                      w-56
                      rounded-xl
                      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                      border border-dashboard-border-light dark:border-dashboard-border-dark
                      shadow-xl
                      overflow-hidden
                    "
                    >
                      <button
                        onClick={() => copyPostLink(post)}
                        className={`${menuItem} hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark text-sm`}
                      >
                        <LinkIcon size={16} className="opacity-80" />
                        Copy link
                      </button>
                      <div className="h-px bg-dashboard-border-light dark:bg-dashboard-border-dark my-1" />
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          navigate(`/community/edit-post/${post.id}`);
                        }}
                        className={`${menuItem} hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark text-sm`}
                      >
                        <Pencil size={16} className="opacity-80" />
                        Edit
                      </button>
                      <div className="h-px bg-dashboard-border-light dark:bg-dashboard-border-dark my-1" />

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          confirmDeletePost(post.id);
                        }}
                        className={`${menuItem} text-red-500 hover:bg-red-500/10 text-sm`}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MobileCreateFAB
        className={`
          md:hidden
          transition-all duration-200 ease-out
          ${showFab ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
        open={createOpen}
        setOpen={setCreateOpen}
        containerRef={createMenuRef}
        onCreatePost={() => {
          setCreateOpen(false);
          navigate("/community/create-post");
        }}
        onCreateFragment={() => {
          setCreateOpen(false);
          navigate("/community/fragments/create");
        }}
      />
    </div>
  );
}
