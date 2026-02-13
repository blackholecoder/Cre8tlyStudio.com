import { Heart, MessageSquareLock, ShieldCheck } from "lucide-react";
import ReplyBox from "../../../components/community/ReplyBox";
import CommentThread from "../CommentThread";
import CreateCommentBox from "../CreateCommentBox";
import { Img } from "react-image";
import { renderTextWithLinks } from "../../../helpers/renderTextWithLinks";

export default function CommentsSection({
  commentsState,
  postState,
  handlers,
  uiHelpers,
}) {
  const {
    comments,
    setComments,
    replies,
    setReplies,
    setOpenReplies,
    replyPages,
    expandedComments,
    setExpandedComments,
    openReplies,
    activeReplyBox,
    editCommentId,
    editBody,
  } = commentsState;

  const { post, setPost, commentsLocked, isCommentsPaid, targetType } =
    postState;

  const {
    toggleLike,
    toggleReplies,
    loadReplies,
    setActiveReplyBox,
    setEditCommentId,
    setEditBody,
    saveEditedComment,
    handleDelete,
  } = handlers;

  const { user, navigate, redirectPath, timeAgo, observerRef } = uiHelpers;

  return (
    <>
      {/* Comments */}
      <div>
        <h2
          className="text-xl font-semibold mb-5
            text-dashboard-text-light dark:text-dashboard-text-dark"
        >
          Comments
        </h2>

        {commentsLocked ? (
          <div className="mb-10 p-4 rounded-lg border border-dashboard-border-light dark:border-dashboard-border-dark text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark flex items-center gap-2">
            <MessageSquareLock size={16} />
            <span>
              {isCommentsPaid
                ? "Comments are for paid subscribers only."
                : "Comments are private."}
            </span>
            {isCommentsPaid && user?.id !== post.user_id && (
              <button
                onClick={() =>
                  navigate(`/community/subscribe/${post.user_id}/choose`, {
                    state: { from: redirectPath },
                  })
                }
                className="
                    text-green
                    text-sm
                    font-medium
                    w-fit
                    hover:underline
                  "
              >
                Become a paid subscriber →
              </button>
            )}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark mb-6">
            No comments yet.
          </p>
        ) : null}
        {!commentsLocked && (
          <div className="space-y-4 mb-10">
            {comments.map((c) => {
              const commentAvatar = c.author?.charAt(0).toUpperCase() ?? "U";
              const commentAdmin = c.author_role === "admin";

              const MAX_LENGTH = 420;

              const isExpanded = expandedComments[c.id] !== false;
              const isLong = c.body.length > MAX_LENGTH;

              const displayText =
                !isExpanded && isLong
                  ? c.body.slice(0, MAX_LENGTH).trim() + "…"
                  : c.body;

              return (
                <div
                  key={c.id}
                  className="
                    /* mobile */
                    bg-transparent
                    border-b border-dashboard-border-light/50 dark:border-dashboard-border-dark/50
                    rounded-none
                    shadow-none
                    p-3

                    /* desktop */
                    sm:bg-dashboard-sidebar-light
                    sm:dark:bg-dashboard-sidebar-dark
                    sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
                    sm:rounded-lg
                    sm:p-5
                    lg:p-6
                    sm:shadow-inner
                  "
                >
                  <div className="flex items-start gap-4">
                    <button
                      title={
                        !c.author_has_profile
                          ? "Profile coming soon"
                          : undefined
                      }
                      onClick={() => {
                        // own comment → no navigation
                        if (user?.id === c.user_id) return;

                        // no profile → block
                        if (!c.author_has_profile) {
                          toast.info(
                            "This author hasn’t set up their profile yet",
                          );
                          return;
                        }

                        // navigate
                        navigate(`/community/authors/${c.user_id}`);
                      }}
                      className={`flex-shrink-0 ${
                        !c.author_has_profile
                          ? "cursor-default"
                          : "cursor-pointer"
                      }`}
                    >
                      {c.author_image ? (
                        <Img
                          src={c.author_image}
                          loader={
                            <div className="w-8 h-8 rounded-full bg-gray-700/40 animate-pulse" />
                          }
                          unloader={
                            <div
                              className="
                                w-10 h-10 rounded-full
                                flex items-center justify-center
                                text-sm font-semibold
                                bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                                border border-dashboard-border-light dark:border-dashboard-border-dark
                                text-dashboard-muted-light dark:text-dashboard-muted-dark
                              "
                            >
                              {commentAvatar}
                            </div>
                          }
                          decode
                          alt="Comment avatar"
                          className="w-10 h-10 rounded-full object-cover border border-gray-700 transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                          {commentAvatar}
                        </div>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-2 flex items-center gap-[4px]">
                        <div className="flex items-center gap-0">
                          <span className="font-medium text-dashboard-muted-light dark:text-dashboard-muted-dark">
                            {c.author}
                          </span>

                          {commentAdmin && (
                            <span className="px-1">
                              <ShieldCheck
                                size={12}
                                className="text-dashboard-muted-light dark:text-green"
                              />
                            </span>
                          )}
                        </div>

                        <span>·</span>
                        <span>{timeAgo(c.created_at)}</span>

                        {c.updated_at &&
                          new Date(c.updated_at).getTime() >
                            new Date(c.created_at).getTime() && (
                            <>
                              <span>·</span>
                              <span className="text-[10px] opacity-60">
                                edited
                              </span>
                            </>
                          )}
                      </div>
                      {editCommentId !== c.id && (
                        <>
                          <div
                            className="
                              prose prose-sm max-w-none
                              my-1
                              text-dashboard-text-light dark:text-dashboard-text-dark
                              whitespace-pre-wrap
                              dark:prose-invert
                              dark:prose-a:text-sky-400
                              dark:prose-a:decoration-sky-400
                            "
                          >
                            {renderTextWithLinks(displayText)}
                          </div>

                          {!isExpanded && isLong && (
                            <button
                              onClick={() =>
                                setExpandedComments((prev) => ({
                                  ...prev,
                                  [c.id]: true,
                                }))
                              }
                              className="text-xs text-sky-400 mt-1 hover:underline"
                            >
                              See more
                            </button>
                          )}

                          {isExpanded && isLong && (
                            <button
                              onClick={() =>
                                setExpandedComments((prev) => ({
                                  ...prev,
                                  [c.id]: false,
                                }))
                              }
                              className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-1 hover:underline"
                            >
                              See less
                            </button>
                          )}
                        </>
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

                      {/* Action Row */}
                      {editCommentId !== c.id && (
                        <div className="flex items-center gap-3 mt-1.5">
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
                          {/* Reply is ALWAYS available */}
                          {!commentsLocked && (
                            <button
                              onClick={() => setActiveReplyBox(c.id)}
                              className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                            >
                              Reply
                            </button>
                          )}

                          {/* View / Hide replies only if replies exist */}
                          {c.reply_count > 0 && (
                            <button
                              onClick={() => toggleReplies(c.id)}
                              className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                            >
                              {openReplies[c.id]
                                ? "Hide replies"
                                : `View replies (${c.reply_count})`}
                            </button>
                          )}

                          {/* Edit */}
                          {!openReplies[c.id] &&
                            user &&
                            c.user_id === user.id && (
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
                            user &&
                            (c.user_id === user.id ||
                              post.user_id === user.id) && (
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                              >
                                Delete
                              </button>
                            )}
                        </div>
                      )}

                      {activeReplyBox === c.id && (
                        <div className="mt-3 ml-6">
                          <ReplyBox
                            parentComment={c}
                            onReply={async (newReply) => {
                              // 1️⃣ add reply locally
                              setReplies((prev) => ({
                                ...prev,
                                [c.id]: [...(prev[c.id] || []), newReply],
                              }));

                              // 2️⃣ increment reply_count on the parent comment
                              setComments((prev) =>
                                prev.map((comment) =>
                                  comment.id === c.id
                                    ? {
                                        ...comment,
                                        reply_count:
                                          (comment.reply_count || 0) + 1,
                                      }
                                    : comment,
                                ),
                              );

                              // 3️⃣ open replies immediately
                              setOpenReplies((prev) => ({
                                ...prev,
                                [c.id]: true,
                              }));

                              // 4️⃣ close reply box
                              setTimeout(() => setActiveReplyBox(null), 100);
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
                            postOwnerId={post.user_id}
                            comment={reply}
                            depth={1}
                            loadReplies={loadReplies}
                            replies={replies}
                            setReplies={setReplies}
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
                            onReplySubmit={saveEditedComment}
                            openReplies={openReplies}
                            toggleReplyVisibility={toggleReplies}
                            expandedComments={expandedComments}
                            setExpandedComments={setExpandedComments}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={observerRef} className="h-10"></div>
          </div>
        )}
        {!commentsLocked && (
          <CreateCommentBox
            targetType={targetType}
            targetId={post.id}
            onComment={(newComment) => {
              setComments((prev) => [newComment, ...prev]);

              setPost((prev) => ({
                ...prev,
                comment_count: (prev.comment_count || 0) + 1,
              }));
            }}
          />
        )}
      </div>
    </>
  );
}
