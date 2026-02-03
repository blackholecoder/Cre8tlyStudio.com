import { Heart, MessageCircle, Repeat } from "lucide-react";
import { timeAgo, formatDate } from "../../../helpers/date";

export function FragmentItem({ fragment, onOpen, onToggleLike }) {
  const {
    body,
    created_at,
    like_count,
    has_liked,
    comment_count,
    reshare_count,
    author,
    author_image,
    reshared_id,
    reshared_body,
    reshared_author,
  } = fragment;

  return (
    <div
      onClick={onOpen}
      className="
        px-4 py-4
        sm:px-6
        border-b border-dashboard-border-light
        dark:border-dashboard-border-dark
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

        <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
          {author}
        </span>
      </div>

      {/* Body */}
      <p className="text-sm leading-relaxed text-dashboard-text-light dark:text-dashboard-text-dark whitespace-pre-wrap">
        {body}
      </p>
      <div className="mt-2 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark flex items-center gap-1">
        <span>{formatDate(created_at)}</span>
        <span>·</span>
        <span>{timeAgo(created_at)}</span>
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
      <div className="flex items-center gap-6 mt-3 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(fragment.id, has_liked);
          }}
          className="flex items-center gap-1"
        >
          <Heart
            size={14}
            className={has_liked ? "text-red-500 fill-red-500" : "opacity-70"}
          />
          {like_count}
        </button>

        <span className="flex items-center gap-1">
          <MessageCircle size={14} />
          {comment_count}
        </span>

        <span className="flex items-center gap-1">
          <Repeat size={14} />
          {reshare_count}
        </span>
      </div>
    </div>
  );
}
