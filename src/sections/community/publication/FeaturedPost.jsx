import { Check, Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedPost({
  post,
  authorName,
  authorId,
  onLike,
  onShare,
  copiedPostId,
}) {
  const returnTo = `/community/authors/${authorId}/publication`;

  return (
    <article className="space-y-5">
      {/* IMAGE — clickable */}
      {post.image_url && (
        <Link
          to={`/community/post/${post.id}`}
          state={{ returnTo }}
          className="block group"
        >
          <img
            src={post.image_url}
            alt=""
            className="
              w-full
              h-[220px] sm:h-[300px] lg:h-[420px]
              object-cover
              rounded-2xl
              transition
              group-hover:opacity-95
            "
          />
        </Link>
      )}

      {/* TITLE — clickable */}
      <Link
        to={`/community/post/${post.id}`}
        state={{ returnTo }}
        className="block w-fit"
      >
        <h2
          className="
            text-xl sm:text-2xl lg:text-3xl
            font-semibold
            leading-tight
            hover:underline
          "
        >
          {post.title}
        </h2>
      </Link>

      {/* SUBTITLE — not clickable */}
      {post.subtitle && (
        <p className="text-sm sm:text-base opacity-70">{post.subtitle}</p>
      )}

      {/* META — not clickable */}
      <p className="text-xs opacity-50">
        {new Date(post.created_at).toLocaleDateString()} · {authorName}
      </p>
      {/* MOBILE ACTION BAR */}
      <div
        className="
    pt-3
    border-t
    border-dashboard-border-light
    dark:border-dashboard-border-dark

    flex items-center justify-between
    text-sm sm:text-sm
    text-dashboard-muted-light
    dark:text-dashboard-muted-dark

    sm:hidden
  "
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[4px]">
            <Eye size={16} className="opacity-70" />
            <span>{post.views ?? 0}</span>
          </div>

          {/* LIKE */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike(e, post);
            }}
            className="flex items-center gap-[4px]"
          >
            <Heart
              size={16}
              className={
                post.has_liked ? "text-red-500 fill-red-500" : "opacity-70"
              }
            />
            <span>{post.like_count ?? 0}</span>
          </button>

          <div className="flex items-center gap-[4px]">
            <MessageSquare size={16} className="opacity-70" />
            <span>{post.comment_count ?? 0}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShare(e, post);
            }}
            className="flex items-center gap-[4px]"
          >
            {copiedPostId === post.id ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Share2 size={16} className="opacity-70" />
            )}
          </button>
        </div>

        {/* SHARE */}
      </div>
    </article>
  );
}
