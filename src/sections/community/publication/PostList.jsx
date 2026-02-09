export function PostList({ posts }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <div key={post.id} className="cursor-pointer">
          <h3 className="font-semibold leading-snug">{post.title}</h3>

          {post.subtitle && (
            <p className="mt-1 text-sm opacity-70">{post.subtitle}</p>
          )}

          <p className="mt-2 text-xs opacity-50">{post.published_at}</p>
        </div>
      ))}
    </div>
  );
}
