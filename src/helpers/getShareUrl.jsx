export function getShareUrl(post, targetType = "post") {
  if (targetType === "fragment") {
    return `${window.location.origin}/community/fragments/${post.id}`;
  }

  return `${window.location.origin}/p/${post.slug}`;
}
