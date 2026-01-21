import { useState } from "react";
import axiosInstance from "../../api/axios";

export default function ReplyBox({ parentId, postId, onReply, onCancel }) {
  const [body, setBody] = useState("");

  const submit = async () => {
    if (!body.trim()) return;

    try {
      await axiosInstance.post(`/community/comments/${parentId}/reply`, {
        body,
        postId,
      });

      setBody("");
      onReply();
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  return (
    <div className="mt-3 pl-10">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="
        w-full
        bg-dashboard-input-bg
        border border-dashboard-border
        rounded-lg
        p-3
        text-sm
        text-dashboard-text
        placeholder-dashboard-muted
        focus:outline-none
        focus:ring-2
        focus:ring-green/40
      "
        placeholder="Write a reply..."
      />

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={submit}
          className="
         bg-green
          text-dashboard-text-light
          px-4
          py-1.5
          rounded-md
          text-sm
          font-medium
          transition
          hover:bg-green/90
          focus:outline-none
          focus:ring-2
          focus:ring-green/40

        "
        >
          Reply
        </button>

        <button
          onClick={onCancel}
          className="
    px-4
    py-1.5
    bg-dashboard-hover-light dark:bg-dashboard-hover-dark
    text-dashboard-muted-light dark:text-dashboard-muted-dark
    text-sm
    rounded-md
    transition
    hover:bg-dashboard-border-light dark:hover:bg-dashboard-border-dark
    focus:outline-none
    focus:ring-2
    focus:ring-dashboard-border-light dark:focus:ring-dashboard-border-dark
  "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
