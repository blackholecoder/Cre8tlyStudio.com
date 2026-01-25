import { Link } from "react-router-dom";

export function ProfilePostCarousel({ posts }) {
  if (!posts?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold opacity-80">
        More from this author
      </h3>

      <div
        className="
          flex gap-4 overflow-x-auto pb-2
          snap-x snap-mandatory
          no-scrollbar
        "
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/community/post/${post.id}`}
            className="
              min-w-[220px] max-w-[220px]
              snap-start
              rounded-xl
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              hover:opacity-90
              transition
            "
          >
            {/* Image */}
            <div className="h-28 w-full rounded-t-xl overflow-hidden bg-dashboard-hover-light dark:bg-dashboard-hover-dark">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-40">
                  —
                </div>
              )}
            </div>

            {/* Text */}
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold line-clamp-2">{post.title}</p>

              <div className="flex items-center gap-3 text-xs opacity-60">
                <span>{post.views} views</span>
                <span>{post.comment_count} comments</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
