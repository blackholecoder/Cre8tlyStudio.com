import { useState } from "react";
import api from "../../api/axios";

export default function BrandUpload({ userId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1]; // remove data: header

      setLoading(true);
      try {
        const res = await api.post("/upload-brand-file", {
          user_id: userId,
          file_name: file.name,
          file_data: base64Data,
        });
        alert(res.data.message);
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Brand Identity"}
      </button>
    </div>
  );
}
