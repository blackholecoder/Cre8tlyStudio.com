import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../admin/AuthContext";
import { toast } from "react-toastify"; // ✅ Add this

export default function DashboardSettings() {
  const { user, setUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const fetchSettings = async () => {
      try {
        const res = await api.get(`upload-data/user/settings/${user.id}`);
        setSettings(res.data.settings);
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load brand settings.");
      }
    };
    fetchSettings();
  }, [user?.id]);

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);

      try {
        const res = await api.post("upload-data/user/settings/upload", {
          user_id: user.id,
          file_name: file.name,
          file_data: base64Data,
        });

        setSettings((prev) => ({
          ...prev,
          brand_identity_file: res.data.fileUrl,
        }));
        setUser((prev) => ({
          ...prev,
          brand_identity_file: res.data.fileUrl,
        }));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            brand_identity_file: res.data.fileUrl,
          })
        );

        toast.success("Brand file uploaded successfully!");
        setFile(null);
      } catch (err) {
        console.error(err);
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    try {
      const res = await api.delete(
        `upload-data/user/settings/remove/${user.id}`
      );
      if (res.data.success) {
        setSettings((prev) => ({ ...prev, brand_identity_file: null }));
        setUser((prev) => ({ ...prev, brand_identity_file: null }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, brand_identity_file: null })
        );
        toast.info("Brand identity file removed. Defaults restored.");
      } else {
        toast.warning("Failed to remove brand file. Try again.");
      }
    } catch (err) {
      console.error("Error removing brand file:", err);
      toast.error("Error removing file.");
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#030712] text-white">
      <div className="w-full max-w-[900px] p-10">
        {/* Header */}
        <div className="mb-10 border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-headerGreen">
            Brand Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your brand tone and upload a reference file for AI
            generation.
          </p>
        </div>

        {/* Active File */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-3 shadow-lg mb-8">
          {settings?.brand_identity_file ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">
                    Active Brand File
                  </span>
                </p>
                <button
                  onClick={handleRemove}
                  className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md font-semibold shadow-sm transition"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-400 italic">
                Uploaded on: {new Date().toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center">
              No brand identity uploaded yet.
            </p>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-200">
            Upload New Brand File
          </h2>
          <p className="text-sm text-gray-400">
            Accepted formats:{" "}
            <span className="text-gray-300">.pdf, .docx, .doc, .txt</span> (max
            5 MB)
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="flex-1 w-full">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-500 file:to-purple-600 hover:file:opacity-90"
              />
              {file && (
                <p className="text-xs text-gray-400 italic mt-1">
                  Selected: <span className="text-gray-200">{file.name}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow-lg text-black bg-headerGreen hover:opacity-90 transition ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Save Brand File"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
