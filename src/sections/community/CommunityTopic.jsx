import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Eye, MessageCircle, Plus } from "lucide-react";
// import CreatePostModal from "./CreatePostModal";

export default function CommunityTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
        `/community/topics/${topicId}/posts`,
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
      <div
        className="flex items-center gap-2 text-sm
      text-dashboard-muted-light dark:text-dashboard-muted-dark mb-4"
      >
        <button
          onClick={() => navigate("/community")}
          className="opacity-70 hover:opacity-100 transition"
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
        <h1
          className="text-2xl font-semibold
          text-dashboard-text-light dark:text-dashboard-text-dark"
        >
          {topic.name}
        </h1>
        {posts.length > 0 && (
          <button
            onClick={() =>
              navigate("/community/create-post", {
                state: {
                  topicId: topic.id,
                  topicName: topic.name,
                },
              })
            }
            className="
          flex items-center gap-2
          px-3 py-1.5
          rounded-md text-sm
          border border-dashboard-border-light dark:border-dashboard-border-dark
          text-dashboard-text-light dark:text-dashboard-text-dark
          hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
          transition
          focus:outline-none focus:ring-2 focus:ring-green/30
        "
          >
            <Plus size={18} />
            New Post
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 && (
          <div
            className="
        mt-16
        px-6
        py-12
        rounded-xl
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        text-center
      "
          >
            <h2
              className="
          text-lg font-semibold
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          mb-2
        "
            >
              This is the {topic.name} room
            </h2>

            <p
              className="
          text-sm
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark
          max-w-md
          mx-auto
          leading-relaxed
        "
            >
              No one has started a conversation here yet. This space is for
              ideas, questions, and writing related to {topic.name}. Be the
              first to set the tone.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="
          mt-6
          px-5 py-2.5
          rounded-lg
          bg-green text-black
          font-medium
          hover:opacity-90
          transition
        "
            >
              Write the first post
            </button>
          </div>
        )}
        {posts.map((post) => {
          return (
            <button
              key={post.id}
              onClick={async () => {
                try {
                  await axiosInstance.post(`/community/${topicId}/mark-viewed`);
                } catch (err) {}
                navigate(`/community/post/${post.id}`, {
                  state: { from: location.pathname },
                });
              }}
              className="
              relative w-full text-left
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              p-3 sm:p-4 rounded-xl
              border border-dashboard-border-light dark:border-dashboard-border-dark
              hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
              transition
              active:scale-[0.99]
            "
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left image */}
                {post.image_url && (
                  <div
                    className="
                    w-full sm:w-16
                    aspect-[4/1] sm:aspect-square
                    rounded-lg
                    overflow-hidden
                    border border-dashboard-border-light
                    dark:border-dashboard-border-dark
                    flex-shrink-0
                  "
                  >
                    <img
                      src={post.image_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="
                      w-full h-full object-cover
                      bg-dashboard-hover-light
                      dark:bg-dashboard-hover-dark
                    "
                    />
                  </div>
                )}
                {/* Right content */}
                <div className="flex-1">
                  <h3
                    className="
                    text-base sm:text-lg font-semibold line-clamp-2
                    text-dashboard-text-light dark:text-dashboard-text-dark
                  "
                  >
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p
                      className="
                      mt-1
                      text-sm sm:text-base
                      font-medium
                      leading-snug
                      line-clamp-2
                      text-dashboard-muted-light
                      dark:text-dashboard-muted-dark
                    "
                    >
                      {post.subtitle}
                    </p>
                  )}

                  <p
                    className="
                    text-sm mt-1
                    text-dashboard-muted-light dark:text-dashboard-muted-dark
                  "
                  >
                    By {post.author}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    <div className="flex items-center gap-[3px]">
                      <Eye size={14} className="opacity-70" />
                      <span>{post.views ?? 0}</span>
                      <span>views</span>
                    </div>

                    <div className="flex items-center gap-[3px]">
                      <MessageCircle size={14} className="opacity-70" />
                      <span>{post.comment_count ?? 0}</span>
                      <span>comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {/* {showModal && (
        <CreatePostModal
          key={topicId}
          topicId={topicId}
          topicName={topic.name}
          onClose={() => setShowModal(false)}
          onPosted={load}
        />
      )} */}
    </div>
  );
}
