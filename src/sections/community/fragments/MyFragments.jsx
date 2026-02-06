import { useEffect, useState } from "react";
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

export default function MyFragments() {
  const navigate = useNavigate();
  const [fragments, setFragments] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

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

      <div className="md:hidden px-4 py-3">
        <button
          onClick={() => navigate("/community/fragments/create")}
          className="
            w-full py-2.5 rounded-lg text-sm font-medium
            bg-dashboard-text-light dark:bg-dashboard-text-dark
            text-dashboard-bg-light dark:text-dashboard-bg-dark
          "
        >
          Write Fragment
        </button>
      </div>

      <div className="px-0 py-4 pb-24 max-w-3xl mx-auto space-y-2">
        {loading && <p className="text-sm opacity-60">Loading fragments…</p>}

        {!loading && fragments.length === 0 && (
          <p className="text-sm opacity-60">
            You haven’t written any fragments yet.
          </p>
        )}

        {fragments.map((fragment) => (
          <div
            key={fragment.id}
            onClick={() => navigate(`/community/fragments/${fragment.id}`)}
            className="
            p-4 rounded-xl
            border border-dashboard-border-light dark:border-dashboard-border-dark
            bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
            flex justify-between gap-4
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
            transition
            cursor-pointer
          "
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {fragment.author_image ? (
                  <img
                    src={fragment.author_image}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="
                    w-6 h-6 rounded-full
                    bg-dashboard-hover-light dark:bg-dashboard-hover-dark
                    flex items-center justify-center
                    text-xs font-semibold
                    text-dashboard-muted-light dark:text-dashboard-muted-dark
                  "
                  >
                    {fragment.author?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  {fragment.author}
                </span>
              </div>

              <p className="text-sm leading-relaxed line-clamp-3">
                {fragment.body}
              </p>
              <div className="mt-1 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark flex items-center gap-1">
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

              <div className="mt-2 flex items-center gap-6 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                {/* Views */}
                <div className="flex items-center gap-[3px]">
                  <Eye size={14} className="opacity-70" />
                  <span>{fragment.views ?? 0}</span>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-[3px]">
                  <Heart size={14} className="opacity-70" />
                  <span>{fragment.like_count ?? 0}</span>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-[3px]">
                  <MessageCircle size={14} className="opacity-70" />
                  <span>{fragment.comment_count ?? 0}</span>
                </div>

                {/* Reshares */}
                <div className="flex items-center gap-[3px]">
                  <Repeat size={14} className="opacity-70" />
                  <span>{fragment.reshare_count ?? 0}</span>
                </div>
              </div>
            </div>

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
                  absolute left-1/2 mt-2 -translate-x-1/2 z-30
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
                      navigate(`/community/fragments/edit/${fragment.id}`);
                    }}
                    className={`${menuItem} hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark text-sm`}
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
                    className={`${menuItem} text-red-500 hover:bg-red-500/10 text-sm`}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
