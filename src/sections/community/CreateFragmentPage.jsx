import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import { timeAgo } from "../../helpers/date";
import { ShieldCheck } from "lucide-react";

export default function CreateFragment() {
  const MAX_CHARS = 500;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reshareId = searchParams.get("reshare");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [reshareFragment, setReshareFragment] = useState(null);

  const { fragmentId } = useParams();
  const isEdit = Boolean(fragmentId);
  const isReshare = Boolean(reshareId) && !isEdit;

  const submit = async () => {
    const strippedBody = body.trim();

    if (!strippedBody && !isReshare) {
      toast.error("Fragment cannot be empty");
      return;
    }

    if (strippedBody.length > MAX_CHARS) {
      toast.error("Fragments must be 500 characters or less");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axiosInstance.post(
          "/community/upload-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        imageUrl = uploadRes.data.image_url;
      }

      if (isEdit) {
        await axiosInstance.put(`/fragments/${fragmentId}`, {
          body,
          image_url: imageUrl,
        });
      } else {
        await axiosInstance.post("/fragments", {
          body,
          image_url: imageUrl,
          reshareFragmentId: isReshare ? reshareId : null,
        });
      }

      toast.success("Fragment published");
      navigate("/community");
    } catch (err) {
      console.error("Failed to create fragment:", err);
      toast.error("Failed to publish fragment");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!isReshare) return;

    async function loadReshare() {
      try {
        const res = await axiosInstance.get(`/fragments/${reshareId}`);
        setReshareFragment(res.data.fragment);
      } catch {
        toast.error("Original fragment not found");
        navigate("/community");
      }
    }

    loadReshare();
  }, [isReshare, reshareId]);

  const handleCancel = () => {
    if (isEdit) {
      navigate("/community/my-fragments");
    } else {
      navigate("/community"); // or fragments feed
    }
  };

  useEffect(() => {
    if (!isEdit) return;

    async function fetchFragment() {
      try {
        const res = await axiosInstance.get(`/fragments/${fragmentId}`);
        const f = res.data.fragment;

        if (f.reshared_id) {
          setReshareFragment({
            id: f.reshared_id,
            body: f.reshared_body,
            created_at: f.reshared_created_at,
            author: f.reshared_author,
            author_image: f.reshared_author_image,
            author_is_verified: f.reshared_author_is_verified,
          });
        }

        setBody(f.body || "");
        setImagePreview(f.image_url || null);

        // 🔥 THIS IS THE MISSING PART
        if (f.reshare_fragment_id) {
          const reshareRes = await axiosInstance.get(
            `/fragments/${f.reshare_fragment_id}`,
          );
          setReshareFragment(reshareRes.data.fragment);
        }
      } catch (err) {
        console.error("Failed to load fragment:", err);
        navigate("/community/my-fragments");
      }
    }

    fetchFragment();
  }, [fragmentId, isEdit]);

  return (
    <div className="min-h-screen w-full bg-dashboard-bg-light dark:bg-dashboard-bg-dark flex flex-col">
      {/* Header */}
      <header
        className="
          sticky top-0 z-20
          h-14
          px-4 sm:px-6
          flex items-center justify-between
          bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
          border-b border-dashboard-border-light dark:border-dashboard-border-dark
        "
      >
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm font-medium text-dashboard-muted-light dark:text-dashboard-muted-dark"
        >
          Cancel
        </button>

        <span className="text-sm font-semibold">
          {isEdit
            ? "Edit Fragment"
            : isReshare
              ? "Reshare Fragment"
              : "Post Fragment"}
        </span>

        <button
          onClick={submit}
          disabled={uploading}
          className="
    hidden sm:inline-flex
    px-3 py-1.5
    rounded-md
    text-sm font-medium
    bg-green text-black
    disabled:opacity-50
  "
        >
          {uploading ? "Saving…" : isEdit ? "Save Changes" : "Post Fragment"}
        </button>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {/* Fragment body */}
          <div className="space-y-1">
            <label
              className="
                text-sm font-medium
                text-dashboard-text-light
                dark:text-dashboard-text-dark
              "
            >
              {isReshare ? "Add a thought (optional)" : "Fragment"}
            </label>

            <textarea
              value={body}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARS) {
                  setBody(value);
                }
              }}
              placeholder="Write a thought, a line, or something unfinished…"
              rows={6}
              className="
              w-full p-4 rounded-lg
              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              text-dashboard-text-light dark:text-dashboard-text-dark
              placeholder:text-dashboard-muted-light
              dark:placeholder:text-dashboard-muted-dark
              focus:outline-none focus:ring-2 focus:ring-green
              resize-y
            "
            />
            <div
              className={`flex justify-end text-xs ${
                body.length >= MAX_CHARS
                  ? "text-red-500"
                  : "text-dashboard-muted-light dark:text-dashboard-muted-dark"
              }`}
            >
              {body.length}/{MAX_CHARS}
            </div>
            {reshareFragment && (
              <div
                className="
      mt-4
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
                  {reshareFragment.author_image ? (
                    <img
                      src={reshareFragment.author_image}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark" />
                  )}

                  {/* Name + time */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-[4px]">
                      <span className="text-sm font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
                        {reshareFragment.author}
                      </span>

                      {reshareFragment.author_is_verified === 1 && (
                        <ShieldCheck size={14} className="text-green" />
                      )}
                    </div>

                    <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      {timeAgo(reshareFragment.created_at)}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-dashboard-text-light dark:text-dashboard-text-dark">
                  {reshareFragment.body}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Mobile bottom action */}
        <div
          className="
    sm:hidden
    sticky bottom-0
    w-full
    border-t border-dashboard-border-light dark:border-dashboard-border-dark
    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
    px-4 py-3
  "
        >
          <button
            onClick={submit}
            disabled={uploading}
            className="
            w-full
            py-3
            rounded-lg
            text-sm font-semibold
            bg-green text-black
            disabled:opacity-50
          "
          >
            {uploading ? "Saving…" : isEdit ? "Save Changes" : "Post Fragment"}
          </button>
        </div>
      </main>
    </div>
  );
}
