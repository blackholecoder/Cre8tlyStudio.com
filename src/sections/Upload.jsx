import React, { useState, useRef } from "react";
import axios from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [label, setLabel] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [email, setEmail] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/x-wav"];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setMessage("");
    } else {
      setFile(null); // Clear invalid file
      setMessage("Please upload a valid MP3 or WAV file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file before uploading.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("artist", artist);
      formData.append("song_name", songName);
      formData.append("duration", duration);
      formData.append("genre", genre);
      formData.append("label", label);
      formData.append("release_date", releaseDate);
      formData.append("email", email);

      const url = "https://phlokk-website-api.phlokk.com/api/sounds/upload";

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setMessage("File uploaded successfully!");

      // Clear form fields
      setFile(null);
      setArtist("");
      setSongName("");
      setDuration("");
      setGenre("");
      setLabel("");
      setReleaseDate("");
      setEmail("");
      setUploadProgress(0);
      setUploading(false);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Display Joi validation errors
        const errorMessages = error.response.data.errors.join("\n");
        setMessage(`${errorMessages}`);
      } else {
        // Generic error message
        setMessage("Error uploading file. Please try again.");
      }

      // Reset the form state on validation error
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-white text-center">
          Upload Your Audio
        </h2>
        <p className="text-lg mb-8 text-white text-center">
          Upload your tracks to be considered for inclusion on our platform's
          exclusive soundbar. Our A&R music specialists will review each
          submission to ensure it meets our high-quality standards. Please
          ensure your tracks are professionally mixed, mastered, and
          radio-ready. If selected, we will reach out via the email you provide
          below, so be sure to use a current and active address.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Artist{" "}
                <span className="text-gray-400 text-sm">
                  (e.g., Russ, Everclear, Korn)
                </span>
              </label>
              <input
                type="text"
                placeholder="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Song Name{" "}
                <span className="text-gray-400 text-sm">
                  (e.g., Summer Vibes)
                </span>
              </label>
              <input
                type="text"
                placeholder="Song Name"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Duration <span className="text-gray-400 text-sm">(MM:SS)</span>
              </label>
              <input
                type="text"
                placeholder="Duration (e.g., 3:45)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Genre{" "}
                <span className="text-gray-400 text-sm">
                  (e.g., Hip-Hop, Country, Rock, R&B)
                </span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="p-2 pr-8 bg-gray-800 text-white rounded-xl w-full"
              >
                <option value="">Select a genre</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Rap/Rock">Rap/Rock</option>
                <option value="Country">Country</option>
                <option value="Rock">Rock</option>
                <option value="R&B">R&amp;B</option>
                <option value="Pop">Pop</option>
                <option value="Comedy">Comedy</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Record Label{" "}
                <span className="text-gray-400 text-sm">
                  (e.g., Universal, Sony)
                </span>
              </label>
              <input
                type="text"
                placeholder="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Release Date{" "}
                <span className="text-gray-400 text-sm">(YYYY-MM-DD)</span>
              </label>
              <input
                type="text"
                placeholder="Release Date (YYYY-MM-DD)"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">
                Email{" "}
                <span className="text-gray-400 text-sm">
                  (e.g., artist@example.com)
                </span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-2 pl-1">MP3 or WAV</label>
              <input
                type="file"
                accept=".mp3,.wav"
                onChange={handleFileChange}
                className="p-2 bg-gray-800 text-white rounded-xl w-full"
                ref={fileInputRef}
              />
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 ${message.includes("successfully") ? "text-phlokkGreen" : "text-red-500"}`}
            >
              {message.split("\n").map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}

          {uploading && (
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4 relative">
              <div
                className="bg-phlokkGreen h-4 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="absolute left-1/2 transform -translate-x-1/2 top-1 text-sm text-white font-semibold">
                {uploadProgress}%
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-phlokkGreen text-white px-6 py-2 rounded-2xl hover:bg-green-700 transition-all duration-300"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
