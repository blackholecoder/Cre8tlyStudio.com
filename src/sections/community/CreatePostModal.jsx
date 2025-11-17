import { useState } from "react";
import axiosInstance from "../../api/axios";
import { X } from "lucide-react";

export default function CreatePostModal({ topicId, onClose, onPosted }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = async () => {
    if (!title.trim()) return;

    try {
      await axiosInstance.post(`/community/posts/topics/${topicId}/posts`, {
        title,
        body,
      });

      onPosted();
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 mb-4"
          placeholder="Post title"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 min-h-[120px]"
          placeholder="Write your post..."
        />

        <button
          onClick={submit}
          className="mt-6 w-full bg-green text-black hover:bg-green-500 py-3 rounded-lg transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
