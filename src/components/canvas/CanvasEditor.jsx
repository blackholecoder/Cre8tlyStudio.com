import { useState, useEffect, useRef, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { pdfjs } from "react-pdf";
import axiosInstance from "../../api/axios";
import PDFOverlayCanvas from "./PDFOverlayCanvas";
import {
  Square,
  Circle,
  ArrowRight,
  Type,
  Trash2,
  Plus,
  Minus,
  Slash,
  Combine,
  Divide,
} from "lucide-react";
import { performBooleanOperation } from "../../helpers/booleanOps";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/pdf.worker.min.js",
  window.location.origin
).toString();

// one page view
function PDFPage({ imageUrl, shapes, setShapes, setSelectedTool, selectedTool, selectedIds, setSelectedIds }) {
  const [img] = useImage(imageUrl);
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  // Auto-scale to fit container size
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !img) return;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const scaleX = containerWidth / img.width;
      const scaleY = containerHeight / img.height;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
      setStageSize({
        width: img.width * newScale,
        height: img.height * newScale,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [img]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center w-full h-[80vh] overflow-hidden bg-[#0f0f10] rounded-lg"
    >
      {img && (
        <>
          {/* PDF Page Rendered as Image */}
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              <KonvaImage image={img} />
            </Layer>
          </Stage>

          {/* ✅ Overlay synced to the exact same size and position */}
          <div
            className="absolute"
            style={{
              width: `${stageSize.width}px`,
              height: `${stageSize.height}px`,
            }}
          >
            <PDFOverlayCanvas
              shapes={shapes}
              setShapes={setShapes}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool} 
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function CanvasEditor() {
  const [pages, setPages] = useState([]); // all page images
  const [selectedPage, setSelectedPage] = useState(0);
  const [shapesByPage, setShapesByPage] = useState({});
  const pdfUrl = new URLSearchParams(window.location.search).get("pdf");
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const handleClearSelectedTool = () => setSelectedTool(null);
    window.addEventListener("clearSelectedTool", handleClearSelectedTool);
    return () =>
      window.removeEventListener("clearSelectedTool", handleClearSelectedTool);
  }, []);

  // load pdf pages
  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      setLoading(true);
      try {
        // ✅ Same proxy as your PDFPreviewModal uses
        const proxyUrl = `https://cre8tlystudio.com/api/pdf/proxy?url=${encodeURIComponent(pdfUrl)}`;
        console.log("🔗 Loading via same proxy as PDFPreview:", proxyUrl);

        // ✅ Request as blob (same as react-pdf)
        const response = await axiosInstance.get(proxyUrl, {
          responseType: "blob",
        });

        // ✅ Convert blob → arrayBuffer for pdf.js
        const buffer = await response.data.arrayBuffer();

        const pdf = await pdfjs.getDocument({ data: buffer }).promise;
        console.log("✅ PDF loaded, pages:", pdf.numPages);

        const imgs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL());
        }

        console.log("🖼️ Rendered images:", imgs.length);
        setPages(imgs);
      } catch (err) {
        console.error("❌ PDF load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const handleSelectTool = (type) => {
    setSelectedTool((prev) => (prev === type ? null : type)); // toggle same tool off
    console.log("🧰 Tool selected:", type);
  };


function handleBoolean(op) {
  const current = shapesByPage[selectedPage] || [];
  const sel = selectedIds.map(String);
  const picked = current.filter(s => sel.includes(String(s.id)));

  console.log("✅ selectedIds:", sel, " -> picked:", picked.map(s => s.id));

  if (picked.length !== 2) {
    alert("Select exactly 2 shapes to combine.");
    return;
  }

  const svgPath = performBooleanOperation(picked, op);
  if (!svgPath) return;

  const newShape = {
    id: `shape-${Date.now()}`,
    type: "path",
    data: svgPath,
    fill: "rgba(0,128,255,0.25)",
    stroke: "#00b4ff",
    strokeWidth: 1,
  };

  setShapesByPage(prev => ({
    ...prev,
    [selectedPage]: [
      ...current.filter(s => !sel.includes(String(s.id))),
      newShape,
    ],
  }));
  setSelectedIds([newShape.id]);
}





  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-400 mb-3"></div>
        <p>Rendering PDF pages...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#111] text-white">
      {/* ✅ Left sidebar thumbnails */}
      <div className="w-28 flex-shrink-0 overflow-y-auto p-3 border-r border-gray-800">
        <h1 className="text-sm font-semibold mb-3 text-gray-300">Pages</h1>
        <div className="flex flex-col gap-2">
          {pages.map((p, i) => (
            <img
              key={i}
              src={p}
              alt={`Page ${i + 1}`}
              onClick={() => setSelectedPage(i)}
              className={`cursor-pointer rounded-md border-2 transition-all ${
                selectedPage === i
                  ? "border-emerald-500 scale-105"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Main content area */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">Canvas Editor</h1>
        </div>

        {/* ✅ Drawing area */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-[#0f0f10] rounded-lg border border-gray-800">
          <div className="absolute top-4 right-4 flex gap-2 z-50 bg-[#1a1a1a]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-700/60 shadow-md canvas-toolbar" onMouseDown={(e) => e.stopPropagation()}
  onClick={(e) => e.stopPropagation()}>
            {[
              {
                icon: Square,
                type: "rect",
                color: "bg-black",
              },
              {
                icon: Circle,
                type: "circle",
                color: "bg-black",
              },
              {
                icon: ArrowRight,
                type: "arrow",
                color: "bg-black",
              },
              {
                icon: Type,
                type: "text",
                color: "bg-black",
              },
            ].map(({ icon: Icon, type, color }) => (
              <button
                key={type}
                onClick={() => handleSelectTool(type)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${color} transition`}
                title={`Add ${type}`}
              >
                <Icon size={18} className="text-green" />
              </button>
            ))}
            <div className="flex gap-2 ml-3">
              <button onClick={() => handleBoolean("union")} title="Add">
                <Plus className="text-cyan-400" size={18} />
              </button>
              <button
                onClick={() => handleBoolean("subtract")}
                title="Subtract"
              >
                <Minus className="text-cyan-400" size={18} />
              </button>
              <button
                onClick={() => handleBoolean("intersect")}
                title="Intersect"
              >
                <Combine className="text-cyan-400" size={18} />
              </button>
              <button
                onClick={() => handleBoolean("xor")}
                title="XOR / Exclude"
              >
                <Slash className="text-cyan-400" size={18} />
              </button>
              <button onClick={() => handleBoolean("divide")} title="Divide">
                <Divide className="text-cyan-400" size={18} />
              </button>
            </div>
          </div>

          {/* 🔹 Clear Design Button */}
          <button
            onClick={() => {
              localStorage.removeItem("cre8tly_canvas_shapes");
              window.dispatchEvent(new CustomEvent("clearCanvasShapes"));
            }}
            className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1a1a1a]/90 text-gray-300 hover:text-red-400 border border-gray-700/50 text-xs transition"
          >
            <Trash2 size={14} />
            Clear
          </button>

          {/* 🔹 Canvas Display */}
          {pages.length > 0 && (
            <>
              {(() => {
                window.currentPDFPage = selectedPage;
              })()}{" "}
              {/* ✅ Set active page */}
              <PDFPage
                imageUrl={pages[selectedPage]}
                shapes={shapesByPage[selectedPage] || []}
                setShapes={(s) => {
                  console.log("🧩 CanvasEditor setShapes() called with:", s);

                  setShapesByPage((prev) => {
                    const current = Array.isArray(prev[selectedPage])
                      ? prev[selectedPage]
                      : [];

                    // 🧠 If s is a function, run it with the current array
                    const next =
                      typeof s === "function"
                        ? s(current)
                        : Array.isArray(s)
                          ? s
                          : [];

                    return { ...prev, [selectedPage]: next };
                  });
                }}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                selectedTool={selectedTool}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
