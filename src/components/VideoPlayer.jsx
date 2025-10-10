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
          src="https://cre8tlystudio.nyc3.cdn.digitaloceanspaces.com/Videos/Cre8tlyStudio.mp4"
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
