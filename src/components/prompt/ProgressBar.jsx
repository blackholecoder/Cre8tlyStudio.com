export default function ProgressBar({ progress }) {
  return (
    <div className="mt-6 w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 p-4">
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="h-3 bg-gradient-to-r from-green to-royalPurple rounded-full transition-all duration-700 ease-out animate-pulseGlow"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
