import { Eye, Heart, MessageCircle, Repeat, ShieldCheck } from "lucide-react";
import { timeAgo, formatDate } from "../../../helpers/date";

export function FragmentItem({ fragment, onOpen, onToggleLike }) {
  const {
    body,
    created_at,
    updated_at,
    views,
    like_count,
    has_liked,
    comment_count,
    reshare_count,
    author,
    author_image,
    author_is_verified,
    reshared_id,
    reshared_body,
    reshared_author,
  } = fragment;

  const isVerified = author_is_verified === 1;

  return (
    <div
      onClick={onOpen}
      className="
      px-4 py-4
      sm:px-6
      rounded-lg
      border
      border-dashboard-border-light
      dark:border-dashboard-border-dark
      bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      hover:bg-dashboard-hover-light
      dark:hover:bg-dashboard-hover-dark
      transition
      cursor-pointer
    "
    >
      {/* Author */}
      <div className="flex items-center gap-2 mb-2">
        {author_image ? (
          <img
            src={author_image}
            alt=""
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
        )}

        <div className="flex items-center gap-[2px]">
          <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
            {author}
          </span>

          {isVerified && (
            <ShieldCheck
              size={12}
              className="text-dashboard-muted-light dark:text-green"
            />
          )}
        </div>
      </div>

      {/* Body */}
      <p className="text-sm leading-relaxed text-dashboard-text-light dark:text-dashboard-text-dark whitespace-pre-wrap">
        {body}
      </p>
      <div className="mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark flex items-center gap-1">
        <span>{formatDate(created_at)}</span>
        <span>·</span>
        <span>{timeAgo(created_at)}</span>

        {updated_at && new Date(updated_at) > new Date(created_at) && (
          <>
            <span>·</span>
            <span className="italic opacity-70">edited</span>
          </>
        )}
      </div>

      {/* Reshare */}
      {reshared_id && (
        <div
          className="
            mt-3 p-3
            rounded-lg
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            text-xs
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
          "
        >
          <span className="font-medium">{reshared_author}</span>
          <p className="mt-1 whitespace-pre-wrap">{reshared_body}</p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-4 mt-3 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
        {/* Views */}
        <div className="flex items-center justify-center gap-[3px]">
          <Eye size={14} className="opacity-70" />
          <span>{views ?? 0}</span>
        </div>

        {/* Like */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(fragment.id, has_liked);
          }}
          className="flex items-center justify-center gap-[3px] hover:opacity-80 transition"
        >
          <Heart
            size={14}
            className={has_liked ? "text-red-500 fill-red-500" : "opacity-70"}
          />
          <span>{like_count}</span>
        </button>

        {/* Comments */}
        <div className="flex items-center justify-center gap-[3px]">
          <MessageCircle size={14} className="opacity-70" />
          <span>{comment_count}</span>
        </div>

        {/* Reshares */}
        <div className="flex items-center justify-center gap-[3px]">
          <Repeat size={14} className="opacity-70" />
          <span>{reshare_count}</span>
        </div>
      </div>
    </div>
  );
}
