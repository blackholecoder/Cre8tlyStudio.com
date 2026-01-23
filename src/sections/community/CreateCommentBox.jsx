import { useState } from "react";
import axiosInstance from "../../api/axios";

export default function CreateCommentBox({ postId, onComment }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!body.trim() || submitting) return;

    setSubmitting(true);

    try {
      const res = await axiosInstance.post(
        `/community/posts/${postId}/comments`,
        { body }
      );

      const newComment = res.data.comment;

      setBody("");

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
    <div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
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

      <button
        onClick={submit}
        disabled={submitting}
        className={`
    mt-4
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
        {submitting ? "Posting…" : "Comment"}
      </button>
    </div>
  );
}
