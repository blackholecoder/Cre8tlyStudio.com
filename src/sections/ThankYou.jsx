import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

function ThankYou() {
  const { search } = useLocation();
  const sessionId = useMemo(
    () => new URLSearchParams(search).get("session_id"),
    [search]
  );

  // ✅ Direct backend proxy route (no fetching needed)
  const downloadHref = sessionId
    ? `https://cre8tlystudio.com/api/seller-checkout/downloads/${sessionId}/file`
    : null;

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          Thank you for your purchase!
        </h1>
        <p className="mt-3 text-slate-300">
          {downloadHref
            ? "Your download is ready."
            : "Your download is ready, but we couldn’t find a valid session."}
        </p>

        {downloadHref ? (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={downloadHref}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black hover:opacity-90 transition"
              style={{
                backgroundColor: "#7bed9f", 
                color: "#000",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
              download
            >
              Download Now
            </a>
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-white/20 hover:bg-white/10 transition"
            >
              Open in New Tab
            </a>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <p className="text-sm text-slate-400">
              We expected a URL like <code>/thank-you?session_id=cs_...</code>.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-white/20 hover:bg-white/10 transition"
            >
              Go Home
            </Link>
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
