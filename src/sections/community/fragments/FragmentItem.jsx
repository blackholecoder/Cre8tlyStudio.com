import { Eye, Heart, MessageSquare, Repeat, ShieldCheck } from "lucide-react";
import { timeAgo } from "../../../helpers/date";
import { useNavigate } from "react-router-dom";

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
  } = fragment;
  const navigate = useNavigate();
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
      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-[40px_1fr] gap-3">
        {/* AVATAR COLUMN */}
        {author_image ? (
          <img
            src={author_image}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
        )}

        {/* CONTENT COLUMN */}
        <div className="min-w-0">
          {/* NAME + DATE */}
          <div className="mb-2">
            <div className="flex items-center gap-[2px]">
              <span className="text-xs font-medium text-dashboard-muted-light dark:text-dashboard-muted-dark">
                {author}
              </span>

              {isVerified && (
                <ShieldCheck
                  size={12}
                  className="text-dashboard-muted-light dark:text-green"
                />
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
              <span>{timeAgo(created_at)}</span>

              {updated_at && new Date(updated_at) > new Date(created_at) && (
                <>
                  <span>·</span>
                  <span className="italic opacity-70">edited</span>
                </>
              )}
            </div>
          </div>

          {/* BODY */}
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap text-dashboard-text-light dark:text-dashboard-text-dark"
            dangerouslySetInnerHTML={{
              __html: typeof body === "string" ? body : "",
            }}
          />

          {/* RESHARED FRAGMENT */}
          {reshared_id && (
            <div
              className="
              mt-3
              rounded-lg
            border border-dashboard-border-light
              dark:border-dashboard-border-dark
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              p-3
            "
            >
              <div className="grid grid-cols-[32px_1fr] gap-3">
                {/* Avatar */}
                {fragment.reshared_author_image ? (
                  <img
                    src={fragment.reshared_author_image}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-dashboard-border-light dark:bg-dashboard-border-dark" />
                )}

                {/* Name + time */}
                <div className="min-w-0">
                  <div className="flex items-center gap-[4px]">
                    <span className="text-xs font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
                      {fragment.reshared_author}
                    </span>

                    {fragment.reshared_author_is_verified === 1 && (
                      <ShieldCheck size={12} className="text-green" />
                    )}
                  </div>

                  <div className="text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    {timeAgo(fragment.reshared_created_at)}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div
                className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-dashboard-text-light dark:text-dashboard-text-dark"
                dangerouslySetInnerHTML={{
                  __html:
                    typeof fragment.reshared_body === "string"
                      ? fragment.reshared_body
                      : "",
                }}
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-3 flex items-center gap-6 text-sm sm:text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
            <div className="flex items-center gap-[4px]">
              <Eye size={16} className="opacity-70" />
              <span>{views ?? 0}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(fragment.id, has_liked);
              }}
              className="flex items-center gap-[4px] hover:opacity-80 transition"
            >
              <Heart
                size={16}
                className={
                  has_liked ? "text-red-500 fill-red-500" : "opacity-70"
                }
              />
              <span>{like_count}</span>
            </button>

            <div className="flex items-center gap-[4px]">
              <MessageSquare size={16} className="opacity-70" />
              <span>{comment_count}</span>
            </div>

            <div
              className="flex items-center gap-[4px] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/community/fragments/create?reshare=${fragment.id}`);
              }}
            >
              <Repeat size={16} className="opacity-70" />
              <span>{fragment.reshare_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
