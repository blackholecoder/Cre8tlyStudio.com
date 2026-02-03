import { useState } from "react";
import axiosInstance from "../../api/axios";
import { ButtonSpinner } from "../../helpers/buttonSpinner";

export default function ReplyBox({ parentComment, onReply, onCancel }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

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
    setBody((prev) => prev.replace(/@([a-zA-Z0-9_]*)$/, `@${username} `));

    setShowMentions(false);
    setMentionResults([]);
    setMentionQuery("");
  };

  const submit = async () => {
    if (!body.trim() || loading) return;

    setLoading(true);

    const payload = {
      body,
    };

    try {
      const res = await axiosInstance.post(
        `/community/comments/${parentComment.id}/reply`,
        payload,
      );

      setBody("");
      setShowMentions(false);
      setMentionResults([]);
      setMentionQuery("");
      onReply(res.data.reply);
    } catch (err) {
      console.error("Failed to submit reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-4 -mx-3 -ml-4 sm:mx-0 sm:ml-0">
      <textarea
        value={body}
        onChange={handleChange}
        className="
          w-full
          min-h-[120px]
          resize-none
          rounded-xl
          p-4
          text-base
          bg-dashboard-bg-light
          dark:bg-dashboard-bg-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          placeholder-dashboard-muted-light
          dark:placeholder-dashboard-muted-dark
          focus:outline-none
          focus:ring-2
          focus:ring-green/40
        "
        placeholder="Write your reply…"
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
                  className="w-7 h-7 rounded-full object-cover border"
                />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold">
                  {user.username?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <span className="text-sm font-medium">@{user.username}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="
    px-4 py-2
    rounded-lg
    text-sm
    bg-dashboard-hover-light
    dark:bg-dashboard-hover-dark
    text-dashboard-text-light
    dark:text-dashboard-text-dark
    border
    border-dashboard-border-light
    dark:border-dashboard-border-dark
    transition
    hover:opacity-90
    focus:outline-none
    focus:ring-2
    focus:ring-dashboard-border-light
    dark:focus:ring-dashboard-border-dark
  "
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="
    px-5 py-2
    rounded-lg
    bg-green
    text-black
    font-medium
    transition
    hover:bg-green/90
    disabled:opacity-60
    disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  "
        >
          {loading ? (
            <>
              <ButtonSpinner size="sm" />
              <span>Posting…</span>
            </>
          ) : (
            "Reply"
          )}
        </button>
      </div>
    </div>
  );
}
