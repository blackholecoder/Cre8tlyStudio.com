export const normalizeLink = (value) => {
  if (!value) return "";

  const trimmed = value.trim();

  // Already mailto
  if (trimmed.startsWith("mailto:")) return trimmed;

  // Email address
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  // Already http(s)
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Default to https
  return `https://${trimmed}`;
};
