// import { Document, Page, pdfjs } from "react-pdf";
// import { useState, useMemo, useEffect } from "react";
// import { X, Download, ZoomIn, ZoomOut } from "lucide-react";

// import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// export default function PDFPreviewModal({ fileUrl, onClose }) {
//   const [numPages, setNumPages] = useState(null)
//   const [scale, setScale] = useState(1.2);
//   const [pdfReady, setPdfReady] = useState(false);
//   const [checking, setChecking] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloading, setDownloading] = useState(false);

//   const memoizedFile = useMemo(() => {
//     if (!fileUrl) return null;
//     return {
//       url: `https://cre8tlystudio.com/api/pdf/proxy?url=${encodeURIComponent(fileUrl)}`,
//     };
//   }, [fileUrl]);

//   if (!fileUrl) return null;

//   useEffect(() => {
//     if (!fileUrl) return;
//     let timeout;

//     const checkPDF = async () => {
//       try {
//         const res = await fetch(fileUrl, { method: "HEAD" });
//         if (res.ok && res.headers.get("content-type")?.includes("pdf")) {
//           setPdfReady(true);
//           setChecking(false);
//         } else {
//           // try again until ready
//           timeout = setTimeout(checkPDF, 2000);
//         }
//       } catch (err) {
//         console.warn("Waiting for PDF to finish uploading...");
//         timeout = setTimeout(checkPDF, 2000);
//       }
//     };

//     checkPDF();
//     return () => clearTimeout(timeout);
//   }, [fileUrl]);

//   const handleDownload = async () => {
//     try {
//       setDownloading(true);

//       const res = await fetch(memoizedFile.url);
//       if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "lead-magnet.pdf";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);

//       // keep overlay for 5 s so animation finishes
//       await new Promise((r) => setTimeout(r, 5000));
//     } catch (err) {
//       console.error("Download error:", err);
//       alert("❌ Download failed. Please try again.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
//       {/* Top bar */}
//       <div className="w-full max-w-5xl flex items-center justify-between mb-4 bg-[#111]/80 border border-gray-800 rounded-xl px-5 py-3 shadow-lg">
//         <div className="flex items-center gap-3 text-white/80 font-semibold text-lg tracking-wide">
//           🧾 PDF Preview
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setScale(scale + 0.2)}
//             className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition"
//             title="Zoom In"
//           >
//             <ZoomIn size={20} />
//           </button>
//           <button
//             onClick={() => setScale(Math.max(scale - 0.2, 0.6))}
//             className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition"
//             title="Zoom Out"
//           >
//             <ZoomOut size={20} />
//           </button>
//           <button
//             onClick={handleDownload}
//             disabled={downloading}
//             className={`p-2 rounded-lg transition text-white ${
//               downloading
//                 ? "bg-green-800 cursor-wait"
//                 : "bg-green-600 hover:bg-green-600/90"
//             }`}
//             title="Download"
//           >
//             {downloading ? (
//               <span className="flex items-center gap-2 text-sm">
//                 <svg
//                   className="animate-spin h-4 w-4 text-white"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="white"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="white"
//                     d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
//                   ></path>
//                 </svg>
//                 Downloading…
//               </span>
//             ) : (
//               <Download size={20} />
//             )}
//           </button>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-red-600/90 bg-red-600 text-white transition"
//             title="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>

//       {/* PDF Viewer + Overlay */}
//       <div className="relative w-full max-w-5xl max-h-[80vh] overflow-y-auto bg-[#121212] border border-gray-800 rounded-xl shadow-lg flex justify-center p-6">
//         {/* Overlay when downloading */}
//         {downloading && (
//           <div className="absolute inset-0 z-20 backdrop-blur-sm bg-black/70 flex flex-col items-center justify-center text-white text-lg font-semibold transition-all duration-300">
//             <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
//               {/* bar animated purely with CSS */}
//               <div className="h-full bg-gradient-to-r from-[#00e0ff] via-[#00e07a] to-[#00e0ff] animate-progress"></div>
//             </div>
//             Preparing your PDF...
//           </div>
//         )}

