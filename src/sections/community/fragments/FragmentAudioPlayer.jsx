import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Download,
  RotateCcw,
  RotateCw,
  MoreVertical,
} from "lucide-react";
import axiosInstance from "../../../api/axios";

export default function FragmentAudioPlayer({
  audioUrl,
  audioTitle,
  durationSeconds,
  allowDownload = false,
}) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const SPEEDS = [1, 1.25, 1.5, 2, 3];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".speed-menu-wrapper")) {
        setShowSpeedMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;

    audio.currentTime = percent * audio.duration;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";

    const total = Math.floor(seconds);

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(
      audio.currentTime + 10,
      audio.duration || durationSeconds || 0,
    );
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();

    const key = audioUrl.split(".com/")[1]; // extract S3 key

    const res = await axiosInstance.post("/fragments/sign-audio-download", {
      key,
      fileName: audioTitle + ".mp3",
    });

    if (res.data?.downloadUrl) {
      window.location.href = res.data.downloadUrl;
    }
  };

  return (
    <div
      className="
        mt-4
        rounded-xl
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        p-4
        space-y-3
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden Native Audio */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Title + Download */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-dashboard-text-light dark:text-dashboard-text-dark truncate">
          {audioTitle || "Audio"}
        </p>

        {allowDownload && (
          <a
            onClick={handleDownload}
            download={audioTitle || "audio"}
            className="
              inline-flex items-center gap-1.5
              text-xs font-medium
              px-3 py-1.5
              rounded-full
              bg-green/10
              text-green
              hover:bg-green/20
              transition
            "
          >
            <Download size={14} />
            Download
          </a>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Back 10s */}
        <button
          onClick={skipBackward}
          className="
           w-9 h-9
          rounded-full
          flex items-center justify-center
          bg-dashboard-hover-light
          text-dashboard-text-light
          dark:bg-black
          dark:text-green
          hover:bg-dashboard-border-light
          dark:hover:bg-dashboard-hover-dark
          transition
        "
        >
          <RotateCcw size={16} />
        </button>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="
         w-11 h-11
        rounded-full
        flex items-center justify-center
        bg-dashboard-border-light
        text-dashboard-text-light
        dark:bg-black
        dark:text-green
        hover:bg-dashboard-hover-light
        dark:hover:bg-dashboard-hover-dark
        transition
        "
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Forward 10s */}
        <button
          onClick={skipForward}
          className="
          w-9 h-9
          rounded-full
          flex items-center justify-center
          bg-dashboard-hover-light
          text-dashboard-text-light
          dark:bg-black
          dark:text-green
          hover:bg-dashboard-border-light
          dark:hover:bg-dashboard-hover-dark
          transition
        "
        >
          <RotateCw size={16} />
        </button>

        {/* Progress + Time */}
        <div className="flex-1 space-y-1 ml-2">
          <div
            onClick={handleSeek}
            className="
        h-2
        rounded-full
        bg-dashboard-border-light
        dark:bg-dashboard-border-dark
        cursor-pointer
        relative
        overflow-hidden
      "
          >
            <div
              className="h-full bg-green transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
            <span>{formatTime(currentTime)}</span>
            <span>
              {formatTime(durationSeconds || audioRef.current?.duration)}
            </span>
          </div>
        </div>
        {/* Speed Menu */}
        <div className="relative speed-menu-wrapper">
          <button
            onClick={() => setShowSpeedMenu((prev) => !prev)}
            className="
      w-9 h-9
      rounded-full
      flex items-center justify-center
      bg-dashboard-hover-light
      text-dashboard-text-light
      dark:bg-black
      dark:text-green
      hover:bg-dashboard-border-light
      dark:hover:bg-dashboard-hover-dark
      transition
    "
          >
            <MoreVertical size={16} />
          </button>

          {showSpeedMenu && (
            <div
              className="
        absolute right-0 bottom-full mb-2
        w-28
        rounded-xl
        shadow-lg
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        py-1
        z-50
      "
            >
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    setPlaybackRate(speed);
                    setShowSpeedMenu(false);
                  }}
                  className={`
            w-full text-left px-3 py-2 text-sm transition
            ${
              playbackRate === speed
                ? "bg-green/10 text-green"
                : "text-dashboard-text-light dark:text-dashboard-text-dark hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            }
          `}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
