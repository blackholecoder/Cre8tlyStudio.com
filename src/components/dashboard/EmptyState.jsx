export default function EmptyState({ type = "magnet" }) {
  const isBook = type === "book";

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      <p className="text-silver text-lg max-w-md leading-relaxed italic">
        {isBook
          ? "You haven’t written any books yet."
          : "You haven’t created any lead magnets yet."}
      </p>
      <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm mt-2">
        Get started whenever you’re ready.
      </p>
    </div>
  );
}
