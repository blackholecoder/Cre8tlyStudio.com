import { useState, useRef } from "react";
import axiosInstance from "../../api/axios";
import { X, Image as ImageIcon } from "lucide-react";
import CommunityPostEditor from "./posts/CommunityPostEditor";
import { toast } from "react-toastify";

export default function CreatePostModal({
  post = null,
  topicId,
  topicName,
  topics = [],
  onClose,
  onPosted,
}) {
  const editorRef = useRef(null);
  const isEdit = Boolean(post);
  const [selectedTopicId, setSelectedTopicId] = useState(topicId || "");
  const [title, setTitle] = useState(post?.title || "");
  const [subtitle, setSubtitle] = useState(post?.subtitle || "");
  const [body, setBody] = useState(post?.body || "");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.image_url || null);
  const [uploading, setUploading] = useState(false);

  const MAX_RELATED_TOPICS = 3;
  const [relatedTopicIds, setRelatedTopicIds] = useState([]);

  const submit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const strippedBody = body?.replace(/<[^>]*>/g, "")?.trim();

    if (!strippedBody) {
      toast.error("Post body cannot be empty");
      return;
    }

    if (!isEdit && !topicId && !selectedTopicId) {
      toast.error("Please select a topic");
      return;
    }

    try {
      let imageUrl = null;

      if (imageFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axiosInstance.post(
          "/community/upload-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = uploadRes.data.image_url;
      }

      if (isEdit) {
        const payload = {
          title,
          subtitle,
          body,
        };

        // 👇 ONLY include image_url if it changed
        if (imageUrl) {
          payload.image_url = imageUrl;
        }

        await axiosInstance.put(`/community/posts/${post.id}`, payload);
      } else {
        const finalTopicId = topicId || selectedTopicId;

        await axiosInstance.post(`/community/topics/${finalTopicId}/posts`, {
          title,
          subtitle,
          body,
          image_url: imageUrl,
          relatedTopicIds: relatedTopicIds,
        });
      }

      onPosted();
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="
    fixed inset-0 z-50
    flex items-center justify-center
    px-3 sm:px-0
    bg-black/60 backdrop-blur-sm
  "
    >
      <div
        className="
    relative
    w-full max-w-lg md:max-w-2xl
    max-h-[90vh]
    rounded-xl
    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
    border border-dashboard-border-light dark:border-dashboard-border-dark
    shadow-xl
    flex flex-col
  "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
          absolute top-4 right-4
          text-dashboard-muted-light dark:text-dashboard-muted-dark
          hover:opacity-80
        "
        >
          <X size={22} />
        </button>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
          {/* Title */}
          <h2
            className="
          text-xl font-semibold mb-4
          text-dashboard-text-light dark:text-dashboard-text-dark
        "
          >
            {isEdit ? "Edit Post" : "Create New Post"}
          </h2>

          {/* Topic selector (My Posts Page only) */}
          {!isEdit && !topicId && topics.length > 0 && (
            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium">Topic</label>

              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="
        w-full p-3 rounded-lg
        bg-dashboard-bg-light dark:bg-dashboard-bg-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        text-dashboard-text-light dark:text-dashboard-text-dark
        focus:outline-none focus:ring-2
      "
              >
                <option value="">Select a topic</option>

                {topics
                  .filter((t) => !t.is_locked)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {!isEdit && topicId && (
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wide text-dashboard-muted-light dark:text-dashboard-muted-dark">
                Posting in
              </span>
              <div
                className="mt-1 inline-flex items-center px-3 py-1 rounded-full
      bg-dashboard-hover-light dark:bg-dashboard-hover-dark
      text-sm font-medium
      text-dashboard-text-light dark:text-dashboard-text-dark
    "
              >
                {topicName || "General"}
              </div>
            </div>
          )}

          {/* Post title */}

          <div className="space-y-1">
            <label
              className="
      text-sm font-medium
      text-dashboard-text-light
      dark:text-dashboard-text-dark
    "
            >
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a clear title"
              className="
      w-full p-3 rounded-lg
      bg-dashboard-bg-light dark:bg-dashboard-bg-dark
      border border-dashboard-border-light dark:border-dashboard-border-dark
      text-dashboard-text-light dark:text-dashboard-text-dark
      placeholder:text-dashboard-muted-light
      dark:placeholder:text-dashboard-muted-dark
      focus:outline-none focus:ring-2 focus:ring-green
    "
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1 mt-4">
            <label
              className="
      text-sm font-medium
      text-dashboard-text-light
      dark:text-dashboard-text-dark
    "
            >
              Subtitle (optional)
            </label>

            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Add context or a short summary"
              className="
              w-full p-3 rounded-lg
              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              text-dashboard-text-light dark:text-dashboard-text-dark
              placeholder:text-dashboard-muted-light
              dark:placeholder:text-dashboard-muted-dark
              focus:outline-none focus:ring-2 focus:ring-green
            "
            />
          </div>

          {/* Image upload */}
          <div className="mt-6 md:mt-8">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  className="
                w-full max-h-[240px] object-cover rounded-lg
                border border-dashboard-border-light dark:border-dashboard-border-dark
              "
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="
                absolute top-2 right-2
                px-2 py-1 text-xs rounded
                bg-black/60 text-white
                hover:opacity-80
              "
                >
                  Remove
                </button>
              </div>
            ) : (
              <label
                className="
              flex flex-col items-center justify-center gap-2
              w-full p-6 cursor-pointer rounded-lg
              border border-dashed border-dashboard-border-light dark:border-dashboard-border-dark
              text-dashboard-muted-light dark:text-dashboard-muted-dark
              hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
              transition
            "
              >
                <ImageIcon size={28} className="opacity-70" />

                <span className="text-sm font-medium">Add image</span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}
          </div>
          {/* Community reminder */}
          {!isEdit && (
            <div
              className="
      mb-3
      rounded-lg
      border border-dashboard-border-light
      dark:border-dashboard-border-dark
      bg-dashboard-hover-light
      dark:bg-dashboard-hover-dark
      px-4 py-3
      text-xs sm:text-sm
      text-dashboard-muted-light
      dark:text-dashboard-muted-dark
      space-y-2
    "
            >
              <p>
                This community works best when people show up as themselves.
                Share something real, ask a genuine question, or offer a
                perspective that might help someone else.
              </p>

              <p className="opacity-80">
                This isn’t a place for quick promos or low-effort posts. Those
                may be removed so the space stays thoughtful and worth showing
                up for.
              </p>
            </div>
          )}

          {/* Body */}
          <CommunityPostEditor
            ref={editorRef}
            value={body}
            onChange={setBody}
          />

          {/* Related Topics */}
          {topics.length > 0 && (
            <div className="mt-6 space-y-2">
              <label
                className="
        text-sm font-medium
        text-dashboard-text-light
        dark:text-dashboard-text-dark
      "
              >
                Related topics (optional)
              </label>

              <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                Help readers find this post. Choose up to {MAX_RELATED_TOPICS}.
              </p>
              {/* 🔒 Lock notice */}
              <p className="text-[11px] italic text-dashboard-muted-light dark:text-dashboard-muted-dark">
                Related topics are locked after publishing to keep discovery
                consistent.
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {topics
                  .filter((t) => !t.is_locked && t.id !== topicId)
                  .map((t) => {
                    const active = relatedTopicIds.includes(t.id);

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setRelatedTopicIds((prev) => {
                            if (active) {
                              return prev.filter((id) => id !== t.id);
                            }

                            if (prev.length >= MAX_RELATED_TOPICS) {
                              toast.info(
                                `You can select up to ${MAX_RELATED_TOPICS} related topics`
                              );
                              return prev;
                            }

                            return [...prev, t.id];
                          });
                        }}
                        className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition
                ${
                  active
                    ? "bg-green text-black"
                    : "border border-dashboard-border-light dark:border-dashboard-border-dark text-dashboard-text-light dark:text-dashboard-text-dark"
                }
              `}
                      >
                        {t.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={uploading}
            className="
          mt-6 w-full py-3 rounded-lg font-medium
          bg-dashboard-metric-light dark:bg-dashboard-metric-dark
          text-dashboard-bg-dark dark:text-dashboard-text-light
          transition
          hover:opacity-90
          disabled:opacity-50 disabled:cursor-not-allowed
        "
          >
            {uploading ? "Saving…" : isEdit ? "Save changes" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
