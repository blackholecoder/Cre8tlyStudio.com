import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Arrow,
  Ellipse,
  Text,
  Transformer,
  Path
} from "react-konva";

import ShapePropertiesPanel from "./ShapePropertiesPanel";

export default function PDFOverlayCanvas({
  shapes,
  setShapes,
  selectedTool,
  setSelectedTool,
  selectedIds,
  setSelectedIds,
}) {
  shapes = Array.isArray(shapes) ? shapes : [];
  const containerRef = useRef(null);
  const trRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [panelOpen, setPanelOpen] = useState(false);
  const [previewShape, setPreviewShape] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const selectionStart = useRef(null);

  const stageRef = useRef(null);

  const pageKey = `cre8tly_canvas_shapes_page_${window.currentPDFPage ?? 0}`;


  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStageSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClear = () => {
      setShapes([]);
    };

    window.addEventListener("clearCanvasShapes", handleClear);
    return () => window.removeEventListener("clearCanvasShapes", handleClear);
  }, [setShapes]);

  // Dynamically size stage to container
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setStageSize({ width: clientWidth, height: clientHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleAutoEdit = (e) => {
      const { id } = e.detail;
      const stage = trRef.current?.getStage();
      if (!stage) return;

      const node = stage.findOne(`#${id}`);
      if (!node) return;

      // simulate double-click edit mode
      const evt = { target: node };
      node.fire("dblclick", evt);
    };

    window.addEventListener("autoEditText", handleAutoEdit);
    return () => window.removeEventListener("autoEditText", handleAutoEdit);
  }, []);

  // 🧠 Persist shapes in localStorage so design stays between sessions
  useEffect(() => {
    const savedShapes = localStorage.getItem(pageKey);
    if (savedShapes) {
      try {
        setShapes(JSON.parse(savedShapes));
        console.log(`✅ Restored shapes for page ${window.currentPDFPage}`);
      } catch (err) {
        console.error("⚠️ Failed to parse saved shapes:", err);
      }
    }
  }, [pageKey]);

  useEffect(() => {
    if (shapes.length > 0) {
      localStorage.setItem(pageKey, JSON.stringify(shapes));
    } else {
      localStorage.removeItem(pageKey);
    }
  }, [shapes, pageKey]);

  const deleteSelected = (ids = []) => {
    if (!ids.length) return;
    setShapes((prev) => prev.filter((s) => !ids.includes(s.id)));
    setSelectedIds([]);
    setPanelOpen(false);
  };

  const updateSelected = (updates) => {
    setShapes((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, ...updates } : s))
    );
  };
  useEffect(() => {
    const tr = trRef.current;
    const stage = tr?.getStage();
    if (!stage) return;

    const nodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean);
    tr.nodes(nodes);
    tr.getLayer()?.batchDraw();
  }, [selectedIds, shapes]);

  useEffect(() => {
    localStorage.setItem("cre8tly_canvas_shapes", JSON.stringify(shapes));
  }, [shapes]);

  useEffect(() => {
  const handleOutsideClick = (e) => {
    // 👇 ignore clicks on the canvas toolbar
    if (e.target.closest('.canvas-toolbar')) return;

    if (!containerRef.current?.contains(e.target)) {
      setSelectedIds([]);
      setPanelOpen(false);
    }
  };

  // use capture so this runs before other handlers
  document.addEventListener('mousedown', handleOutsideClick);
  return () =>
    document.removeEventListener('mousedown', handleOutsideClick);
}, []);


  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

