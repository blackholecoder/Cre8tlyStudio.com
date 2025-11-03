import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Arrow,
  Ellipse,
  Text,
  Transformer,
} from "react-konva";

import ShapePropertiesPanel from "./ShapePropertiesPanel";

export default function PDFOverlayCanvas({ shapes, setShapes }) {
  shapes = Array.isArray(shapes) ? shapes : [];
  const containerRef = useRef(null);
  const trRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

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

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
    setPanelOpen(false);
  };

  const updateSelected = (updates) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, ...updates } : s))
    );
  };

  useEffect(() => {
    const tr = trRef.current;
    const stage = tr?.getStage();
    if (!stage) return;

    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode) {
      tr.nodes([selectedNode]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, shapes]);

  useEffect(() => {
    localStorage.setItem("cre8tly_canvas_shapes", JSON.stringify(shapes));
  }, [shapes]);

  useEffect(() => {
  const handleOutsideClick = (e) => {
    if (!containerRef.current?.contains(e.target)) {
      setSelectedId(null);
      setPanelOpen(false);
    }
  };
  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick);
}, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 50 }}
    >
      {stageSize.width > 0 && (
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          className="absolute inset-0"
          style={{ background: "transparent" }}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();

            if (clickedOnEmpty) {
              setSelectedId(null);
              setPanelOpen(false);
            }
          }}
        >
          <Layer>
            {shapes.map((shape) => {
              const isSelected = selectedId === shape.id;

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
                      onClick={() => {
                        setSelectedId(shape.id);
                        setPanelOpen(true);
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
                      onClick={() => {
                        setSelectedId(shape.id);
                        setPanelOpen(true);
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
                      onClick={() => {
                        setSelectedId(shape.id);
                        setPanelOpen(true);
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
                      onClick={() => {
                        setSelectedId(shape.id);
                        setPanelOpen(true);
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
        selectedId={selectedId}
        shapes={shapes}
        updateSelected={updateSelected}
        deleteSelected={deleteSelected}
      />
    </div>
  );
}