//         {/* Actual PDF (blurred while overlay active) */}
//         <div
//           className={`${
//             downloading ? "blur-sm" : ""
//           } transition-all duration-300`}
//         >
//           <Document
//             file={{
//               url: `https://cre8tlystudio.com/api/pdf/proxy?url=${encodeURIComponent(
//                 fileUrl
//               )}`,
//             }}
//             onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//             loading={<p className="text-gray-400">Loading PDF…</p>}
//             error={<p className="text-red-400">Failed to load PDF</p>}
//           >
//             <div className="flex flex-col items-center w-full">
//               {Array.from(new Array(numPages || 0), (_, index) => (
//                 <Page
//                   key={`page_${index + 1}`}
//                   pageNumber={index + 1}
//                   scale={scale}
//                   renderTextLayer={false}
//                   renderAnnotationLayer={false}
//                   className="mb-6 rounded-lg shadow-xl"
//                 />
//               ))}
//             </div>
//           </Document>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useMemo, useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";

import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFPreviewModal({ fileUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [pdfReady, setPdfReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Memoized proxy URL
  const memoizedFile = useMemo(() => {
    if (!fileUrl) return null;
    return {
      url: `https://cre8tlystudio.com/api/pdf/proxy?url=${encodeURIComponent(fileUrl)}`,
    };
  }, [fileUrl]);

  if (!fileUrl) return null;

  // ✅ Check if PDF file is actually available yet
  useEffect(() => {
    if (!fileUrl) return;
    let timeout;
    let retries = 0;

    const checkPDF = async () => {
      try {
        const res = await fetch(memoizedFile.url, { method: "HEAD" });
        const type = res.headers.get("content-type");

        if (res.ok && type?.includes("pdf")) {
          setPdfReady(true);
        } else if (retries < 10) {
          retries++;
          timeout = setTimeout(checkPDF, 1500);
        } else {
          setError("PDF is still being finalized. Try again in a few seconds.");
        }
      } catch {
        if (retries < 10) {
          retries++;
          timeout = setTimeout(checkPDF, 1500);
        } else {
          setError("PDF is still being finalized. Try again shortly.");
        }
      }
    };

    checkPDF();
    return () => clearTimeout(timeout);
  }, [fileUrl]);

  // ✅ Handle manual download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(memoizedFile.url);
      if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lead-magnet.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await new Promise((r) => setTimeout(r, 2000)); // short delay for UX
    } catch (err) {
      console.error("Download error:", err);
      alert("❌ Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
  if (!fileUrl) {
    setPdfReady(false);
    setError(null);
    setDownloading(false);
    setNumPages(null);
    setScale(1.2);
    return;
  }

  // Also reset on fileUrl change
  setPdfReady(false);
  setError(null);
  setDownloading(false);
  setNumPages(null);
  setScale(1.2);
}, [fileUrl, onClose]);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      {/* Top bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 bg-[#111]/80 border border-gray-800 rounded-xl px-5 py-3 shadow-lg">
        <div className="flex items-center gap-3 text-white/80 font-semibold text-lg tracking-wide">
          🧾 PDF Preview
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScale(scale + 0.2)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => setScale(Math.max(scale - 0.2, 0.6))}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`p-2 rounded-lg transition text-white ${
              downloading
                ? "bg-green-800 cursor-wait"
                : "bg-green-600 hover:bg-green-600/90"
            }`}
            title="Download"
          >
            {downloading ? (
              <span className="flex items-center gap-2 text-sm">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Downloading…
              </span>
            ) : (
              <Download size={20} />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-600/90 bg-red-600 text-white transition"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* PDF Viewer + Overlays */}
      <div className="relative w-full max-w-5xl max-h-[80vh] overflow-y-auto bg-[#121212] border border-gray-800 rounded-xl shadow-lg flex justify-center p-6">
        {/* 1️⃣ Waiting / finalizing overlay */}
        {!pdfReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/70 backdrop-blur-sm rounded-xl">
            <svg
              className="animate-spin h-8 w-8 text-[#00e0ff] mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              ></path>
            </svg>
            <p className="text-lg font-medium animate-pulse">
              🧩 Finalizing your PDF — just a few more seconds...
            </p>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-[#00e0ff] via-[#00e07a] to-[#00e0ff] animate-progress" />
            </div>
          </div>
        )}

        {/* 2️⃣ Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 z-20 bg-black/70 backdrop-blur-sm rounded-xl">
            <p className="text-center px-6 text-sm">{error}</p>
          </div>
        )}

        {/* 3️⃣ The actual PDF once ready */}
        {pdfReady && !error && (
          <Document
            file={memoizedFile}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => {
              console.error("PDF load error:", err);
              setError("Failed to load PDF file.");
            }}
            loading={<p className="text-gray-400">Loading PDF…</p>}
          >
            <div className="flex flex-col items-center w-full">
              {Array.from(new Array(numPages || 0), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mb-6 rounded-lg shadow-xl"
                />
              ))}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
}
