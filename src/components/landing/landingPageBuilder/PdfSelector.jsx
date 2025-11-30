import React from "react";
import axiosInstance from "../../../api/axios";



export default function PdfSelector({
  pdfList,
  landing,
  setLanding,
  showPdfSection,
  setShowPdfSection,
  coverPreview,
  setCoverPreview,
  coverLoading,
  setCoverLoading,
}) {
  return (
    <div className="mt-1 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 transition-all hover:border-silver/60">
      {/* Header */}
      <div
        onClick={() => setShowPdfSection(!showPdfSection)}
        className="flex items-center justify-between px-6 py-5 cursor-pointer select-none"
      >
        <h3 className="text-lg font-semibold text-silver tracking-wide">
          Choose PDF to Offer
        </h3>
        <span
          className={`text-gray-400 text-sm transform transition-transform duration-300 ${
            showPdfSection ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showPdfSection ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          <span className="text-xs text-gray-400 italic block mb-5">
            Only completed PDFs are shown.
            <br />
            If Stripe Button is enabled, this image will be the cover.
          </span>

          {/* PDF Dropdown */}
          <div className="relative">
            <select
              value={landing.pdf_url || ""}
              onChange={async (e) => {
                const selectedUrl = e.target.value;
                setLanding((prev) => ({ ...prev, pdf_url: selectedUrl }));
                setCoverPreview("");
                setCoverLoading(true);

                if (!selectedUrl) {
                  setCoverLoading(false);
                  return;
                }

                try {
                  const res = await axiosInstance.get(
                    `/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(
                      selectedUrl
                    )}`
                  );

                  if (res.data.success && res.data.cover_image) {
                    setCoverPreview(res.data.cover_image);

                    setLanding((prev) => ({
                      ...prev,
                      cover_image_url: res.data.cover_image,
                    }));
                  }
                } catch (err) {
                  console.error("Error loading cover image:", err);
                } finally {
                  setCoverLoading(false);
                }
              }}
              className="w-full border border-gray-600 bg-[#0F172A] text-gray-200 rounded-lg px-4 py-3 appearance-none cursor-pointer"
            >
              <option value="">-- Select a Completed PDF --</option>
              {pdfList
                .filter((lm) => lm.status === "completed" && lm.pdf_url)
                .map((lm) => (
                  <option key={lm.id} value={lm.pdf_url}>
                    {lm.title || "Untitled PDF"} — (Ready)
                  </option>
                ))}
            </select>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.25 9.75L12 13.5l3.75-3.75"
              />
            </svg>
          </div>

          {/* PDF Cover Preview */}
          <div
            className="mt-6 text-center bg-[#1f2937]/60 border border-gray-700 rounded-xl p-5 shadow-inner relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
            style={{ height: "340px" }}
          >
            {coverLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]/70 backdrop-blur-sm">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-gray-500 border-t-green rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm mt-3">
                  Loading cover preview...
                </p>
              </div>
            ) : coverPreview ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-sm text-gray-300 mb-3 font-semibold tracking-wide">
                  PDF Cover Preview
                </p>
                <img
                  src={coverPreview}
                  alt="PDF Cover"
                  className="h-48 object-contain rounded-lg shadow-md border border-gray-600 mx-auto"
                />
                <p className="text-xs text-gray-500 mt-3">
                  This cover will appear on your landing page.
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No PDF cover selected yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
