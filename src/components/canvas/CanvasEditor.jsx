import { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import axiosInstance from "../../api/axios";
import PDFOverlayCanvas from "./PDFOverlayCanvas";
import { toast } from "react-toastify";
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
  MousePointerClick,
  ArrowLeft,
  Package,
  ZoomIn,
  Undo2,
  Redo2,
  ImageIcon,
} from "lucide-react";
import { performBooleanOperation } from "../../helpers/booleanOps";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/pdf.worker.min.js",
  window.location.origin
).toString();

function PDFPage({
  pageIndex,
  imageUrl,
  shapes,
  setShapes,
  setSelectedTool,
  selectedTool,
  selectedIds,
  setSelectedIds,
}) {
  const [img] = useImage(imageUrl);
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);

  // Fit image once loaded
  useEffect(() => {
    if (!img || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / img.width;
    const scaleY = rect.height / img.height;
    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
    setStageSize({
      width: img.width * newScale,
      height: img.height * newScale,
    });
  }, [img]);

  // Spacebar to pan
  useEffect(() => {
    const down = (e) => e.code === "Space" && setSpacePressed(true);
    const up = (e) => e.code === "Space" && setSpacePressed(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Zoom logic
  const applyZoom = (direction, e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;
    const clickY = e.clientY - bounds.top;
    const step = 1.5;
    const maxZoom = 8;
    const minZoom = 1;

    setZoom((prev) => {
      let next =
        direction === "in"
          ? Math.min(prev * step, maxZoom)
          : Math.max(prev / step, minZoom);

      if (next === prev) return prev;
      // Adjust pan offset relative to click position
      setOffset({
        x: offset.x - (clickX - stageSize.width / 2) * (next - prev) * 0.3,
        y: offset.y - (clickY - stageSize.height / 2) * (next - prev) * 0.3,
      });
      return next;
    });
  };

  const handleClick = (e) => {
    if (selectedTool !== "magnify") return;
    e.preventDefault();
    if (e.button === 2 || e.altKey) applyZoom("out", e);
    else applyZoom("in", e);
  };

  const handleMouseDown = (e) => {
    // Only pan if the click didn’t originate from inside the overlay’s Konva stage
    const target = e.target;

    // Check if the event target is inside Konva’s actual shape layer or transformer
    const isInsideOverlay =
      target.closest(".konvajs-content") && selectedTool !== "magnify";

    // Allow resize/move when zoomed if the click is on a shape
    if (isInsideOverlay) return; // ⛔ Let Konva handle it (resizing or drawing)

    // Otherwise, enable panning
    const shouldPan =
      zoom > 1 &&
      (spacePressed || selectedTool === "magnify" || selectedTool === null);

    if (shouldPan && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        startOffset: { ...offset },
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setOffset({
      x: dragStart.startOffset.x + dx,
      y: dragStart.startOffset.y + dy,
    });
  };

  const handleMouseUp = () => setIsPanning(false);
  const handleDoubleClick = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const preventContext = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventContext);
    return () => document.removeEventListener("contextmenu", preventContext);
  }, []);

  return (
    <div
      ref={containerRef}
      data-pdf-page={pageIndex}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="relative w-full h-[80vh] overflow-hidden bg-[#0f0f10] rounded-lg"
      style={{
        cursor:
          zoom > 1
            ? isPanning
              ? "grabbing"
              : "grab"
            : selectedTool === "magnify"
              ? "zoom-in"
              : spacePressed
                ? "grab"
                : "default",
      }}
    >
      {img && (
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
            transformOrigin: "center center",
            width: `${stageSize.width}px`,
            height: `${stageSize.height}px`,
            transition: isPanning ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* PDF Background */}
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            scaleX={scale}
            scaleY={scale}
            className="absolute"
            style={{
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Layer listening={false}>
              <KonvaImage image={img} />
            </Layer>
          </Stage>

          {/* Drawing Layer */}
          <div
            className="absolute top-0 left-0 z-30"
            style={{
              width: `${stageSize.width}px`,
              height: `${stageSize.height}px`,
              pointerEvents: "auto",
            }}
          >
            <PDFOverlayCanvas
              shapes={shapes}
              setShapes={setShapes}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              zoom={zoom}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CanvasEditor() {
  const params = new URLSearchParams(window.location.search);
  const leadMagnetId = params.get("id");
  const pdfUrl = decodeURIComponent(params.get("pdf") || "");

  const [pages, setPages] = useState([]); // all page images
  const [selectedPage, setSelectedPage] = useState(0);
  const [shapesByPage, setShapesByPage] = useState({});

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

        // ✅ Request as blob (same as react-pdf)
        const response = await axiosInstance.get(proxyUrl, {
          responseType: "blob",
        });

        // ✅ Convert blob → arrayBuffer for pdf.js
        const buffer = await response.data.arrayBuffer();

        const pdf = await pdfjs.getDocument({ data: buffer }).promise;

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
  };

  // history manager
  const historyRef = useRef({}); // { [page]: { past: [], future: [] } }

  function getStacks(page) {
    if (!historyRef.current[page]) {
      historyRef.current[page] = { past: [], future: [] };
    }
    return historyRef.current[page];
  }

  // Call this *before* you set a new shapes array for a page
  function pushPast(page, currentShapes) {
    const { past } = getStacks(page);
    // store a deep copy so future edits don't mutate history
    past.push(JSON.parse(JSON.stringify(currentShapes || [])));
    // whenever we push, clear future (standard undo/redo behavior)
    historyRef.current[page].future = [];
  }

  const undo = useCallback(() => {
    const page = selectedPage;
    const { past, future } = getStacks(page);
    if (past.length === 0) return;

    const current = shapesByPage[page] || [];
    const previous = past.pop();
    future.push(JSON.parse(JSON.stringify(current)));

    setShapesByPage((prev) => ({ ...prev, [page]: previous }));
    setSelectedIds([]); // optional but helpful
  }, [selectedPage, shapesByPage, setShapesByPage]);

  const redo = useCallback(() => {
    const page = selectedPage;
    const { past, future } = getStacks(page);
    if (future.length === 0) return;

    const current = shapesByPage[page] || [];
    const next = future.pop();
    past.push(JSON.parse(JSON.stringify(current)));

    setShapesByPage((prev) => ({ ...prev, [page]: next }));
    setSelectedIds([]); // optional
  }, [selectedPage, shapesByPage, setShapesByPage]);

  useEffect(() => {
    function onKeyDown(e) {
      const t = e.target;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);
  // selectedPage matters for per-page stacks

  function handleBoolean(op) {
    const current = shapesByPage[selectedPage] || [];
    const sel = selectedIds.map(String);
    const picked = current.filter((s) => sel.includes(String(s.id)));

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
    pushPast(selectedPage, current);

    setShapesByPage((prev) => ({
      ...prev,
      [selectedPage]: [
        ...current.filter((s) => !sel.includes(String(s.id))),
        newShape,
      ],
    }));
    setSelectedIds([newShape.id]);
  }

  async function handleSaveFinalPDF() {
    try {
      if (!pdfUrl) {
        toast.error("No PDF URL provided — cannot save.");
        return;
      }

      if (!pages.length) throw new Error("No pages loaded");

      toast.info("🧩 Saving your design… Please wait.", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      // ✅ 1. Fetch the original PDF
      const res = await fetch(
        `https://cre8tlystudio.com/api/pdf/proxy?url=${encodeURIComponent(pdfUrl)}`
      );
      const original = await res.arrayBuffer();
      const pdfDoc = await PDFDocument.load(original);

      // ✅ 2. Apply overlays from each page
      for (let i = 0; i < pages.length; i++) {
        const overlayCanvas = document.querySelector(
          `[data-pdf-page="${i}"] .konva-overlay .konvajs-content canvas:first-child`
        );

        if (!overlayCanvas) continue;

        console.log("🎨 Exporting overlay for page", i, overlayCanvas);
        document.body.appendChild(overlayCanvas.cloneNode(true));

        const imgData = overlayCanvas.toDataURL("image/png");
        const png = await pdfDoc.embedPng(imgData);

        const page = pdfDoc.getPages()[i];
        const { width, height } = page.getSize();
        page.drawImage(png, { x: 0, y: 0, width, height });
      }

      // ✅ 3. Generate the new PDF blob
      const finalBytes = await pdfDoc.save();
      const finalBlob = new Blob([finalBytes], { type: "application/pdf" });

      // ✅ 4. Upload and commit
      const formData = new FormData();
      formData.append("file", finalBlob, "final.pdf");

      const uploadRes = await axiosInstance.put(
        `https://cre8tlystudio.com/api/edit/${leadMagnetId}/editor/commit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const title = uploadRes.data?.title || "Lead Magnet";

      toast.success(`✅ "${title}" saved and committed successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error("❌ Save failed:", err);

      toast.error(
        `❌ Failed to save final PDF. ${
          err.response?.data?.error || "Check console for details."
        }`,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }
      );
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green mb-3"></div>
        <p>Opening design portal...</p>
      </div>
    );
  }

 

  return (
    <div className="flex h-screen bg-[#111] text-white">
       <input
    id="hiddenImageUpload"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // ✅ use blob URL instead of base64 (much lighter for React)
      const objectUrl = URL.createObjectURL(file);

      // ✅ get current canvas size for auto-centering
      const canvasWidth =
        document.querySelector(".konva-overlay")?.clientWidth || 600;
      const canvasHeight =
        document.querySelector(".konva-overlay")?.clientHeight || 800;

      const newShape = {
        id: `image-${Date.now()}`,
        type: "image",
        src: objectUrl,
        // ✅ auto-center
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 - 100,
        width: 200,
        height: 200,
        draggable: true,
      };

      console.log("✅ Added image shape:", newShape);

      // ✅ add to current page (preserving undo)
      setShapesByPage((prev) => {
        const current = prev[selectedPage] || [];
        const next = [...current, newShape];
        pushPast(selectedPage, current);
        return { ...prev, [selectedPage]: next };
      });

      toast.success("🖼 Image added to canvas!");
      e.target.value = ""; // reset file input
    }}
  />
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700/60 transition text-white text-sm font-medium"
              title="Dashboard"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-lg font-semibold">Canvas Editor</h1>
          </div>
          <button
            onClick={handleSaveFinalPDF}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green hover:bg-green border border-grey-700 transition text-black text-sm font-medium"
          >
            <Package size={18} />
            Save Final PDF
          </button>
        </div>

        {/* ✅ Drawing area */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-[#0f0f10] rounded-lg border border-gray-800">
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-[#1a1a1a]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-700/60 shadow-md canvas-toolbar"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("canvas:resetTool"));
                setSelectedTool(null);
                setSelectedIds([]);
              }}
              title="Reset to Default"
              className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all duration-150
    ${
      !selectedTool
        ? "bg-[#0f0f10] border-green shadow-[0_0_8px_rgba(0,255,0,0.4)] scale-105"
        : "bg-black border-gray-700/50 hover:border-green hover:bg-[#1a1a1a]"
    }`}
            >
              <MousePointerClick
                size={16}
                className={`${!selectedTool ? "text-green" : "text-gray-300"} transition-colors`}
              />
            </button>

            {/* 🔁 Undo / Redo */}
            <div className="flex gap-2 justify-center mb-1 mt-0 border-b border-gray-700/40 pb-1">
              <button
                onClick={undo}
                title="Undo"
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-700/50 bg-black hover:border-green hover:bg-[#1a1a1a] active:scale-95 transition-all duration-150"
              >
                <Undo2
                  size={18}
                  className="text-green transition-transform group-hover:scale-110"
                />
              </button>

              <button
                onClick={redo}
                title="Redo"
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-700/50 bg-black hover:border-green hover:bg-[#1a1a1a] active:scale-95 transition-all duration-150"
              >
                <Redo2
                  size={18}
                  className="text-green transition-transform group-hover:scale-110"
                />
              </button>
            </div>

            {[
              {
                icon: ZoomIn,
                type: "magnify",
                color: "bg-black",
                title: "Magnify Tool (click & drag to zoom)",
              },
              {
                icon: Square,
                type: "rect",
                color: "bg-black",
                title: "Rectangle Tool",
              },
              {
                icon: Circle,
                type: "circle",
                color: "bg-black",
                title: "Ellipse Tool",
              },
              {
                icon: ArrowRight,
                type: "arrow",
                color: "bg-black",
                title: "Arrow Tool",
              },
              {
                icon: Type,
                type: "text",
                color: "bg-black",
                title: "Artistic Text Tool",
              },
              {
                icon: ImageIcon, // import { Image as ImageIcon } from "lucide-react"
                type: "image",
                color: "bg-black",
                title: "Image Tool",
              },
            ].map(({ icon: Icon, type, color, title }) => (
              <button
                key={type}
                onClick={() => {
                  if (type === "image") {
                    // 👇 Directly open the hidden file input
                    document.getElementById("hiddenImageUpload")?.click();
                    return;
                  }
                  handleSelectTool(type);
                }}
                title={title}
                className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all duration-150
      ${
        selectedTool === type
          ? "bg-[#0f0f10] border-green shadow-[0_0_8px_rgba(0,255,0,0.4)] scale-105"
          : `${color} border-gray-700/50 hover:border-green hover:bg-[#1a1a1a]`
      }`}
              >
                <Icon
                  size={18}
                  className={`${
                    selectedTool === type ? "text-green" : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}

            <div className="flex gap-2 ml-0">
              {[
                { icon: Plus, title: "Add", action: "union" },
                { icon: Minus, title: "Subtract", action: "subtract" },
                { icon: Combine, title: "Intersect", action: "intersect" },
                { icon: Slash, title: "XOR / Exclude", action: "xor" },
                { icon: Divide, title: "Divide", action: "divide" },
              ].map(({ icon: Icon, title, action }) => (
                <button
                  key={action}
                  onClick={() => handleBoolean(action)}
                  title={title}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all duration-150
      bg-black border-gray-700/50 hover:border-cyan-400 hover:bg-[#1a1a1a]
      active:scale-95 focus:outline-none
      ${selectedTool === action ? "border-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.4)] scale-105" : ""}`}
                >
                  <Icon
                    size={18}
                    className={`${
                      selectedTool === action
                        ? "text-cyan-400"
                        : "text-cyan-400"
                    } transition-transform`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 🔹 Clear Design Button */}
          <button
            onClick={() => {
              localStorage.removeItem("cre8tly_canvas_shapes");
              window.dispatchEvent(new CustomEvent("clearCanvasShapes"));
            }}
            className="absolute bottom-6 right-6 flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 text-white hover:text-red-400 border border-gray-700/50 text-xs transition"
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
                pageIndex={selectedPage}
                imageUrl={pages[selectedPage]}
                shapes={shapesByPage[selectedPage] || []}
                setShapes={(updater) => {
                  setShapesByPage((prev) => {
                    const current = Array.isArray(prev[selectedPage])
                      ? prev[selectedPage]
                      : [];

                    // compute next from updater/function/array
                    const next =
                      typeof updater === "function"
                        ? updater(current)
                        : Array.isArray(updater)
                          ? updater
                          : [];

                    // ✅ record current into undo history BEFORE we set next
                    pushPast(selectedPage, current);

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
