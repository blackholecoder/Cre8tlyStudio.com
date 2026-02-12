import { useRef, useEffect, useMemo } from "react";
import {
  registerAudio,
  unregisterAudio,
} from "../../../helpers/globalAudioManager";

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }

  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function FragmentAudioPlayer({
  audioUrl,
  audioTitle,
  durationSeconds,
}) {
  const audioRef = useRef(null);

  const formattedDuration = useMemo(
    () => formatDuration(durationSeconds),
    [durationSeconds],
  );

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handlePlay = () => {
      registerAudio(audioEl);
    };

    const handleEnded = () => {
      unregisterAudio(audioEl);
    };

    const handlePause = () => {
      if (audioEl.currentTime === 0 || audioEl.paused) {
        unregisterAudio(audioEl);
      }
    };

    audioEl.addEventListener("play", handlePlay);
    audioEl.addEventListener("ended", handleEnded);
    audioEl.addEventListener("pause", handlePause);

    return () => {
      unregisterAudio(audioEl);
      audioEl.removeEventListener("play", handlePlay);
      audioEl.removeEventListener("ended", handleEnded);
      audioEl.removeEventListener("pause", handlePause);
    };
  }, []);

  if (!audioUrl) return null;

  return (
    <div
      className="
        mt-3
        rounded-lg
        border
        border-dashboard-border-light
        dark:border-dashboard-border-dark
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        p-3
      "
      onClick={(e) => e.stopPropagation()}
    >
      {audioTitle && (
        <div className="mb-1 text-xs font-medium text-dashboard-text-light dark:text-dashboard-text-dark truncate">
          {audioTitle}
        </div>
      )}

      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        preload="metadata"
        className="w-full"
      />
    </div>
  );
}
