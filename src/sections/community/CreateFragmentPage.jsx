import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import { timeAgo } from "../../helpers/date";
import { ShieldCheck } from "lucide-react";
import FragmentAudioPlayer from "./fragments/FragmentAudioPlayer";

export default function CreateFragment() {
  const MAX_CHARS = 500;
  const MAX_AUDIO_SECONDS = 10800;
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reshareId = searchParams.get("reshare");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [reshareFragment, setReshareFragment] = useState(null);

  const [mentionResults, setMentionResults] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [allowDownload, setAllowDownload] = useState(false);

  // Audio State

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [audioDuration, setAudioDuration] = useState(null);
  const [audioFileSize, setAudioFileSize] = useState(null);
  const [audioMimeType, setAudioMimeType] = useState(null);

  const { fragmentId } = useParams();
  const isEdit = Boolean(fragmentId);
  const isReshare = Boolean(reshareId) && !isEdit;

  function validateAudioDuration(file) {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);

        if (audio.duration > MAX_AUDIO_SECONDS) {
          reject(new Error("Audio exceeds the 3 hour maximum"));
        } else {
          resolve(audio.duration);
        }
      };

      audio.onerror = () => {
        reject(new Error("Unable to read audio metadata"));
      };

      audio.src = URL.createObjectURL(file);
    });
  }

  const handleAudioUpload = async (file) => {
    try {
      setAudioUploading(true);

      // 1️⃣ Validate duration locally
      const duration = await validateAudioDuration(file);

      console.log({
        fileName: file.name,
        mimeType: file.type,
      });

      // 2️⃣ Request signed upload URL from backend
      const signRes = await axiosInstance.post("/fragments/sign-audio-upload", {
        fileName: file.name,
        mimeType: file.type,
      });

      if (!signRes.data?.success) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, publicUrl } = signRes.data;

      // 3️⃣ Upload DIRECTLY to DigitalOcean Spaces
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "x-amz-acl": "public-read",
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Upload to storage failed");
      }

      // 4️⃣ Save state using returned public URL
      setAudioFile(file);
      setAudioUrl(publicUrl);
      setAudioTitle(file.name.replace(/\.[^/.]+$/, ""));
      setAudioDuration(Math.floor(duration));
      setAudioFileSize(file.size);
      setAudioMimeType(file.type);

      toast.success("Audio uploaded");
    } catch (err) {
      console.error("❌ handleAudioUpload failed:", err);
      toast.error(err.message || "Audio upload failed");
    } finally {
      setAudioUploading(false);
    }
  };

  const submit = async () => {
    const strippedBody = body.trim();

    if (!strippedBody && !isReshare && !audioUrl) {
      toast.error("Fragment cannot be empty");
      return;
    }

    if (strippedBody.length > MAX_CHARS) {
      toast.error("Fragments must be 500 characters or less");
      return;
    }

    if (audioUrl && !audioTitle.trim()) {
      toast.error("Audio title is required");
      return;
    }

    try {
      setSubmitting(true);

      if (isEdit) {
        await axiosInstance.put(`/fragments/${fragmentId}`, {
          body,
          audio_url: audioUrl,
          audio_title: audioTitle,
          audio_duration_seconds: audioDuration,
          audio_file_size: audioFileSize,
          audio_mime_type: audioMimeType,
          allow_download: allowDownload ? 1 : 0,
        });
      } else {
        await axiosInstance.post("/fragments", {
          body,
          reshareFragmentId: isReshare ? reshareId : null,
          audio_url: audioUrl,
          audio_title: audioTitle,
          audio_duration_seconds: audioDuration,
          audio_file_size: audioFileSize,
          audio_mime_type: audioMimeType,
          allow_download: allowDownload ? 1 : 0,
        });
      }

      toast.success("Fragment published");
      navigate("/community");
    } catch (err) {
      console.error("Failed to create fragment:", err);
      toast.error("Failed to publish fragment");
    } finally {
      setSubmitting(false);
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
        if (f.audio_url) {
          setAudioUrl(f.audio_url);
          setAudioTitle(f.audio_title || "");
          setAudioDuration(f.audio_duration_seconds || null);
          setAudioFileSize(f.audio_file_size || null);
          setAudioMimeType(f.audio_mime_type || null);
        }

        setAllowDownload(Boolean(f.allow_download));

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

  const handleBodyChange = async (e) => {
    const rawValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    const value = rawValue.slice(0, MAX_CHARS);
    setBody(value);

    const textBeforeCursor = value.slice(
      Math.max(0, cursorPos - 50),
      cursorPos,
    );

    const match = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);

    if (!match) {
      setShowMentions(false);
      setMentionResults([]);
      return;
    }

    const query = match[1];

    if (/\s/.test(query)) {
      setShowMentions(false);
      return;
    }

    setMentionQuery(query);

    if (query.length < 1) return;

    try {
      const res = await axiosInstance.get(
        `/community/users/search?query=${query}`,
      );

      setMentionResults(res.data.users || []);
      setShowMentions(true);
    } catch (err) {
      console.error("❌ fragment mention search failed:", err);
      setShowMentions(false);
    }
  };

  const insertMention = (username) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textUpToCursor = body.slice(0, cursorPos);

    const match = textUpToCursor.match(/@([a-zA-Z0-9_]*)$/);
    if (!match) return;

    const mentionStart = cursorPos - match[0].length;

    const before = body.slice(0, mentionStart);
    const after = body.slice(cursorPos);

    const newText = `${before}@${username} ${after}`;
    setBody(newText);

    setShowMentions(false);
    setMentionResults([]);
    setMentionQuery("");

    // restore cursor
    requestAnimationFrame(() => {
      const pos = mentionStart + username.length + 2;
      textarea.setSelectionRange(pos, pos);
      textarea.focus();
    });
  };

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
          disabled={submitting || audioUploading}
          className="
          hidden sm:inline-flex
          px-3 py-1.5
          rounded-md
          text-sm font-medium
          bg-green text-black
          disabled:opacity-50
        "
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Post Fragment"}
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
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={body}
                onChange={handleBodyChange}
                placeholder="Write a thought, a line, or something unfinished… use @ to mention other users in your fragment"
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
                    : "text-dashboard-muted-light dark:text-dashboard-muted-dark pb-4"
                }`}
              >
                {body.length}/{MAX_CHARS} characters max
              </div>
              {showMentions && mentionResults.length > 0 && (
                <div
                  className="
                relative
                z-50
                mt-2
                w-full
                max-h-56
                overflow-y-auto
                rounded-xl
                border
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border-dashboard-border-light
                dark:border-dashboard-border-dark
                shadow-2xl
              "
                >
                  {mentionResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // desktop
                        insertMention(user.username);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault(); // mobile
                        insertMention(user.username);
                      }}
                      className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2
                    text-left
                    hover:bg-dashboard-hover-light
                    dark:hover:bg-dashboard-hover-dark
                    transition
                  "
                    >
                      {user.profile_image_url ? (
                        <img
                          src={user.profile_image_url}
                          alt={user.username}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
                          {user.username?.charAt(0)?.toUpperCase()}
                        </div>
                      )}

                      <span className="text-sm font-medium">
                        @{user.username}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div
              className="
              mt-6
              rounded-2xl
              border border-dashboard-border-light dark:border-dashboard-border-dark
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              p-6
              space-y-5
            "
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
                  Add Audio{" "}
                  <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark font-normal">
                    (optional · max 3 hours)
                  </span>
                </h3>

                {audioUrl && (
                  <button
                    type="button"
                    className="
                    text-xs
                    text-dashboard-muted-light
                    dark:text-dashboard-muted-dark
                    hover:text-red-500
                    transition
                  "
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Upload Button Styled */}
              {!audioUrl && !audioUploading && (
                <label
                  className="
                  flex items-center justify-center
                  h-24
                  rounded-lg
                  border-2 border-dashed
                  border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  text-sm
                  cursor-pointer
                  hover:bg-dashboard-hover-light
                  dark:hover:bg-dashboard-hover-dark
                  transition
                "
                >
                  <span className="opacity-70">Click to upload audio</span>

                  <input
                    type="file"
                    accept="audio/*"
                    disabled={submitting || audioUploading}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      handleAudioUpload(file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
              )}

              {/* Uploading State */}
              {audioUploading && (
                <div
                  className="
                  rounded-lg
                  border border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  bg-dashboard-bg-light
                  dark:bg-dashboard-bg-dark
                  p-4
                  flex items-center gap-3
                "
                >
                  <div className="w-5 h-5 border-2 border-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Uploading audio…</span>
                </div>
              )}

              {/* After Upload */}
              {!audioUploading && audioUrl && (
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      Audio Title
                    </label>

                    <input
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      maxLength={255}
                      className="
                      w-full
                      px-3 py-2.5
                      rounded-lg
                      bg-dashboard-bg-light
                      dark:bg-dashboard-bg-dark
                      border border-dashboard-border-light
                      dark:border-dashboard-border-dark
                      text-sm
                      text-dashboard-text-light
                      dark:text-dashboard-text-dark
                      focus:outline-none
                      focus:ring-2
                      focus:ring-green
                      transition
                    "
                    />

                    <div className="text-[11px] text-right opacity-60 mt-1">
                      {audioTitle.length}/255
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={allowDownload}
                        onChange={(e) => setAllowDownload(e.target.checked)}
                        className="h-4 w-4 accent-green"
                      />
                      <label className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                        Allow users to download this audio
                      </label>
                    </div>
                  </div>

                  {/* Player */}
                  <FragmentAudioPlayer
                    audioUrl={audioUrl}
                    audioTitle={audioTitle}
                    durationSeconds={audioDuration}
                    allowDownload={allowDownload}
                  />
                </div>
              )}
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
            disabled={submitting || audioUploading}
            className="
            w-full
            py-3
            rounded-lg
            text-sm font-semibold
            bg-green text-black
            disabled:opacity-50
          "
          >
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Post Fragment"}
          </button>
        </div>
      </main>
    </div>
  );
}
