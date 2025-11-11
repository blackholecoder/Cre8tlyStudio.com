export function normalizeVideoUrl(url) {
  if (!url) return "";

  const clean = url.trim();

  // ✅ Handle YouTube "watch" links
  if (clean.includes("youtube.com/watch?v=")) {
    const id = clean.split("watch?v=")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }

   // ✅ Handle YouTube "shorts" links
  if (clean.includes("youtube.com/shorts/")) {
    const id = clean.split("shorts/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }

  // ✅ Handle YouTube short links
  if (clean.includes("youtu.be/")) {
    const id = clean.split("youtu.be/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }

  // ✅ Handle Vimeo links
  if (clean.includes("vimeo.com") && !clean.includes("player.vimeo.com")) {
    const id = clean.split("vimeo.com/")[1].split(/[?&]/)[0];
    return `https://player.vimeo.com/video/${id}`;
  }

  // already an embed URL
  return clean;
}