const handleMouseDown = (e) => {
  // 🔒 If the DOM target is the toolbar, ignore (prevents accidental clears)
  if (e?.evt?.target?.closest && e.evt.target.closest('.canvas-toolbar')) {
    return;
  }

  const stage = e.target.getStage();
  const clickedEmpty =
    e.target === stage || e.target.getParent() === stage.findOne('Layer');

  const pos = stage.getPointerPosition();

  // 🟦 No active tool → start lasso selection
  if (!selectedTool && clickedEmpty) {
    // make sure we are NOT in draw mode anymore
    setSelectedTool?.(null);
    setPreviewShape(null);
    isDrawing.current = false;

    // begin lasso
    selectionStart.current = pos;
    setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
    return;
  }

  // 🖌️ Tool is active and we clicked empty → start drawing a new shape
  if (selectedTool && clickedEmpty) {
    isDrawing.current = true;
    startPos.current = pos;
    setPreviewShape({
      id: 'preview-shape',
      type: selectedTool,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      radiusX: 0,
      radiusY: 0,
      fill: 'rgba(0,128,255,0.15)',
      stroke: '#00b4ff',
      strokeWidth: 0,
      opacity: 0.6,
    });
    return;
  }

  // (Optional) clicked on a node while no tool active → leave to node onClick
};


  const handleMouseMove = (e) => {
  const stage = e.target.getStage();
  const pos = stage.getPointerPosition();
  
  if (!pos) return;

  // 🖌 drawing preview
  if (isDrawing.current && previewShape) {
    const dx = pos.x - startPos.current.x;
    const dy = pos.y - startPos.current.y;

    if (previewShape.type === "rect") {
      // normalize so rect always has positive width/height
      const x = Math.min(startPos.current.x, pos.x);
      const y = Math.min(startPos.current.y, pos.y);
      const width  = Math.abs(dx);
      const height = Math.abs(dy);
      setPreviewShape((prev) => ({ ...prev, x, y, width, height }));
      return;
    }

    if (previewShape.type === "circle") {
      // Ellipse needs center + radii
      const cx = startPos.current.x + dx / 2;
      const cy = startPos.current.y + dy / 2;
      const rx = Math.abs(dx) / 2;
      const ry = Math.abs(dy) / 2;
      setPreviewShape((prev) => ({
        ...prev,
        x: cx,
        y: cy,
        radiusX: rx,
        radiusY: ry,
      }));
      return;
    }

    if (previewShape.type === "arrow") {
      setPreviewShape((prev) => ({
        ...prev,
        points: [startPos.current.x, startPos.current.y, pos.x, pos.y],
      }));
      return;
    }
  }

  // 🟦 selection box
  if (selectionBox && selectionStart.current) {
    const x = Math.min(pos.x, selectionStart.current.x);
    const y = Math.min(pos.y, selectionStart.current.y);
    const width  = Math.abs(pos.x - selectionStart.current.x);
    const height = Math.abs(pos.y - selectionStart.current.y);
    setSelectionBox({ x, y, width, height });
  }
};

const handleMouseUp = (e) => {
  const stage = e.target.getStage();


  if (selectionBox) {
    const scaleX = stage.scaleX();
    const scaleY = stage.scaleY();

    const normBox = {
      x: selectionBox.x / scaleX,
      y: selectionBox.y / scaleY,
      width: selectionBox.width / scaleX,
      height: selectionBox.height / scaleY,
    };

    const box = {
      x: Math.min(normBox.x, normBox.x + normBox.width),
      y: Math.min(normBox.y, normBox.y + normBox.height),
      x2: Math.max(normBox.x, normBox.x + normBox.width),
      y2: Math.max(normBox.y, normBox.y + normBox.height),
    };


    const selected = shapes
      .filter((s) => {
        const node = stage.findOne(`#${s.id}`);
        if (!node) {
          console.log("⚠️ Shape node not found:", s.id);
          return false;
        }

        const rect = node.getClientRect({ relativeTo: stage });

        const intersects = !(
          rect.x + rect.width < box.x ||
          rect.x > box.x2 ||
          rect.y + rect.height < box.y ||
          rect.y > box.y2
        );

        return intersects;
      })
      .map((s) => s.id);

    setSelectedIds(selected);
    setPanelOpen(selected.length === 1);
    setSelectionBox(null);
    selectionStart.current = null;

    if (selected.length === 0) {
      console.log("❌ No shapes selected by box.");
    }
    return;
  }

  // 🖌 finalize a drawn shape
  if (isDrawing.current && previewShape) {
    isDrawing.current = false;

    // ignore accidental clicks / tiny shapes
    const tiny =
      (previewShape.type === "rect"   && (previewShape.width < 2 || previewShape.height < 2)) ||
      (previewShape.type === "circle" && (previewShape.radiusX < 1 || previewShape.radiusY < 1)) ||
      (previewShape.type === "arrow"  && !previewShape.points);
    if (!tiny) {
      setShapes((prev) => [
        ...prev,
        {
          ...previewShape,
          id: `shape-${Date.now()}`,
          // default stroke off on creation
          strokeWidth: previewShape.type === "arrow" ? 2 : 0,
        },
      ]);
    }

    setPreviewShape(null);
    setSelectedTool(null);            // <-- important

  const container = stageRef.current?.getStage()?.container();
  if (container) container.style.cursor = "default";  // <-- force reset
  }
};

// keep cursor in sync with tool
useEffect(() => {
  const container = stageRef.current?.getStage()?.container();
  if (!container) return;
  container.style.cursor = selectedTool ? "crosshair" : "default";
}, [selectedTool]);

