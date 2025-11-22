export default function ThankYouModal({
  visible,
  message,
  setMessage,
  onClose,
  loading,
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999] flex items-center justify-center px-4">
      <div className="bg-[#0F1629] border border-gray-700 rounded-xl w-full max-w-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E293B] px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Email Preview</h2>
          <p className="text-gray-400 text-sm mt-1">
            This is what your thank-you email will look like
          </p>
        </div>

        {/* Email layout */}
        <div className="p-6 space-y-6">
          {/* Subject line */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">
              Subject
            </label>
            <input
              type="text"
              value="Thank you for your purchase!"
              disabled
              className="w-full mt-1 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-2 text-sm opacity-80"
            />
          </div>

          {/* "Email body" */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">
              Email Body
            </label>

            {loading ? (
              <div className="w-full h-72 bg-gray-900 border border-gray-700 rounded-lg flex flex-col items-center justify-center">
                {/* 3-Dot Typing Loader */}
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>

                <p className="text-gray-400 text-sm mt-4">
                  Writing your message...
                </p>
              </div>
            ) : (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-72 bg-gray-900 text-white border border-gray-700 rounded-lg p-4 text-sm leading-relaxed resize-none"
                style={{ fontFamily: "ui-sans-serif, system-ui" }}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#1E293B] flex justify-between items-center border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>

          <a
            href={`mailto:?subject=Thank%20you!&body=${encodeURIComponent(
              message
            )}`}
            className="px-6 py-2 bg-green text-black font-semibold rounded-lg hover:bg-green/80 transition"
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}
