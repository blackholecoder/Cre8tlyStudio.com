import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../admin/AuthContext";
import { formatPostDate } from "../../helpers/formatPostDate";
import { confirmDelete } from "../../helpers/confirmToast";
import { toast } from "react-toastify";
import TipModal from "./modals/TipModal";
import PostHeader from "./posts/PostHeader";
import PostBody from "./posts/PostBody";
import CommentsSection from "./posts/CommentsSection";

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
  const [subscriberHasPaid, setSubscriberHasPaid] = useState(false);

  // paid subs state
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);

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
  prose-p:text-dashboard-text-light
  prose-headings:text-dashboard-text-light
  prose-strong:text-dashboard-text-light
  prose-li:text-dashboard-text-light
  dark:prose-p:text-dashboard-text-dark
  dark:prose-headings:text-dashboard-text-dark
  dark:prose-strong:text-dashboard-text-dark
  dark:prose-li:text-dashboard-text-dark
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
      redirectBase: "/community",
    },
  };

  const redirectPath = isFragment
    ? `/community`
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
          setHasPaidSubscription(subRes.data.has_paid_subscription);
          setSubscriberHasPaid(subRes.data.subscriber_has_paid);
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
      console.log("🧪 COMMENTS FETCH RESULT", {
        targetType,
        targetId: postData.id,
        count: res2.data.comments?.length,
        comments: res2.data.comments,
      });
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

    // already subscribed → unsubscribe directly
    if (isSubscribed) {
      setSubLoading(true);
      try {
        await axiosInstance.delete(
          `/community/subscriptions/${post.user_id}/subscribe`,
        );
        setIsSubscribed(false);
      } catch (err) {
        console.error("Unsubscribe failed", err);
      }
      setSubLoading(false);
      return;
    }

    // NOT subscribed yet
    if (!hasPaidSubscription) {
      // 👉 free subscribe immediately
      setSubLoading(true);
      try {
        await axiosInstance.post(
          `/community/subscriptions/${post.user_id}/subscribe`,
        );
        setIsSubscribed(true);
      } catch (err) {
        console.error("Subscribe failed", err);
      }
      setSubLoading(false);
      return;
    }

    // 👉 paid subscription exists → go to choice page
    navigate(`/community/subscribe/${post.user_id}/choose`, {
      state: {
        from: redirectPath,
      },
    });
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
      const res = await axiosInstance.put(`/community/comments/${commentId}`, {
        body: editBody,
      });

      const { body: updatedBody, updated_at } = res.data.comment;

      // 1️⃣ Update top-level comments
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, body: updatedBody, updated_at } : c,
        ),
      );

      // 2️⃣ Update replies (nested comments)
      setReplies((prev) => {
        const next = { ...prev };

        Object.keys(next).forEach((parentId) => {
          next[parentId] = next[parentId].map((r) =>
            r.id === commentId ? { ...r, body: updatedBody, updated_at } : r,
          );
        });

        return next;
      });

      setEditCommentId(null);
      setEditBody("");
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Failed to save edit");
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

  const backTo =
    location.state?.returnTo ||
    (isFragment
      ? "/community"
      : post
        ? `/community/topic/${post.topic_id}`
        : "/community");

  useEffect(() => {
    if (!backTo) return;

    window.history.replaceState(
      {
        ...window.history.state,
        backTo,
      },
      "",
    );
  }, [backTo]);

  if (!post) {
    return <div className="p-10 text-center opacity-60">Loading post…</div>;
  }

  const COMMENTS_VISIBILITY = {
    PUBLIC: "public",
    PAID: "paid",
    PRIVATE: "private",
  };

  const isCommentsPaid = post.comments_visibility === COMMENTS_VISIBILITY.PAID;

  const isCommentsPrivate =
    post.comments_visibility === COMMENTS_VISIBILITY.PRIVATE;

  const commentsLocked = (() => {
    // 1️⃣ Owner always allowed
    if (user?.id === post.user_id) return false;

    // 2️⃣ Admin hard lock always wins
    if (post.comments_locked === 1) return true;

    // 3️⃣ Paid comments require paid subscription
    if (isCommentsPaid && !subscriberHasPaid) return true;

    // 4️⃣ Private comments require ANY subscription
    if (isCommentsPrivate && !isSubscribed) return true;

    return false;
  })();

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
        pt-14

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
            <PostHeader
              post={post}
              user={user}
              navigate={navigate}
              isStudioPost={isStudioPost}
              isAdmin={isAdmin}
              avatarInitial={avatarInitial}
              toggleSubscribe={toggleSubscribe}
              subLoading={subLoading}
              isSubscribed={isSubscribed}
              formatPostDate={formatPostDate}
              timeAgo={timeAgo}
              togglePostLike={togglePostLike}
              commentsLocked={commentsLocked}
              handleShare={handleShare}
              copied={copied}
              tipSuccess={tipSuccess}
              openTipModal={openTipModal}
            />
            <PostBody
              post={post}
              isFragment={isFragment}
              user={user}
              navigate={navigate}
              toggleBookmark={toggleBookmark}
              bookmarkSuccess={bookmarkSuccess}
              fragmentClasses={fragmentClasses}
              htmlClasses={htmlClasses}
              timeAgo={timeAgo}
            />
          </div>

          <CommentsSection
            commentsState={{
              comments,
              setComments,
              replies,
              setReplies,
              setOpenReplies,
              replyPages,
              expandedComments,
              setExpandedComments,
              openReplies,
              activeReplyBox,
              editCommentId,
              editBody,
            }}
            postState={{
              post,
              setPost,
              commentsLocked,
              isCommentsPaid,
              targetType,
            }}
            handlers={{
              toggleLike,
              toggleReplies,
              loadReplies,
              setActiveReplyBox,
              setEditCommentId,
              setEditBody,
              saveEditedComment,
              handleDelete,
            }}
            uiHelpers={{
              user,
              navigate,
              redirectPath,
              timeAgo,
              observerRef,
            }}
          />
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
