import { Mention } from "../sections/community/modals/Mention";

export function renderTextWithLinks(text) {
  try {
    if (!text) return null;

    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const youtubeRegex =
      /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;

    const parts = [];
    let lastIndex = 0;

    // 1️⃣ Markdown-style links first
    text.replace(markdownLinkRegex, (match, label, url, index) => {
      if (index > lastIndex) {
        parts.push(text.slice(lastIndex, index));
      }

      parts.push(
        <a
          key={`md-${index}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            underline
            text-dashboard-metric-light dark:text-dashboard-metric-dark
            hover:opacity-80
          "
        >
          {label}
        </a>,
      );

      lastIndex = index + match.length;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // 2️⃣ URLs, YouTube embeds, then mentions
    return parts.flatMap((part, i) => {
      if (typeof part !== "string") return part;

      return part.split(urlRegex).flatMap((chunk, j) => {
        if (chunk.match(urlRegex)) {
          const cleanChunk = chunk.trim();
          const ytMatch = cleanChunk.match(youtubeRegex);

          // 🎥 YouTube embed
          if (ytMatch) {
            return (
              <div key={`yt-${i}-${j}`} className="my-6">
                <iframe
                  className="
                    w-full aspect-video rounded-xl
                    border border-dashboard-border-light
                    dark:border-dashboard-border-dark
                  "
                  src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          // 🔗 Normal URL
          return (
            <a
              key={`url-${i}-${j}`}
              href={cleanChunk}
              target="_blank"
              rel="noopener noreferrer"
              className="
                underline
                text-dashboard-metric-light dark:text-dashboard-metric-dark
                hover:opacity-80
              "
            >
              {cleanChunk}
            </a>
          );
        }

        // 3️⃣ Mentions ONLY in plain text
        return chunk.split(mentionRegex).map((sub, k) => {
          if (k % 2 === 1) {
            return <Mention key={`mention-${i}-${j}-${k}`} username={sub} />;
          }

          return (
            <span key={`text-${i}-${j}-${k}`} className="whitespace-pre-wrap">
              {sub}
            </span>
          );
        });
      });
    });
  } catch (error) {
    console.error("❌ renderTextWithLinks error:", error);
    return text;
  }
}
