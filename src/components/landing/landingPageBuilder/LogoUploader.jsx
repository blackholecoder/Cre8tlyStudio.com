import React from "react";

import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";

export default function LogoUploader({ landing, setLanding }) {
  return (
    <div className="mt-12 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 transition-all hover:border-silver/60">
      <div className="flex items-center justify-between mb-5">
        <label className="text-lg font-semibold text-silver tracking-wide">
          Brand Logo
        </label>
        <span className="text-xs text-gray-400 italic">
          Recommended: PNG or SVG · 200×200px+
        </span>
      </div>

      {!landing.logo_url ? (
        <label
          htmlFor="logoUpload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-green rounded-xl py-10 px-6 cursor-pointer transition-all duration-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-500 group-hover:text-green transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-6-9l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <p className="mt-3 text-sm text-gray-400">
            <span className="text-green font-medium">Click to upload</span> or
            drag your logo
          </p>

          <input
            id="logoUpload"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const previewUrl = URL.createObjectURL(file);
              setLanding({ ...landing, logo_url: previewUrl });

              const formData = new FormData();
              formData.append("logo", file);
              formData.append("landingId", landing.id);

              try {
                const res = await axiosInstance.post(
                  "/landing/upload-logo",
                  formData,
                  { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (res.data.success) {
                  setLanding({ ...landing, logo_url: res.data.logo_url });
                  toast.success("Logo uploaded successfully!");
                  URL.revokeObjectURL(previewUrl);
                } else {
                  toast.error(res.data.message || "Upload failed");
                  setLanding({ ...landing, logo_url: "" });
                }
              } catch (err) {
                console.error("❌ Upload error:", err);
                toast.error("Error uploading logo");
                setLanding({ ...landing, logo_url: "" });
              }
            }}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 mb-3">Current Logo:</p>
          <div className="relative bg-white rounded-lg shadow-md border border-gray-300 p-3 w-fit mx-auto">
            <img
              src={landing.logo_url}
              alt="Uploaded Logo"
              className="h-24 object-contain rounded-md mx-auto"
            />
          </div>
          <button
            type="button"
            className="text-red-400 text-xs mt-4 hover:underline"
            onClick={() => setLanding({ ...landing, logo_url: "" })}
          >
            Remove Logo
          </button>
        </div>
      )}
    </div>
  );
}
