import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function UnsplashImagePicker({ onSelect }) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const loaderRef = useRef(null);

  useEffect(() => {
    if (query.trim() === "") {
      setImages([]);
      setPage(1);
      setHasMore(false);
    }
  }, [query]);

  async function searchUnsplash(newPage = 1, append = false) {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://cre8tlystudio.com/api/unsplash/search?query=${encodeURIComponent(
          query
        )}&per_page=30&page=${newPage}`
      );

      const results = res.data.results || res.data;
      if (!results || results.length === 0) {
        toast.info("No results found", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: true,
          theme: "dark",
        });
      }
      setImages((prev) => (append ? [...prev, ...results] : results));
      setHasMore(results.length > 0);
      setPage(newPage);
    } catch (err) {
      console.error("Unsplash fetch failed:", err);
      toast.error("Failed to fetch images. Please try again.", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: true,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    setImages([]);
    setPage(1);
    searchUnsplash(1, false);
  };

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        searchUnsplash(page + 1, true);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, query]);

  return (
    <div className="space-y-4 bg-[#0b0b0b] p-4 rounded-lg border border-gray-800">
      {/* 🔍 Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Unsplash images (e.g. fitness, coffee, nature)"
          className="
          w-full
          bg-black
          text-white
          p-3
          rounded-lg
          border
          border-gray-900
  "
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="
          w-full
          sm:w-auto
          bg-gray-700
          text-white
          hover:bg-green
          hover:text-black
          font-bold
          px-4
          py-3
          rounded-lg
          transition
          hover:bg-green-400
          disabled:opacity-60
          disabled:cursor-not-allowed
  "
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* 🖼️ Scrollable Grid */}
      <div
        className="grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-4
    gap-3
    overflow-y-auto
    relative
    max-h-[45vh]
    sm:max-h-[400px]"
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group cursor-pointer"
            onClick={() => onSelect(img.urls.full, img)}
          >
            <img
              src={img.urls.small}
              alt={img.alt_description}
              className="rounded-lg w-full h-32
    sm:h-40 object-cover group-hover:opacity-75 transition"
            />
            <span className="absolute bottom-1 left-1 text-xs bg-black/60 px-1 rounded text-white">
              {img.user.name}
            </span>
          </div>
        ))}

        {/* 👇 Invisible loader trigger */}
        {hasMore && !loading && (
          <div ref={loaderRef} className="col-span-full h-8"></div>
        )}

        {/* 🌀 Spinner (smooth & centered at bottom) */}
        {loading && (
          <div className="col-span-full flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-green rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
