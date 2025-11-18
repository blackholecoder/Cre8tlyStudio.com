import ReplyBox from "../../components/community/ReplyBox";
import { ShieldCheck, Heart } from "lucide-react";
import { useAuth } from "../../admin/AuthContext";

export default function CommentThread({
  comment,
  depth = 0,
  loadReplies,
  replies,
  setReplies,
  replyPages,
  timeAgo,
  postId,
  toggleLike,
  setActiveReplyBox,
  activeReplyBox,
  editCommentId,
  editBody,
  setEditBody,
  setEditCommentId,
  handleDelete,
  onReplySubmit,
  openReplies,
  toggleReplyVisibility,
}) {
  const { user } = useAuth();
  const children = replies[comment.id] || [];

  const replyTotal =
    comment.reply_count ??
    (replies[comment.id] ? replies[comment.id].length : 0);

  return (
    <div className="mt-3" style={{ marginLeft: depth === 1 ? 30 : 0 }}>
      <div
        id={`comment-${comment.id}`}
        className={
          depth === 0
            ? "bg-gray-900/60 border border-gray-700 p-3 rounded-lg"
            : depth === 1
              ? "border-l border-gray-700 pl-4"
              : "pl-4"
        }
      >
        {/* ✏ EDIT MODE */}
        {editCommentId === comment.id ? (
          <>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-gray-100 text-sm"
              rows={3}
            />

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => onReplySubmit(comment.id)}
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
          </>
        ) : (
          <>
            {/* Author + Meta */}
            <div className="flex items-center gap-3 mb-2">
              {/* Avatar */}
              {comment.author_image ? (
                <img
                  src={comment.author_image}
                  className="w-8 h-8 rounded-full object-cover border border-gray-700"
                  alt="User avatar"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300">
                  {comment.author?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* Author + Meta */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-200">
                  {comment.author}
                </span>
                {comment.author_role === "admin" && (
                  <span className="flex items-center gap-1 text-white text-[10px] px-2 py-0.5 border border-green rounded-full">
                    <ShieldCheck size={11} className="text-green" /> Official
                  </span>
                )}
                • {timeAgo(comment.created_at)}
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-gray-300 text-sm whitespace-pre-wrap mb-2">
              {comment.body}
            </p>

            {/* ❤️ Likes + Reply/Edit/Delete */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <button
                onClick={() => toggleLike(comment, comment.parent_id)}
                className={`flex items-center gap-1 ${
                  comment.user_liked ? "text-red-600" : "text-gray-500"
                } hover:text-red-600/90 transition-transform ${
                  comment.user_liked ? "scale-110" : "scale-100"
                }`}
              >
                <Heart
                  size={12}
                  fill={comment.user_liked ? "currentColor" : "transparent"}
                  className={comment.user_liked ? "animate-pingOnce" : ""}
                />
                {comment.like_count}
              </button>

              <button
                onClick={() => setActiveReplyBox(comment.id)}
                className="text-green hover:text-green/90"
              >
                Reply
              </button>

              {(comment.user_id === user.id || user.role === "admin") && (
                <>
                  <button
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setEditBody(comment.body);
                    }}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id, comment.parent_id)}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Reply Box */}
            {activeReplyBox === comment.id && (
              <div className="mt-2">
                <ReplyBox
                  parentId={comment.id}
                  postId={postId}
                  onReply={async (newReply) => {
                    setActiveReplyBox(null);

                    setReplies((prev) => ({
                      ...prev,
                      [comment.parent_id || comment.id]: [
                        ...(prev[comment.parent_id || comment.id] || []),
                        newReply,
                      ],
                    }));
                    // setActiveReplyBox(null); // 🔥 close immediately
                    await loadReplies(comment.parent_id || comment.id); // fetch fresh replies AFTER closing
                  }}
                  onCancel={() => setActiveReplyBox(null)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {replyTotal > 0 && (
        <button
          onClick={() => toggleReplyVisibility(comment.id)}
          className="text-xs text-green hover:text-green/80 mt-2 ml-1"
        >
          {openReplies[comment.id]
            ? "Hide replies"
            : `View replies (${replyTotal})`}
        </button>
      )}

      {openReplies[comment.id] &&
        children
          .filter((child) => child && child.id) // 🔥 prevents all crashes
          .map((child) => (
            <CommentThread
              key={child.id}
              comment={child}
              depth={1}
              loadReplies={loadReplies}
              replies={replies}
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
              onReplySubmit={onReplySubmit}
              openReplies={openReplies}
              toggleReplyVisibility={toggleReplyVisibility}
            />
          ))}

      {/* SHOW MORE */}
      {openReplies[comment.id] && replyPages[comment.id] && (
        <button
          onClick={() => loadReplies(comment.id, replyPages[comment.id])}
          className="text-xs text-blue hover:text-blue/80 ml-3 mt-1"
        >
          Show more replies
        </button>
      )}
    </div>
  );
}
