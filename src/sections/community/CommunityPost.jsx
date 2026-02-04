import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import CreateCommentBox from "./CreateCommentBox";
import {
  ArrowLeft,
  ShieldCheck,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Check,
  DollarSign,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../../admin/AuthContext";
import CommentThread from "./CommentThread";
import ReplyBox from "../../components/community/ReplyBox";
import { Img } from "react-image";
import { headerLogo } from "../../assets/images";
import { renderTextWithLinks } from "../../helpers/renderTextWithLinks";
import { formatPostDate } from "../../helpers/formatPostDate";
import { confirmDelete } from "../../helpers/confirmToast";
import { ButtonSpinner } from "../../helpers/buttonSpinner";
import { toast } from "react-toastify";
import TipModal from "./modals/TipModal";

export default function CommunityPost({ targetType = "post" }) {
  const isFragment = targetType === "fragment";
  const { user, authLoading } = useAuth();
  const { slug, id } = useParams();
  const targetId = isFragment ? id : slug;
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openReplies, setOpenReplies] = useState({});
  const [replies, setReplies] = useState({});
  const [copied, setCopied] = useState(false);

  const [editCommentId, setEditCommentId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const [tipSuccess, setTipSuccess] = useState(false);

  const [replyPages, setReplyPages] = useState({});

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightedCommentId = params.get("comment");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const [tipOpen, setTipOpen] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);

  const fragmentClasses = `
  post-body-frag
  max-w-none
  text-sm leading-relaxed
  text-dashboard-text-light dark:text-dashboard-text-dark
  whitespace-pre-wrap
`;

  const htmlClasses = `
  post-body
  prose prose-md max-w-none
  prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-800
  prose-pre:text-gray-100
  prose-pre:overflow-x-auto
  prose-code:text-[#e5e7eb]
  dark:prose-invert
  text-dashboard-text-light dark:text-dashboard-text-dark
`;

  const targetConfig = {
    post: {
      fetch: (slug) => axiosInstance.get(`/community/posts/${slug}`),
      fetchComments: (id, page, limit) =>
        axiosInstance.get(
          `/community/posts/${id}/comments?page=${page}&limit=${limit}`,
        ),
      idKey: "id",
      redirectBase: "/community/post",
    },
    fragment: {
      fetch: (id) => axiosInstance.get(`/fragments/${id}`),
      fetchComments: (id, page, limit) =>
        axiosInstance.get(
          `/community/comments?targetType=fragment&targetId=${id}&page=${page}&limit=${limit}`,
        ),
      idKey: "id",
      redirectBase: "/community/fragments",
    },
  };

  const redirectPath = isFragment
    ? `/community/fragments/${post?.id}`
    : `/community/post/${post?.slug}`;

  useEffect(() => {
    if (!comments.length) return;

    setExpandedComments((prev) => {
      const next = { ...prev };

      comments.forEach((c) => {
        if (next[c.id] === undefined) {
          next[c.id] = c.body.length <= 420; // short comments auto-expanded
        }
      });

      return next;
    });
  }, [comments]);

  const openTipModal = () => {
    if (!user) {
      navigate(`/signup-community?redirect=${redirectPath}`);
      return;
    }
    setTipOpen(true);
  };

  const handleTip = async (amountInCents) => {
    if (tipLoading) return;
    setTipLoading(true);

    try {
      const res = await axiosInstance.post(
        "/seller-checkout/create-checkout-session",
        {
          checkoutType: "tip",
          targetType, // 👈 already "post" or "fragment"
          targetId: post.id, // 👈 ALWAYS post.id (fragment ids are also ids)
          tipAmountInCents: amountInCents,
        },
      );

      window.location.href = res.data.url;
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "Recipient cannot receive tips") {
        toast.info(
          "This writer hasn’t enabled tips yet. You’ll be able to support them once they do.",
        );
        setTipLoading(false);
        return;
      }

      toast.error("Failed to start tip checkout");
      console.error(err);
    }

    setTipLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!post) return;

    if (!user) {
      navigate(`/signup-community?redirect=${redirectPath}`, {
        replace: true,
      });
    }
  }, [user, authLoading, post, redirectPath]);

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

  // Load post + first page of comments
  const load = async () => {
    try {
      const res = await targetConfig[targetType].fetch(targetId);
      const postData =
        targetType === "fragment" ? res.data.fragment : res.data.post;

      if (!postData) {
        console.error("Missing post data:", res.data);
        return;
      }
      setPost(postData);

      if (user?.id && postData?.user_id && user.id !== postData.user_id) {
        try {
          const subRes = await axiosInstance.get(
            `/community/subscriptions/${postData.user_id}/status`,
          );
          setIsSubscribed(subRes.data.subscribed);
        } catch (err) {
          console.error("Failed to load subscription status", err);
        }
      }

      const res2 = await targetConfig[targetType].fetchComments(
        postData.id,
        1,
        10,
      );

      setComments(res2.data.comments || []);
      setPage(res2.data.nextPage || null);
      setHasMore(!!res2.data.nextPage);
    } catch (err) {
      console.error("Failed to load:", err);
    }
  };

  const toggleSubscribe = async () => {
    if (subLoading) return;

    if (!user) {
      navigate(`/signup-community?redirect=${redirectPath}`);
      return;
    }

    setSubLoading(true);

    try {
      if (isSubscribed) {
        await axiosInstance.delete(
          `/community/subscriptions/${post.user_id}/subscribe`,
        );
        setIsSubscribed(false);
      } else {
        await axiosInstance.post(
          `/community/subscriptions/${post.user_id}/subscribe`,
        );
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Subscription toggle failed", err);
    }

    setSubLoading(false);
  };

  const togglePostLike = async () => {
    if (!user) {
      navigate(`/signup-community?redirect=${redirectPath}`);
      return;
    }

    const payload = {
      targetType,
      targetId: post.id,
    };

    try {
      if (post.has_liked) {
        await axiosInstance.delete("/community/delete-like", { data: payload });

        setPost((prev) => ({
          ...prev,
          has_liked: 0,
          like_count: Math.max(prev.like_count - 1, 0),
        }));
      } else {
        await axiosInstance.post("/community/likes", payload);

        setPost((prev) => ({
          ...prev,
          has_liked: 1,
          like_count: prev.like_count + 1,
        }));
      }
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate(`/signup-community?redirect=${redirectPath}`);
      return;
    }

    // optimistic update
    setPost((prev) => {
      const wasBookmarked = prev.is_bookmarked;

      return {
        ...prev,
        is_bookmarked: !wasBookmarked,
        save_count: Math.max(
          (prev.save_count || 0) + (wasBookmarked ? -1 : 1),
          0,
        ),
      };
    });

    try {
      const res = await axiosInstance.post(`/community/bookmark/${post.id}`);

      // reconcile with server truth
      setPost((prev) => ({
        ...prev,
        is_bookmarked: res.data.bookmarked,
      }));

      if (res.data.bookmarked) {
        setBookmarkSuccess(true);
        setTimeout(() => setBookmarkSuccess(false), 1200);
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);

      // rollback on failure
      setPost((prev) => {
        const wasBookmarked = prev.is_bookmarked;

        return {
          ...prev,
          is_bookmarked: !wasBookmarked,
          save_count: Math.max(
            (prev.save_count || 0) + (wasBookmarked ? -1 : 1),
            0,
          ),
        };
      });

      toast.error("Failed to save bookmark");
    }
  };

  useEffect(() => {
    if (params.get("tipped") === "1") {
      setTipSuccess(true);

      // remove param so it doesn't re-trigger
      const url = new URL(window.location.href);
      url.searchParams.delete("tipped");
      window.history.replaceState({}, "", url.pathname);

      setTimeout(() => {
        setTipSuccess(false);
      }, 1800);
    }
  }, []);

  useEffect(() => {
    if (!targetId) return;
    load();
  }, [targetId, user]);

  // Infinite scroll load
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await targetConfig[targetType].fetchComments(
        post.id,
        page,
        10,
      );

      setComments((prev) => [...prev, ...(res.data.comments || [])]);

      if (res.data.nextPage) setPage(res.data.nextPage);
      else setHasMore(false);
    } catch (err) {
      console.error("Load more failed:", err);
    }

    setLoadingMore(false);
  };

  const observerRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  // Load replies for a comment
  const loadReplies = async (commentId, page = 1) => {
    const limit = 5;

    try {
      const res = await axiosInstance.get(
        `/community/comments/${commentId}/replies?page=${page}&limit=${limit}`,
      );

      // CLEAN the data
      let newReplies = res.data.replies || [];
      newReplies = newReplies.filter((r) => r && r.id);

      const freshReplies = [...newReplies];

      setReplies((prev) => ({
        ...prev,
        [commentId]:
          page === 1
            ? [...freshReplies]
            : [...(prev[commentId] || []), ...freshReplies],
      }));

      setReplyPages((prev) => ({
        ...prev,
        [commentId]: res.data.nextPage,
      }));
    } catch (err) {
      console.error("Failed to load replies:", err);
    }
  };

  // Toggle reply expansion
  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    // Only load ONCE
    if (!replies[commentId]) {
      loadReplies(commentId);
    }
  };

  const saveEditedComment = async (commentId) => {
    try {
      await axiosInstance.put(`/community/comments/${commentId}`, {
        body: editBody,
      });

      // Reload comments or patch it locally
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, body: editBody } : c)),
      );

      setEditCommentId(null);
      setEditBody("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDelete = (commentId, parentId = null) => {
    confirmDelete({
      message: "Delete this comment?",
      onConfirm: async () => {
        try {
          // 🔥 optimistic UI removal
          if (parentId) {
            setReplies((prev) => ({
              ...prev,
              [parentId]: (prev[parentId] || []).filter(
                (r) => r.id !== commentId,
              ),
            }));
          } else {
            setComments((prev) => prev.filter((c) => c.id !== commentId));

            setPost((prev) => ({
              ...prev,
              comment_count: Math.max((prev.comment_count || 1) - 1, 0),
            }));
          }

          await axiosInstance.delete(`/community/comments/${commentId}`);

          toast.success("Comment deleted");
        } catch (err) {
          console.error("❌ Delete failed:", err);
          toast.error("Failed to delete comment");
        }
      },
    });
  };

  const toggleLike = async (comment, parentId = null) => {
    try {
      if (comment.user_liked) {
        await axiosInstance.delete(`/community/comments/${comment.id}/like`);
        comment.like_count -= 1;
        comment.user_liked = 0;
      } else {
        await axiosInstance.post(`/community/comments/${comment.id}/like`);
        comment.like_count += 1;
        comment.user_liked = 1;
      }

      // Update UI
      if (parentId) {
        // reply
        setReplies((prev) => ({
          ...prev,
          [parentId]: [...prev[parentId]],
        }));
      } else {
        // top-level comment
        setComments([...comments]);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  useEffect(() => {
    if (!highlightedCommentId) return;

    setTimeout(() => {
      const el = document.getElementById(`comment-${highlightedCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-green", "rounded-lg");

        // remove highlight after 3 sec
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-green");
        }, 3000);
      }
    }, 500);
  }, [comments, replies]);

  if (!post) {
    return <div className="p-10 text-center opacity-60">Loading post…</div>;
  }

  const backTo =
    location.state?.from ||
    (isFragment ? "/community/fragments" : `/community/topic/${post.topic_id}`);

  const avatarInitial = post.author?.charAt(0)?.toUpperCase() ?? "U";
  const isStudioPost = post.is_admin_post === 1;

  const timeAgo = (d) => {
    const date = new Date(d);
    const diff = Math.floor((Date.now() - date) / 1000);
    if (diff < 60) return "Just now";
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const isAdmin = post.author_role === "admin";

  const shareUrl = isFragment
    ? `${window.location.origin}/community/fragments/${post.id}`
    : `${window.location.origin}/p/${post.slug}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div
      className="
      w-full flex justify-center items-start min-h-screen
      px-0 py-0
      sm:px-6 sm:py-0
      lg:py-0
    "
    >
      <div
        className="
    w-full max-w-4xl

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

    space-y-6 sm:space-y-8 lg:space-y-10
  "
      >
        {/* Breadcrumb */}
        <div
          className="
  w-full mb-6 text-sm flex items-center gap-2
  text-dashboard-muted-light dark:text-dashboard-muted-dark
"
        >
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1 opacity-70 hover:opacity-100 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Main content */}
        <div className="w-full space-y-6 sm:space-y-8 lg:space-y-100">
          {/* Post Card */}
          <div
            className="
            bg-transparent
            border-none
            rounded-none
            shadow-none
            p-0

            sm:bg-dashboard-sidebar-light
            sm:dark:bg-dashboard-sidebar-dark
            sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
            sm:rounded-xl
            sm:p-8
            sm:shadow-lg
          "
          >
            <div className="flex items-start gap-4 mb-4 sm:mb-6">
              <button
                title={
                  !post.author_has_profile ? "Profile coming soon" : undefined
                }
                onClick={() => {
                  // Own post → no navigation
                  if (user?.id === post.user_id) return;

                  // Author has no profile → block + inform
                  if (!post.author_has_profile) {
                    toast.info("This! author hasn’t set up their profile yet");
                    return;
                  }

                  // Safe navigation
                  navigate(`/community/authors/${post.user_id}`);
                }}
                className={`group -mt-2.5 ${!post.author_has_profile ? "cursor-default" : "cursor-pointer"}`}
              >
                {isStudioPost ? (
                  <img
                    src={headerLogo}
                    className="w-12 h-12 rounded-full object-cover"
                    alt="The Messy Attic"
                  />
                ) : post.author_image ? (
                  <Img
                    src={post.author_image}
                    loader={
                      <div className="w-12 h-12 rounded-full bg-gray-700/40 animate-pulse" />
                    }
                    unloader={
                      <div
                        className="w-12 h-12 rounded-full border flex items-center justify-center text-xl font-bold bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                      border-dashboard-border-light dark:border-dashboard-border-dark
                      text-dashboard-muted-light dark:text-dashboard-muted-dark"
                      >
                        {avatarInitial}
                      </div>
                    }
                    decode={true}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover  shadow-xl transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green/90 border border-green flex items-center justify-center text-xl font-bold text-green">
                    {avatarInitial}
                  </div>
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-[1px]">
                    <p className="text-dashboard-text-light dark:text-dashboard-text-dark text-lg font-semibold">
                      {post.author}
                    </p>

                    {(isStudioPost || isAdmin) && (
                      <span
                        className="
                        flex items-center
                        text-dashboard-muted-light dark:text-dashboard-muted-dark
                        text-[10px]
                        px-0.5 py-0.5
                        rounded-full
                      "
                      >
                        <ShieldCheck
                          size={15}
                          className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
                        />
                      </span>
                    )}
                  </div>

                  {/* Subscribe button */}
                  {!isStudioPost && user?.id !== post.user_id && (
                    <button
                      onClick={toggleSubscribe}
                      disabled={subLoading}
                      className={`
                      text-xs
                      px-2
                      py-1
                      min-w-[88px]
                      rounded-md
                      border
                      transition
                      flex
                      items-center
                      justify-center
                      gap-1

                      ${
                        isSubscribed
                          ? "bg-green/10 text-green border-green/30"
                          : "bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark text-dashboard-text-light dark:text-dashboard-text-dark"
                      }

                      ${subLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"}
                    `}
                    >
                      {subLoading ? (
                        <>
                          <ButtonSpinner />
                          <span>
                            {isSubscribed ? "Updating" : "Subscribing"}
                          </span>
                        </>
                      ) : (
                        <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm mt-1 flex items-center flex-wrap gap-1">
                  <span>{formatPostDate(post.created_at)}</span>
                  <span className="mx-1">·</span>
                  <span className="opacity-80">{timeAgo(post.created_at)}</span>
                  <span className="mx-1">·</span>
                  <span className="flex items-center gap-1 opacity-80">
                    <Bookmark
                      size={12}
                      className="text-dashboard-muted-light dark:text-dashboard-muted-dark stroke-[2]"
                    />
                    {post.save_count}
                  </span>
                </p>

                {/* Mobile meta + actions */}
                <div
                  className="
                  sm:hidden
                  mt-2
                  w-full
                  flex items-center
                  justify-between
                  text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                "
                >
                  {/* Views (meta, not clickable) */}

                  {/* Actions */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye size={18} className="opacity-70" />
                      <span>{post.views ?? 0}</span>
                    </div>

                    {/* Like */}
                    <button
                      onClick={togglePostLike}
                      className="
                      flex items-center gap-2
                      text-sm
                      active:scale-95
                      transition
                    "
                    >
                      <Heart
                        size={18}
                        className={
                          post.has_liked
                            ? "text-red-500 fill-red-500"
                            : "opacity-80"
                        }
                      />
                      <span>{post.like_count ?? 0}</span>
                    </button>

                    {/* Comments */}
                    <button
                      onClick={() =>
                        document
                          .getElementById("comments")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="
                      flex items-center gap-2
                      text-sm
                      active:scale-95
                      transition
                    "
                    >
                      <MessageCircle size={18} className="opacity-80" />
                      <span>{post.comment_count ?? 0}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={handleShare}
                      className="
                      flex items-center gap-2
                      text-sm
                      active:scale-95
                      transition
                    "
                    >
                      {copied ? (
                        <>
                          <Check size={18} className="text-green" />
                        </>
                      ) : (
                        <>
                          <Share2 size={18} className="opacity-80" />
                        </>
                      )}
                    </button>
                    {user &&
                      user.id !== post.user_id &&
                      (tipSuccess ? (
                        <div className="flex items-center gap-2 text-sm text-green">
                          <Check size={18} />
                          <span>Sent</span>
                        </div>
                      ) : (
                        <button
                          onClick={openTipModal}
                          className="
                          flex items-center gap-2
                          text-sm
                          active:scale-95
                          transition
                        "
                        >
                          <DollarSign size={18} className="opacity-80" />
                          <span>Tip</span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-6 mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  <div className="flex items-center gap-[3px]">
                    <Eye size={16} />
                    <span>{post.views ?? 0}</span>
                  </div>

                  <button
                    onClick={togglePostLike}
                    className={`
                    flex items-center gap-[3px]
                    transition
                    ${post.has_liked ? "text-red-500" : "opacity-70 hover:opacity-100"}
                  `}
                  >
                    <Heart
                      size={16}
                      fill={post.has_liked ? "currentColor" : "transparent"}
                    />
                    <span>{post.like_count ?? 0}</span>
                  </button>

                  <div className="flex items-center gap-[3px]">
                    <MessageCircle size={16} className="opacity-70" />
                    <span>{post.comment_count ?? 0}</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="
                    relative
                    flex items-center gap-1
                     hover:text-sky-400/80
                    transition
                  "
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-green" />
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                      </>
                    )}
                  </button>
                  {user &&
                    user.id !== post.user_id &&
                    (tipSuccess ? (
                      <div className="flex items-center gap-1 text-green text-xs">
                        <Check size={14} />
                        <span>Tip sent!</span>
                      </div>
                    ) : (
                      <button
                        onClick={openTipModal}
                        className="
                        flex items-center gap-1
                        text-dashboard-muted-light
                        dark:text-dashboard-muted-dark
                        hover:text-green
                        transition
                      "
                      >
                        <DollarSign size={16} />
                        <span>Tip</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              {!isFragment && (
                <h2
                  className="
                not-prose
                text-3xl sm:text-3xl
                font-bold
                tracking-tight
                leading-tight
                text-dashboard-text-light
                dark:text-dashboard-text-dark
              "
                >
                  {post.title}
                </h2>
              )}

              {!isFragment && user && (
                <button
                  onClick={toggleBookmark}
                  className="
                  mt-1
                  p-2
                  rounded-lg
                  text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                  hover:bg-dashboard-hover-light
                  dark:hover:bg-dashboard-hover-dark
                  active:scale-95
                  transition
                "
                  title={post.is_bookmarked ? "Saved" : "Save for later"}
                >
                  {bookmarkSuccess ? (
                    <Check size={18} className="text-green" />
                  ) : (
                    <Bookmark
                      size={18}
                      className={
                        post.is_bookmarked
                          ? "text-green stroke-[2.2]"
                          : "opacity-80"
                      }
                    />
                  )}
                </button>
              )}
            </div>

            {!isFragment && post.subtitle && (
              <p
                className="
                text-base sm:text-lg
                font-normal
                leading-relaxed
                max-w-2xl
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
              "
              >
                {post.subtitle}
              </p>
            )}

            {post.image_url && (
              <div className="mb-6">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="
                w-full
                max-h-[420px]
                object-cover
                rounded-xl
                mt-12
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
              "
                />
              </div>
            )}
            <div className={isFragment ? fragmentClasses : htmlClasses}>
              {isFragment ? (
                <p>{post.body}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h2
              className="text-xl font-semibold mb-5
            text-dashboard-text-light dark:text-dashboard-text-dark"
            >
              Comments
            </h2>

            {comments.length === 0 && (
              <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark mb-6">
                No comments yet.
              </p>
            )}

            <div className="space-y-4 mb-10">
              {comments.map((c) => {
                const commentAvatar = c.author?.charAt(0).toUpperCase() ?? "U";
                const commentAdmin = c.author_role === "admin";

                const MAX_LENGTH = 420;

                const isExpanded = expandedComments[c.id] !== false;
                const isLong = c.body.length > MAX_LENGTH;

                const displayText =
                  !isExpanded && isLong
                    ? c.body.slice(0, MAX_LENGTH).trim() + "…"
                    : c.body;

                return (
                  <div
                    key={c.id}
                    className="
                    /* mobile */
                    bg-transparent
                    border-b border-dashboard-border-light/50 dark:border-dashboard-border-dark/50
                    rounded-none
                    shadow-none
                    p-3

                    /* desktop */
                    sm:bg-dashboard-sidebar-light
                    sm:dark:bg-dashboard-sidebar-dark
                    sm:border sm:border-dashboard-border-light sm:dark:border-dashboard-border-dark
                    sm:rounded-lg
                    sm:p-5
                    lg:p-6
                    sm:shadow-inner
                  "
                  >
                    <div className="flex items-start gap-4">
                      <button
                        title={
                          !c.author_has_profile
                            ? "Profile coming soon"
                            : undefined
                        }
                        onClick={() => {
                          // own comment → no navigation
                          if (user?.id === c.user_id) return;

                          // no profile → block
                          if (!c.author_has_profile) {
                            toast.info(
                              "This author hasn’t set up their profile yet",
                            );
                            return;
                          }

                          // navigate
                          navigate(`/community/authors/${c.user_id}`);
                        }}
                        className={`flex-shrink-0 ${
                          !c.author_has_profile
                            ? "cursor-default"
                            : "cursor-pointer"
                        }`}
                      >
                        {c.author_image ? (
                          <Img
                            src={c.author_image}
                            loader={
                              <div className="w-8 h-8 rounded-full bg-gray-700/40 animate-pulse" />
                            }
                            unloader={
                              <div
                                className="
                                w-10 h-10 rounded-full
                                flex items-center justify-center
                                text-sm font-semibold
                                bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                                border border-dashboard-border-light dark:border-dashboard-border-dark
                                text-dashboard-muted-light dark:text-dashboard-muted-dark
                              "
                              >
                                {commentAvatar}
                              </div>
                            }
                            decode
                            alt="Comment avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-700 transition-opacity duration-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                            {commentAvatar}
                          </div>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-0">
                            <span
                              className="
                              font-medium
                              text-dashboard-muted-light
                              dark:text-dashboard-muted-dark
                            "
                            >
                              {c.author}
                            </span>

                            {commentAdmin && (
                              <span
                                className="
                                flex items-center gap-1
                                text-dashboard-muted-light dark:text-dashboard-muted-dark
                                text-xs
                                px-1
                                rounded-full
                              "
                              >
                                <ShieldCheck
                                  className="text-dashboard-muted-light dark:text-green"
                                  size={12}
                                />
                              </span>
                            )}
                          </div>
                          <span>{timeAgo(c.created_at)}</span>
                        </div>
                        {editCommentId !== c.id && (
                          <>
                            <div
                              className="
                              prose prose-sm max-w-none
                              my-1
                              text-dashboard-text-light dark:text-dashboard-text-dark
                              whitespace-pre-wrap
                              dark:prose-invert
                              dark:prose-a:text-sky-400
                              dark:prose-a:decoration-sky-400
                            "
                            >
                              {renderTextWithLinks(displayText)}
                            </div>

                            {!isExpanded && isLong && (
                              <button
                                onClick={() =>
                                  setExpandedComments((prev) => ({
                                    ...prev,
                                    [c.id]: true,
                                  }))
                                }
                                className="text-xs text-sky-400 mt-1 hover:underline"
                              >
                                See more
                              </button>
                            )}

                            {isExpanded && isLong && (
                              <button
                                onClick={() =>
                                  setExpandedComments((prev) => ({
                                    ...prev,
                                    [c.id]: false,
                                  }))
                                }
                                className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-1 hover:underline"
                              >
                                See less
                              </button>
                            )}
                          </>
                        )}

                        {editCommentId === c.id && (
                          <div className="mt-3">
                            <textarea
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="
                              w-full
                              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                              border border-dashboard-border-light dark:border-dashboard-border-dark
                              p-2 rounded
                              text-dashboard-text-light dark:text-dashboard-text-dark
                              text-sm
                            "
                              rows={3}
                            />

                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => saveEditedComment(c.id)}
                                className="px-3 py-1 bg-blue text-white text-xs rounded hover:bg-blue/90"
                              >
                                Save
                              </button>

                              <button
                                onClick={() => {
                                  setEditCommentId(null);
                                  setEditBody("");
                                }}
                                className="
                                px-3 py-1
                                bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                                text-dashboard-muted-light dark:text-dashboard-muted-dark
                                border border-dashboard-border-light dark:border-dashboard-border-dark
                                text-xs rounded
                                hover:opacity-80
"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action Row */}
                        {editCommentId !== c.id && (
                          <div className="flex items-center gap-3 mt-1.5">
                            <button
                              onClick={() => toggleLike(c)}
                              className={`text-xs ${
                                c.user_liked
                                  ? "text-red-600"
                                  : "text-dashboard-muted-light dark:text-dashboard-muted-dark"
                              } hover:opacity-80`}
                            >
                              <Heart
                                size={12}
                                fill={
                                  c.user_liked ? "currentColor" : "transparent"
                                }
                                className="inline-block mr-1"
                              />
                              {c.like_count}
                            </button>
                            {/* Reply is ALWAYS available */}
                            <button
                              onClick={() => setActiveReplyBox(c.id)}
                              className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                            >
                              Reply
                            </button>

                            {/* View / Hide replies only if replies exist */}
                            {c.reply_count > 0 && (
                              <button
                                onClick={() => toggleReplies(c.id)}
                                className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                              >
                                {openReplies[c.id]
                                  ? "Hide replies"
                                  : `View replies (${c.reply_count})`}
                              </button>
                            )}

                            {/* Edit */}
                            {!openReplies[c.id] &&
                              user &&
                              c.user_id === user.id && (
                                <button
                                  onClick={() => {
                                    setEditCommentId(c.id);
                                    setEditBody(c.body);
                                  }}
                                  className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                                >
                                  Edit
                                </button>
                              )}

                            {/* Delete */}
                            {!openReplies[c.id] &&
                              user &&
                              (c.user_id === user.id ||
                                post.user_id === user.id) && (
                                <button
                                  onClick={() => handleDelete(c.id)}
                                  className="text-xs text-dashboard-text-light dark:text-dashboard-text-dark hover:opacity-80"
                                >
                                  Delete
                                </button>
                              )}
                          </div>
                        )}

                        {activeReplyBox === c.id && (
                          <div className="mt-3 ml-6">
                            <ReplyBox
                              parentComment={c}
                              onReply={async (newReply) => {
                                // 1️⃣ add reply locally
                                setReplies((prev) => ({
                                  ...prev,
                                  [c.id]: [...(prev[c.id] || []), newReply],
                                }));

                                // 2️⃣ increment reply_count on the parent comment
                                setComments((prev) =>
                                  prev.map((comment) =>
                                    comment.id === c.id
                                      ? {
                                          ...comment,
                                          reply_count:
                                            (comment.reply_count || 0) + 1,
                                        }
                                      : comment,
                                  ),
                                );

                                // 3️⃣ open replies immediately
                                setOpenReplies((prev) => ({
                                  ...prev,
                                  [c.id]: true,
                                }));

                                // 4️⃣ close reply box
                                setTimeout(() => setActiveReplyBox(null), 100);
                              }}
                              onCancel={() => setActiveReplyBox(null)}
                            />
                          </div>
                        )}

                        {/* Replies */}
                        {openReplies[c.id] &&
                          (replies[c.id] || []).map((reply) => (
                            <CommentThread
                              key={reply.id}
                              postOwnerId={post.user_id}
                              comment={reply}
                              depth={1}
                              loadReplies={loadReplies}
                              replies={replies}
                              setReplies={setReplies}
                              replyPages={replyPages}
                              timeAgo={timeAgo}
                              toggleLike={toggleLike}
                              activeReplyBox={activeReplyBox}
                              setActiveReplyBox={setActiveReplyBox}
                              editCommentId={editCommentId}
                              editBody={editBody}
                              setEditBody={setEditBody}
                              setEditCommentId={setEditCommentId}
                              handleDelete={handleDelete}
                              onReplySubmit={saveEditedComment}
                              openReplies={openReplies}
                              toggleReplyVisibility={toggleReplies}
                              expandedComments={expandedComments}
                              setExpandedComments={setExpandedComments}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={observerRef} className="h-10"></div>
            </div>

            <CreateCommentBox
              targetType={targetType}
              targetId={post.id}
              onComment={(newComment) => {
                setComments((prev) => [newComment, ...prev]);

                setPost((prev) => ({
                  ...prev,
                  comment_count: (prev.comment_count || 0) + 1,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <TipModal
        open={tipOpen}
        loading={tipLoading}
        onTip={handleTip}
        onClose={() => setTipOpen(false)}
      />
    </div>
  );
}
