// import { useEffect, useRef, useState } from "react";
// import { FaPlay, FaPause } from "react-icons/fa";

// export function PreviewPlayer({
//   src, // full mp3 url or a preview file url
//   title = "Preview",
//   start = 0, // seconds to start preview
//   end = 30, // seconds to stop preview
//   initialVolume = 0.8,
// }) {
//   const audioRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [time, setTime] = useState(0);
//   const [volume, setVolume] = useState(initialVolume);

//   useEffect(() => {
//     const a = audioRef.current;
//     if (!a) return;

//     const onLoaded = () => {
//       setDuration(a.duration || 0);
//       // start the playhead at preview start
//       a.currentTime = start;
//     };

//     const onTime = () => {
//       setTime(a.currentTime);
//       if (a.currentTime >= end) {
//         a.pause();
//         setIsPlaying(false);
//         // reset to start so the next press replays the clip
//         a.currentTime = start;
//       }
//     };

//     const onEnd = () => {
//       setIsPlaying(false);
//       a.currentTime = start;
//     };

//     a.addEventListener("loadedmetadata", onLoaded);
//     a.addEventListener("timeupdate", onTime);
//     a.addEventListener("ended", onEnd);
//     return () => {
//       a.removeEventListener("loadedmetadata", onLoaded);
//       a.removeEventListener("timeupdate", onTime);
//       a.removeEventListener("ended", onEnd);
//     };
//   }, [start, end]);

//   useEffect(() => {
//     if (audioRef.current) audioRef.current.volume = volume;
//   }, [volume]);

//   const toggle = async () => {
//     const a = audioRef.current;
//     if (!a) return;
//     if (isPlaying) {
//       a.pause();
//       setIsPlaying(false);
//     } else {
//       // if user scrubbed before the start, snap to the start
//       if (a.currentTime < start || a.currentTime >= end) a.currentTime = start;
//       try {
//         await a.play();
//         setIsPlaying(true);
//       } catch (e) {
//         // autoplay blocked, do nothing
//       }
//     }
//   };

//   const format = (s) => {
//     if (!isFinite(s)) return "0:00";
//     const m = Math.floor(s / 60);
//     const sec = Math.floor(s % 60)
//       .toString()
//       .padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   // progress within the preview window
//   const previewLength = Math.max(end - start, 1);
//   const previewProgress = Math.min(
//     Math.max(((time - start) / previewLength) * 100, 0),
//     100
//   );

//   const onScrub = (e) => {
//     const a = audioRef.current;
//     if (!a) return;
//     const pct = Number(e.target.value) / 100;
//     a.currentTime = start + pct * previewLength;
//     setTime(a.currentTime);
//   };

//   return (
//     <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-4 mt-5">
//       <audio ref={audioRef} src={src} preload="metadata" />
//       <div className="flex items-center gap-3 flex-wrap">
//         <button
//           onClick={toggle}
//           className="grid place-items-center w-12 h-12 rounded-xl bg-blue text-white hover:opacity-90"
//         >
//            {isPlaying ? <FaPause /> : <FaPlay />}
//         </button>

//         {/* Progress + Info */}
//         <div className="flex-1 min-w-[180px]">
//           <div className="text-white font-semibold">{title}</div>
//           <div className="text-silver text-sm">
//             {format(Math.max(time - start, 0))} / {format(previewLength)}
//           </div>
//           <input
//             type="range"
//             min={0}
//             max={100}
//             value={previewProgress}
//             onChange={onScrub}
//             className="w-full mt-2 accent-blue"
//           />
//         </div>

//         {/* Volume */}
//         <div className="flex items-center gap-2 min-w-[100px]">
//           <span className="text-silver text-xs">Vol</span>
//           <input
//             type="range"
//             min={0}
//             max={1}
//             step={0.01}
//             value={volume}
//             onChange={(e) => setVolume(Number(e.target.value))}
//             className="flex-1 accent-blue"
//           />
//         </div>
//       </div>

//       <div className="mt-2 text-silver text-xs">
//         Preview from {format(start)} to {format(end)}
//       </div>
//     </div>
//   );
// }
import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

let soloCurrent = null;
const claimSolo = (a) => {
  if (soloCurrent && soloCurrent !== a) soloCurrent.pause();
  soloCurrent = a;
};
const releaseSolo = (a) => {
  if (soloCurrent === a) soloCurrent = null;
};

export function PreviewPlayer({
  src,
  title = "Preview",
  start = 0,
  end = 30,
  initialVolume = 0.8,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(initialVolume);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => {
      setDuration(a.duration || 0);
      a.currentTime = start;
    };

    const onTime = () => {
      setTime(a.currentTime);
      if (a.currentTime >= end) {
        a.pause();
        a.currentTime = start;
        releaseSolo(a);
      }
    };

    const onEnd = () => {
      a.currentTime = start;
      releaseSolo(a);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      releaseSolo(a);
    };
  }, [start, end]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      releaseSolo(a);
    } else {
      if (a.currentTime < start || a.currentTime >= end) a.currentTime = start;
      try {
        claimSolo(a);
        await a.play();
      } catch (e) {
        releaseSolo(a);
      }
    }
  };

  const format = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const previewLength = Math.max(end - start, 1);
  const previewProgress = Math.min(
    Math.max(((time - start) / previewLength) * 100, 0),
    100
  );

  const onScrub = (e) => {
    const a = audioRef.current;
    if (!a) return;
    const pct = Number(e.target.value) / 100;
    a.currentTime = start + pct * previewLength;
    setTime(a.currentTime);
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-4 mt-5">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={toggle}
          className="grid place-items-center w-12 h-12 rounded-xl bg-blue text-white hover:opacity-90"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="flex-1 min-w-[180px]">
          <div className="text-white font-semibold">{title}</div>
          <div className="text-silver text-sm">
            {format(Math.max(time - start, 0))} / {format(previewLength)}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={previewProgress}
            onChange={onScrub}
            className="w-full mt-2 accent-blue"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="text-silver text-xs">Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-blue"
          />
        </div>
      </div>
      <div className="mt-2 text-silver text-xs">
        Preview from {format(start)} to {format(end)}
      </div>
    </div>
  );
}
