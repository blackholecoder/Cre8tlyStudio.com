import { FeaturedPost } from "./FeaturedPost";
import { PostList } from "./PostList";

export function PublicationGrid({ posts }) {
  if (!posts.length) {
    return <p className="opacity-60">No posts yet</p>;
  }

  const [featured, ...rest] = posts;

  return (
    <>
      <FeaturedPost post={featured} />
      <PostList posts={rest} />
    </>
  );
}
