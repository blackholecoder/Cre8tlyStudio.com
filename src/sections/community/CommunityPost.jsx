import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import CreateCommentBox from "./CreateCommentBox";
import { ArrowLeft, ShieldCheck, Heart } from "lucide-react";
import { useAuth } from "../../admin/AuthContext";
import CommentThread from "./CommentThread";
import ReplyBox from "../../components/community/ReplyBox";
import { Img } from "react-image";

export default function CommunityPost() {
  const { user } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openReplies, setOpenReplies] = useState({});
  const [replies, setReplies] = useState({});

  const [editCommentId, setEditCommentId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState(null);

  const [replyPages, setReplyPages] = useState({});

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightedCommentId = params.get("comment");

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
      const res = await axiosInstance.get(`/community/posts/${postId}`);
      setPost(res.data.post);

      const res2 = await axiosInstance.get(
        `/community/posts/${postId}/comments?page=1&limit=10`
      );

      setComments(res2.data.comments || []);
      setPage(res2.data.nextPage || null);
      setHasMore(!!res2.data.nextPage);
    } catch (err) {
      console.error("Failed to load:", err);
    }
  };

  useEffect(() => {
    load();
  }, [postId]);

  // Infinite scroll load
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await axiosInstance.get(
        `/community/posts/${postId}/comments?page=${page}&limit=10`
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

  if (!post) return null;

  const avatarInitial = post.author?.charAt(0)?.toUpperCase() ?? "U";
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
    return <div className="p-10 text-center text-gray-300">Post not found</div>;
  }

  return (
    <div className="w-full flex justify-center items-start min-h-screen px-6 py-20">
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-10 backdrop-blur-sm shadow-xl space-y-10">
        {/* Breadcrumb */}
        <div className="w-full max-w-3xl mb-6 text-gray-400 text-sm flex items-center gap-2">
          <button
            onClick={() => navigate("/community")}
            className="flex items-center gap-1 text-green hover:text-green/80 transition"
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

          <span className="text-white font-medium">{post.title}</span>
        </div>

        {/* Main content */}
        <div className="w-full max-w-3xl space-y-10">
          {/* Post Card */}
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              {post.author_image ? (
                <Img
                  src={post.author_image}
                  loader={
                    <div className="w-12 h-12 rounded-full bg-gray-700/40 animate-pulse" />
                  }
                  unloader={
                    <div className="w-12 h-12 rounded-full bg-gray-800 border border-green-600 flex items-center justify-center text-xl font-bold text-green-400">
                      {avatarInitial}
                    </div>
                  }
                  decode={true}
                  alt="User avatar"
                  className="w-12 h-12 rounded-full object-cover border border-green-600 transition-opacity duration-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-600/30 border border-green-600 flex items-center justify-center text-xl font-bold text-green-400">
                  {avatarInitial}
                </div>
              )}
              <div>
                <p className="text-white text-lg font-semibold flex items-center gap-2">
                  {post.author}
                  {isAdmin && (
                    <span className="flex items-center gap-1 text-green-400 text-[10px] px-2 py-0.5 border border-green rounded-full">
                      <ShieldCheck size={11} className="text-green" /> Official
                    </span>
                  )}
                </p>
                <p className="text-gray-500 text-sm">
                  {timeAgo(post.created_at)}
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {post.body}
            </p>
          </div>

          {/* Comments */}
          <div>
            <h2 className="text-xl font-semibold mb-5 text-white">Comments</h2>

            {comments.length === 0 && (
              <p className="text-gray-500 mb-6">No comments yet.</p>
            )}

            <div className="space-y-4 mb-10">
              {comments.map((c) => {
                const commentAvatar = c.author?.charAt(0).toUpperCase() ?? "U";
                const commentAdmin = c.author_role === "admin";

                return (
                  <div
                    key={c.id}
                    className="bg-gray-900/60 border border-gray-700 p-6 rounded-lg shadow-inner"
                  >
                    <div className="flex items-start gap-4">
                      {c.author_image ? (
                        <Img
                          src={c.author_image}
                          loader={
                            <div className="w-10 h-10 rounded-full bg-gray-700/40 animate-pulse" />
                          }
                          unloader={
                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
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
                          <p className="text-gray-300 whitespace-pre-wrap">
                            {c.body}
                          </p>
                        )}

                        {editCommentId === c.id && (
                          <div className="mt-3">
                            <textarea
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-gray-100 text-sm"
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
                                className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-4">
                          <span>{c.author}</span>
                          {commentAdmin && (
                            <span className="flex items-center gap-1 text-white text-xs px-2 py-0.5 border border-green rounded-full">
                              <ShieldCheck size={12} className="text-green" />{" "}
                              Official
                            </span>
                          )}
                          • <span>{timeAgo(c.created_at)}</span>
                          <button
                            onClick={() => toggleLike(c, null)}
                            className={`text-xs ${
                              c.user_liked ? "text-red-600" : "text-gray-500"
                            } hover:text-blue/90`}
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
                                className="text-xs text-green hover:text-green/90"
                              >
                                {openReplies[c.id]
                                  ? "Hide replies"
                                  : `View replies (${c.reply_count})`}
                              </button>
                            ) : (
                              // No replies → open reply box
                              <button
                                onClick={() => setActiveReplyBox(c.id)}
                                className="text-xs text-green hover:text-green/90"
                              >
                                Reply
                              </button>
                            )}

                            {/* Divider Dot */}
                            {!openReplies[c.id] &&
                              (c.user_id === user.id ||
                                user.role === "admin") && (
                                <span className="text-gray-500 text-xs">•</span>
                              )}

                            {/* Edit */}
                            {!openReplies[c.id] &&
                              (c.user_id === user.id ||
                                user.role === "admin") && (
                                <button
                                  onClick={() => {
                                    setEditCommentId(c.id);
                                    setEditBody(c.body);
                                  }}
                                  className="text-xs text-gray-100 hover:text-gray-300"
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
                                  className="text-xs text-gray-200 hover:text-gray-300"
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
                              postId={postId}
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
                              postId={postId}
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

            <CreateCommentBox postId={postId} onComment={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
