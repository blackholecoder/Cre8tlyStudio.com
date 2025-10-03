export default function ToastMessage({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-fadeIn">
        <span className="text-lg font-semibold">✅ {message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white font-bold text-xl hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
