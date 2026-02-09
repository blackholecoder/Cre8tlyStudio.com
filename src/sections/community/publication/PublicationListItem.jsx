import { Check, Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export function PublicationListItem({
  post,
  authorName,
  authorId,
  onLike,
  onShare,
  copiedPostId,
}) {
  return (
    <Link
      to={`/community/post/${post.id}`}
      state={{
        returnTo: `/community/authors/${authorId}/publication`,
      }}
      className="block hover:opacity-90 transition"
    >
      <article
        className="
          rounded-2xl
          bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light dark:border-dashboard-border-dark
          p-4

          sm:border-none sm:bg-transparent sm:p-0 sm:rounded-none
        "
      >
        <div
          className="
            flex flex-col gap-4

            sm:grid
            sm:grid-cols-[1fr_96px]
            sm:gap-6
            sm:items-start
          "
        >
          {/* IMAGE — MOBILE */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              className="
                w-full
                h-[180px]
                rounded-xl
                object-cover

                sm:hidden
              "
            />
          )}

          {/* TEXT */}
          <div>
            <h3 className="font-semibold leading-snug">{post.title}</h3>

            {post.subtitle && (
              <p className="text-sm opacity-70 mt-1 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            <p className="text-xs opacity-50 mt-2">
              {new Date(post.created_at).toLocaleDateString()} · {authorName}
            </p>
          </div>

          {/* IMAGE — DESKTOP */}
          {post.image_url ? (
            <img
              src={post.image_url}
              alt=""
              className="
                hidden sm:block
                w-[96px]
                h-[96px]
                rounded-xl
                object-cover
                justify-self-end
              "
            />
          ) : (
            <div className="hidden sm:block w-[96px]" />
          )}
        </div>
        {/* MOBILE ACTION BAR */}
        <div
          className="
    mt-3
    pt-3
    border-t
    border-dashboard-border-light
    dark:border-dashboard-border-dark

    flex items-center justify-between
    text-sm sm:text-xs
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
                <Check size={16} className="text-green" />
              ) : (
                <Share2 size={16} className="opacity-70" />
              )}
            </button>
          </div>

          {/* SHARE */}
        </div>
      </article>
    </Link>
  );
}
