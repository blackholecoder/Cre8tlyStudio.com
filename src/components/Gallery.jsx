import { useEffect, useMemo, useRef, useState } from "react";
import {
  dramaAtl,
  dramaBooth,
  dramaLeather,
  dramaLegacy,
  dramaNash,
  dramaImg
} from "../assets/images";

function ToolbarButton({ children, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {children}
    </button>
  );
}

// Inline icons
function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    >
      <path d="M5 12h14" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function GalleryPage() {
  const images = useMemo(
    () => [
      { src: dramaImg, alt: "Drama head shot" },
      { src: dramaBooth, alt: "Drama in the booth, U47 JR " },
      { src: dramaLeather, alt: "Drama in leather biker jacket" },
      { src: dramaLegacy, alt: "Drama legacy photoshoot" },
      { src: dramaNash, alt: "Drama downtown Broadway Nashville TN 2025" },
      { src: dramaAtl, alt: "Drama in Atlanta" },
    ],
    []
  );
  return (
    <div className="min-h-screen bg-bioModal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold">Gallery</h1>
        <ImageGallery images={images} />
      </div>
    </div>
  );
}

export function ImageGallery({ images }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => openAt(i)}
            className="group relative block w-full overflow-hidden rounded-xl"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      {open && (
        <Lightbox
          images={images}
          index={index}
          onIndex={(i) => setIndex(i)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function Lightbox({ images, index, onIndex, onClose }) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [panning, setPanning] = useState(false);
  const last = useRef({ x: 0, y: 0 });
  const swipe = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    time: 0,
    active: false,
  });
  const containerRef = useRef(null);
  const pointers = useRef(new Map()); // pointerId -> { x, y }
  const pinch = useRef({
    active: false,
    baseDist: 0,
    baseScale: 1,
    cx: 0,
    cy: 0,
  });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  const MIN_SCALE = 1;
  const MAX_SCALE = 4; // was 6, bring it down
  const PINCH_DAMPEN = 0.18;

  useEffect(() => {
    // lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      // unlock on unmount
      document.body.style.overflow = "";
    };
  }, []);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const resetTransform = () => {
    setScale(1);
    setTx(0);
    setTy(0);
    setPanning(false);
    swipe.current.active = false;
    pinch.current.active = false;
    pinch.current.baseDist = 0;
  };

  const close = () => {
    onClose();
    setTimeout(resetTransform, 0);
  };

  const next = () => {
    const i = (index + 1) % images.length;
    onIndex(i);
    resetTransform();
  };

  const prev = () => {
    const i = (index - 1 + images.length) % images.length;
    onIndex(i);
    resetTransform();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "+" || e.key === "=") zoom(1.2);
      if (e.key === "-") zoom(1 / 1.2);
      if (e.key === "0") resetTransform();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  const zoom = (factor, cx, cy) => {
    if (!isFinite(factor) || factor <= 0) return;

    const el = containerRef.current;
    const rect = el?.getBoundingClientRect();

    setScale((prev) => {
      const next = clamp(prev * factor, MIN_SCALE, MAX_SCALE);

      if (rect && cx != null && cy != null) {
        // anchor zoom to the gesture point
        const ox = cx - rect.left - rect.width / 2 - tx;
        const oy = cy - rect.top - rect.height / 2 - ty;
        const ratio = next / prev - 1;

        setTx((t) => t - ox * ratio);
        setTy((t) => t - oy * ratio);
      }

      return next;
    });
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 / 1.15 : 1.15;
    zoom(delta, e.clientX, e.clientY);
  };

  // Pointer Events for mouse + touch (mobile swipe + pan)
  const onPointerDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);

    // track pointers
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // start swipe tracking
    swipe.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      time: Date.now(),
      active: true,
    };

    // if already zoomed, allow panning
    if (scale > 1) {
      setPanning(true);
      last.current = { x: e.clientX, y: e.clientY };
    }
    // if two fingers are down, start pinch
    if (pointers.current.size === 2) {
      const it = [...pointers.current.values()];
      const m = mid(it[0], it[1]);
      pinch.current = {
        active: true,
        baseDist: dist(it[0], it[1]),
        baseScale: scale,
        cx: m.x,
        cy: m.y,
      };
      setPanning(false);
    }
  };

  const onPointerMove = (e) => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // If zoomed, pan the image
    if (pinch.current.active && pointers.current.size >= 2) {
      const it = [...pointers.current.values()];
      const m = mid(it[0], it[1]);
      const d = dist(it[0], it[1]);

      // absolute ratio from the starting distance
      const rawRatio = d / Math.max(1, pinch.current.baseDist);
      // dampen so the first move is gentle
      const damped = Math.exp(Math.log(rawRatio) * PINCH_DAMPEN);
      // absolute target scale
      const target = clamp(
        pinch.current.baseScale * damped,
        MIN_SCALE,
        MAX_SCALE
      );
      // convert to a relative factor for the current frame
      const factor = target / Math.max(0.0001, scale);

      zoom(factor, m.x, m.y);
      pinch.current.cx = m.x;
      pinch.current.cy = m.y;
      return;
    }

    if (!swipe.current.active) return;

    if (panning && scale > 1) {
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      setTx((t) => t + dx);
      setTy((t) => t + dy);
      swipe.current.lastX = e.clientX;
      swipe.current.lastY = e.clientY;
      return;
    }

    // If not zoomed, track swipe
    swipe.current.lastX = e.clientX;
    swipe.current.lastY = e.clientY;
  };

  const onPointerUp = (e) => {
    const el = containerRef.current;
    el?.releasePointerCapture?.(e.pointerId);
    pointers.current.delete(e.pointerId);

    if (pointers.current.size < 2) {
      pinch.current.active = false;
      pinch.current.baseDist = 0;
    }

    const s = swipe.current;
    if (!s.active) return;
    s.active = false;

    if (panning && scale > 1) {
      setPanning(false);
      return;
    }

    const dx = s.lastX - s.startX;
    const dy = s.lastY - s.startY;
    const dt = Date.now() - s.time;

    const SWIPE_X = 60;
    const SWIPE_Y_CLOSE = 80;
    const TIME_MAX = 600;

    if (Math.abs(dx) > SWIPE_X && Math.abs(dy) < 120 && dt < TIME_MAX) {
      if (dx < 0) next();
      else prev();
      return;
    }

    if (dy > SWIPE_Y_CLOSE && Math.abs(dx) < 120) {
      close();
      return;
    }
  };

  const onDoubleClick = (e) => {
    if (scale === 1) zoom(2, e.clientX, e.clientY);
    else resetTransform();
  };

  const active = images[index];

  return (
    <div className="fixed inset-0 z-50" aria-modal role="dialog">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/90"
        onClick={close}
        aria-label="Close"
        title="Close"
      />

      {/* Toolbar */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
        <ToolbarButton title="Previous" onClick={prev}>
          <ArrowLeftIcon />
        </ToolbarButton>
        <ToolbarButton title="Next" onClick={next}>
          <ArrowRightIcon />
        </ToolbarButton>
        <div className="mx-2 h-6 w-px bg-white/20" />
        <ToolbarButton title="Zoom out" onClick={() => zoom(1 / 1.08)}>
          <MinusIcon />
        </ToolbarButton>
        <ToolbarButton title="Zoom in" onClick={() => zoom(1.08)}>
          <PlusIcon />
        </ToolbarButton>
        <ToolbarButton title="Reset" onClick={resetTransform}>
          <ResetIcon />
        </ToolbarButton>
        <ToolbarButton title="Close" onClick={close}>
          <CloseIcon />
        </ToolbarButton>
      </div>

      {/* Stage */}
      <div
        ref={containerRef}
        className={`absolute inset-0 z-10 flex items-center justify-center select-none cursor-${scale === 1 ? "zoom-in" : panning ? "grabbing" : "grab"}`}
        style={{ touchAction: "none" }}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={active?.src}
          alt={active?.alt || ""}
          style={{
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
            transition: panning ? "none" : "transform 120ms ease-out",
            maxWidth: scale === 1 ? "90%" : "none",
            maxHeight: scale === 1 ? "85%" : "none",
            willChange: "transform",
            WebkitTransform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
          }}
          className="pointer-events-none drop-shadow-2xl"
        />
      </div>

      {/* Caption */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/80">
        <div className="text-sm md:text-base">{active?.alt}</div>
        <div className="mt-1 text-xs">
          {index + 1} of {images.length}
        </div>
      </div>

      {/* Clickable nav areas for mouse */}
      <button
        className="absolute left-0 top-0 h-full w-1/3 focus:outline-none hidden md:block"
        onClick={prev}
        aria-label="Previous"
        title="Previous"
      />
      <button
        className="absolute right-0 top-0 h-full w-1/3 focus:outline-none hidden md:block"
        onClick={next}
        aria-label="Next"
        title="Next"
      />
    </div>
  );
}
