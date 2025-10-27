import { Document, Page, pdfjs } from "react-pdf";
import { useState, useMemo, useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/pdf.worker.min.js",
  window.location.origin
).toString();

export default function PDFPreviewModal({ fileUrl, fileTitle, partNumber, sourceType = "magnet", onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [pdfReady, setPdfReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const memoizedFile = useMemo(() => {
    if (!fileUrl) return null;


    return {
      url: `https://cre8tlystudio.com/api/pdf/proxy?url=${encodeURIComponent(fileUrl)}`,
    };
  }, [fileUrl]);

  if (!fileUrl) return null;

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

 const handleDownload = async () => {
  try {
    setDownloading(true);
    const res = await fetch(memoizedFile.url);
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // ✅ Use title and part number if available
    if (sourceType === "book") {
      const safeTitle = (fileTitle || "Book")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      const safePart = partNumber ? `_Part_${partNumber}` : "";
      a.download = `${safeTitle}${safePart}.pdf`;
    } 
    // ✅ Update for Lead Magnets only
    else if (sourceType === "magnet") {
      const safeTitle = (fileTitle || "Lead_Magnet")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      a.download = `${safeTitle}.pdf`;
    } 
    else {
      a.download = "document.pdf";
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    await new Promise((r) => setTimeout(r, 2000));
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
    setPdfReady(false);
    setError(null);
    setDownloading(false);
    setNumPages(null);
    setScale(1.2);
  }, [fileUrl, onClose]);

  useEffect(() => {
    const handleResize = () => setScale(window.innerWidth < 640 ? 0.8 : 1.2);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
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

      <div className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto bg-[#121212] border border-gray-800 rounded-xl shadow-lg flex justify-center p-2 sm:p-6">
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

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 z-20 bg-black/70 backdrop-blur-sm rounded-xl">
            <p className="text-center px-6 text-sm">{error}</p>
          </div>
        )}

        <div
          className={`w-full flex justify-center transition-opacity duration-500 ${
            pdfReady ? "opacity-100" : "opacity-0"
          }`}
        >
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
                    className="mb-4"
                    width={Math.min(window.innerWidth - 40, 900)}
                  />
                ))}
              </div>
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
