
export default function MaintenanceScreen() {

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f0f10] text-white text-center px-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">🚧 Down for Maintenance</h1>
      <p className="text-lg text-gray-400 max-w-md mb-8">
        Cre8tly Studio is <span className="text-yellow">temporarily offline</span> while we make improvements.
        <br />We’ll be back shortly, thank you for your patience.
      </p>

      {/* 🏠 Home button */}
      <a
        href="/"
        className="px-6 py-3 bg-green hover:bg-emerald-600 text-black font-semibold rounded-lg shadow-md transition-all duration-200"
      >
        Return Home
      </a>

      <div className="mt-10 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Alure Digital</p>
      </div>
    </div>
  );
}
