import { useState } from "react";
import axiosInstance from "../../api/axios";

export default function CreateCommentBox({ postId, onComment }) {
  const [body, setBody] = useState("");

  const submit = async () => {
    if (!body.trim()) return;

    try {
      await axiosInstance.post(`/community/posts/${postId}/comments`, {
        body,
      });

      setBody("");
      onComment();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 min-h-[100px]"
        placeholder="Write a comment..."
      />

      <button
        onClick={submit}
        className="mt-4 bg-black/60 hover:bg-green hover:text-black py-2 px-5 rounded-lg transition"
      >
        Comment
      </button>
    </div>
  );
}
