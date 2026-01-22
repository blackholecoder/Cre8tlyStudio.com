import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import CreateCommentBox from "./CreateCommentBox";
import {
  ArrowLeft,
  ShieldCheck,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Check,
} from "lucide-react";
import { useAuth } from "../../admin/AuthContext";
import CommentThread from "./CommentThread";
import ReplyBox from "../../components/community/ReplyBox";
import { Img } from "react-image";
import { headerLogo } from "../../assets/images";
import { renderTextWithLinks } from "../../helpers/renderTextWithLinks";
import { formatPostDate } from "../../helpers/formatPostDate";

export default function CommunityPost() {
  const { user, authLoading } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openReplies, setOpenReplies] = useState({});
  const [replies, setReplies] = useState({});
  const [copied, setCopied] = useState(false);

  const [editCommentId, setEditCommentId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState(null);

  const [replyPages, setReplyPages] = useState({});

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightedCommentId = params.get("comment");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!post || !post.slug) return;

    if (!user) {
      navigate(`/community/signup?redirect=/community/post/${post.slug}`, {
        replace: true,
      });
    }
  }, [user, authLoading, post]);

  useEffect(() => {
    // Always restore scrolling when this page mounts
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";

    return () => {
      // Ensure scroll is restored if you navigate away and come back
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  // Load post + first page of comments
  const load = async () => {
    try {
      const res = await axiosInstance.get(`/community/posts/${slug}`);
      const postData = res.data.post;

      if (res.data.post?.is_admin_post === 1) {
        res.data.post.author = "Cre8tly Studio";
        res.data.post.author_image = headerLogo;
        res.data.post.author_role = "admin";
      }

      setPost(postData);

      const res2 = await axiosInstance.get(
        `/community/posts/${postData.id}/comments?page=1&limit=10`
      );

      setComments(res2.data.comments || []);
      setPage(res2.data.nextPage || null);
      setHasMore(!!res2.data.nextPage);
    } catch (err) {
      console.error("Failed to load:", err);
    }
  };

  useEffect(() => {
    if (!slug) return;
    load();
  }, [slug]);

  // Infinite scroll load
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await axiosInstance.get(
        `/community/posts/${post.id}/comments?page=${page}&limit=10`
      );

      setComments((prev) => [...prev, ...(res.data.comments || [])]);

      if (res.data.nextPage) setPage(res.data.nextPage);
      else setHasMore(false);
    } catch (err) {
      console.error("Load more failed:", err);
    }

    setLoadingMore(false);
  };

  const observerRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  // Load replies for a comment
  const loadReplies = async (commentId, page = 1) => {
    const limit = 5;

    try {
      const res = await axiosInstance.get(
        `/community/comments/${commentId}/replies?page=${page}&limit=${limit}`
      );

      // CLEAN the data
      let newReplies = res.data.replies || [];
      newReplies = newReplies.filter((r) => r && r.id);

      const freshReplies = [...newReplies];

      setReplies((prev) => ({
        ...prev,
        [commentId]:
          page === 1
            ? [...freshReplies]
            : [...(prev[commentId] || []), ...freshReplies],
      }));

      setReplyPages((prev) => ({
        ...prev,
        [commentId]: res.data.nextPage,
      }));
    } catch (err) {
      console.error("Failed to load replies:", err);
    }
  };

  // Toggle reply expansion
  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    // Only load ONCE
    if (!replies[commentId]) {
      loadReplies(commentId);
    }
  };

  const saveEditedComment = async (commentId) => {
    try {
      await axiosInstance.put(`/community/comments/${commentId}`, {
        body: editBody,
      });

      // Reload comments or patch it locally
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, body: editBody } : c))
      );

      setEditCommentId(null);
      setEditBody("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDelete = async (commentId, parentId = null) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axiosInstance.delete(`/community/comments/${commentId}`);

      if (parentId) {
        setReplies((prev) => {
          const list = prev[parentId] || [];

          const filtered = list.filter((r) => r.id !== commentId);

          const updated = {
            ...prev,
            [parentId]: filtered,
          };

          return updated;
        });
        await loadReplies(parentId);
      } else {
        setComments((prev) => {
          const filtered = prev.filter((c) => c.id !== commentId);

          return filtered;
        });

        await loadReplies(null);
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const toggleLike = async (comment, parentId = null) => {
    try {
      if (comment.user_liked) {
        await axiosInstance.delete(`/community/comments/${comment.id}/like`);
        comment.like_count -= 1;
        comment.user_liked = 0;
      } else {
        await axiosInstance.post(`/community/comments/${comment.id}/like`);
        comment.like_count += 1;
        comment.user_liked = 1;
      }

      // Update UI
      if (parentId) {
        // reply
        setReplies((prev) => ({
          ...prev,
          [parentId]: [...prev[parentId]],
        }));
      } else {
        // top-level comment
        setComments([...comments]);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  useEffect(() => {
    if (!highlightedCommentId) return;

    setTimeout(() => {
      const el = document.getElementById(`comment-${highlightedCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-green", "rounded-lg");

        // remove highlight after 3 sec
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-green");
        }, 3000);
      }
    }, 500);
  }, [comments, replies]);

  if (!post) {
    return <div className="p-10 text-center opacity-60">Loading post…</div>;
  }

  const backTo = location.state?.from || `/community/topic/${post.topic_id}`;

  const avatarInitial = post.author?.charAt(0)?.toUpperCase() ?? "U";
  const isStudioPost = post.author === "Cre8tly Studio";

  const timeAgo = (d) => {
    const date = new Date(d);
    const diff = Math.floor((Date.now() - date) / 1000);
    if (diff < 60) return "Just now";
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const isAdmin = post.author_role === "admin";

  if (!post) {
    return <div className="p-10 text-center opacity-60">Loading post…</div>;
  }

  const shareUrl = `${window.location.origin}/p/${post.slug}`;

  return (
    <div
      className="
      w-full flex justify-center items-start min-h-screen
      px-4 py-14
      sm:px-6 sm:py-16
      lg:py-20
    "
    >
      <div
        className="
    w-full max-w-4xl

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

    space-y-6 sm:space-y-8 lg:space-y-10
  "
      >
        {/* Breadcrumb */}
        <div
          className="
  w-full mb-6 text-sm flex items-center gap-2
  text-dashboard-muted-light dark:text-dashboard-muted-dark
"
        >
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1 text-blue hover:text-blue/80 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span>/</span>

          <button
            onClick={() => navigate("/community")}
            className="hover:text-gray-200"
          >
            Community
          </button>

          <span>/</span>

          <span
            className="
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          font-medium
          text-sm sm:text-base
          truncate
          max-w-[60vw] sm:max-w-none
        "
            title={post.title}
          >
            {post.title}
          </span>
        </div>

        {/* Main content */}
        <div className="w-full space-y-6 sm:space-y-8 lg:space-y-100">
          {/* Post Card */}
          <div
            className="
            bg-transparent
            border-none
            rounded-none
            shadow-none
            p-0

            sm:bg-dashboard-sidebar-light
            sm:dark:bg-dashboard-sidebar-dark
            sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
            sm:rounded-xl
            sm:p-8
            sm:shadow-lg
          "
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              {isStudioPost ? (
                <img
                  src={headerLogo}
                  className="w-12 h-12 rounded-full object-cover"
                  alt="Cre8tly Studio"
                />
              ) : post.author_image ? (
                <Img
                  src={post.author_image}
                  loader={
                    <div className="w-12 h-12 rounded-full bg-gray-700/40 animate-pulse" />
                  }
                  unloader={
                    <div
                      className="w-12 h-12 rounded-full border flex items-center justify-center text-xl font-bold bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                      border-dashboard-border-light dark:border-dashboard-border-dark
                      text-dashboard-muted-light dark:text-dashboard-muted-dark"
                    >
                      {avatarInitial}
                    </div>
                  }
                  decode={true}
                  alt="User avatar"
                  className="w-12 h-12 rounded-full object-cover  shadow-xl transition-opacity duration-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-green/90 border border-green flex items-center justify-center text-xl font-bold text-green">
                  {avatarInitial}
                </div>
              )}

              <div>
                <div className="flex items-center gap-[1px]">
                  <p className="text-dashboard-text-light dark:text-dashboard-text-dark text-lg font-semibold">
                    {isStudioPost ? "Cre8tly Studio" : post.author}
                  </p>

                  {(isStudioPost || isAdmin) && (
                    <span
                      className="
                      flex items-center
                      text-dashboard-muted-light dark:text-dashboard-muted-dark
                      text-[10px]
                      px-0.5 py-0.5
                      rounded-full
                    "
                    >
                      <ShieldCheck
                        size={15}
                        className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
                      />
                    </span>
                  )}
                </div>

                <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm">
                  <span>{formatPostDate(post.created_at)}</span>
                  <span className="mx-1">·</span>
                  <span className="opacity-80">{timeAgo(post.created_at)}</span>
                </p>
                <div className="flex items-center gap-4 mt-0.5 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
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
                  <button
                    onClick={handleShare}
                    className="
                    relative
                    flex items-center gap-1
                    text-sky-400 hover:text-sky-400/80
                    transition
                  "
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-500" />
                        <span className="text-green-500 text-xs">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <h2
              className="
              not-prose
              text-3xl sm:text-3xl
              font-bold
              mb-2
              text-dashboard-text-light
              dark:text-dashboard-text-dark
            "
            >
              {post.title}
            </h2>

            {post.subtitle && (
              <p
                className="
                text-base sm:text-lg
                font-normal
                leading-relaxed
                max-w-2xl
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
              "
              >
                {post.subtitle}
              </p>
            )}

            {post.image_url && (
              <div className="mb-6">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="
                w-full
                max-h-[420px]
                object-cover
                rounded-xl
                mt-12
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
              "
                />
              </div>
            )}
            <div
              className="
              post-body
              prose prose-md max-w-none
              text-dashboard-text-light dark:text-dashboard-text-dark
            "
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>

          {/* Comments */}
          <div>
            <h2
              className="text-xl font-semibold mb-5
            text-dashboard-text-light dark:text-dashboard-text-dark"
            >
              Comments
            </h2>

            {comments.length === 0 && (
              <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark mb-6">
                No comments yet.
              </p>
            )}

            <div className="space-y-4 mb-10">
              {comments.map((c) => {
                const commentAvatar = c.author?.charAt(0).toUpperCase() ?? "U";
                const commentAdmin = c.author_role === "admin";

                return (
                  <div
                    key={c.id}
                    className="
                    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                    border border-dashboard-border-light dark:border-dashboard-border-dark
                    p-4 sm:p-5 lg:p-6 rounded-lg shadow-inner
                  "
                  >
                    <div className="flex items-start gap-4">
                      {c.author_image ? (
                        <Img
                          src={c.author_image}
                          loader={
                            <div className="w-10 h-10 rounded-full bg-gray-700/40 animate-pulse" />
                          }
                          unloader={
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                            border-dashboard-border-light dark:border-dashboard-border-dark
                            text-dashboard-muted-light dark:text-dashboard-muted-dark
                            "
                            >
                              {commentAvatar}
                            </div>
                          }
                          decode={true}
                          alt="Comment avatar"
                          className="w-10 h-10 rounded-full object-cover border border-gray-700 transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                          {commentAvatar}
                        </div>
                      )}

                      <div className="flex-1">
                        {editCommentId !== c.id && (
                          <div
                            className="
                            prose prose-sm max-w-none
                            text-dashboard-text-light dark:text-dashboard-text-dark
                            whitespace-pre-wrap
                            dark:prose-invert
                            dark:prose-a:text-sky-400
                            dark:prose-a:decoration-sky-400
                          "
                          >
                            {renderTextWithLinks(c.body)}
                          </div>
                        )}

                        {editCommentId === c.id && (
                          <div className="mt-3">
                            <textarea
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="
                              w-full
                              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                              border border-dashboard-border-light dark:border-dashboard-border-dark
                              p-2 rounded
                              text-dashboard-text-light dark:text-dashboard-text-dark
                              text-sm
                            "
                              rows={3}
                            />

                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => saveEditedComment(c.id)}
                                className="px-3 py-1 bg-blue text-white text-xs rounded hover:bg-blue/90"
                              >
                                Save
                              </button>

                              <button
                                onClick={() => {
                                  setEditCommentId(null);
                                  setEditBody("");
                                }}
                                className="
                                px-3 py-1
                                bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                                text-dashboard-muted-light dark:text-dashboard-muted-dark
                                border border-dashboard-border-light dark:border-dashboard-border-dark
                                text-xs rounded
                                hover:opacity-80
"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-0">
                            <span>{c.author}</span>

                            {commentAdmin && (
                              <span
                                className="
                                flex items-center gap-1
                                text-dashboard-muted-light dark:text-dashboard-muted-dark
                                text-xs
                                px-1
                                rounded-full
                              "
                              >
                                <ShieldCheck
                                  className="text-dashboard-muted-light dark:text-green"
                                  size={12}
                                />
                              </span>
                            )}
                          </div>
                          <span>{timeAgo(c.created_at)}</span>
                          <button
                            onClick={() => toggleLike(c)}
                            className={`text-xs ${
                              c.user_liked
                                ? "text-red-600"
                                : "text-dashboard-muted-light dark:text-dashboard-muted-dark"
                            } hover:opacity-80`}
                          >
                            <Heart
                              size={12}
                              fill={
                                c.user_liked ? "currentColor" : "transparent"
                              }
                              className="inline-block mr-1"
                            />
                            {c.like_count}
                          </button>
                        </div>

                        {/* Action Row */}
                        {editCommentId !== c.id && (
                          <div className="flex items-center gap-4 mt-2">
                            {/* Reply */}

                            {/* Reply toggle + open reply box */}
                            {c.reply_count > 0 ? (
                              // Threaded replies exist → open/close thread
                              <button
                                onClick={() => toggleReplies(c.id)}
                                className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark
                                  hover:opacity-80"
                              >
                                {openReplies[c.id]
                                  ? "Hide replies"
                                  : `View replies (${c.reply_count})`}
                              </button>
                            ) : (
                              // No replies → open reply box
                              <button
                                onClick={() => setActiveReplyBox(c.id)}
                                className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark
                                  hover:opacity-80"
                              >
                                Reply
                              </button>
                            )}

                            {/* Divider Dot */}

                            {/* Edit */}
                            {!openReplies[c.id] &&
                              (c.user_id === user.id ||
                                user.role === "admin") && (
                                <button
                                  onClick={() => {
                                    setEditCommentId(c.id);
                                    setEditBody(c.body);
                                  }}
                                  className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                                >
                                  Edit
                                </button>
                              )}

                            {/* Delete */}
                            {!openReplies[c.id] &&
                              (c.user_id === user.id ||
                                user.role === "admin") && (
                                <button
                                  onClick={() => handleDelete(c.id)}
                                  className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                                >
                                  Delete
                                </button>
                              )}
                            {/* Reply Box for top-level comments */}
                          </div>
                        )}

                        {activeReplyBox === c.id && (
                          <div className="mt-3 ml-6">
                            <ReplyBox
                              parentId={c.id}
                              postId={post.id}
                              onReply={async (newReply) => {
                                setReplies((prev) => ({
                                  ...prev,
                                  [c.id]: [...(prev[c.id] || []), newReply],
                                }));
                                await loadReplies(c.id);
                                setActiveReplyBox(null);
                              }}
                              onCancel={() => setActiveReplyBox(null)}
                            />
                          </div>
                        )}

                        {/* Replies */}
                        {openReplies[c.id] &&
                          (replies[c.id] || []).map((reply) => (
                            <CommentThread
                              key={reply.id}
                              comment={reply}
                              depth={1}
                              loadReplies={loadReplies}
                              replies={replies}
                              setReplies={setReplies}
                              replyPages={replyPages}
                              timeAgo={timeAgo}
                              postId={post.id}
                              toggleLike={toggleLike}
                              activeReplyBox={activeReplyBox}
                              setActiveReplyBox={setActiveReplyBox}
                              editCommentId={editCommentId}
                              editBody={editBody}
                              setEditBody={setEditBody}
                              setEditCommentId={setEditCommentId}
                              handleDelete={handleDelete}
                              onReplySubmit={saveEditedComment}
                              openReplies={openReplies}
                              toggleReplyVisibility={toggleReplies}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={observerRef} className="h-10"></div>
            </div>

            <CreateCommentBox postId={post.id} onComment={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
