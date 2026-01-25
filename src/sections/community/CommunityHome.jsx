import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { headerLogo } from "../../assets/images";
import CreatePostModal from "./CreatePostModal";
import { Eye, MessageCircle } from "lucide-react";

export default function CommunityHome() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const [viewedTopics, setViewedTopics] = useState(new Set());

  const [posts, setPosts] = useState([]);
  const [activeTopic, setActiveTopic] = useState("all");
  const [showModal, setShowModal] = useState(null);

  async function handlePostClick(postId) {
    try {
      await axiosInstance.post(`/community/posts/${postId}/view`);
    } catch (err) {
      // intentionally silent, view tracking should never block navigation
    }

    navigate(`/community/post/${postId}`);
  }

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/community/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return activeTopic === "all"
      ? posts
      : posts.filter((p) => p.topic_id === activeTopic);
  }, [posts, activeTopic]);

  const generalTopicId = useMemo(() => {
    const general = topics.find((t) => t.slug === "general");
    return general?.id || "";
  }, [topics]);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await axiosInstance.get("/community/views");
        // returns: { viewedTopics: ["id1", "id2", ...] }
        setViewedTopics(new Set(res.data.viewedTopics));
      } catch (err) {
        console.error("Failed to load viewed topics:", err);
      }
    };

    fetchViews();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axiosInstance.get("/community/topics");
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    };

    fetchTopics();
  }, []);

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

  return (
    <div
      className="
    w-full h-screen overflow-hidden
    flex justify-center items-start
    px-6 py-20
    bg-dashboard-bg-light
    dark:bg-dashboard-bg-dark
  "
    >
      <div
        className="
    w-full max-w-5xl

    /* mobile */
    bg-transparent
    border-none
    rounded-none
    shadow-none
    p-0

    /* desktop */
    sm:bg-dashboard-sidebar-light
    sm:dark:bg-dashboard-sidebar-dark
    sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
    sm:rounded-xl
    sm:p-8
    lg:p-10
    sm:shadow-xl
    sm:backdrop-blur-sm

    max-h-[calc(100vh-160px)]
    flex flex-col
  "
      >
        {/* Logo */}
        <div className="flex items-center justify-center text-center">
          <img
            src={headerLogo}
            alt="Cre8tly"
            width={75}
            height={75}
            className="
    block
    select-none
  "
          />
        </div>

        {/* Page Title */}
        <h1
          className="
          text-3xl font-bold text-center normal-case
          text-dashboard-text-light
          dark:text-dashboard-text-dark mb-2
  "
        >
          Cre8tly Community
        </h1>
        <p
          className="
    text-center text-sm sm:text-base
    max-w-xl mx-auto
    text-dashboard-muted-light
    dark:text-dashboard-muted-dark
     mb-8
  "
        >
          A shared space for ideas, questions, discussions, and learning.
        </p>

        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() =>
              setShowModal({
                open: true,
                topicId: generalTopicId,
              })
            }
            className="
      px-6 py-3
      rounded-xl
      font-semibold
      bg-green text-black
      hover:opacity-90
      transition
    "
          >
            Write a post
          </button>
        </div>

        {/* Scrollable Topics */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-12 mb-6">
          <button
            onClick={() => setActiveTopic("all")}
            className={`px-4 h-9 rounded-full text-sm font-medium flex items-center justify-center
              ${
                activeTopic === "all"
                  ? "bg-green text-black"
                  : "border border-dashboard-border-light dark:border-dashboard-border-dark"
              }
            `}
          >
            All
          </button>

          {topics.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => navigate(`/community/topic/${t.id}`)}
              className={`px-4 h-9 rounded-full text-sm font-medium flex items-center justify-center whitespace-nowrap
  ${
    activeTopic === t.id
      ? "bg-green text-black"
      : "border border-dashboard-border-light dark:border-dashboard-border-dark"
  }
`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="
              relative
              w-full text-left
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              p-4 sm:p-5 rounded-xl
              border border-dashboard-border-light dark:border-dashboard-border-dark
              hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
              transition
            "
            >
              <div className="flex gap-4 items-start">
                {/* Post image */}
                {post.image_url && (
                  <div
                    className="
                    w-16 h-16
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Right content */}
                <div className="flex-1">
                  <h3
                    className="
                    text-base sm:text-lg font-semibold
                    text-dashboard-text-light dark:text-dashboard-text-dark
                    line-clamp-2
                  "
                  >
                    {post.title}
                  </h3>

                  {post.subtitle && (
                    <p
                      className="
                        mt-1 text-sm
                        text-dashboard-muted-light dark:text-dashboard-muted-dark
                        line-clamp-2
                      "
                    >
                      {post.subtitle}
                    </p>
                  )}

                  {/* Author row */}
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
                  {/* Meta stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
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
          ))}
        </div>
      </div>
      {showModal?.open && (
        <CreatePostModal
          topicId={showModal.topicId}
          topics={topics}
          onClose={() => setShowModal(null)}
          onPosted={() => {
            setShowModal(null);
            fetchPosts();
            // optionally refetch posts
          }}
        />
      )}
    </div>
  );
}
