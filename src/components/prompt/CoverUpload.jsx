import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Lock, ImageIcon } from "lucide-react";
import { useAuth } from "../../admin/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import UnsplashImagePicker from "../../components/unsplash/UnsplashImagePicker.jsx";

export default function CoverUpload({ setCover }) {
  const [preview, setPreview] = useState(null);
  const [credit, setCredit] = useState(null); // ✅ store photographer info
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const isLocked = !user?.pro_covers;

  // ✅ Handle local upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000 * 1024 * 1024) {
      toast.error("File too large. Maximum 1GB allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCover(reader.result);
      setPreview(reader.result);
      setCredit(null); // remove Unsplash credit if user uploads manually
    };
    reader.readAsDataURL(file);
  };

  const handleUnlock = () => navigate("/plans");

  // ✅ When Unsplash image is chosen
  const handleUnsplashSelect = (url, img) => {
    setCover(url);
    setPreview(img.urls.small);
    setCredit({
      name: img.user.name,
      profile: img.user.links.html,
    });
    toast.success("Cover image selected!");
  };

  return (
    <div className="relative mt-6 border border-gray-700 rounded-xl p-4 bg-gray-900/60 overflow-hidden">
      {/* 🔒 Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
          <button
            onClick={handleUnlock}
            className="px-8 py-2.5 rounded-lg border border-royalPurple bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff]
             text-black font-semibold hover:opacity-90 transition shadow-lg flex items-center gap-2 justify-center"
          >
            <Lock size={15} className="text-black" />
            <span>Unlock Pro Covers</span>
          </button>
        </div>
      )}

      {/* Title Row */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-gray-300 font-semibold text-lg tracking-wide">
          Upload or Choose a Cover{" "}
          <span className="text-sm text-gray-500 ml-1">(Max 667 × 1000)</span>
        </label>

        <span
          className={`bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff]
                     text-black font-semibold text-xs px-3 py-1 rounded-full
                     shadow-[0_0_10px_rgba(168,130,255,0.6)]
                     border border-[#d2b6ff]/60 uppercase tracking-wider
                     ${isLocked ? "opacity-60" : ""}`}
        >
          PRO
        </span>
      </div>

      {/* File Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
        disabled={isLocked}
      />

      <button
        type="button"
        onClick={() => !isLocked && fileInputRef.current.click()}
        disabled={isLocked}
        className={`px-5 py-2 rounded-md font-semibold text-sm shadow-md transition cursor-pointer flex items-center gap-2 
          ${
            isLocked
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green text-black hover:bg-green"
          }`}
      >
        <ImageIcon size={16} /> Choose File
      </button>

      {/* ✅ Unsplash picker injected here */}
      {!isLocked && (
        <div className="mt-4">
          <UnsplashImagePicker onSelect={handleUnsplashSelect} />
        </div>
      )}

      {/* ✅ Preview and attribution */}
      {preview && !isLocked && (
        <div className="mt-4 text-center">
          <img
            src={preview}
            alt="Cover Preview"
            className="w-[225px] h-[320px] object-cover rounded-lg shadow-lg mx-auto"
          />
          <p className="text-xs text-gray-500 mt-1">
            This cover will appear before your first page.
          </p>

          {credit && (
            <p className="text-[10px] text-gray-400 mt-1 italic">
              Photo by{" "}
              <a
                href={credit.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-400 hover:text-green-300"
              >
                {credit.name}
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-400 hover:text-green-300"
              >
                Unsplash
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
