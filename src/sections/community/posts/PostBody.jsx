import { Bookmark, Check, ShieldCheck } from "lucide-react";
import FragmentAudioPlayer from "../fragments/FragmentAudioPlayer";

export default function PostBody({
  post,
  isFragment,
  user,
  navigate,
  toggleBookmark,
  bookmarkSuccess,
  fragmentClasses,
  htmlClasses,
  timeAgo,
}) {
  return (
    <>
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
                  post.is_bookmarked ? "text-green stroke-[2.2]" : "opacity-80"
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
        {/* Reshared fragment card */}

        <div
          dangerouslySetInnerHTML={{
            __html: typeof post?.body === "string" ? post.body : "",
          }}
        />

        {post.has_paid_section === 1 &&
          post.viewer_has_paid_subscription === 0 && (
            <div className="relative mt-10">
              {/* Fade Gradient */}
              <div
                className="
                absolute -top-28 left-0 right-0 h-32
                pointer-events-none
                to-dashboard-sidebar-light
                dark:to-dashboard-sidebar-dark
              "
              />

              {/* Paywall Card */}
              <div
                className="
              relative
              p-6
              rounded-xl
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              text-center
            "
              >
                <div className="text-lg font-semibold mb-2">
                  This post continues for paid subscribers
                </div>

                <p className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark mb-4">
                  Become a paid subscriber to finish reading and support this
                  writer
                </p>

                <button
                  onClick={() =>
                    navigate(`/community/subscribe/${post.user_id}/choose`, {
                      state: { from: window.location.pathname },
                    })
                  }
                  className="
                px-5 py-2
                rounded-lg
                bg-green
                text-black
                font-medium
                hover:opacity-90
                transition
              "
                >
                  Become a Paid Subscriber
                </button>
              </div>
            </div>
          )}

        {isFragment && post.audio_url && (
          <FragmentAudioPlayer
            audioUrl={post.audio_url}
            audioTitle={post.audio_title}
            durationSeconds={post.audio_duration_seconds}
            allowDownload={post.allow_download}
          />
        )}

        {isFragment && post.reshared_id && (
          <div
            className="
            mt-6
            mb-4
            rounded-lg
            border border-dashboard-border-light
           dark:border-dashboard-border-dark
           bg-dashboard-sidebar-light
           dark:bg-dashboard-sidebar-dark
            p-4
                "
          >
            <div className="grid grid-cols-[40px_1fr] gap-3">
              {/* Avatar */}
              <button
                onClick={() => {
                  if (!navigate) return;

                  // Don’t navigate to your own profile
                  if (user?.id === post.reshared_author_id) return;

                  // Optional safety check if you track profile existence
                  if (post.reshared_author_has_profile === 0) {
                    toast.info("This author hasn’t set up their profile yet");
                    return;
                  }

                  navigate(`/community/authors/${post.reshared_author_id}`);
                }}
                className="cursor-pointer"
              >
                {post.reshared_author_image ? (
                  <img
                    src={post.reshared_author_image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-dashboard-border-light dark:bg-dashboard-border-dark" />
                )}
              </button>

              {/* Name + time */}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
                    {post.reshared_author}
                  </span>

                  {post.reshared_author_is_verified === 1 && (
                    <ShieldCheck size={14} className="text-green" />
                  )}
                </div>

                <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  {timeAgo(post.reshared_created_at)}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-dashboard-text-light dark:text-dashboard-text-dark">
              {post.reshared_body}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
