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
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function PDFOverlayCanvas({shapes, setShapes}) {
  const containerRef = useRef(null);
  const trRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

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

  // 🧩 NEW: Listen for shape toolbar events
  useEffect(() => {
    const handleAddShape = (e) => addShape(e.detail);
    window.addEventListener("addShape", handleAddShape);
    return () => window.removeEventListener("addShape", handleAddShape);
  }, [shapes]);

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
    const savedShapes = localStorage.getItem("cre8tly_canvas_shapes");
    if (savedShapes) {
      try {
        setShapes(JSON.parse(savedShapes));
        console.log("✅ Restored saved shapes from localStorage");
      } catch (err) {
        console.error("⚠️ Failed to parse saved shapes:", err);
      }
    }
  }, []);

  useEffect(() => {
    // Auto-save shapes whenever they change
    if (shapes.length > 0) {
      localStorage.setItem("cre8tly_canvas_shapes", JSON.stringify(shapes));
    } else {
      // If cleared, remove key
      localStorage.removeItem("cre8tly_canvas_shapes");
    }
  }, [shapes]);

  const addShape = (type) => {
    const base = {
      id: `shape-${Date.now()}`,
      x: 100 + shapes.length * 30,
      y: 100 + shapes.length * 30,
      draggable: true,
      fill: "rgba(0,128,255,0.25)",
      stroke: "transparent", // ✅ No visible border by default
      strokeWidth: 0,
      opacity: 0.8,
      type,
    };

    let newShape;
    switch (type) {
      case "circle":
        newShape = { ...base, radius: 50 };
        break;
      case "arrow":
        newShape = {
          ...base,
          points: [0, 0, 150, 0], // ✅ longer, more visible default line
          pointerLength: 15,
          pointerWidth: 15,
          strokeWidth: 3,
          stroke: "#00b4ff",
          fill: "#00b4ff",
          hitStrokeWidth: 20, // ✅ easier to click
        };
        break;
      case "text":
        newShape = {
          ...base,
          text: "Click to edit",
          fontSize: 18,
          isEditing: true,
        };
        break;
      default:
        newShape = { ...base, width: 160, height: 100, cornerRadius: 0 };
    }

    setShapes((prev) => [...prev, newShape]);
    setSelectedId(newShape.id);
    setPanelOpen(true);
    if (type === "text") {
      setTimeout(() => {
        const event = new CustomEvent("autoEditText", {
          detail: { id: newShape.id },
        });
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
    setPanelOpen(false);
  };

  const updateSelected = (updates) => {
    setShapes((prev) => {
      const updatedShapes = prev.map((s) =>
        s.id === selectedId ? { ...s, ...updates } : s
      );

      // ✅ Save directly to localStorage
      localStorage.setItem(
        "cre8tly_canvas_shapes",
        JSON.stringify(updatedShapes)
      );

      return updatedShapes;
    });
  };

  // Track transformer selection
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;
    const stage = tr.getStage();
    const selectedNode = selectedId ? stage.findOne(`#${selectedId}`) : null;

    if (selectedNode) {
      tr.nodes([selectedNode]);
      tr.getLayer()?.batchDraw();
    } else {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId, shapes]);

  useEffect(() => {
  localStorage.setItem("cre8tly_canvas_shapes", JSON.stringify(shapes));
}, [shapes]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 25 }}
    >
      {/* 🖼 Konva Stage */}
      {stageSize.width > 0 && (
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          className="absolute inset-0"
          style={{ pointerEvents: "auto", background: "transparent" }}
          onMouseDown={(e) => {
            const empty = e.target === e.target.getStage();
            if (empty) {
              setSelectedId(null);
              setPanelOpen(false);
            }
          }}
        >
          <Layer>
            {shapes.map((shape) => {
              const isSelected = selectedId === shape.id;
              const strokeColor = shape.stroke || "#000000";

              switch (shape.type) {
                case "circle":
                  return (
                    <Ellipse
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      radiusX={shape.radiusX ?? shape.radius}
                      radiusY={shape.radiusY ?? shape.radius}
                      stroke={strokeColor}
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
                        updateSelected({ x, y });
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        updateSelected({
                          x: node.x(),
                          y: node.y(),
                          radiusX: (shape.radiusX ?? shape.radius) * scaleX,
                          radiusY: (shape.radiusY ?? shape.radius) * scaleY,
                          rotation: node.rotation(),
                        });

                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );
                // 🟡 ARROW (resizable + rotatable)
                case "arrow":
                  return (
                    <Arrow
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      stroke={strokeColor}
                      fill={strokeColor}
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
                        updateSelected({ x, y });
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        updateSelected({
                          x: node.x(),
                          y: node.y(),
                          scaleX: node.scaleX(),
                          scaleY: node.scaleY(),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );

                // 📝 TEXT (inline editable)
                case "text":
                  return (
                    <Text
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      stroke={strokeColor}
                      fill={shape.fill}
                      shadowEnabled={isSelected}
                      shadowColor="#00b4ff"
                      shadowBlur={isSelected ? 10 : 0}
                      shadowOpacity={isSelected ? 0.8 : 0}
                      draggable={!shape.isEditing}
                      listening
                      onClick={() => {
                        setSelectedId(shape.id);
                        setPanelOpen(true);
                      }}
                      onDblClick={(e) => {
                        const node = e.target;
                        const stage = node.getStage();
                        const layer = node.getLayer();
                        const stageBox = stage
                          .container()
                          .getBoundingClientRect();
                        const textPosition = node.absolutePosition();

                        const scaleX = node.getAbsoluteScale().x;
                        const scaleY = node.getAbsoluteScale().y;

                        // 🧠 Hide original Konva text while editing
                        node.visible(false);
                        layer.batchDraw();

                        // ---- Create and style textarea ----
                        const textarea = document.createElement("textarea");
                        document.body.appendChild(textarea);

                        textarea.value = node.text();
                        if (textarea.value.trim() === "Click to edit")
                          textarea.value = "";

                        textarea.style.position = "absolute";
                        textarea.style.top = `${stageBox.top + textPosition.y}px`;
                        textarea.style.left = `${stageBox.left + textPosition.x}px`;
                        textarea.style.width = `${node.width() * scaleX}px`;
                        textarea.style.height = `${node.height() * scaleY}px`;
                        textarea.style.fontSize = `${node.fontSize() * scaleY}px`;
                        textarea.style.lineHeight = node.lineHeight();
                        textarea.style.fontFamily = node.fontFamily();
                        textarea.style.fontStyle = node.fontStyle();
                        textarea.style.fontWeight = node
                          .fontStyle()
                          .includes("bold")
                          ? "bold"
                          : "normal";
                        textarea.style.textAlign = node.align();
                        textarea.style.color = node.fill();
                        textarea.style.border = "none";
                        textarea.style.margin = "0";
                        textarea.style.padding = "0";
                        textarea.style.background = "transparent";
                        textarea.style.outline = "none";
                        textarea.style.overflow = "hidden";
                        textarea.style.resize = "none";
                        textarea.style.whiteSpace = "pre-wrap";
                        textarea.style.transformOrigin = "left top";
                        textarea.style.zIndex = 9999;
                        textarea.style.caretColor = node.fill();

                        // Match rotation
                        const rotation = node.rotation();
                        textarea.style.transform = `rotate(${rotation}deg)`;

                        textarea.focus();

                        // ---- Dynamic height adjustment ----
                        const fitSize = () => {
                          textarea.style.height = "auto";
                          textarea.style.height = `${textarea.scrollHeight}px`;
                        };
                        fitSize();
                        textarea.addEventListener("input", fitSize);

                        // 🧠 Live update to memory/localStorage
                        textarea.addEventListener("input", () => {
                          const liveText = textarea.value;
                          setShapes((prev) => {
                            const idx = prev.findIndex(
                              (s) => s.id === node.id()
                            );
                            if (idx === -1) return prev;

                            const updatedShapes = [...prev];
                            updatedShapes[idx] = {
                              ...updatedShapes[idx],
                              text: liveText,
                            };

                            // ✅ Persist without rebuilding the entire canvas
                            localStorage.setItem(
                              "cre8tly_canvas_shapes",
                              JSON.stringify(updatedShapes)
                            );
                            return updatedShapes;
                          });
                        });

                        // ---- Save and cleanup ----
                        const save = () => {
                          const newText =
                            textarea.value.trim() || "Click to edit";

                          setShapes((prev) => {
                            const updatedShapes = prev.map((s) =>
                              s.id === node.id() ? { ...s, text: newText } : s
                            );
                            localStorage.setItem(
                              "cre8tly_canvas_shapes",
                              JSON.stringify(updatedShapes)
                            );
                            return updatedShapes;
                          });

                          document.body.removeChild(textarea);
                          node.visible(true);
                          layer.batchDraw();
                        };

                        textarea.addEventListener("blur", save);
                        textarea.addEventListener("keydown", (ev) => {
                          if (ev.key === "Enter" && !ev.shiftKey) {
                            ev.preventDefault();
                            save();
                          } else if (ev.key === "Escape") {
                            document.body.removeChild(textarea);
                            node.visible(true);
                            layer.batchDraw();
                          }
                        });
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

                // 🟩 RECTANGLE (no size inflation)
                default:
                  return (
                    <Rect
                      key={shape.id}
                      id={shape.id.toString()}
                      {...shape}
                      cornerRadius={shape.cornerRadius || 0}
                      stroke={strokeColor}
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
                        updateSelected({ x, y });
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        const newWidth = Math.max(20, node.width() * scaleX);
                        const newHeight = Math.max(20, node.height() * scaleY);

                        updateSelected({
                          x: node.x(),
                          y: node.y(),
                          width: newWidth,
                          height: newHeight,
                          rotation: node.rotation(),
                          // ✅ Keep rounded corners proportional
                          cornerRadius: shape.cornerRadius
                            ? Math.min(newWidth, newHeight) * 0.1
                            : 0,
                        });

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
              anchorCornerRadius={50} // circular
              anchorSize={5} // crisp visible handles
              anchorStroke="#00b4ff" // ✅ visible blue ring
              anchorStrokeWidth={0.5} // ✅ thickness of the blue border
              anchorFill="#ffffff" // ✅ solid white fill
              anchorStrokeEnabled={true} // ✅ explicitly render stroke
              anchorFillEnabled={true} // ✅ explicitly render fill
              borderStroke="#00b4ff" // selection outline
              borderStrokeWidth={1.5}
              borderDash={[3, 3]}
              ignoreStroke={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 20) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      )}

      {/* 🎛 Property Panel */}

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 z-50 bg-[#111]/90 backdrop-blur-md border border-gray-700/60 rounded-xl p-4 flex flex-col gap-3 shadow-xl w-64"
          >
            <h3 className="text-white font-semibold text-sm">
              Shape Properties
            </h3>

            {/* 🎨 Fill */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300">Fill</label>
              <div className="relative w-5 h-5">
                <input
                  type="color"
                  value={
                    shapes.find((s) => s.id === selectedId)?.fill || "#000000"
                  }
                  onChange={(e) => updateSelected({ fill: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Fill Color"
                />
                <div
                  className="w-full h-full rounded-full border border-gray-500 shadow-inner"
                  style={{
                    backgroundColor:
                      shapes.find((s) => s.id === selectedId)?.fill ||
                      "#000000",
                  }}
                />
              </div>
            </div>

            {/* 🧠 Stroke */}
            <hr className="border-gray-700/50 my-1" />
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300">Stroke</label>
              <div className="relative w-5 h-5">
                <input
                  type="color"
                  value={
                    shapes.find((s) => s.id === selectedId)?.stroke || "#000000"
                  }
                  onChange={(e) => updateSelected({ stroke: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Stroke Color"
                />
                <div
                  className="w-full h-full rounded-full border border-gray-500 shadow-inner"
                  style={{
                    backgroundColor:
                      shapes.find((s) => s.id === selectedId)?.stroke ||
                      "#000000",
                  }}
                />
              </div>
            </div>

            {/* Stroke Width */}
            <hr className="border-gray-700/50 my-1" />
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300">Width</label>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.01"
                  value={
                    shapes.find((s) => s.id === selectedId)?.strokeWidth || 2
                  }
                  onChange={(e) =>
                    updateSelected({ strokeWidth: parseFloat(e.target.value) })
                  }
                  className="cre8tly-slider w-24"
                />
                <span className="text-[11px] text-gray-400 w-8 text-right">
                  {(
                    shapes.find((s) => s.id === selectedId)?.strokeWidth || 0
                  ).toFixed(1)}
                </span>
              </div>
            </div>

            {/* 🫧 Opacity */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300">Opacity</label>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={shapes.find((s) => s.id === selectedId)?.opacity ?? 1}
                  onChange={(e) =>
                    updateSelected({ opacity: parseFloat(e.target.value) })
                  }
                  className="cre8tly-slider w-24"
                />
                <span className="text-[11px] text-gray-400 w-8 text-right">
                  {(
                    shapes.find((s) => s.id === selectedId)?.opacity ?? 1
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            {/* 🟣 Rounded Corners */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300">Rounded Corners</label>
              <input
                type="checkbox"
                checked={
                  !!shapes.find((s) => s.id === selectedId)?.cornerRadius
                }
                onChange={(e) => {
                  const isRounded = e.target.checked;
                  updateSelected({
                    cornerRadius: isRounded
                      ? Math.min(
                          shapes.find((s) => s.id === selectedId)?.width || 0,
                          shapes.find((s) => s.id === selectedId)?.height || 0
                        ) * 0.1
                      : 0,
                  });
                }}
                className="accent-blue w-4 h-4 cursor-pointer"
              />
            </div>

            {/* 🗑️ Delete */}
            <button
              onClick={deleteSelected}
              className="self-end mt-2 p-1 bg-white text-white rounded-md flex items-center justify-center transition-all duration-150"
              title="Delete shape"
            >
              <Trash2 className="text-red-600" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
