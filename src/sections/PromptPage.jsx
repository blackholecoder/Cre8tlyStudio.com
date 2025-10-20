import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function PromptPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const quillRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Quill toolbar options
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  useEffect(() => {
    if (prompt && quillRef.current) {
      const editor = quillRef.current.getEditor();
      setTimeout(() => {
        editor.root.scrollTop = 0;
        editor.root.dispatchEvent(new Event("input")); // forces Quill layout refresh
      }, 100);
    }
  }, [prompt]);
  // Validate session ID on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `https://cre8tlystudio.com/api/lead-magnets/${sessionId}`
        );
        if (res.data) {
          setValid(true);
          if (res.data.status === "completed" && res.data.pdf_url) {
            setPdfUrl(res.data.pdf_url);
            setSuccess(true);
          }
        }
      } catch (err) {
        console.error("Invalid session:", err.response?.data || err.message);
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) checkSession();
    else setLoading(false);
  }, [sessionId]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setSubmitting(true);

    try {
      await axios.post("https://cre8tlystudio.com/api/lead-magnets/prompt", {
        sessionId,
        prompt,
      });

      setSuccess(true);

      // ✅ Start polling backend until PDF is ready
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(
            `https://cre8tlystudio.com/api/lead-magnets/${sessionId}`
          );
          if (res.data.status === "completed" && res.data.pdf_url) {
            setPdfUrl(res.data.pdf_url);
            clearInterval(interval); // stop polling
          }
        } catch (err) {
          console.error("Polling failed:", err.message);
        }
      }, 5000); // poll every 5 seconds
    } catch (err) {
      console.error("❌ Request failed:", err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-400">
        Validating session...
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-500">
          Invalid or expired session
        </h2>
        <p className="text-gray-400">
          Please purchase a lead magnet to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Enter Your Prompt</h2>

      {!success ? (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your audience or offer..."
            className="w-full h-[500px] bg-white text-black text-left rounded-lg p-4 leading-relaxed font-montserrat border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner resize-none overflow-y-auto"
          ></textarea>
          <button
            onClick={handleSubmit}
            disabled={submitting || !prompt || prompt.trim() === "<p><br></p>"}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition shadow-lg ${
              submitting || !prompt
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-black border border-green-400 text-white hover:opacity-90"
            }`}
          >
            {submitting ? "Generating..." : "Generate PDF"}
          </button>
        </>
      ) : (
        <div className="mt-6">
          <p className="text-xl text-green mb-6">
            ✅ Your prompt was submitted!
          </p>
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#1DA1F2] to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:opacity-90 transition"
            >
              Download PDF
            </a>
          ) : (
            <p className="text-gray-400">
              Your PDF is being generated... Please wait.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PromptPage;
