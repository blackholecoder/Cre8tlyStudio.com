import {
  Check,
  Eye,
  Heart,
  MessageSquare,
  MessageSquareLock,
  Share2,
} from "lucide-react";
import { formatDate, timeAgo } from "../../../helpers/date";

export function MobilePostCard({
  post,
  onOpen,
  onLike,
  onShare,
  isCommentsLocked,
  copiedPostId,
}) {
  return (
    <div
      onClick={onOpen}
      className="
        rounded-2xl
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        shadow-sm
        overflow-hidden
      "
    >
      {/* AUTHOR ROW */}
      <div className="flex items-start gap-3 px-4 pt-4">
        {post.author_image ? (
          <img
            src={post.author_image}
            alt=""
            className="
              w-8 h-8 rounded-full object-cover
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
            "
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
        )}

        <div>
          <p className="text-sm font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
            {post.author}
          </p>

          <div className="mt-1 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark flex items-center gap-1">
            <span>{formatDate(post.created_at)}</span>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>

            {post.updated_at &&
              new Date(post.updated_at) > new Date(post.created_at) && (
                <>
                  <span>·</span>
                  <span className="italic opacity-70">edited</span>
                </>
              )}
          </div>
        </div>
      </div>

      {/* IMAGE + BLENDED CAPTION */}
      <div className="mt-4 mx-4 rounded-xl overflow-hidden">
        {/* IMAGE */}
        {post.image_url ? (
          <img
            src={post.image_url}
            alt=""
            className="w-full h-60 object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="
            w-full h-60
            bg-dashboard-hover-light
            dark:bg-dashboard-hover-dark
            flex items-center justify-center
          "
          >
            <span className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
              No image uploaded
            </span>
          </div>
        )}

        {/* CAPTION PANEL */}
        <div className="relative bg-dashboard-sidebar-light dark:bg-dashboard-hover-dark">
          {/* FADE FROM IMAGE INTO PANEL */}
          <div
            className="
              absolute inset-x-0 -top-28 h-28
              bg-gradient-to-t
              from-dashboard-sidebar-light
              dark:from-dashboard-hover-dark
              to-transparent
              pointer-events-none
            "
          />

          {/* CONTENT */}
          <div className="relative px-4 py-4">
            <h3 className="text-lg font-semibold text-dashboard-text-light dark:text-dashboard-text-dark line-clamp-2">
              {post.title}
            </h3>

            {post.subtitle && (
              <p className="mt-1 text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark line-clamp-1">
                {post.subtitle}
              </p>
            )}

            <p className="mt-2 text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark line-clamp-2">
              {post.excerpt || post.body_preview || ""}
            </p>

            <button
              className="
              mt-4
              w-full
              rounded-lg
              bg-dashboard-border-light
              dark:bg-white/15
              text-dashboard-text-light
              dark:text-dashboard-text-dark
              font-semibold
              py-2.5
              text-sm
              hover:bg-dashboard-hover-light
              dark:hover:bg-white/25
              transition
            "
            >
              Read
            </button>
          </div>
        </div>
      </div>

      {/* ACTION ROW */}
      <div
        className="
        mt-2
        px-6 sm:px-0
        flex items-center gap-6
        py-3
        text-sm sm:text-xs
        text-dashboard-muted-light
        dark:text-dashboard-muted-dark
      "
      >
        {/* Views */}
        <div className="flex items-center gap-[2px]">
          <Eye size={16} className="opacity-70" />
          <span>{post.views ?? 0}</span>
        </div>

        {/* Like */}
        <button
          onClick={onLike}
          disabled={!onLike}
          className="flex items-center  gap-[2px] hover:opacity-80 transition disabled:opacity-60 disabled:cursor-default"
        >
          <Heart
            size={16}
            className={
              post.has_liked ? "text-red-500 fill-red-500" : "opacity-70"
            }
          />
          <span>{post.like_count ?? 0}</span>
        </button>

        {/* Comments */}
        <div className="flex items-center  gap-[2px] opacity-70">
          {isCommentsLocked ? (
            <MessageSquareLock size={16} />
          ) : (
            <MessageSquare size={16} />
          )}
          <span>{post.comment_count ?? 0}</span>
        </div>

        {/* Share */}
        <button
          onClick={onShare}
          disabled={!onShare}
          className="flex items-center  gap-[2px] hover:opacity-80 transition disabled:opacity-60 disabled:cursor-default"
        >
          {copiedPostId === post.id ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Share2 size={16} className="opacity-70" />
          )}
        </button>
      </div>
    </div>
  );
}
