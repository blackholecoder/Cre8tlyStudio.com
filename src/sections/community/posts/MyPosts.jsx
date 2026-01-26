import { useEffect, useState } from "react";
import {
  MessageCircle,
  Ellipsis,
  Pencil,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import axiosInstance from "../../../api/axios";
import CreatePostModal from "../CreatePostModal";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

export default function MyPosts() {
  const [showCreate, setShowCreate] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [topics, setTopics] = useState([]);

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
    if (showCreate || editingPost) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [showCreate, editingPost]);

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

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      {/* Header */}
      {!showCreate && !editingPost && (
        <div className="sticky top-0 z-20 px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <h1 className="text-lg font-semibold">My Posts</h1>

            <button
              onClick={() => setShowCreate(true)}
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
      )}
      {/* Mobile action bar */}
      {!showCreate && !editingPost && (
        <div className="md:hidden px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
          <button
            onClick={() => setShowCreate(true)}
            className="
            w-full
            py-2.5
            rounded-lg
            text-sm
            font-medium
            bg-dashboard-text-light
            dark:bg-dashboard-text-dark
            text-dashboard-bg-light
            dark:text-dashboard-bg-dark
            hover:opacity-90
            transition
          "
          >
            Create new post
          </button>
        </div>
      )}

      {/* List */}
      <div className="px-4 py-4 pb-24 max-w-3xl mx-auto space-y-2">
        {loading && <p className="text-sm opacity-60">Loading posts…</p>}

        {!loading && posts.length === 0 && (
          <p className="text-sm opacity-60">You haven’t posted anything yet.</p>
        )}

        {posts.map((post) => (
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
                <div className="mt-2 flex items-center gap-4 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {post.comment_count ?? 0}
                  </span>

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
                          setEditingPost(post);
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

      {editingPost && (
        <CreatePostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onPosted={fetchPosts}
        />
      )}

      {showCreate && (
        <CreatePostModal
          topics={topics}
          onClose={() => setShowCreate(false)}
          onPosted={fetchPosts}
        />
      )}
    </div>
  );
}
