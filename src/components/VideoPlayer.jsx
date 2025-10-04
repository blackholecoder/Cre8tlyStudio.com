// import { useRef, useState } from "react";

// export default function VideoPlayer() {
//   const videoRef = useRef(null);
//   const [muted, setMuted] = useState(true);

//   const toggleMute = () => {
//     const vid = videoRef.current;
//     if (vid) {
//       vid.muted = !vid.muted;
//       setMuted(vid.muted);
//     }
//   };

//   return (
//     <section className="relative w-full bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a] py-16 px-4 sm:px-6 mt-10 rounded-3xl shadow-[0_0_25px_rgba(103,15,231,0.3)]">
//   <div className="mx-auto text-center w-full max-w-7xl">
//     <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
//       Watch How Cre8tly Studio Works
//     </h2>
//     <p className="text-gray-400 mb-8 sm:mb-10 text-base sm:text-lg">
//       See how you can generate a professional lead magnet in seconds.
//     </p>

//     <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl border border-gray-800 max-w-[95vw] sm:max-w-5xl mx-auto">
//       <video
//         ref={videoRef}
//         className="w-full h-full object-cover"
//         autoPlay
//         loop
//         playsInline
//         muted={muted}
//         preload="metadata"
//         poster="/assets/video-thumbnail.jpg"
//       >
//         <source
//           src="https://cre8tlystudio.nyc3.cdn.digitaloceanspaces.com/Videos/Cre8tlyStudio-10-bit.mp4"
//           type="video/mp4"
//         />
//         Your browser does not support the video tag.
//       </video>

//       <button
//         onClick={toggleMute}
//         className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm hover:bg-black/80 transition"
//       >
//         {muted ? "🔊 Unmute" : "🔇 Mute"}
//       </button>
//     </div>
//   </div>
// </section>

//   );
// }
import { useRef, useState } from "react";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleMute = () => setMuted((prev) => !prev);

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    // Desktop & Android Fullscreen API
    if (video.requestFullscreen) {
      await video.requestFullscreen();
      setIsFullscreen(true);
      try {
        await screen.orientation.lock("landscape");
      } catch {}
    }
    // iOS Safari-specific fullscreen API
    else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
      setIsFullscreen(true);
    }
  };

  // Detect exit from fullscreen
  const handleFullscreenChange = () => {
    const isFull =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    setIsFullscreen(!!isFull);
  };

  // Bind listener
  if (typeof window !== "undefined") {
    document.onfullscreenchange = handleFullscreenChange;
    document.onwebkitfullscreenchange = handleFullscreenChange;
  }

  return (
    <section className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 mt-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        autoPlay
        loop
        playsInline
        muted={muted}
        preload="metadata"
        poster="/assets/video-thumbnail.jpg"
      >
        <source
          src="https://cre8tlystudio.nyc3.cdn.digitaloceanspaces.com/Videos/Cre8tlyStudio-8-bit.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Buttons overlay */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm hover:bg-black/80 transition"
        >
          {muted ? "🔊 Unmute" : "🔇 Mute"}
        </button>

        <button
          onClick={toggleFullscreen}
          className="bg-black/60 text-white px-3 py-2 rounded-lg text-sm hover:bg-black/80 transition"
        >
          {isFullscreen ? "⤫ Exit" : "⛶ Fullscreen"}
        </button>
      </div>
    </section>
  );
}