// if mouse leaves the stage while drawing, stop and reset cursor
const handleMouseLeave = () => {
  if (isDrawing.current) {
    isDrawing.current = false;
    setPreviewShape(null);
  }
  const container = stageRef.current?.getStage()?.container();
  if (container) container.style.cursor = "default";
};
// Sometimes mouseup fires outside the Stage. Add a document-level listener that cancels drawing:
useEffect(() => {
  const endDrawingOutside = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    setPreviewShape(null);
    setSelectedTool(null);
    const c = stageRef.current?.getStage()?.container();
    if (c) c.style.cursor = "default";
  };
  document.addEventListener("mouseup", endDrawingOutside);
  return () => document.removeEventListener("mouseup", endDrawingOutside);
}, [setSelectedTool]);

useEffect(() => {
  const onKeyDown = (e) => {
    // don’t delete while typing
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds?.length) {
      e.preventDefault(); // stop browser “back” on Backspace
      deleteSelected(selectedIds); // you already have this helper in PDFOverlayCanvas
    }
  };

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [selectedIds, deleteSelected]);


  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 50 }}
    >
      {stageSize.width > 0 && (
        <Stage
        ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          className="absolute inset-0"
          style={{
            background: "transparent",
            cursor: selectedTool ? "crosshair" : "default",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          handleMouseLeave={handleMouseLeave}
        >
          <Layer>
            {shapes.map((shape) => {
              const isSelected = selectedIds.includes(shape.id);

              // ✅ Ensure cornerRadius exists for rectangles
              if (
                shape.type === "rect" &&
                typeof shape.cornerRadius !== "number"
              ) {
                shape.cornerRadius = 0;
              }

              switch (shape.type) {
                case "circle":
                  return (
                    <Ellipse
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      radiusX={shape.radiusX ?? shape.radius ?? 50}
                      radiusY={shape.radiusY ?? shape.radius ?? 50}
                      fill={shape.fill ?? "rgba(0,128,255,0.25)"}
                      stroke={shape.stroke ?? "#00b4ff"}
                      strokeWidth={shape.strokeWidth ?? 2}
                      shadowEnabled={isSelected}
                      shadowColor="#00b4ff"
                      shadowBlur={isSelected ? 10 : 0}
                      shadowOpacity={isSelected ? 0.8 : 0}
                      onClick={(e) => {
                        const isShift = e.evt.shiftKey;
                        setPanelOpen(true);
                        setSelectedIds((prev) =>
                          isShift
                            ? prev.includes(shape.id)
                              ? prev.filter((id) => id !== shape.id)
                              : [...prev, shape.id]
                            : [shape.id]
                        );
                      }}
                      draggable
                      onDragEnd={(e) => {
                        const { x, y } = e.target.position();
                        setShapes((prev) =>
                          prev.map((s) =>
                            s.id === shape.id ? { ...s, x, y } : s
                          )
                        );
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        setShapes((prev) =>
                          prev.map((s) =>
                            s.id === shape.id
                              ? {
                                  ...s,
                                  x: node.x(),
                                  y: node.y(),
                                  radiusX:
                                    (s.radiusX ?? s.radius ?? 50) * scaleX,
                                  radiusY:
                                    (s.radiusY ?? s.radius ?? 50) * scaleY,
                                  rotation: node.rotation(),
                                }
                              : s
                          )
                        );
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );

                case "arrow":
                  return (
                    <Arrow
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      points={shape.points ?? [0, 0, 100, 0]}
                      pointerLength={shape.pointerLength ?? 15}
                      pointerWidth={shape.pointerWidth ?? 15}
                      stroke={shape.stroke ?? "#00b4ff"}
                      fill={shape.stroke ?? "#00b4ff"}
                      strokeWidth={shape.strokeWidth ?? 3}
                      hitStrokeWidth={20}
                      shadowEnabled={isSelected}
                      shadowColor="#00b4ff"
                      shadowBlur={isSelected ? 10 : 0}
                      shadowOpacity={isSelected ? 0.8 : 0}
                      onClick={(e) => {
                        const isShift = e.evt.shiftKey;
                        setPanelOpen(true);
                        setSelectedIds((prev) =>
                          isShift
                            ? prev.includes(shape.id)
                              ? prev.filter((id) => id !== shape.id)
                              : [...prev, shape.id]
                            : [shape.id]
                        );
                      }}
                      draggable
                      onDragEnd={(e) => {
                        const { x, y } = e.target.position();
                        setShapes((prev) =>
                          prev.map((s) =>
                            s.id === shape.id ? { ...s, x, y } : s
                          )
                        );
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        setShapes((prev) =>
                          prev.map((s) =>
                            s.id === shape.id
                              ? {
                                  ...s,
                                  x: node.x(),
                                  y: node.y(),
                                  scaleX: node.scaleX(),
                                  scaleY: node.scaleY(),
                                }
                              : s
                          )
                        );
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );

                case "text":
                  return (
                    <Text
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      fill={shape.fill}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth ?? 1}
                      shadowEnabled={isSelected}
                      shadowColor="#00b4ff"
                      shadowBlur={isSelected ? 10 : 0}
                      shadowOpacity={isSelected ? 0.8 : 0}
                      draggable={!shape.isEditing}
                      onClick={(e) => {
                        const isShift = e.evt.shiftKey;
                        setPanelOpen(true);
                        setSelectedIds((prev) =>
                          isShift
                            ? prev.includes(shape.id)
                              ? prev.filter((id) => id !== shape.id)
                              : [...prev, shape.id]
                            : [shape.id]
                        );
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        updateSelected({
                          x: node.x(),
                          y: node.y(),
                          rotation: node.rotation(),
                          scaleX: node.scaleX(),
                          scaleY: node.scaleY(),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );

                case "path":
                  return (
                    <Path
                      key={shape.id}
                      id={shape.id.toString()}
                      data={shape.data}
                      fill={shape.fill}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      draggable
                      onClick={(e) => {
                        const isShift = e.evt.shiftKey;
                        setSelectedIds((prev) =>
                          isShift ? [...prev, shape.id] : [shape.id]
                        );
                        setPanelOpen(true);
                      }}
                    />
                  );

                default:
                  return (
                    <Rect
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      fill={shape.fill ?? "rgba(0,128,255,0.25)"}
                      stroke={shape.stroke ?? "#00b4ff"}
                      strokeWidth={shape.strokeWidth ?? 2}
                      perfectDrawEnabled={false}
                      strokeScaleEnabled={false}
                      onClick={(e) => {
                        const isShift = e.evt.shiftKey;
                        setPanelOpen(true);
                        setSelectedIds((prev) =>
                          isShift
                            ? prev.includes(shape.id)
                              ? prev.filter((id) => id !== shape.id)
                              : [...prev, shape.id]
                            : [shape.id]
                        );
                      }}
                      draggable
                      onDragEnd={(e) => {
                        const { x, y } = e.target.position();
                        setShapes((prev) =>
                          prev.map((s) =>
                            s.id === shape.id ? { ...s, x, y } : s
                          )
                        );
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        const newWidth = Math.max(20, node.width() * scaleX);
                        const newHeight = Math.max(20, node.height() * scaleY);
                        setShapes((prev) =>
                          prev.map((s) =>
                            s.id === shape.id
                              ? {
                                  ...s,
                                  x: node.x(),
                                  y: node.y(),
                                  width: newWidth,
                                  height: newHeight,
                                  rotation: node.rotation(),
                                  cornerRadius: shape.cornerRadius
                                    ? Math.min(newWidth, newHeight) * 0.1
                                    : 0,
                                }
                              : s
                          )
                        );
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );
              }
            })}
            {previewShape &&
              (previewShape.type === "rect" ? (
                <Rect {...previewShape} />
              ) : previewShape.type === "circle" ? (
                <Ellipse {...previewShape} />
              ) : previewShape.type === "arrow" ? (
                <Arrow {...previewShape} />
              ) : null)}
            {selectionBox && (
              <Rect
                x={selectionBox.x}
                y={selectionBox.y}
                width={selectionBox.width}
                height={selectionBox.height}
                fill="rgba(0, 128, 255, 0.1)"
                stroke="#00b4ff"
                strokeWidth={1}
                dash={[4, 4]}
              />
            )}

            <Transformer
              ref={trRef}
              rotateEnabled
              resizeEnabled
              keepRatio={false}
              enabledAnchors={[
                "top-left",
                "top-center",
                "top-right",
                "middle-left",
                "middle-right",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ]}
              anchorCornerRadius={50}
              anchorSize={5}
              anchorStroke="#00b4ff"
              anchorStrokeWidth={0.5}
              anchorFill="#ffffff"
              borderStroke="#00b4ff"
              borderStrokeWidth={1.5}
              borderDash={[3, 3]}
              ignoreStroke={false}
            />
          </Layer>
        </Stage>
      )}

      {/* 🎛 Shape Properties Panel */}
      <ShapePropertiesPanel
        panelOpen={panelOpen}
        selectedIds={selectedIds}
        shapes={shapes}
        updateSelected={updateSelected}
        deleteSelected={deleteSelected}
      />
    </div>
  );
}
