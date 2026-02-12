import ReplyBox from "../../components/community/ReplyBox";
import { ShieldCheck, Heart } from "lucide-react";
import { useAuth } from "../../admin/AuthContext";
import { Img } from "react-image";
import { renderTextWithLinks } from "../../helpers/renderTextWithLinks";
import { toast } from "react-toastify";

export default function CommentThread({
  comment,
  postOwnerId,
  depth = 0,
  loadReplies,
  replies,
  setReplies,
  replyPages,
  timeAgo,
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
  expandedComments,
  setExpandedComments,
}) {
  const { user } = useAuth();
  const children = replies[comment.id] || [];

  const MAX_LENGTH = 420;

  const isExpanded = expandedComments?.[comment.id] === true;
  const isLong = comment.body.length > MAX_LENGTH;

  const displayText =
    !isExpanded && isLong
      ? comment.body.slice(0, MAX_LENGTH).trim() + "…"
      : comment.body;

  const replyTotal =
    comment.reply_count ??
    (replies[comment.id] ? replies[comment.id].length : 0);

  const visualDepth = depth > 0 ? 1 : 0;
  const isRoot = depth === 0;

  return (
    <div id={`comment-${comment.id}`}>
      <div
        className={
          isRoot
            ? `
    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
    border border-dashboard-border-light dark:border-dashboard-border-dark
    rounded-lg
  `
            : `
    relative
    ml-2 sm:ml-4
    mt-3 sm:mt-4
  `
        }
      >
        {!isRoot && (
          <span
            className="
      absolute
      left-[-1px]
      top-4
      w-2 h-2
      rounded-full
      bg-dashboard-border-light
      dark:bg-dashboard-border-dark
      z-10
    "
          />
        )}

        {!isRoot && (
          <span
            className="
      absolute
      left-0
      top-3
      bottom-3
      w-px
      bg-dashboard-border-light/40
      dark:bg-dashboard-border-dark/40
      z-0
    "
          />
        )}

        <div className={isRoot ? "p-3" : "pl-4 sm:pl-5 py-2 sm:py-3"}>
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
                <button
                  title={
                    !comment.author_has_profile
                      ? "Profile coming soon"
                      : undefined
                  }
                  onClick={() => {
                    // own comment → no nav
                    if (user?.id === comment.user_id) return;

                    // no profile → block
                    if (!comment.author_has_profile) {
                      toast.info("This author hasn’t set up their profile yet");
                      return;
                    }

                    // safe navigation
                    navigate(`/community/authors/${comment.user_id}`);
                  }}
                  className={`flex-shrink-0 ${
                    !comment.author_has_profile ||
                    comment.author_role === "admin"
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  {comment.author_image ? (
                    <Img
                      src={comment.author_image}
                      loader={
                        <div className="w-8 h-8 rounded-full bg-gray-700/40 animate-pulse" />
                      }
                      unloader={
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300">
                          {comment.author?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      }
                      decode
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-700 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300">
                      {comment.author?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {/* Author + Meta */}
                <div className="flex items-center gap-[4px] text-xs text-gray-500">
                  <div className="flex items-center gap-0">
                    <span className="font-medium text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      {comment.author}
                    </span>

                    {comment.author_role === "admin" && (
                      <span className="p-1">
                        <ShieldCheck size={11} className="text-green" />
                      </span>
                    )}
                  </div>

                  <span>•</span>
                  <span>{timeAgo(comment.created_at)}</span>

                  {comment.updated_at &&
                    new Date(comment.updated_at) >
                      new Date(comment.created_at) && (
                      <>
                        <span>·</span>
                        <span className="text-[10px] opacity-60">edited</span>
                      </>
                    )}
                </div>
              </div>
              {/* Replying to indicator */}
              {comment.reply_to_author && (
                <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
                  Replying to{" "}
                  <span className="font-medium">
                    @{comment.reply_to_author}
                  </span>
                </div>
              )}
              {/* Comment Body */}
              <div
                className="
            prose prose-sm max-w-none
             dark:prose-invert
             dark:prose-a:text-sky-400
             dark:prose-a:decoration-sky-400
            text-dashboard-text-light dark:text-dashboard-text-dark
             whitespace-pre-wrap mb-2
          "
              >
                {renderTextWithLinks(displayText)}
              </div>
              {/* SEE MORE */}
              {!isExpanded && isLong && (
                <button
                  onClick={() =>
                    setExpandedComments((prev) => ({
                      ...prev,
                      [comment.id]: true,
                    }))
                  }
                  className="text-xs text-sky-400 mt-1 hover:underline"
                >
                  See more
                </button>
              )}

              {/* SEE LESS */}
              {isExpanded && isLong && (
                <button
                  onClick={() =>
                    setExpandedComments((prev) => ({
                      ...prev,
                      [comment.id]: false,
                    }))
                  }
                  className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-1 hover:underline"
                >
                  See less
                </button>
              )}

              {/* ❤️ Likes + Reply/Edit/Delete */}
              <div className="flex items-center gap-4 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-1">
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
                  className="text-dashboard-text-light dark:text-dashboard-text-dark
                hover:opacity-80
"
                >
                  Reply
                </button>

                {user && comment.user_id === user.id && (
                  <button
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setEditBody(comment.body);
                    }}
                    className="
                    text-dashboard-muted-light dark:text-dashboard-muted-dark
                    hover:opacity-80
"
                  >
                    Edit
                  </button>
                )}

                {user &&
                  (comment.user_id === user.id || postOwnerId === user.id) && (
                    <button
                      onClick={() =>
                        handleDelete(comment.id, comment.parent_id)
                      }
                      className="text-dashboard-muted-light dark:text-dashboard-muted-dark hover:opacity-80"
                    >
                      Delete
                    </button>
                  )}
              </div>

              {/* Reply Box */}
              {activeReplyBox === comment.id && (
                <div className="mt-2">
                  <ReplyBox
                    parentComment={comment}
                    onReply={async (newReply) => {
                      setActiveReplyBox(null);

                      const threadId = comment.parent_id || comment.id;

                      setReplies((prev) => ({
                        ...prev,
                        [threadId]: [...(prev[threadId] || []), newReply],
                      }));

                      await loadReplies(threadId);
                    }}
                    onCancel={() => setActiveReplyBox(null)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {replyTotal > 0 && (
        <button
          onClick={() => toggleReplyVisibility(comment.id)}
          className={`text-xs text-dashboard-text-light dark:text-dashboard-text-dark
    hover:opacity-80
    mt-2 ${visualDepth === 1 ? "ml-4 sm:ml-6" : "ml-1"}`}
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
            <div className="mt-3">
              <CommentThread
                key={child.id}
                comment={child}
                depth={1}
                postOwnerId={postOwnerId}
                loadReplies={loadReplies}
                replies={replies}
                replyPages={replyPages}
                timeAgo={timeAgo}
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
                expandedComments={expandedComments}
                setExpandedComments={setExpandedComments}
              />
            </div>
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
