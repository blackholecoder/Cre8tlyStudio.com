export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
        <p className="text-white font-semibold">Restoring your session...</p>
      </div>
    </div>
  );
}