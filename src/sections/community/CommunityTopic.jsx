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
      const res2 = await axiosInstance.get(
        `/community/topics/${topicId}/posts`
      );
      setPosts(res2.data.posts);
    } catch (err) {
      console.error("Failed to load topic:", err);
    }
  };

  useEffect(() => {
  load();
}, [topicId]);

  useEffect(() => {
    // Always restore scrolling when this page mounts
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";

    return () => {
      // Ensure scroll is restored if you navigate away and come back
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  if (!topic) return null;

  return (
    <div className="pt-20 p-8 max-w-4xl mx-auto">
      {/* 🔙 Back + Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <button
          onClick={() => navigate("/community")}
          className="text-green hover:text-green/80 transition"
        >
          ← Back
        </button>

        <span className="mx-1">/</span>

        <button
          onClick={() => navigate("/community")}
          className="hover:text-gray-200"
        >
          Community
        </button>

        <span className="mx-1">/</span>

        <span className="text-gray-200">{topic.name}</span>
      </div>

      {/* Header + Create Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{topic.name}</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isNew =
            !topic.last_viewed ||
            new Date(post.created_at) > new Date(topic.last_viewed);

          return (
            <button
              key={post.id}
              onClick={async () => {
                try {
                  await axiosInstance.post(
                    `/community/${topicId}/mark-viewed`
                  );
                } catch (err) {}

                navigate(`/community/post/${post.id}`);
              }}
              className="relative w-full text-left bg-gray-900/80 p-5 rounded-xl border border-gray-700
                   hover:border-green hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] transition"
            >
              {isNew && (
                <span className="absolute top-3 right-3 bg-green text-black text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                  NEW
                </span>
              )}

              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-400 text-sm mt-1">By {post.author}</p>
            </button>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <CreatePostModal
          topicId={topicId}
          onClose={() => setShowModal(false)}
          onPosted={load}
        />
      )}
    </div>
  );
}
