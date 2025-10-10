// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useAuth } from "../../admin/AuthContext.jsx";

// export default function CoverUpload({ cover, setCover }) {
//   const [preview, setPreview] = useState(null);
//   const { user } = useAuth();

//   console.log("USER FROM CONTEXT:", user);


//   // ✅ Handle upload
//   const handleCoverUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.size > 1000 * 1024 * 1024) {
//       toast.error("File too large. Maximum 1GB allowed.");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setCover(reader.result); // Base64
//       setPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   // ✅ Only show if user has pro covers
//   if (!user || user.pro_covers !== 1) return null;


//   return (
//     <div className="mt-6 border border-gray-700 rounded-xl p-4 bg-gray-900/60">
//       <div className="flex items-center justify-between mb-2">
//   <label className="block text-gray-300 font-semibold text-lg tracking-wide">
//     Upload PDF Cover <span className="text-sm text-gray-500 ml-1">(Max 667 × 1000 - 1GB)</span>
//   </label>

//   <div className="flex items-center space-x-2">
//     <span className="bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff]
//                      text-black font-semibold text-xs px-3 py-1 rounded-full
//                      shadow-[0_0_10px_rgba(168,130,255,0.6)]
//                      border border-[#d2b6ff]/60 uppercase tracking-wider">
//       PRO
//     </span>
//   </div>
// </div>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleCoverUpload}
//         className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
//                    file:rounded-md file:border-0 file:text-sm file:font-semibold 
//                    file:bg-headerGreen file:text-black hover:file:bg-green-500 cursor-pointer"
//       />

//       {preview && (
//         <div className="mt-3">
//           <img
//             src={preview}
//             alt="Cover Preview"
//             className="w-52 h-auto rounded-lg shadow-lg mx-auto"
//           />
//           <p className="text-xs text-gray-500 mt-1 text-center">
//             This cover will appear before your first page.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../admin/AuthContext.jsx";

export default function CoverUpload({ cover, setCover }) {
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const fileInputRef = useRef(null); // 👈 to trigger click manually

  // ✅ Handle upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000 * 1024 * 1024) {
      toast.error("File too large. Maximum 1GB allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCover(reader.result); // Base64
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Only show if user has pro covers
  if (!user || user.pro_covers !== 1) return null;

  return (
    <div className="mt-6 border border-gray-700 rounded-xl p-4 bg-gray-900/60">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-gray-300 font-semibold text-lg tracking-wide">
          Upload PDF Cover{" "}
          <span className="text-sm text-gray-500 ml-1">(Max 667 × 1000 - 1GB)</span>
        </label>

        <div className="flex items-center space-x-2">
          <span
            className="bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff]
                       text-black font-semibold text-xs px-3 py-1 rounded-full
                       shadow-[0_0_10px_rgba(168,130,255,0.6)]
                       border border-[#d2b6ff]/60 uppercase tracking-wider"
          >
            PRO
          </span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />

      {/* Visible clickable button */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="inline-block bg-headerGreen text-black font-semibold px-5 py-2 rounded-md 
                   hover:bg-green-500 transition cursor-pointer text-sm shadow-md"
      >
        Choose File
      </button>

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Cover Preview"
            className="w-52 h-auto rounded-lg shadow-lg mx-auto"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            This cover will appear before your first page.
          </p>
        </div>
      )}
    </div>
  );
}
