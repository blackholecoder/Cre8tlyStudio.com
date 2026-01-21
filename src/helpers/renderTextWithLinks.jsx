export function renderTextWithLinks(text) {
  if (!text) return null;

  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const youtubeRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;

  const parts = [];
  let lastIndex = 0;

  // 1️⃣ Handle markdown-style links first
  text.replace(markdownLinkRegex, (match, label, url, index) => {
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    parts.push(
      <a
        key={`${index}-${url}`}
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
      </a>
    );

    lastIndex = index + match.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // 2️⃣ Handle raw URLs + YouTube embeds
  return parts.flatMap((part, i) => {
    if (typeof part !== "string") return part;

    return part.split(urlRegex).map((chunk, j) => {
      if (chunk.match(urlRegex)) {
        const cleanChunk = chunk.trim();
        const ytMatch = cleanChunk.match(youtubeRegex);

        // 🎥 YouTube embed
        if (ytMatch) {
          return (
            <div key={`${i}-${j}`} className="my-6">
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

        // 🔗 Normal link
        return (
          <a
            key={`${i}-${j}`}
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

      return (
        <span key={`${i}-${j}`} className="whitespace-pre-wrap">
          {chunk}
        </span>
      );
    });
  });
}
