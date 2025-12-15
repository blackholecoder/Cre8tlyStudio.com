import { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import axiosInstance from "../../../../api/axios";
import { toast } from "react-toastify";

export default function AudioPlayerBlock({
  block,
  index,
  updateBlock,
  landing,
  bgTheme,
}) {
  const MAX_AUDIO_SECONDS = 3 * 60 * 60; // 3 hours

  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const colorDebounce = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const startTime = Date.now();

  const getLabelContrast = (hex) => {
    if (!hex) return "#f3f4f6";

    const c = hex.replace("#", "");
    if (c.length !== 6) return "#f3f4f6";

    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160 ? "#1f2937" : "#f3f4f6";
  };

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  const loadTrack = (track) => {
    updateBlock(index, "audio_url", track.audio_url);
    updateBlock(index, "title", track.title);
    updateBlock(index, "cover_url", track.cover_url || "");
    updateBlock(index, "audio_name", track.title || "Track");

    // Reset player UI
    setCurrentTime(0);
    setDuration(0);
    setSeekValue(0);
    setIsPlaying(false);
  };

  // Initialize Waveform
  useEffect(() => {
    clearTimeout(colorDebounce.current);

    colorDebounce.current = setTimeout(() => {
      if (!block.show_waveform || !block.audio_url) return;

      // destroy old
      if (waveSurfer.current) {
        waveSurfer.current.destroy();
        waveSurfer.current = null;
      }

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: block.waveform_color,
        progressColor: block.progress_color,
        height: 30,
        barWidth: 2,
        responsive: true,
      });

      waveSurfer.current = ws;

      // LOAD AUDIO
      ws.load(block.audio_url);

      // READY
      ws.on("ready", () => {
        const dur = ws.getDuration();
        setDuration(dur);
      });

      // AUDIO PROCESS
      ws.on("audioprocess", () => {
        const inst = waveSurfer.current;
        if (!inst || !inst.isPlaying()) return;

        const t = inst.getCurrentTime();
        const dur = inst.getDuration();

        if (
          block.preview_enabled &&
          block.preview_duration > 0 &&
          t >= Math.min(block.preview_duration, dur)
        ) {
          inst.pause();
          inst.seekTo(0);

          setIsPlaying(false);
          setCurrentTime(0);
          setSeekValue(0);

          toast.info("Preview ended. Purchase to unlock the full track.");
          return;
        }

        setCurrentTime(t);
        setSeekValue((t / dur) * 100);
      });

      // SEEK HANDLER (clicking waveform)
      ws.on("seek", (pct) => {
        const inst = waveSurfer.current;
        if (!inst) return;

        const dur = inst.getDuration();
        const newTime = pct * dur;

        if (
          block.preview_enabled &&
          block.preview_duration > 0 &&
          newTime >= Math.min(block.preview_duration, dur)
        ) {
          const limitPct = block.preview_duration / dur;
          inst.seekTo(limitPct);

          setCurrentTime(block.preview_duration);
          setSeekValue(limitPct * 100);
          return;
        }

        inst.seekTo(pct);
        setCurrentTime(newTime);
        setSeekValue(pct * 100);
      });

      // ON FINISH
      ws.on("finish", () => {
        setIsPlaying(false);

        const playlist = block.playlist || [];
        const indexNow = playlist.findIndex(
          (t) => t.audio_url === block.audio_url
        );

        const next = playlist[indexNow + 1];
        if (next) loadTrack(next);
      });
    }, 300);

    return () => {
      clearTimeout(colorDebounce.current);
      if (waveSurfer.current) {
        waveSurfer.current.destroy();
        waveSurfer.current = null;
      }
    };
  }, [
    block.audio_url,
    block.show_waveform,
    block.waveform_color,
    block.progress_color,
    block.preview_enabled,
    block.preview_duration,
  ]);

  const togglePlay = () => {
    if (!waveSurfer.current) return;
    waveSurfer.current.playPause();
    setIsPlaying(waveSurfer.current.isPlaying());
  };

  async function handleSinglePurchase(track, block, landing) {
    const res = await axiosInstance.post(
      "/seller-checkout/create-audio-checkout",
      {
        audio_type: "single",
        landingPageId: landing.id,
        blockId: block.id,
        sellerId: landing.user_id,
        audio_urls: [track.audio_url], // <- MUST be array
        product_name: track.title || "Audio Track",
        price_in_cents: Math.round((track.price || block.single_price) * 100),
        cover_url: track.cover_url || block.cover_url || "",
      }
    );

    if (res.data.url) {
      window.location.href = res.data.url;
    }
  }

  async function handleAlbumPurchase(block, landing) {
    const res = await axiosInstance.post(
      "/seller-checkout/create-audio-checkout",
      {
        audio_type: "album",
        landingPageId: landing.id,
        blockId: block.id,
        sellerId: landing.user_id,
        audio_urls: block.playlist.map((t) => t.audio_url), // all tracks
        product_name: block.album_button_text?.trim() || "Buy Album",
        price_in_cents: Math.round(block.album_price * 100),
        cover_url: albumCover,
      }
    );

    if (res.data.url) {
      window.location.href = res.data.url;
    }
  }

  function getPreviewOptions(duration) {
    const maxPreview = Math.min(duration, 1800); // 30 minutes max
    const options = [];

    // Generate options every 30 seconds up to max preview
    for (let sec = 10; sec <= maxPreview; sec += 30) {
      const minutes = Math.floor(sec / 60);
      const seconds = sec % 60;
      const label =
        minutes > 0
          ? `${minutes}m ${seconds > 0 ? seconds + "s" : ""}`
          : `${seconds}s`;

      options.push({ value: sec, label });
    }

    return options;
  }

  function validateAudioDuration(file) {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);

        if (audio.duration > MAX_AUDIO_SECONDS) {
          reject(new Error("Audio exceeds the 3 hour maximum length"));
        } else {
          resolve();
        }
      };

      audio.onerror = () => {
        reject(new Error("Unable to read audio metadata"));
      };

      audio.src = URL.createObjectURL(file);
    });
  }

  return (
    <>
      <div
        className="relative rounded-xl p-6 mt-3 border border-gray-700 transition-all"
        style={{
          background: block.match_main_bg
            ? bgTheme // provided from parent landing
            : block.use_gradient
              ? `linear-gradient(${block.gradient_direction}, ${block.gradient_start}, ${block.gradient_end})`
              : block.bg_color || "transparent",
        }}
      >
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 rounded-xl">
            <div className="w-10 h-10 border-4 border-t-transparent border-green rounded-full animate-spin"></div>
          </div>
        )}
        {/* PLAYER PREVIEW */}
        <div className="flex items-center gap-6 mt-4">
          {/* COVER */}
          {block.show_cover && block.cover_url && (
            <img
              src={block.cover_url}
              className="w-[70px] h-[70px] object-cover rounded-lg"
            />
          )}

          {/* RIGHT SIDE */}
          <div className="flex-1 text-left">
            {/* TITLE */}
            {block.show_title && (
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-semibold"
                  style={{ color: block.text_color }}
                >
                  {block.title}
                </span>
              </div>
            )}

            {/* CONTROLS */}
            <div className="flex items-center gap-4">
              {/* BACK 10s */}
              <div
                className="w-[38px] h-[38px] rounded-lg bg-[#1e293b] flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (!waveSurfer.current) return;
                  const ws = waveSurfer.current;
                  ws.seekTo(
                    Math.max(0, ws.getCurrentTime() - 10) / ws.getDuration()
                  );
                }}
              >
                <svg width="16" height="16" fill={block.progress_color}>
                  <path d="M12 16V4L4 10l8 6z" />
                </svg>
              </div>

              {/* PLAY / PAUSE */}
              <div
                onClick={togglePlay}
                className="w-[45px] h-[45px] rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                style={{ background: block.progress_color }}
              >
                {isPlaying ? (
                  <svg width="26" height="26" fill="#000">
                    <path d="M8 4h4v16H8zm6 0h4v16h-4z" />
                  </svg>
                ) : (
                  <svg width="26" height="26" fill="#000">
                    <path d="M8 4v16l12-8z" />
                  </svg>
                )}
              </div>

              {/* FORWARD 10s */}
              <div
                className="w-[38px] h-[38px] rounded-lg bg-[#1e293b] flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (!waveSurfer.current) return;
                  const ws = waveSurfer.current;
                  ws.seekTo(
                    Math.min(ws.getDuration(), ws.getCurrentTime() + 10) /
                      ws.getDuration()
                  );
                }}
              >
                <svg width="16" height="16" fill={block.progress_color}>
                  <path d="M8 4v12l8-6-8-6z" />
                </svg>
              </div>

              {/* VOLUME (STATIC PREVIEW) */}
              <div className="w-[120px] h-[6px] bg-[#1f2937] rounded-lg overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: "70%",
                    background: block.progress_color,
                  }}
                />
              </div>
            </div>

            {/* REAL SCRUBBER */}
            <input
              type="range"
              min={0}
              max={100}
              value={seekValue}
              onChange={(e) => {
                const pct = Number(e.target.value);
                const dur = duration || 1;
                const newTime = (pct / 100) * dur;

                const limit =
                  block.preview_enabled && block.preview_duration > 0
                    ? Math.min(block.preview_duration, dur)
                    : null;

                if (limit !== null && newTime >= limit) {
                  const limitPct = limit / dur;
                  console.log("Slider clamped", { newTime, limit, limitPct });

                  setSeekValue(limitPct * 100);
                  setCurrentTime(limit);

                  if (waveSurfer.current) {
                    waveSurfer.current.seekTo(limitPct);
                  }
                  return;
                }

                setSeekValue(pct);
                if (waveSurfer.current) {
                  waveSurfer.current.seekTo(pct / 100);
                }
                setCurrentTime(newTime);
              }}
              className="w-full mt-4 accent-green cursor-pointer"
            />

            {/* TIME DISPLAY */}
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* REAL WAVEFORM */}
        {block.show_waveform && (
          <div ref={waveformRef} className="w-full mt-4" />
        )}

        <label className="text-sm text-gray-300 flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={block.show_waveform}
            onChange={(e) =>
              updateBlock(index, "show_waveform", e.target.checked)
            }
          />
          Show Waveform
        </label>

        {/* PLAYLIST SECTION */}
        {block.playlist?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-silver mb-2 font-semibold">Playlist</h4>

            <ul className="space-y-2">
              {block.playlist.map((track, i) => {
                const isActive = block.audio_url === track.audio_url;

                return (
                  <li
                    key={i}
                    className={`p-3 rounded border cursor-pointer 
    ${
      isActive
        ? "bg-green/20 border-green"
        : "bg-[#1E293B] border-gray-700 hover:bg-[#2A3A4F]"
    }
  `}
                    onClick={() => loadTrack(track)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* COVER */}
                      {track.cover_url && (
                        <img
                          src={track.cover_url}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}

                      {/* TITLE (Fills remaining space) */}
                      <span className="flex-1 text-white truncate">
                        {track.title}
                      </span>

                      {/* DURATION (optional, matches live HTML) */}
                      <span className="text-gray-400 text-sm mr-3">
                        {track.duration || "--:--"}
                      </span>

                      {/* BUY BUTTON */}
                      {block.sell_singles && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSinglePurchase(track, block, landing);
                          }}
                          className="px-3 py-1 rounded bg-green text-black font-semibold text-sm"
                        >
                          {block.single_button_text || "Buy"}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* BUY FULL ALBUM */}
        {block.sell_album && block.playlist.length > 0 && (
          <button
            type="button"
            onClick={() => handleAlbumPurchase(block, landing)}
            className="mt-4 w-full py-3 bg-green text-black font-semibold rounded-lg"
          >
            {block.album_button_text || "Buy Album"}
          </button>
        )}
      </div>

      {/* SETTINGS PANEL */}
      <div className="p-4 bg-[#111]/40 border border-gray-800 rounded-lg space-y-4 mt-8">
        {/* Title */}
        <label className="text-sm text-gray-300">Track Title</label>
        <input
          value={block.title || ""}
          onChange={(e) => updateBlock(index, "title", e.target.value)}
          className="w-full p-2 rounded bg-black border border-gray-700 text-white"
        />

        {/* Upload Audio */}
        {/* <input
          id={`audioUpload-${block.id}`}
          type="file"
          accept="audio/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 500 * 1024 * 1024) {
              toast.error("Audio file is too large");
              return;
            }

            const formData = new FormData();
            formData.append("audio", file);
            formData.append("landingId", landing.id);
            formData.append("blockId", block.id);
            setIsUploading(true);
            try {
              await validateAudioDuration(file);

              const res = await axiosInstance.post(
                "/landing/upload-media-block",
                formData,
                {
                  timeout: 0,
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (e) => {
                    if (e.total) {
                      const percent = Math.round((e.loaded * 100) / e.total);
                      console.log("Upload progress:", percent);
                    }
                  },
                }
              );

              console.log(
                "[UPLOAD COMPLETE]",
                "Time:",
                Math.round((Date.now() - startTime) / 1000),
                "seconds"
              );

              if (res.data.success) {
                const newTrack = {
                  title: file.name.replace(/\.[^/.]+$/, "") || "Untitled Track",
                  audio_url: res.data.url,
                  cover_url: block.cover_url || "",
                  price: block.single_price || "",
                  stripe_product_id: "",
                  stripe_price_id: "",
                };

                const updatedPlaylist = [...(block.playlist || []), newTrack];

                updateBlock(index, "playlist", updatedPlaylist);

                // Load this new track immediately:
                updateBlock(index, "audio_url", newTrack.audio_url);
                updateBlock(index, "audio_name", newTrack.title);
                updateBlock(index, "title", newTrack.title);

                toast.success("Audio added to playlist!");
              } else {
                toast.error("Upload failed");
              }
            } catch (err) {
              console.error(err);
              toast.error(err.message || "Invalid audio file");
            } finally {
              setIsUploading(false);
            }
          }}
          className="hidden"
        /> */}
        <input
          id={`audioUpload-${block.id}`}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsUploading(true);

            try {
              // 1️⃣ client side duration check
              await validateAudioDuration(file);

              // 2️⃣ ask backend for signed upload URL
              const signRes = await axiosInstance.post("/landing/sign-upload", {
                fileName: file.name,
                mimeType: file.type,
                landingId: landing.id,
                blockId: block.id,
              });

              if (!signRes.data?.success) {
                throw new Error("Failed to get upload URL");
              }

              const { uploadUrl, publicUrl } = signRes.data;

              // 3️⃣ upload DIRECTLY to DigitalOcean Spaces
              await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                  "Content-Type": file.type,
                  "x-amz-acl": "public-read", // 👈 REQUIRED
                },
              });

              // 4️⃣ save to playlist
              const newTrack = {
                title: file.name.replace(/\.[^/.]+$/, ""),
                audio_url: publicUrl,
                cover_url: block.cover_url || "",
                price: block.single_price || "",
                stripe_product_id: "",
                stripe_price_id: "",
              };

              const updatedPlaylist = [...(block.playlist || []), newTrack];

              updateBlock(index, "playlist", updatedPlaylist);
              updateBlock(index, "audio_url", newTrack.audio_url);
              updateBlock(index, "audio_name", newTrack.title);
              updateBlock(index, "title", newTrack.title);

              toast.success("Audio uploaded successfully");
            } catch (err) {
              console.error(err);
              toast.error(err.message || "Upload failed");
            } finally {
              setIsUploading(false);
              e.target.value = ""; // reset input
            }
          }}
        />

        <label
          htmlFor={`audioUpload-${block.id}`}
          className="px-4 py-2 bg-blue rounded cursor-pointer text-white inline-block mt-2"
        >
          Upload Audio
        </label>
        <button
          type="button"
          onClick={() => {
            updateBlock(index, "audio_url", "");
            updateBlock(index, "audio_name", "");
            updateBlock(index, "title", "");
            setCurrentTime(0);
            setDuration(0);
            setSeekValue(0);
            setIsPlaying(false);

            // remove from playlist if needed
            const updatedPlaylist = (block.playlist || []).filter(
              (t) => t.audio_url !== block.audio_url
            );
            updateBlock(index, "playlist", updatedPlaylist);

            toast.success("Audio removed.");
          }}
          className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white inline-block mt-2"
        >
          Remove Audio
        </button>

        {/* Audio URL */}
        <label className="text-sm text-gray-300 block">Audio File</label>
        <input
          value={block.audio_name || "No audio uploaded"}
          readOnly
          className="w-full p-2 rounded bg-black border border-gray-700 text-white"
          placeholder="No audio uploaded"
        />

        {/* Upload Cover Image */}
        <input
          id={`coverUpload-${block.id}`}
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);
            formData.append("landingId", landing.id);
            formData.append("blockId", block.id);
            setIsUploading(true);
            try {
              const res = await axiosInstance.post(
                "/landing/upload-media-block",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );

              if (res.data.success) {
                const newCover = res.data.url;

                // Update the active track in playlist too
                const updatedPlaylist = (block.playlist || []).map((track) =>
                  track.audio_url === block.audio_url
                    ? { ...track, cover_url: newCover }
                    : track
                );

                updateBlock(index, "playlist", updatedPlaylist);

                // Update block cover
                updateBlock(index, "cover_url", newCover);
                updateBlock(index, "cover_name", res.data.originalName);

                toast.success("Cover updated!");
              } else {
                toast.error("Upload failed");
              }
            } catch (err) {
              console.error(err);
              toast.error("Upload error");
            } finally {
              setIsUploading(false);
            }
          }}
          className="hidden"
        />

        <label
          htmlFor={`coverUpload-${block.id}`}
          className="px-4 py-2 bg-royalPurple rounded cursor-pointer text-white inline-block mt-2"
        >
          Upload Cover
        </label>
        <button
          type="button"
          onClick={() => {
            updateBlock(index, "cover_url", "");
            updateBlock(index, "cover_name", "");

            // update playlist entry as well
            const updatedPlaylist = (block.playlist || []).map((track) =>
              track.audio_url === block.audio_url
                ? { ...track, cover_url: "" }
                : track
            );
            updateBlock(index, "playlist", updatedPlaylist);

            toast.success("Cover removed.");
          }}
          className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white inline-block mt-2"
        >
          Remove Cover
        </button>

        {/* Cover URL */}
        <label className="text-sm text-gray-300 block">Cover Image URL</label>
        <input
          value={block.cover_name || "No cover uploaded"}
          readOnly
          className="w-full p-2 rounded bg-black border border-gray-700 text-white"
        />

        {/* --- SELLING OPTIONS ------------------------------------------------ */}
        <div className="p-4 bg-[#111]/40 border border-gray-800 rounded-lg space-y-4">
          <h3 className="text-silver font-semibold text-lg">Selling Options</h3>

          {/* Sell Singles */}
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={block.sell_singles}
              onChange={(e) =>
                updateBlock(index, "sell_singles", e.target.checked)
              }
            />
            Sell Individual Tracks
          </label>

          {/* Default single price */}
          {block.sell_singles && (
            <div>
              <label className="text-sm text-gray-300">
                Default Single Price
              </label>
              <input
                className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                value={block.single_price}
                onChange={(e) =>
                  updateBlock(index, "single_price", e.target.value)
                }
                placeholder="0.00"
              />
            </div>
          )}

          {/* Sell Album */}
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={block.sell_album}
              onChange={(e) =>
                updateBlock(index, "sell_album", e.target.checked)
              }
            />
            Sell Full Album
          </label>

          {/* Album Price + Button Text */}
          {block.sell_album && (
            <>
              <label className="text-sm text-gray-300">Album Price</label>
              <input
                className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                value={block.album_price}
                onChange={(e) =>
                  updateBlock(index, "album_price", e.target.value)
                }
                placeholder="9.99"
              />

              <label className="text-sm text-gray-300">Album Button Text</label>
              <input
                className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                value={block.album_button_text}
                onChange={(e) =>
                  updateBlock(index, "album_button_text", e.target.value)
                }
              />
            </>
          )}
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={block.preview_enabled}
              onChange={(e) => {
                updateBlock(index, "preview_enabled", e.target.checked);

                if (e.target.checked && !block.preview_duration) {
                  updateBlock(index, "preview_duration", 10); // default 10s
                }
              }}
            />
            Limit Playback to Preview Only
          </label>

          {block.preview_enabled && (
            <div>
              <label className="text-sm text-gray-300">Preview Duration</label>

              <select
                className="w-full p-2 rounded bg-black border border-gray-700 text-white mt-1"
                value={block.preview_duration}
                onChange={(e) =>
                  updateBlock(index, "preview_duration", Number(e.target.value))
                }
              >
                {getPreviewOptions(duration).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-400 mt-1">
                Choose up to 30 minutes based on the audio length.
              </p>
            </div>
          )}
        </div>

        {/* Waveform Colors */}
        <div className="mt-8 space-y-6 p-4 rounded-lg bg-[#111]/40 border border-gray-800">
          {/* Waveform + Progress Colors */}
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Waveform Appearance
            </label>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {/* Waveform Color */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Waveform Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.waveform_color}
                    onChange={(e) =>
                      updateBlock(index, "waveform_color", e.target.value)
                    }
                    className="w-10 h-10 rounded-full cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={block.waveform_color}
                    onChange={(e) =>
                      updateBlock(index, "waveform_color", e.target.value)
                    }
                    onBlur={(e) => {
                      const cleaned = e.target.value.startsWith("#")
                        ? e.target.value
                        : `#${e.target.value}`;
                      updateBlock(index, "waveform_color", cleaned);
                    }}
                    className="w-24 p-1 bg-black border border-gray-700 rounded text-white text-sm"
                    placeholder="#22c55e"
                  />
                </div>
              </div>

              {/* Progress Color */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Progress Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.progress_color}
                    onChange={(e) =>
                      updateBlock(index, "progress_color", e.target.value)
                    }
                    className="w-10 h-10 rounded-full cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={block.progress_color}
                    onChange={(e) =>
                      updateBlock(index, "progress_color", e.target.value)
                    }
                    onBlur={(e) => {
                      const cleaned = e.target.value.startsWith("#")
                        ? e.target.value
                        : `#${e.target.value}`;
                      updateBlock(index, "progress_color", cleaned);
                    }}
                    className="w-24 p-1 bg-black border border-gray-700 rounded text-white text-sm"
                    placeholder="#16a34a"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Match Background */}
          <div className="flex items-center gap-3">
            <label
              className="text-sm font-semibold"
              style={{ color: getLabelContrast(block.bg_color) }}
            >
              Match Section Background
            </label>
            <input
              type="checkbox"
              checked={block.match_main_bg}
              onChange={(e) =>
                updateBlock(index, "match_main_bg", e.target.checked)
              }
            />
          </div>

          {/* Use Gradient */}
          <div className="flex items-center gap-3">
            <label
              className="text-sm font-semibold"
              style={{ color: getLabelContrast(block.bg_color) }}
            >
              Use Gradient Background
            </label>
            <input
              type="checkbox"
              checked={block.use_gradient}
              onChange={(e) =>
                updateBlock(index, "use_gradient", e.target.checked)
              }
            />
          </div>

          {/* Gradient or Solid BG Logic (unchanged) */}
          {block.use_gradient ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Gradient Start</label>
                <input
                  type="color"
                  value={block.gradient_start}
                  onChange={(e) =>
                    updateBlock(index, "gradient_start", e.target.value)
                  }
                  className="w-full h-10 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Gradient End</label>
                <input
                  type="color"
                  value={block.gradient_end}
                  onChange={(e) =>
                    updateBlock(index, "gradient_end", e.target.value)
                  }
                  className="w-full h-10 rounded mt-1"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-300">
                  Gradient Direction
                </label>
                <select
                  value={block.gradient_direction}
                  onChange={(e) =>
                    updateBlock(index, "gradient_direction", e.target.value)
                  }
                  className="w-full p-2 rounded bg-black border border-gray-700 text-white mt-1"
                >
                  <option value="90deg">Left → Right</option>
                  <option value="180deg">Top → Bottom</option>
                  <option value="45deg">Diagonal ↘</option>
                  <option value="135deg">Diagonal ↙</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <label className="text-sm text-gray-300">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={block.bg_color}
                  onChange={(e) =>
                    updateBlock(index, "bg_color", e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={block.bg_color}
                  onChange={(e) =>
                    updateBlock(index, "bg_color", e.target.value)
                  }
                  className="w-24 p-1 bg-black border border-gray-700 rounded text-white text-sm"
                />
              </div>
            </>
          )}

          {/* Title Text Color */}
          <div>
            <label className="text-sm text-gray-300">Title Text Color</label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={block.text_color}
                onChange={(e) =>
                  updateBlock(index, "text_color", e.target.value)
                }
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={block.text_color}
                onChange={(e) =>
                  updateBlock(index, "text_color", e.target.value)
                }
                className="w-24 p-1 bg-black border border-gray-700 rounded text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
