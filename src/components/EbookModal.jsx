export function EbookModal({ ebook, onClose, onBuy, loadingBook }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full shadow-xl p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Ebook cover centered */}
        <div className="flex justify-center">
          <img
            src={ebook.image_url}
            alt={ebook.title}
            className="w-56 h-auto object-contain rounded-lg border border-gray-700"
          />
        </div>

        {/* Text content (left-aligned) */}
        <div className="mt-6 text-left">
          <h2 className="text-3xl font-bold text-white mb-3">
            {ebook.title} (guide)
          </h2>

          <div
            className="text-gray-300 mb-5 text-sm leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: ebook.description }}
          />

          <p className="text-4xl font-extrabold text-white mb-5">
            ${ebook.price}
          </p>

          <button
            onClick={() => onBuy(ebook)} // Pass the full ebook
            disabled={loadingBook === ebook.product_type}
            className={`py-3 px-8 rounded-xl text-lg font-semibold shadow-lg ${
              loadingBook === ebook.product_type
                ? "opacity-50 cursor-not-allowed bg-gray-700"
                : "bg-headerGreen text-black hover:bg-green-400 transition"
            }`}
          >
            {loadingBook === ebook.product_type ? "Redirecting..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}