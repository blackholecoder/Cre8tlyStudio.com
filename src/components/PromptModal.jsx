import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import { cannedPrompts, themes } from "../constants/index";
import PDFThemePreview from "./PDFThemePreview";

export default function PromptModal({
  isOpen,
  onClose,
  magnetId,
  accessToken,
  onSubmitted,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("modern");
  const [pages, setPages] = useState(5);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // ✅ Reset all form fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      // reset all fields when modal closes
      setText("");
      setTheme("modern");
      setPages(5);
      setLogo(null);
      setLogoPreview(null);
      setProgress(0);
      setLink("");
      setShowPreview(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // ✅ handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be less than 2MB");
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width > 512 || img.height > 512) {
        toast.warning(
          "Logo too large! Please use an image up to 512×512 px for best results.",
          {
            position: "top-center",
            className:
              "bg-[#0a0a0a] text-white border-2 border-green font-semibold rounded-lg shadow-[0_0_12px_rgba(123,237,159,0.6)]",
            progressClassName: "bg-green",
            icon: "⚠️",
          }
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result); // base64 string
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    let progressInterval;

    try {
      // start a simulated smooth progress
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + Math.random() * 5; // speed up slightly
          return prev;
        });
      }, 300);

      // Send request to backend
      await axios.post(
        "https://cre8tlystudio.com/api/lead-magnets/prompt",
        { magnetId, prompt: text, theme, pages, logo, link },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // ✅ stop animation
      clearInterval(progressInterval);
      setProgress(100);

      toast.success("🎉 Lead magnet generated successfully!", {
        position: "top-center",
        className:
          "bg-[#0a0a0a] text-white border-2 border-green font-semibold rounded-lg shadow-[0_0_12px_rgba(123,237,159,0.6)]",
        progressClassName: "bg-green",
      });

      // small delay for the bar to finish animating
      setTimeout(() => {
        setLoading(false);
        onSubmitted(magnetId, text, theme);
        onClose();
      }, 600);
    } catch (err) {
      console.error("Error submitting prompt:", err);
      clearInterval(progressInterval);
      toast.error("❌ Failed to generate lead magnet", {
        position: "top-center",
        className:
          "bg-[#0a0a0a] text-white border-2 border-red-500 font-semibold rounded-lg shadow-[0_0_12px_rgba(231,76,60,0.6)]",
        progressClassName: "bg-red-500",
      });
      setProgress(0);
      setLoading(false);
    }
  }

  return (
    <Transition show={isOpen} appear>
      <Dialog className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />

        {/* Modal wrapper (centers content) */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl 
                          bg-gray-900 p-8 shadow-2xl border border-gray-700"
          >
            <DialogTitle className="text-2xl font-bold text-white mb-6 text-center">
              ✨ Create Your Lead Magnet
            </DialogTitle>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-silver mb-2 font-medium">
                  Choose a Pre-Made Prompt
                </label>
                <select
                  onChange={(e) => {
                    const selected = cannedPrompts.find(
                      (p) => p.text === e.target.value
                    );
                    if (selected) setText(selected.text);
                  }}
                  className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600"
                >
                  <option value="">Select a pre-made prompt...</option>
                  {cannedPrompts.map((p, idx) => (
                    <option key={idx} value={p.text}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Editor Box */}
              <div className="h-[250px] overflow-hidden rounded-lg border border-gray-600 bg-white">
                <ReactQuill
                  theme="snow"
                  value={text}
                  onChange={setText}
                  placeholder="Write your prompt here..."
                  className="h-[250px] text-black"
                />
              </div>
              {/* Upload logo */}
              <div>
                <label className="block text-silver mb-2 font-medium">
                  Brand Logo (Max upload size: 512x512 2MB)
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0 file:text-sm file:font-semibold
                             file:bg-royalPurple file:text-white hover:file:opacity-80"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="mt-3 mx-auto w-16 h-16 object-contain border border-gray-700 rounded-md"
                  />
                )}
              </div>
              <div>
                <label className="block text-silver mb-2 font-medium">
                  Number of Pages
                </label>
                <input
                  type="number"
                  min="1"
                  value={pages}
                  onChange={(e) => {
                    const val = Math.min(
                      25,
                      Math.max(1, Number(e.target.value))
                    );
                    setPages(val);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                />
              </div>
             
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themes.map((t) => (
                  <div
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 
        ${
          theme === t.value
            ? "border-green shadow-[0_0_15px_rgba(123,237,159,0.5)] scale-[1.02]"
            : "border-gray-700 hover:border-gray-500"
        }`}
                  >
                    {/* Preview Area */}
                    <div
                      className="h-24 rounded-md mb-3 flex items-center justify-center text-lg font-semibold"
                      style={{
                        background: t.preview,
                        color: t.textColor,
                        border:
                          t.value === "classic"
                            ? "1px solid #FFD700"
                            : "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <span>{t.label.split(" ")[0]}</span>
                    </div>

                    {/* Description */}
                    <p className="text-center text-white font-medium">
                      {t.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="text-sm font-semibold text-green hover:underline"
                >
                  👁️ Preview Theme
                </button>
              </div>

              {showPreview && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                  <div className="bg-gray-900 rounded-2xl p-6 relative max-w-2xl w-full">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="absolute top-3 right-4 text-white text-lg hover:text-red-400"
                    >
                      ✕
                    </button>
                    <h2 className="text-white text-lg font-semibold mb-4 text-center">
                      PDF Theme Preview ({theme})
                    </h2>
                    <PDFThemePreview
                      themeConfig={
                        {
                          modern: {
                            font: "Montserrat",
                            primaryColor: "#000",
                            textColor: "#222",
                            ctaBg: "#00E07A",
                            ctaText: "#000",
                            linkGradient:
                              "linear-gradient(90deg, #00E07A 0%, #670fe7 100%)",
                          },
                          classic: {
                            font: "AdobeArabic",
                            primaryColor: "#000",
                            textColor: "#444",
                            ctaBg: "#000000",
                            ctaText: "#FFD700",
                            linkGradient:
                              "linear-gradient(90deg, #000000 0%, #000000 100%)",
                          },

                          bold: {
                            font: "Bebas Neue",
                            primaryColor: "#000",
                            textColor: "#111",
                            ctaBg: "#EC4899",
                            ctaText: "#fff",
                            linkGradient:
                              "linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)",
                          },
                        }[theme]
                      }
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-silver mb-2 font-medium">
                  Optional Link or Call-to-Action
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:outline-none focus:border-green"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This link will appear at the bottom of your generated PDF.
                </p>
              </div>
              {loading ? (
                <div className="w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 p-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-r from-green to-royalPurple rounded-full transition-all duration-700 ease-out animate-pulseGlow"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green to-royalPurple 
               text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
                >
                  🚀 Submit Prompt
                </button>
              )}
            </form>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-xl"
            >
              ✕
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
