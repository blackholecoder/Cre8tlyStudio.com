import { useEffect, useState, useMemo, useRef } from "react";
import {
  MessageCircle,
  Ellipsis,
  Trash2,
  Heart,
  Pencil,
  Eye,
  Repeat,
} from "lucide-react";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { formatDate, timeAgo } from "../../../helpers/date";
import MobileCreateFAB from "../posts/MobileCreateFAB";

export default function MyFragments() {
  const navigate = useNavigate();
  const [fragments, setFragments] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const createMenuRef = useRef(null);

  const [showFab, setShowFab] = useState(true);
  const lastScrollY = useRef(0);

  const menuItem =
    "w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-colors";

  useEffect(() => {
    fetchFragments();
  }, []);

  useEffect(() => {
    function closeMenu() {
      setOpenMenuId(null);
    }
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  async function fetchFragments() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/fragments/my-fragments");
      setFragments(res.data.fragments || []);
    } catch (err) {
      console.error("Failed to fetch fragments:", err);
    } finally {
      setLoading(false);
    }
  }

  function confirmDeleteFragment(fragmentId) {
    const toastId = toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm font-medium">Delete this fragment?</p>
          <p className="text-xs opacity-70">This cannot be undone.</p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 text-xs rounded-md border"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await axiosInstance.delete(`/fragments/${fragmentId}`);
                  setFragments((prev) =>
                    prev.filter((f) => f.id !== fragmentId),
                  );
                  toast.dismiss(toastId);
                  toast.success("Fragment deleted");
                } catch {
                  toast.error("Failed to delete fragment");
                }
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { closeButton: false, className: "rounded-xl" },
    );
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setCreateOpen(false);
      }
    }

    if (createOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [createOpen]);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;

      // scrolling down → hide
      if (currentY > lastScrollY.current && currentY > 80) {
        setShowFab(false);
      }

      // scrolling up → show
      if (currentY < lastScrollY.current) {
        setShowFab(true);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredFragments = useMemo(() => {
    if (!search.trim()) return fragments;

    const q = search.toLowerCase();

    return fragments.filter((fragment) => {
      return (
        fragment.body?.toLowerCase().includes(q) ||
        fragment.author?.toLowerCase().includes(q)
      );
    });
  }, [fragments, search]);

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      <div className="sticky top-0 z-20 px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold">My Fragments</h1>

          <button
            onClick={() => navigate("/community/fragments/create")}
            className="
              hidden md:inline-flex
              px-3 py-2 rounded-lg text-sm font-medium
              bg-dashboard-text-light dark:bg-dashboard-text-dark
              text-dashboard-bg-light dark:text-dashboard-bg-dark
            "
          >
            Write Fragment
          </button>
        </div>
      </div>

      <div className="px-0 py-4 pb-24 max-w-3xl mx-auto space-y-2">
        {loading && <p className="text-sm opacity-60">Loading fragments…</p>}

        <div className="max-w-3xl mx-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your posts by title or subtitle…"
            className="
        w-full
        px-4 py-2.5
        rounded-lg
        text-sm
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        placeholder:text-dashboard-muted-light
        dark:placeholder:text-dashboard-muted-dark
        focus:outline-none
        focus:ring-2
        focus:ring-green
      "
          />
        </div>

        {!loading && filteredFragments.length === 0 && (
          <p className="text-sm opacity-60">
            {search
              ? "No fragments match your search."
              : "You haven’t posted anything yet."}
          </p>
        )}

        <div className="px-4 py-3"></div>

        {filteredFragments.map((fragment) => (
          <div
            key={fragment.id}
            onClick={() => navigate(`/community/fragments/${fragment.id}`)}
            className="
      px-4 py-4 sm:px-6
      rounded-lg
      border border-dashboard-border-light dark:border-dashboard-border-dark
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
      transition
      cursor-pointer
    "
          >
            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-[40px_1fr] gap-3">
              {/* AVATAR */}
              {fragment.author_image ? (
                <img
                  src={fragment.author_image}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="
            w-8 h-8 rounded-full
            bg-dashboard-hover-light dark:bg-dashboard-hover-dark
            flex items-center justify-center
            text-xs font-semibold
            text-dashboard-muted-light dark:text-dashboard-muted-dark
          "
                >
                  {fragment.author?.charAt(0)?.toUpperCase()}
                </div>
              )}

              {/* CONTENT */}
              <div className="min-w-0">
                {/* TOP ROW: NAME + DATE + MENU */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      {fragment.author}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      <span>{formatDate(fragment.created_at)}</span>
                      <span>·</span>
                      <span>{timeAgo(fragment.created_at)}</span>

                      {fragment.updated_at &&
                        new Date(fragment.updated_at).getTime() -
                          new Date(fragment.created_at).getTime() >
                          60_000 && (
                          <>
                            <span>·</span>
                            <span className="italic opacity-50">edited</span>
                          </>
                        )}
                    </div>
                  </div>

                  {/* ELLIPSIS MENU — UNCHANGED */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === fragment.id ? null : fragment.id,
                        );
                      }}
                      className="p-2 rounded-md hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                    >
                      <Ellipsis size={18} />
                    </button>

                    {openMenuId === fragment.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="
                  absolute right-0 mt-2 z-30
                  w-56
                  rounded-xl
                  bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                  border border-dashboard-border-light dark:border-dashboard-border-dark
                  shadow-xl
                  overflow-hidden
                "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            navigate(
                              `/community/fragments/edit/${fragment.id}`,
                            );
                          }}
                          className={`${menuItem} hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark`}
                        >
                          <Pencil size={16} className="opacity-80" />
                          Edit
                        </button>

                        <div className="h-px bg-dashboard-border-light dark:bg-dashboard-border-dark my-1" />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            confirmDeleteFragment(fragment.id);
                          }}
                          className={`${menuItem} text-red-500 hover:bg-red-500/10`}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BODY */}
                <p className="mt-2 text-sm leading-relaxed line-clamp-3 text-dashboard-text-light dark:text-dashboard-text-dark">
                  {fragment.body}
                </p>

                {/* ICONS — NOW PERFECTLY ALIGNED */}
                <div className="mt-3 flex items-center gap-6 text-sm sm:text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  <div className="flex items-center gap-[4px]">
                    <Eye size={16} className="opacity-70" />
                    <span>{fragment.views ?? 0}</span>
                  </div>

                  <div className="flex items-center gap-[4px]">
                    <Heart
                      size={16}
                      className={
                        fragment.has_liked
                          ? "text-red-500 fill-red-500"
                          : "opacity-70"
                      }
                    />
                    <span>{fragment.like_count ?? 0}</span>
                  </div>

                  <div className="flex items-center gap-[4px]">
                    <MessageCircle size={16} className="opacity-70" />
                    <span>{fragment.comment_count ?? 0}</span>
                  </div>

                  <div className="flex items-center gap-[4px]">
                    <Repeat size={16} className="opacity-70" />
                    <span>{fragment.reshare_count ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MobileCreateFAB
        className={`
    md:hidden
    transition-all duration-200 ease-out
    ${showFab ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
  `}
        open={createOpen}
        setOpen={setCreateOpen}
        containerRef={createMenuRef}
        onCreatePost={() => {
          setCreateOpen(false);
          navigate("/community/create-post");
        }}
        onCreateFragment={() => {
          setCreateOpen(false);
          navigate("/community/fragments/create");
        }}
      />
    </div>
  );
}
