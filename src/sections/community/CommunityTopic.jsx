import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Plus } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

export default function CommunityTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
  try {
    // Get topic details
    const res = await axiosInstance.get(`/community/topics/${topicId}`);
    setTopic(res.data.topic);

    // Get posts in this topic
    const res2 = await axiosInstance.get(`/community/topics/${topicId}/posts`);
    setPosts(res2.data.posts);

  } catch (err) {
    console.error("Failed to load topic:", err);
  }
};


  useEffect(() => {
    load();
  }, [topicId]);

  if (!topic) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{topic.name}</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => navigate(`/community/post/${post.id}`)}
            className="w-full text-left bg-gray-900/80 p-5 rounded-xl border border-gray-700
                       hover:border-green hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] transition"
          >
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-400 text-sm mt-1">By {post.author}</p>
          </button>
        ))}
      </div>

      {showModal && (
        <CreatePostModal topicId={topicId} onClose={() => setShowModal(false)} onPosted={load} />
      )}
    </div>
  );
}
