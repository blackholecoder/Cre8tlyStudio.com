import { useMemo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";

function ThankYou() {
  const { search } = useLocation();
  const sessionId = useMemo(
    () => new URLSearchParams(search).get("session_id"),
    [search]
  );

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // Fetch delivery data for both audio + PDF purchases
  // -----------------------------------------------------
  useEffect(() => {
    async function fetchDelivery() {
      if (!sessionId) return;

      try {
        const res = await axiosInstance.get(
          `/seller-checkout/downloads/${sessionId}/info`
        );
        if (res.data?.success) {
          setDelivery(res.data); // <— correct
        }
      } catch (err) {
        console.error("❌ Failed to load delivery:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDelivery();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading your purchase...
      </main>
    );
  }

  if (!delivery) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        No delivery record found.
      </main>
    );
  }

  // -----------------------------------------------------
  // Detect file types (PDF, Single Track, Album)
  // -----------------------------------------------------
  const rawUrl = delivery.download_url;

  let isPdf = false;
  let isAudioArray = false;
  let downloadLinks = [];

  try {
    const parsed = JSON.parse(rawUrl);
    if (Array.isArray(parsed)) {
      isAudioArray = true;
      downloadLinks = parsed; // album
    }
  } catch {
    // Not JSON → single URL
    downloadLinks = [rawUrl];
  }

  // PDF detection
  if (rawUrl.endsWith(".pdf") || rawUrl.includes(".pdf")) {
    isPdf = true;
  }

  // Build correct PDF proxy URL (audio does NOT use this)
  const pdfProxyUrl = isPdf
    ? `https://cre8tlystudio.com/api/seller-checkout/downloads/${sessionId}/file`
    : null;

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          Thank you for your purchase!
        </h1>

        {/* COVER IMAGE (AUDIO ONLY) */}
        {delivery.cover_url && (
          <img
            src={delivery.cover_url}
            className="w-40 h-40 object-cover rounded-xl mx-auto mt-6 border border-white/10"
          />
        )}
        <p className="mt-2 text-lg font-semibold">{delivery.product_name}</p>

        <p className="mt-3 text-slate-300">Your download is ready.</p>

        {/* ----------------------------------------------------- */}
        {/* PDF DOWNLOAD BLOCK */}
        {/* ----------------------------------------------------- */}
        {isPdf && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={pdfProxyUrl}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black hover:opacity-90 transition"
              style={{ backgroundColor: "#7bed9f" }}
              download
            >
              Download PDF
            </a>

            <a
              href={pdfProxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-white/20 hover:bg-white/10 transition"
            >
              Open in New Tab
            </a>
          </div>
        )}

        {/* ----------------------------------------------------- */}
        {/* SINGLE AUDIO TRACK */}
        {/* ----------------------------------------------------- */}
        {!isPdf && !isAudioArray && (
          <div className="mt-8">
            <a
              href={downloadLinks[0]}
              download
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black hover:opacity-90 transition"
              style={{ backgroundColor: "#7bed9f" }}
            >
              Download Audio
            </a>
          </div>
        )}

        {/* ----------------------------------------------------- */}
        {/* ALBUM DOWNLOADS */}
        {/* ----------------------------------------------------- */}
        {isAudioArray && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Album Tracks</h2>

            {downloadLinks.map((url, i) => (
              <a
                key={i}
                href={url}
                download
                className="block text-left w-full bg-white/10 p-3 rounded mb-2 hover:bg-white/20 transition"
              >
                Track {i + 1}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 text-xs text-slate-500">
          Having trouble? Forward your receipt email to support and we’ll help.
        </div>
      </div>
    </main>
  );
}

export default ThankYou;
