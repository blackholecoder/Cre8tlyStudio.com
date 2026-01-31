import { useState } from "react";
import axiosInstance from "../../api/axios";

export default function CreateCommentBox({ postId, onComment }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [mentionResults, setMentionResults] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");

  const handleChange = async (e) => {
    const value = e.target.value;
    setBody(value);

    try {
      const match = value.match(/@([a-zA-Z0-9_]*)$/);

      if (!match) {
        setShowMentions(false);
        setMentionResults([]);
        return;
      }

      const query = match[1];
      setMentionQuery(query);

      if (query.length < 1) return;

      const res = await axiosInstance.get(
        `/community/users/search?query=${query}`,
      );

      setMentionResults(res.data.users || []);
      setShowMentions(true);
    } catch (error) {
      console.error("❌ mention search failed:", error);
      setShowMentions(false);
    }
  };

  const insertMention = (username) => {
    try {
      setBody((prev) => prev.replace(/@([a-zA-Z0-9_]*)$/, `@${username} `));

      setShowMentions(false);
      setMentionResults([]);
      setMentionQuery("");
    } catch (error) {
      console.error("❌ insertMention error:", error);
    }
  };

  const submit = async () => {
    if (!body.trim() || submitting) return;

    setSubmitting(true);

    try {
      const res = await axiosInstance.post(
        `/community/posts/${postId}/comments`,
        { body },
      );

      const newComment = res.data.comment;

      setBody("");
      setShowMentions(false);
      setMentionResults([]);
      setMentionQuery("");

      if (onComment && newComment) {
        onComment(newComment);
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={body}
        onChange={handleChange}
        placeholder="Write a comment..."
        className="
        w-full
        min-h-[100px]
        p-3
        rounded-lg
        bg-dashboard-bg-light dark:bg-dashboard-bg-dark
        text-dashboard-text-light dark:text-dashboard-text-dark
        placeholder-dashboard-muted-light dark:placeholder-dashboard-muted-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        focus:outline-none
        focus:ring-1
        focus:ring-green
      "
      />
      {showMentions && mentionResults.length > 0 && (
        <div
          className="
      absolute
      left-0
      bottom-full
      mb-2
      w-full
      max-h-56
      overflow-y-auto
      rounded-xl
      border
      bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      border-dashboard-border-light
      dark:border-dashboard-border-dark
      shadow-2xl
      z-50
    "
        >
          {mentionResults.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => insertMention(user.username)}
              className="
    w-full
    flex
    items-center
    gap-3
    px-3
    py-2
    text-left
    hover:bg-dashboard-hover-light
    dark:hover:bg-dashboard-hover-dark
    transition
  "
            >
              {user.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.username}
                  className="w-7 h-7 rounded-full object-cover border border-dashboard-border-light dark:border-dashboard-border-dark"
                />
              ) : (
                <div
                  className="
        w-7 h-7
        rounded-full
        flex
        items-center
        justify-center
        text-xs
        font-semibold
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
        border
        border-dashboard-border-light
        dark:border-dashboard-border-dark
        text-dashboard-muted-light
        dark:text-dashboard-muted-dark
      "
                >
                  {user.username?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
                  @{user.username}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={submit}
        disabled={submitting}
        className={`
    mt-6
    px-5 py-2
    rounded-lg
    transition
    border
    ${
      submitting
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-green hover:text-black"
    }
    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
    text-dashboard-text-light dark:text-dashboard-text-dark
    border-dashboard-border-light dark:border-dashboard-border-dark
  `}
      >
        {submitting ? "Posting…" : "Post"}
      </button>
    </div>
  );
}
