import { useState } from "react";
import axiosInstance from "../../api/axios";
import { ButtonSpinner } from "../../helpers/buttonSpinner";

export default function ReplyBox({ parentComment, postId, onReply, onCancel }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!body.trim() || loading) return;

    setLoading(true);

    const payload = {
      body,
      postId,
    };

    console.log("🟢 Reply payload:", payload);

    try {
      const res = await axiosInstance.post(
        `/community/comments/${parentComment.id}/reply`,
        payload,
      );

      console.log("🟢 Reply response:", res.data);

      setBody("");
      onReply(res.data.reply);
    } catch (err) {
      console.error("Failed to submit reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
