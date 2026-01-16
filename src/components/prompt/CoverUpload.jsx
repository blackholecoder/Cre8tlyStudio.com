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
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔒 Limit file size (example: 10 MB max — 1 GB is way too large for base64)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Maximum ${maxSizeMB} MB allowed.`);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      // ✅ Set base64 string (data:image/...;base64,...)
      setCover(base64);
      setPreview(base64);

      // Clear Unsplash credit if the user uploads manually
      setCredit(null);
    };

    // Trigger file reading
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

  const handleRemoveCover = () => {
    setCover(null);
    setPreview(null);
    setCredit(null);

    // also reset file input so the same file can be re selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.info("Cover image removed");
  };

  return (
    <div className="relative mt-6 border border-gray-700 rounded-xl p-4 bg-[#0b0b0b] overflow-hidden">
      {/* 🔒 Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
          <button
            onClick={handleUnlock}
            className="px-8 py-2.5 rounded-lg border border-royalPurple bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff]
             text-black font-semibold hover:opacity-90 transition shadow-lg flex items-center gap-2 justify-center"
          >
            <Lock size={15} className="text-black" />
            <span>Upgrade to Unlock</span>
          </button>
        </div>
      )}

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <label className="block text-gray-300 font-semibold text-lg tracking-wide">
          Upload or Choose a Cover{" "}
          <span className="text-sm text-gray-500 ml-1">(Max 667 × 1000)</span>
        </label>

        <span
          className={`
  self-start
  bg-[#0f0f0f]
  text-gray-400
  text-[11px]
  px-3 py-1
  rounded-full
  border border-[#7c3aed]/60
  tracking-wide
  uppercase
  shadow-[inset_0_0_0_1px_rgba(124,58,237,0.15)]
  ${isLocked ? "opacity-50" : ""}
`}
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
        className={`w-full sm:w-auto px-5 py-3 rounded-md font-semibold text-sm shadow-md transition 
    flex items-center justify-center gap-2
    ${
      isLocked
        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
        : "bg-gray-700 text-white hover:bg-green hover:text-black"
    }`}
      >
        <ImageIcon size={16} /> Choose File
      </button>

      {/* ✅ Unsplash picker injected here */}
      {!isLocked && (
        <div className="mt-4">
          <div className="flex flex-col gap-3">
            <UnsplashImagePicker onSelect={handleUnsplashSelect} />
          </div>
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

          <button
            type="button"
            onClick={handleRemoveCover}
            className="
    mt-3
    w-full
    sm:w-auto
    text-sm
    font-semibold
    text-red-400
    border
    border-red-400/30
    px-4
    py-2
    rounded-lg
    hover:bg-red-500/10
    hover:text-red-300
    transition
  "
          >
            Remove cover image
          </button>

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
