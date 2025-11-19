export default function LoadingState({ label = "Loading your lead magnets..." }) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green mb-4"></div>
      <p className="text-silver">{label}</p>
    </div>
  );
}
