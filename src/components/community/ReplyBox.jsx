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
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
        placeholder="Write a reply..."
      />

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={submit}
          className="bg-green text-black px-4 py-1.5 rounded-md hover:bg-green/90 text-sm transition"
        >
          Reply
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
