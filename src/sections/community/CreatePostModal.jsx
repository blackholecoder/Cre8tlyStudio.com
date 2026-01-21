import { useState } from "react";
import axiosInstance from "../../api/axios";
import { X, Image as ImageIcon } from "lucide-react";

export default function CreatePostModal({ topicId, onClose, onPosted }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;

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

      await axiosInstance.post(`/community/topics/${topicId}/posts`, {
        title,
        subtitle,
        body,
        image_url: imageUrl,
      });

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
        relative w-full max-w-lg md:max-w-2xl p-6 md:p-8 rounded-xl
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        shadow-xl
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

        {/* Title */}
        <h2
          className="
          text-xl font-semibold mb-4
          text-dashboard-text-light dark:text-dashboard-text-dark
        "
        >
          Create New Post
        </h2>

        {/* Title input */}

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

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post..."
          className="
          w-full mt-4 min-h-[120px] md:min-h-[280px] resize-none p-3 rounded-lg
          bg-dashboard-bg-light dark:bg-dashboard-bg-dark
          border border-dashboard-border-light dark:border-dashboard-border-dark
          text-dashboard-text-light dark:text-dashboard-text-dark
          placeholder:text-dashboard-muted-light dark:placeholder:text-dashboard-muted-dark
          focus:outline-none focus:ring-2 focus:ring-dashboard-border-light dark:focus:ring-dashboard-border-dark 
          shadow-inner
        "
        />
        <p
          className="
    mt-2 text-xs
    text-dashboard-muted-light
    dark:text-dashboard-muted-dark
  "
        >
          Tip: You can add links like{" "}
          <span className="font-mono">[Read article](https://example.com)</span>{" "}
          or paste a YouTube link to embed a video automatically.
        </p>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={uploading}
          className="
          mt-6 w-full py-3 rounded-lg font-medium
          bg-dashboard-metric-light dark:bg-dashboard-metric-dark
          text-dashboard-bg-light
          transition
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        >
          {uploading ? "Uploading…" : "Post"}
        </button>
      </div>
    </div>
  );
}
