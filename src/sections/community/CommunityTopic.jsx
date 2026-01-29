import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Eye, Heart, MessageCircle, Plus } from "lucide-react";
// import CreatePostModal from "./CreatePostModal";

export default function CommunityTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);

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
    <div className="sm:pt-16 px-0 sm:px-6 lg:px-6 max-w-4xl mx-auto">
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
              onClick={() =>
                navigate("/community/create-post", {
                  state: {
                    topicId: topic.id,
                    topicName: topic.name,
                  },
                })
              }
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
            <div
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
              w-full
              px-4 py-3
              sm:px-6 sm:py-4
              lg:px-8 lg:py-6
              border-b border-dashboard-border-light
              dark:border-dashboard-border-dark
              hover:bg-dashboard-hover-light
              dark:hover:bg-dashboard-hover-dark
              transition
              cursor-pointer
            "
            >
              <div className="grid grid-cols-[1fr_auto] gap-3 sm:gap-4 lg:gap-6 items-start">
                {/* Left image */}

                {/* Right content */}
                <div className="min-w-0">
                  <h3
                    className="
                    text-base sm:text-lg font-semibold line-clamp-1 lg:line-clamp-2
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
                      line-clamp-1 lg:line-clamp-2
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
                  <div className="flex items-center gap-2 mt-2">
                    {post.author_image ? (
                      <img
                        src={post.author_image}
                        alt=""
                        className="
                        w-6 h-6 rounded-full object-cover
                        border border-dashboard-border-light
                        dark:border-dashboard-border-dark
                      "
                      />
                    ) : (
                      <div
                        className="
                        w-6 h-6 rounded-full
                        bg-dashboard-hover-light
                        dark:bg-dashboard-hover-dark
                      "
                      />
                    )}

                    <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      {post.author} · {post.topic_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8 mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} className="opacity-70" />
                      <span>{post.views ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} className="opacity-70" />
                      <span>{post.like_count ?? 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MessageCircle size={14} className="opacity-70" />
                      <span>{post.comment_count ?? 0}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="
                  w-14 h-14
                  sm:w-16 sm:h-16
                  lg:w-20 lg:h-20
                  rounded-lg
                  flex-shrink-0
                  border border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  overflow-hidden
                  bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                "
                >
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full opacity-40" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
