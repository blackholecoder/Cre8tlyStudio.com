import { Plus } from "lucide-react";

export default function MobileCreateFAB({
  open,
  setOpen,
  onCreatePost,
  onCreateFragment,
  containerRef,
}) {
  return (
    <div ref={containerRef} className="sm:hidden fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full
          px-3 py-3
          rounded-xl
          flex items-center justify-center
          bg-green
          text-black
          shadow-xl
          hover:opacity-90
          transition
        "
        aria-label="Create"
      >
        <Plus
          size={26}
          className={`transition-transform ${open ? "rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute bottom-full right-0 mb-3
            w-44
            rounded-xl
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            shadow-2xl
            overflow-hidden
          "
        >
          <button
            onClick={() => {
              setOpen(false);
              onCreatePost();
            }}
            className="
              w-full px-4 py-3 text-left text-sm
              hover:bg-dashboard-hover-light
              dark:hover:bg-dashboard-hover-dark
            "
          >
            Post
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onCreateFragment();
            }}
            className="
              w-full px-4 py-3 text-left text-sm
              hover:bg-dashboard-hover-light
              dark:hover:bg-dashboard-hover-dark
            "
          >
            Fragment
          </button>
        </div>
      )}
    </div>
  );
}
