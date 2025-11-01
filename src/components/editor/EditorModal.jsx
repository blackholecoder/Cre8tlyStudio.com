import { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  startLeadMagnetEdit,
  commitLeadMagnetEdit,
} from "../../api/leadMagnets";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";

import Image from "@tiptap/extension-image";
import { colorThemes, fontThemes } from "../../constants";
import PDFOverlayCanvas from "./PDFOverlayCanvas";
import { Square, Circle, ArrowRight, Type } from "lucide-react";
import { motion } from "framer-motion";

function isDarkColor(hex) {
  if (!hex) return false;
  const h = hex.replace("#", "");
  const r = parseInt(h.length === 3 ? h[0] + h[0] : h.substring(0, 2), 16);
  const g = parseInt(h.length === 3 ? h[1] + h[1] : h.substring(2, 4), 16);
  const b = parseInt(h.length === 3 ? h[2] + h[2] : h.substring(4, 6), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return brightness < 0.5; // true = dark
}

function embedShapesIntoHTML(htmlString, shapes) {
  if (!shapes || !shapes.length) return htmlString;

  const svgShapes = shapes.map((s) => {
    switch (s.type) {
      case "rect":
        const rx = s.cornerRadius ? `rx="${s.cornerRadius}" ry="${s.cornerRadius}"` : "";
        return `<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" 
          fill="${s.fill || "transparent"}" stroke="${s.stroke || "transparent"}"
          stroke-width="${s.strokeWidth || 1}" opacity="${s.opacity || 1}" ${rx} />`;

      case "circle":
        return `<ellipse cx="${s.x}" cy="${s.y}" rx="${s.radiusX || s.radius}" ry="${s.radiusY || s.radius}"
          fill="${s.fill || "transparent"}" stroke="${s.stroke || "transparent"}"
          stroke-width="${s.strokeWidth || 1}" opacity="${s.opacity || 1}" />`;

      case "arrow":
        const [x2, y2] = s.points?.slice(-2) || [100, 0];
        return `<line x1="${s.x}" y1="${s.y}" x2="${s.x + x2}" y2="${s.y + y2}"
          stroke="${s.stroke || "#000"}" stroke-width="${s.strokeWidth || 2}"
          marker-end="url(#cre8tly-arrowhead)" opacity="${s.opacity || 1}" />`;

      case "text":
        return `<text x="${s.x}" y="${s.y}" font-size="${s.fontSize || 18}"
          font-family="${s.fontFamily || "Arial"}" fill="${s.fill || "#000"}"
          opacity="${s.opacity || 1}">${s.text || ""}</text>`;

      default:
        return "";
    }
  }).join("\n");

  const svgLayer = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;"
  id="cre8tly-overlay-svg">
  <defs>
    <marker id="cre8tly-arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
    </marker>
  </defs>
  ${svgShapes}
</svg>`;

  // Insert before </body>
  return htmlString.includes("</body>")
    ? htmlString.replace("</body>", `${svgLayer}</body>`)
    : htmlString + svgLayer;
}


export default function EditorModal({
  leadMagnetId,
  open,
  onClose,
  onCommitted,
}) {
  const [token, setToken] = useState(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [highlightColor, setHighlightColor] = useState("#fff330");
  const [designMode, setDesignMode] = useState(false);
  const [shapes, setShapes] = useState([]);

  const handleHighlightColorChange = (e) => {
    const c = e.target.value;
    setHighlightColor(c);
    if (!editor) return;
    // If selection already has highlight, update it; otherwise set it so the user sees the color live
    const chain = editor.chain().focus();
    // Try updating attributes on existing highlight first (no-op if none)
    chain.updateAttributes('highlight', { color: c }).run();
    // Ensure the selection (or stored mark) shows the color even if it wasn't highlighted yet
    editor.chain().focus().setHighlight({ color: c }).run();
  };

  {
    designMode && (
      <div className="flex items-center gap-3 bg-[#2a2a2a]/90 backdrop-blur-md border border-gray-700/60 rounded-xl px-4 py-2 shadow-lg relative">
        {[
          {
            icon: Square,
            color: "bg-emerald-500 hover:bg-emerald-600",
            title: "Add Rectangle",
            type: "rect",
          },
          {
            icon: Circle,
            color: "bg-blue-400 hover:bg-blue-500",
            title: "Add Circle",
            type: "circle",
          },
          {
            icon: ArrowRight,
            color: "bg-yellow-400 hover:bg-yellow-500",
            title: "Add Arrow",
            type: "arrow",
          },
          {
            icon: Type,
            color: "bg-pink-400 hover:bg-pink-500",
            title: "Add Text",
            type: "text",
          },
        ].map(({ icon: Icon, color, title, type }) => (
          <TooltipButton
            key={type}
            Icon={Icon}
            color={color}
            title={title}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("addShape", { detail: type })
              )
            }
          />
        ))}
      </div>
    );
  }

  function TooltipButton({ Icon, color, title, onClick }) {
    const [show, setShow] = useState(false);
    return (
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <button
          onClick={onClick}
          className={`w-8 h-8 flex items-center justify-center rounded-md shadow-sm ${color}`}
        >
          <Icon size={18} className="text-black" />
        </button>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-8 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </div>
    );
  }

  const iframeRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Highlight.configure({
        multicolor: true, // ✅ allows color parameter to work
      }),
    ],
    content: "",
    editable: true,
  });

  useEffect(() => {
    if (!open || !leadMagnetId) return;
    (async () => {
      const data = await startLeadMagnetEdit(leadMagnetId);
      setToken(data.token);
      setMeta(data.meta);
      setEditableHtml(data.editableHtml || "");
      editor?.commands.setContent(data.editableHtml || "");
    })().catch(onClose);
  }, [open, leadMagnetId, editor]);

  async function handleCommit() {
    setSaving(true);
    try {
      const updatedHtml = editor?.getHTML() || editableHtml;

      // 🔹 Retrieve shapes from localStorage
    const shapes = JSON.parse(localStorage.getItem("cre8tly_canvas_shapes") || "[]");

     // 🔹 Merge shapes as SVG overlay into HTML
    const htmlWithShapes = embedShapesIntoHTML(updatedHtml, shapes);

      const data = await commitLeadMagnetEdit(leadMagnetId, token, htmlWithShapes);

      localStorage.removeItem("cre8tly_canvas_shapes");


      onCommitted(data.pdf_url);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (editableHtml) {
      const blob = new Blob([editableHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setIframeUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [editableHtml]);

  useEffect(() => {
    const doc =
      iframeRef.current?.contentDocument ||
      iframeRef.current?.contentWindow?.document;
    if (!doc) return;
    doc.documentElement.style.setProperty("--hl", highlightColor || "#fff330");
  }, [highlightColor, iframeUrl]);

  // useEffect(() => {
  //   const doc =
  //     iframeRef.current?.contentDocument ||
  //     iframeRef.current?.contentWindow?.document;

  //   if (!doc) return;


  //   const bg = (colorThemes[meta?.bgTheme]?.background || "#ffffff").trim();
  //   const dark = isDarkColor(bg);

  //   console.log("🎨 BG Theme:", meta?.bgTheme);
  // console.log("🎨 Resolved background:", bg);
  // console.log("🎨 isDarkColor() →", dark);
  // console.log("🎨 textColor set →", textColor);

  // const appliedBefore = doc.documentElement.style.getPropertyValue("--text-color");
  // console.log("🧩 Previously applied --text-color:", appliedBefore || "(none)");

  //   // normal text adjusts automatically
  //   doc.documentElement.style.setProperty(
  //     "--text-color",
  //     dark ? "#ffffff" : "#000000"
  //   );
    

  //   // highlight background stays your selected color
  //   doc.documentElement.style.setProperty("--hl", highlightColor || "#fff330");

  //   // highlighted text is always black for best readability
  //   doc.documentElement.style.setProperty("--hl-text", "#000000");
  // }, [meta?.bgTheme, highlightColor, iframeUrl]);


useEffect(() => {
  const doc =
    iframeRef.current?.contentDocument ||
    iframeRef.current?.contentWindow?.document;
  if (!doc) return;

  const bgThemeName = meta?.bgTheme?.toLowerCase() || "";
const bg = (colorThemes[bgThemeName]?.background || "#ffffff").trim();

// ✅ Explicitly treat known dark themes as dark
const darkThemes = ["dark", "royal", "navy", "graphite", "purple", "lavender"];
const dark = darkThemes.includes(bgThemeName) || isDarkColor(bg);
  const textColor = dark ? "#ffffff" : "#000000"; // ✅ You were missing this line


  // ✅ Apply the color variables
  doc.documentElement.style.setProperty("--text-color", textColor);
  doc.documentElement.style.setProperty("--hl", highlightColor || "#fff330");
  doc.documentElement.style.setProperty("--hl-text", "#000000");

  // ✅ Add a diagnostic style block to enforce and visualize
  const existing = doc.getElementById("color-fix");
  if (existing) existing.remove();

  const colorFix = doc.createElement("style");
  colorFix.id = "color-fix";
  colorFix.innerHTML = `
    body, .page-inner, .page, .cover-page,
    h1, h2, h3, h4, h5, h6,
    p, div, span, strong, b, em, li {
      color: var(--text-color, ${textColor}) !important;
      -webkit-text-fill-color: var(--text-color, ${textColor}) !important;
    }
  `;
  doc.head.appendChild(colorFix);

  
  // 🧩 Check computed color
  const computed = doc.defaultView.getComputedStyle(doc.body).color;
  console.log("✅ Computed color in iframe body:", computed);
}, [meta?.bgTheme, highlightColor, iframeUrl]);






  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !meta?.theme) return;

    const selectedFont = fontThemes[meta.theme?.toLowerCase()];
    if (!selectedFont) return;

    const applyFontAfterLoad = async () => {
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc || !iframeDoc.body) return;

      try {
        const bgColor = (
          colorThemes[meta?.bgTheme]?.background || "#ffffff"
        ).trim();
        const isDark = isDarkColor(bgColor);

        // Normal text color depends on theme
        iframeDoc.documentElement.style.setProperty(
          "--text-color",
          isDark ? "#ffffff" : "#000000"
        );

        // Highlight background uses selected color
        iframeDoc.documentElement.style.setProperty(
          "--hl",
          highlightColor || "#fff330"
        );

        // Highlight text is always black for proper contrast on light backgrounds
        iframeDoc.documentElement.style.setProperty("--hl-text", "#000000");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}${selectedFont.file}`
        );
        const buf = await res.arrayBuffer();
        const base64Font = btoa(
          new Uint8Array(buf).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        const style = iframeDoc.createElement("style");
        style.id = "custom-font-style";
        style.innerHTML = `
        @font-face {
          font-family: '${selectedFont.name}';
          src: url(data:font/ttf;base64,${base64Font}) format('truetype');
        }
        html, body, .page, .page-inner, .formatted-content,
        p, h1, h2, h3, h4, h5, h6, div, span, li {
          font-family: '${selectedFont.name}', sans-serif !important;
        }
      `;

        iframeDoc.head.appendChild(style);

        // ✅ Add fluid layout support without breaking backend alignment
        const responsiveWidthStyle = iframeDoc.createElement("style");
        responsiveWidthStyle.id = "responsive-width-fix";

        responsiveWidthStyle.innerHTML = `
  html, body {
    width: 100% !important;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  /* Let the main page adapt naturally */
  .page, .page-inner {
    width: 100% !important;
    max-width: 667px !important; /* keep backend alignment on desktop */
    margin: 0 auto !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    box-sizing: border-box !important;
  }

  .cover-page {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  width: 100% !important;
  background: transparent !important;
}

.cover-page .cover-img {
  display: block !important;
  margin: 0 auto !important;
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  float: none !important;
}

.footer-link {
  margin-top: 60px !important;
  margin-bottom: 40px !important;
  text-align: center !important;
  padding-bottom: 40px !important;
}

.footer-link p {
  margin-bottom: 20px !important;
  font-size: 1.1rem !important;
  line-height: 1.5 !important;
  font-weight: 600 !important;
}

.footer-link .link-button {
  display: inline-block !important;
  padding: 12px 28px !important;
  border-radius: 30px !important;
  color: white !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  border: 2px solid white !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.25) !important;
}

.footer-link .link-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

  /* Typography adjusts only if viewport is small */
  @media (max-width: 768px) {
    body {
      font-size: 90% !important; /* small font scaling only */
      line-height: 1.6 !important;
    }
    h1, h2, h3 {
      line-height: 1.3 !important;
      word-break: break-word !important;
    }
    img {
    display: block !important;
    margin: 0 auto !important;      /* ✅ centers images horizontally */
    max-width: 100% !important;
    height: auto !important;
    float: none !important;         /* ✅ removes any old float rules */
  }

  .cover-page {
    padding: 0 !important;
    margin-bottom: 1rem !important;
  }
  .cover-page .cover-img {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
  }
      .footer-link {
    margin-top: 40px !important;
    margin-bottom: 30px !important;
    padding-bottom: 2rem !important;
  }
  .footer-link .link-button {
    font-size: 1rem !important;
  }
    pre {
  background-color: #0f0f0f;
  color: #f5f5f5;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0 0 1.5rem 0; /* remove top margin, only keep bottom spacing */
  white-space: pre-wrap;
  page-break-inside: avoid; /* keeps the block from splitting across PDF pages */
  box-decoration-break: clone;
}

pre + pre {
  margin-top: -0.25rem; /* closes any hairline gap between stacked blocks */
}

code {
  background-color: #1a1a1a;
  color: #00ff80;
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
}

/* Optional — better color contrast for multi-line snippets */
pre code {
  background: transparent; /* removes duplicate block background */
  color: #f5f5f5;
}
  }
`;
        iframeDoc.head.appendChild(responsiveWidthStyle);

        const darkPreviewStyle = iframeDoc.createElement("style");
        darkPreviewStyle.id = "dark-preview-text";
        darkPreviewStyle.innerHTML = `
  /* 🧠 Only affect text, not the background */
  body, .page-inner, p, span, div, li, strong, b, h1, h2, h3, h4, h5, h6 {
  color: var(--text-color) !important;
  -webkit-text-fill-color: var(--text-color) !important;
}

  /* Keep background untouched (retain the original white page color) */
  .page, .cover-page {
    background-color: inherit !important;
  }

  /* Highlight and links remain readable */
  a {
    color: #4FC3F7 !important;
  }
  mark {
  background-color: var(--hl, #fff330) !important;
  color: var(--hl-text, #000000) !important;
  -webkit-text-fill-color: var(--hl-text, #000000) !important;
  border-radius: 2px;
  padding: 0 2px;
}
`;
        iframeDoc.head.appendChild(darkPreviewStyle);
        // set initial highlight color into the iframe
        iframeDoc.documentElement.style.setProperty(
          "--hl",
          typeof highlightColor === "string" && highlightColor
            ? highlightColor
            : "#fff330"
        );

        // ✅ Force body re-render with same content
        const currentHTML = iframeDoc.body.innerHTML;
        iframeDoc.body.innerHTML = currentHTML;
        console.log("🎯 Font applied & body refreshed:", selectedFont.name);
        console.log("🧱 BODY HTML:", iframeDoc.body.innerHTML.slice(0, 500));
      } catch (err) {
        console.error("⚠️ Font apply failed:", err);
      }
    };

    iframe.addEventListener("load", applyFontAfterLoad);

    return () => iframe.removeEventListener("load", applyFontAfterLoad);
  }, [meta?.theme, iframeUrl]);

  useEffect(() => {
    if (!editor || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const attachLivePreview = () => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const updatePreview = () => {
        try {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) return;

          let html = editor.getHTML();

          // 🧹 Remove any leftover unsplash/cover images before updating preview
          html = html.replace(/<img[^>]+unsplash[^>]+>/gi, "");
          html = html.replace(/<img[^>]+base64[^>]+>/gi, ""); // optional safeguard

          const target = iframeDoc.querySelector(".page-inner");
          if (target) {
            target.innerHTML = html;
            console.log("🔄 Updated .page-inner content live (cleaned images)");
          } else {
            console.warn("⚠️ .page-inner not found in iframe");
          }
        } catch (err) {
          console.error("⚠️ Failed to update iframe:", err);
        }
      };

      // Attach once iframe is ready
      editor.on("update", updatePreview);
      console.log("✅ Live preview handler attached after iframe load");

      // Cleanup
      return () => editor.off("update", updatePreview);
    };

    // Wait for iframe to load fully before attaching
    iframe.addEventListener("load", attachLivePreview);

    return () => {
      iframe.removeEventListener("load", attachLivePreview);
    };
  }, [editor, iframeUrl]);

  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  function handleFindReplaceAll() {
    if (!editor || !findText) return;
    const html = editor.getHTML();
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars
    const regex = new RegExp(escaped, "gi"); // global + case-insensitive
    const newHtml = html.replace(regex, replaceText);
    editor.commands.setContent(newHtml);
    toast.success(`Replaced all "${findText}" with "${replaceText}"`);
  }




  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/60" />

      {/* Center modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <DialogPanel className="w-full max-w-[1650px] bg-[#0f0f10] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 sm:gap-6 overflow-y-auto max-h-[95vh]">
          <div className="flex justify-end items-center mb-2 gap-3">
            <button
  onClick={() => {
    // 🧹 Clear from local storage
    localStorage.removeItem("cre8tly_canvas_shapes");
    
    // 🧹 Reset state in parent
    setShapes([]);

    // 🧹 Notify any open canvas to clear its drawings
    window.dispatchEvent(new CustomEvent("clearCanvasShapes"));

    // Optional: give feedback
    console.log("🧼 Cleared all overlay shapes");
  }}
  className="mt-2 text-xs text-gray-400 hover:text-red-400 transition"
>
  Clear Design
</button>
            {designMode && (
              <div className="flex items-center gap-2 bg-[#2a2a2a]/90 backdrop-blur-md border border-gray-700/60 rounded-xl px-4 py-2 shadow-lg">
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("addShape", { detail: "rect" })
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center bg-black rounded-md shadow-sm"
                  title="Add Rectangle"
                >
                  <Square size={18} className="text-hotPink" />
                </button>

                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("addShape", { detail: "circle" })
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center bg-black rounded-md shadow-sm"
                  title="Add Circle"
                >
                  <Circle size={18} className="text-hotPink" />
                </button>

                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("addShape", { detail: "arrow" })
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center bg-black rounded-md shadow-sm"
                  title="Add Arrow"
                >
                  <ArrowRight size={18} className="text-hotPink" />
                </button>

                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("addShape", { detail: "text" })
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center bg-black rounded-md shadow-sm"
                  title="Add Text"
                >
                  <Type size={18} className="text-hotPink" />
                </button>
              </div>
            )}

            <button
              onClick={() => setDesignMode(!designMode)}
              className={`px-3 py-2 rounded-md ${
                designMode ? "bg-royalPurple" : "bg-gray-600"
              } text-white`}
            >
              {designMode ? "Exit Design Mode" : "Design Mode"}
            </button>
          </div>

          {/* --- Editor + Preview --- */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 w-full">
            {/* ✏️ Left: Editor */}
            <div className="w-full flex-1 bg-white text-black rounded-xl overflow-y-auto min-h-[50vh] lg:h-[70vh]">
              <EditorContent editor={editor} />
            </div>

            {/* 📄 Right: Preview */}
            <div className="w-full flex-1 relative min-h-[50vh] lg:h-[70vh] rounded-xl overflow-hidden">
              
              <iframe
  ref={iframeRef}
  title="preview"
  src={iframeUrl}
  className="w-full flex-1 border border-gray-800 rounded-xl overflow-hidden min-h-[50vh] lg:h-[70vh]"
  sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
  style={{
    width: "100%",
    borderRadius: "0.75rem",
    background: colorThemes[meta?.bgTheme]?.background || "#fff",
    color: ["dark", "royal", "navy", "graphite", "purple", "lavender"].includes(
      meta?.bgTheme?.toLowerCase?.() || ""
    )
      ? "#ffffff"
      : "#000000",
  }}
/>
              {designMode && <PDFOverlayCanvas shapes={shapes} setShapes={setShapes} />}
            </div>
          </div>

          {/* 🔍 Find & Replace bar */}
          <div className="flex flex-wrap gap-2 items-center justify-between border border-gray-800 rounded-lg p-3 bg-[#1b1b1b]">
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="text"
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#0f0f10] text-white border border-gray-700 w-40 sm:w-56"
              />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#0f0f10] text-white border border-gray-700 w-40 sm:w-56"
              />
              <button
                onClick={handleFindReplaceAll}
                disabled={!findText}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                Replace All
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300">Highlight color:</label>
              <input
                type="color"
                value={highlightColor}
                 onInput={handleHighlightColorChange}
                className="w-9 h-9 rounded-lg cursor-pointer  shadow-inner shadow-black/40 bg-[#1a1a1a] hover:scale-105 transition-transform duration-150"
              />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: highlightColor })
                    .run()
                }
                className="px-5 py-2.5 rounded-lg bg-[#1e1e1e] text-white font-medium border border-gray-700 hover:border-emerald-400 hover:text-emerald-300 transition-all duration-200 shadow-sm"
              >
                Highlight
              </button>
            </div>
          </div>

          {/* --- Buttons --- */}
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2 w-full">
            <button
              className="px-4 py-2 bg-gray-700 rounded-lg w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green rounded-lg disabled:opacity-50 text-black w-full sm:w-auto"
              disabled={saving}
              onClick={handleCommit}
            >
              {saving ? "Reprinting..." : "Commit Edit"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
