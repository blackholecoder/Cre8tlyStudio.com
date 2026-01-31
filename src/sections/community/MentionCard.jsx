export function MentionCard({ user, open, onEnter, onLeave }) {
  if (!user) return null;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`
        absolute z-50 bottom-full mb-2 w-72
        rounded-xl
        border
        shadow-xl
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border-dashboard-border-light
        dark:border-dashboard-border-dark
        transition-all duration-150 ease-out
        opacity-0 translate-y-1 pointer-events-none
        ${open ? "opacity-100 translate-y-0 pointer-events-auto" : ""}
        p-3
      `}
    >
      <div className={!user.author_has_profile ? "opacity-60" : ""}>
        {/* Identity row */}
        <div className="grid grid-cols-[40px_1fr] gap-3 ">
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              className="w-10 h-10 rounded-full object-cover self-start translate-y-[-14px]"
              alt={user.name}
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-sm font-semibold">
              {user.name?.charAt(0) || "U"}
            </div>
          )}

          <div className="grid grid-rows-[auto_auto]">
            {/* Name + Username block */}
            <div className="translate-y-[4px]">
              <p className="text-sm font-semibold leading-none text-dashboard-text-light dark:text-dashboard-text-dark">
                {user.name}
              </p>

              <p className=" -mt-3 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                @{user.username}
              </p>
            </div>

            {/* Bio — stays put */}
            {user.bio && (
              <p className="mt-2 text-xs line-clamp-2 text-dashboard-text-light dark:text-dashboard-text-dark">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Profile status */}
        {!user.author_has_profile && (
          <p className="mt-1 text-[11px] text-dashboard-muted-light italic">
            Profile coming soon
          </p>
        )}
      </div>
    </div>
  );
}
