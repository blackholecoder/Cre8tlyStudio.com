import {
  Bookmark,
  Check,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  MessageSquareLock,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { Img } from "react-image";
import { headerLogo } from "../../../assets/images";

export default function PostHeader({
  post,
  user,
  navigate,
  isStudioPost,
  isAdmin,
  avatarInitial,
  subLoading,
  isSubscribed,
  formatPostDate,
  timeAgo,
  togglePostLike,
  commentsLocked,
  handleShare,
  copied,
  tipSuccess,
  openTipModal,
}) {
  return (
    <>
      <div className="flex items-start gap-4 mb-4 sm:mb-6">
        <button
          title={!post.author_has_profile ? "Profile coming soon" : undefined}
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
                onClick={() =>
                  navigate(`/community/subscribe/${post.user_id}/choose`, {
                    state: { from: window.location.pathname },
                  })
                }
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
                <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
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
              <div className="flex items-center gap-2 text-sm sm:text-xs">
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
                    post.has_liked ? "text-red-500 fill-red-500" : "opacity-80"
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
                {commentsLocked ? (
                  <MessageSquareLock size={15} className="opacity-80" />
                ) : (
                  <MessageSquare size={15} className="opacity-80" />
                )}
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
              {commentsLocked ? (
                <MessageSquareLock size={15} className="opacity-80" />
              ) : (
                <MessageSquare size={15} className="opacity-80" />
              )}
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
    </>
  );
}
