import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Arrow,
  Ellipse,
  Text,
  Transformer,
  Path,
  Line,
} from "react-konva";

import ShapePropertiesPanel from "./ShapePropertiesPanel";
import { handleShapeDuplicate } from "../../helpers/handleShapeDuplicates";
import { getGuides } from "../../helpers/guides";

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
  const [guides, setGuides] = useState({ vertical: [], horizontal: [] });

  const stageRef = useRef(null);
  const isDuplicating = useRef(false);
  const hasLoadedPage = useRef(false);

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
    // mark page as loaded after initial restore
    hasLoadedPage.current = true;
  }, [pageKey]);

  useEffect(() => {
    // prevent writing shapes before the correct page is fully loaded
    if (!hasLoadedPage.current) return;

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
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (selectedIds.includes(shape.id)) {
          return {
            ...shape,
            ...updates,
          };
        }
        return shape;
      })
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
      if (e.target.closest(".canvas-toolbar")) return;

      if (!containerRef.current?.contains(e.target)) {
        setSelectedIds([]);
        setPanelOpen(false);
      }
    };
    // use capture so this runs before other handlers
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!trRef.current) return;

    const stage = trRef.current.getStage();
    if (!stage) return;

    // Find all shapes that are currently selected
    const selectedNodes = shapes
      .filter((s) => selectedIds.includes(s.id))
      .map((s) => stage.findOne(`#${s.id}`))
      .filter(Boolean); // remove nulls

    trRef.current.nodes(selectedNodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, shapes]);

  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    // 🔒 If the DOM target is the toolbar, ignore (prevents accidental clears)
    if (e?.evt?.target?.closest && e.evt.target.closest(".canvas-toolbar")) {
      return;
    }

    const stage = e.target.getStage();
    const clickedEmpty =
      e.target === stage || e.target.getParent() === stage.findOne("Layer");

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
      // 🅰️ Text tool — click and drag to create a text box
      if (selectedTool === "text") {
        isDrawing.current = true;
        startPos.current = pos;
        setPreviewShape({
          id: "preview-text",
          type: "text",
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          text: "A",
          textMode: "line",
          fontSize: 20,
          fill: "#ffffff",
          stroke: "transparent",
          strokeWidth: 0,
          opacity: 0.9,
          fontFamily: "Inter",
          draggable: false,
        });
        return;
      }
      isDrawing.current = true;
      startPos.current = pos;
      setPreviewShape({
        id: "preview-shape",
        type: selectedTool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radiusX: 0,
        radiusY: 0,
        fill: "rgba(0,128,255,0.15)",
        stroke: "#00b4ff",
        strokeWidth: 0,
        opacity: 0.6,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: 5,
        shadowAngle: 315,
        shadowIntensity: 100,
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
      const isShift = e.evt.shiftKey; // ✅ detect Shift

      // ▢ Rectangle / Square
      if (previewShape.type === "rect") {
        let width = Math.abs(dx);
        let height = Math.abs(dy);

        // ✅ Hold Shift → perfect square
        if (isShift) {
          const size = Math.max(width, height);
          width = height = size;
        }

        const x = Math.min(startPos.current.x, pos.x);
        const y = Math.min(startPos.current.y, pos.y);

        setPreviewShape((prev) => ({
          ...prev,
          x,
          y,
          width,
          height,
        }));
        return;
      }

      // ⚪ Ellipse / Circle
      if (previewShape.type === "circle") {
        let rx = Math.abs(dx) / 2;
        let ry = Math.abs(dy) / 2;

        // ✅ Hold Shift → perfect circle
        if (isShift) {
          const r = Math.max(rx, ry);
          rx = ry = r;
        }

        const cx = startPos.current.x + dx / 2;
        const cy = startPos.current.y + dy / 2;

        setPreviewShape((prev) => ({
          ...prev,
          x: cx,
          y: cy,
          radiusX: rx,
          radiusY: ry,
        }));
        return;
      }

      // ➡️ Arrow (unchanged)
      if (previewShape.type === "arrow") {
        setPreviewShape((prev) => ({
          ...prev,
          points: [startPos.current.x, startPos.current.y, pos.x, pos.y],
        }));
        return;
      }
      // 🅰️ Drawing text box
      if (previewShape.type === "text") {
        const dx = pos.x - startPos.current.x;
        const dy = pos.y - startPos.current.y;

        const x = Math.min(startPos.current.x, pos.x);
        const y = Math.min(startPos.current.y, pos.y);
        const width = Math.abs(dx);
        const height = Math.abs(dy);

        setPreviewShape((prev) => ({
          ...prev,
          x,
          y,
          width,
          height,
        }));
        return;
      }
    }

    // 🟦 selection box (keep as is)
    if (selectionBox && selectionStart.current) {
      const x = Math.min(pos.x, selectionStart.current.x);
      const y = Math.min(pos.y, selectionStart.current.y);
      const width = Math.abs(pos.x - selectionStart.current.x);
      const height = Math.abs(pos.y - selectionStart.current.y);
      setSelectionBox({ x, y, width, height });
    }
  };

  const handleMouseUp = (e) => {
    const stage = e.target.getStage();

    // ✅ Handle selection box first
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
          if (!node) return false;
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
      setGuides({ vertical: [], horizontal: [], active: false });
      selectionStart.current = null;
      return;
    }

    // 🅰️ Finalize Text Shape (dragged out text box)
    if (previewShape && previewShape.type === "text") {
      isDrawing.current = false;

      const tiny = previewShape.width < 5 || previewShape.height < 5;
      if (!tiny) {
        const newText = {
          ...previewShape,
          id: `text-${Date.now()}`,
          isEditing: true,
          text: "A",
          draggable: true,
        };

        setShapes((prev) => [...prev, newText]);
        setSelectedIds([newText.id]);
        setPanelOpen(true);

        // 🔥 Auto open edit mode
        setTimeout(() => {
          const stage = stageRef.current?.getStage();
          const node = stage?.findOne(`#${newText.id}`);
          if (node) node.fire("dblclick");
        }, 50);
      }

      setPreviewShape(null);
      setSelectedTool(null);
      return;
    }

    // 🖌 Finalize other shapes
    if (isDrawing.current && previewShape) {
      isDrawing.current = false;

      const tiny =
        (previewShape.type === "rect" &&
          (previewShape.width < 2 || previewShape.height < 2)) ||
        (previewShape.type === "circle" &&
          (previewShape.radiusX < 1 || previewShape.radiusY < 1)) ||
        (previewShape.type === "arrow" && !previewShape.points);

      if (!tiny) {
        setShapes((prev) => [
          ...prev,
          {
            ...previewShape,
            id: `shape-${Date.now()}`,
            strokeWidth: previewShape.type === "arrow" ? 2 : 0,
          },
        ]);
      }

      setPreviewShape(null);
      setSelectedTool(null);
      const container = stageRef.current?.getStage()?.container();
      if (container) container.style.cursor = "default";
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
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds?.length
      ) {
        e.preventDefault(); // stop browser “back” on Backspace
        deleteSelected(selectedIds); // you already have this helper in PDFOverlayCanvas
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIds, deleteSelected]);

  // inside PDFOverlayCanvas
  useEffect(() => {
    function handleReset() {
      // stop any drawing in progress
      isDrawing.current = false;

      // clear UI state
      setPreviewShape(null);
      setSelectionBox(null);
      selectionStart.current = null;
      setSelectedIds([]);
      setPanelOpen(false);
      setGuides({ vertical: [], horizontal: [], active: false });

      // reset cursor to default
      const stage = trRef.current?.getStage();
      if (stage?.container()) stage.container().style.cursor = "default";

      // also make sure the tool is not active in this component (if you pass setter)
      if (typeof setSelectedTool === "function") setSelectedTool(null);
    }

    window.addEventListener("canvas:resetTool", handleReset);
    return () => window.removeEventListener("canvas:resetTool", handleReset);
  }, [setSelectedTool, setSelectedIds]);

  useEffect(() => {
    const stage = stageRef.current?.getStage();
    if (!stage) return;

    const handleDblClick = (e) => {
      const node = e.target;
      if (node.className !== "Text") return;

      const absPos = node.getAbsolutePosition();
      const stageBox = stage.container().getBoundingClientRect();

      // Create editable textarea overlay
      const textarea = document.createElement("textarea");
      textarea.value = node.text();
      textarea.style.position = "absolute";
      textarea.style.top = stageBox.top + absPos.y + "px";
      textarea.style.left = stageBox.left + absPos.x + "px";
      textarea.style.width = node.width() ? node.width() + "px" : "auto";
      textarea.style.height = node.height() ? node.height() + "px" : "auto";
      textarea.style.fontSize = node.fontSize() + "px";
      const scale = stage.scaleX();
      textarea.style.transform = `scale(${scale}) rotate(${node.rotation()}deg)`;
      textarea.style.transformOrigin = "left top";

      textarea.style.fontFamily = node.fontFamily();
      textarea.style.color = node.fill();
      textarea.style.background = "transparent";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.overflow = "hidden";
      textarea.style.resize = "none";
      textarea.style.lineHeight = "1.2";
      textarea.style.zIndex = 1000;
      textarea.style.whiteSpace = "pre-wrap";
      textarea.style.textAlign = node.align?.() ?? "left";
      textarea.style.fontWeight = node.fontStyle?.().includes("bold")
        ? "bold"
        : "normal";
      textarea.style.transformOrigin = "left top";
      textarea.style.transform = `rotate(${node.rotation()}deg)`;
      textarea.style.pointerEvents = "auto";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      });

      // Prevent dragging while editing
      node.draggable(false);

      const removeTextarea = () => {
        const newText = textarea.value;
        node.text(newText);
        textarea.remove();
        node.draggable(true);
        stage.batchDraw();

        // update the shape in React state
        setShapes((prev) =>
          prev.map((s) =>
            s.id === node.id() ? { ...s, text: newText, isEditing: false } : s
          )
        );
      };

      textarea.addEventListener("blur", removeTextarea);
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          textarea.blur();
        }
      });
    };

    stage.on("dblclick", handleDblClick);
    return () => stage.off("dblclick", handleDblClick);
  }, [setShapes]);

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
              // const isSelected = selectedIds.includes(shape.id);

              const intensity = (shape.shadowIntensity ?? 50) / 100; // 0–1 range
              const adjusted = Math.pow(intensity, 1.5);

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
                      perfectDrawEnabled={false}
                      strokeScaleEnabled={false}
                      opacity={shape.opacity ?? 1}
                      shadowColor={shape.shadowColor || "transparent"}
                      shadowBlur={
                        (shape.shadowRadius ?? 10) * (0.5 + adjusted * 1.5)
                      }
                      shadowOffset={{
                        x:
                          (shape.shadowOffset ?? 0) *
                          Math.cos(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                        y:
                          (shape.shadowOffset ?? 0) *
                          Math.sin(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                      }}
                      shadowOpacity={(shape.shadowOpacity ?? 0.5) * adjusted}
                      shadowEnabled={adjusted > 0.01}
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
                      onDragStart={(e) =>
                        handleShapeDuplicate({
                          e,
                          shapes,
                          selectedIds,
                          setShapes,
                          setSelectedIds,
                          isDuplicating,
                        })
                      }
                      onDragMove={(e) => {
                        const node = e.target;
                        const { x, y } = node.position();
                        const width =
                          (node.radiusX?.() || shape.radiusX || 50) * 2;
                        const height =
                          (node.radiusY?.() || shape.radiusY || 50) * 2;

                        // 🧠 Adjust for ellipse center — convert to top-left reference
                        const movingShape = {
                          id: shape.id,
                          x: x - width / 2,
                          y: y - height / 2,
                          width,
                          height,
                          type: shape.type,
                        };

                        const stage = node.getStage();
                        const g = getGuides(
                          movingShape,
                          shapes,
                          stage.width(),
                          stage.height(),
                          {
                            GAP: 6,
                            grid: Array.from(
                              { length: Math.floor(stage.width() / 50) },
                              (_, i) => i * 50
                            ),
                          }
                        );

                        // 🧲 apply magnet snap
                        if (g.snapPosition.x !== undefined)
                          node.x(g.snapPosition.x + width / 2);
                        if (g.snapPosition.y !== undefined)
                          node.y(g.snapPosition.y + height / 2);

                        const isSnapping =
                          g.vertical.length > 0 || g.horizontal.length > 0;
                        setGuides({
                          vertical: g.vertical,
                          horizontal: g.horizontal,
                          active: isSnapping,
                        });
                      }}
                      onDragEnd={(e) => {
                        if (!isDuplicating.current) {
                          const { x, y } = e.target.position();
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === shape.id ? { ...s, x, y } : s
                            )
                          );
                        }
                        isDuplicating.current = false;
                        setGuides({ vertical: [], horizontal: [] });
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
                      opacity={shape.opacity ?? 1}
                      perfectDrawEnabled={false}
                      strokeScaleEnabled={false}
                      shadowColor={shape.shadowColor || "transparent"}
                      shadowBlur={
                        (shape.shadowRadius ?? 10) * (0.5 + adjusted * 1.5)
                      }
                      shadowOffset={{
                        x:
                          (shape.shadowOffset ?? 0) *
                          Math.cos(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                        y:
                          (shape.shadowOffset ?? 0) *
                          Math.sin(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                      }}
                      shadowOpacity={(shape.shadowOpacity ?? 0.5) * adjusted}
                      shadowEnabled={adjusted > 0.01}
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
                      onDragStart={(e) =>
                        handleShapeDuplicate({
                          e,
                          shapes,
                          selectedIds,
                          setShapes,
                          setSelectedIds,
                          isDuplicating,
                        })
                      }
                      onDragMove={(e) => {
                        const node = e.target;
                        const stage = node.getStage();

                        // ✅ Get the real bounding box, rotation-aware
                        const clientRect = node.getClientRect({
                          relativeTo: stage,
                        });
                        const { x, y, width, height } = clientRect;

                        // 🧩 Represent the arrow as its bounding box for snapping
                        const movingShape = {
                          id: shape.id,
                          x,
                          y,
                          width,
                          height,
                          type: shape.type,
                        };

                        const g = getGuides(
                          movingShape,
                          shapes,
                          stage.width(),
                          stage.height(),
                          {
                            GAP: 6,
                            grid: Array.from(
                              { length: Math.floor(stage.width() / 50) },
                              (_, i) => i * 50
                            ),
                          }
                        );

                        // 🧲 Apply magnet snap — adjusted by rotation-safe offset
                        const offsetX = node.x() - x;
                        const offsetY = node.y() - y;

                        if (g.snapPosition.x !== undefined)
                          node.x(g.snapPosition.x + offsetX);
                        if (g.snapPosition.y !== undefined)
                          node.y(g.snapPosition.y + offsetY);

                        const isSnapping =
                          g.vertical.length > 0 || g.horizontal.length > 0;
                        setGuides({
                          vertical: g.vertical,
                          horizontal: g.horizontal,
                          active: isSnapping,
                        });
                      }}
                      onDragEnd={(e) => {
                        if (!isDuplicating.current) {
                          const { x, y } = e.target.position();
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === shape.id ? { ...s, x, y } : s
                            )
                          );
                        }
                        isDuplicating.current = false;
                        setGuides({ vertical: [], horizontal: [] });
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
                      fontSize={shape.fontSize ?? 20}
                      fontFamily={shape.fontFamily ?? "Inter"}
                      width={
                        shape.textMode === "box"
                          ? shape.width || undefined
                          : undefined
                      }
                      height={
                        shape.textMode === "box"
                          ? shape.height || undefined
                          : undefined
                      }
                      wrap={shape.textMode === "box" ? "word" : "none"}
                      align={shape.align || "left"}
                      ellipsis={shape.textMode === "line"}
                      shadowColor={shape.shadowColor || "transparent"}
                      shadowBlur={
                        (shape.shadowRadius ?? 10) * (0.5 + adjusted * 1.5)
                      }
                      shadowOffset={{
                        x:
                          (shape.shadowOffset ?? 0) *
                          Math.cos(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                        y:
                          (shape.shadowOffset ?? 0) *
                          Math.sin(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                      }}
                      shadowOpacity={(shape.shadowOpacity ?? 0.5) * adjusted}
                      shadowEnabled={adjusted > 0.01}
                      draggable={!shape.isEditing}
                      opacity={shape.opacity ?? 1}
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
                      onDragStart={(e) =>
                        handleShapeDuplicate({
                          e,
                          shapes,
                          selectedIds,
                          setShapes,
                          setSelectedIds,
                          isDuplicating,
                        })
                      }
                      onDragMove={(e) => {
                        const node = e.target;
                        const { x, y } = node.position();
                        const width =
                          node.width?.() ||
                          node.radiusX?.() * 2 ||
                          shape.width ||
                          0;
                        const height =
                          node.height?.() ||
                          node.radiusY?.() * 2 ||
                          shape.height ||
                          0;

                        // 🧩 use a different name to avoid shadowing
                        const movingShape = {
                          id: shape.id,
                          x,
                          y,
                          width,
                          height,
                          type: shape.type,
                        };

                        const stage = node.getStage();

                        const g = getGuides(
                          movingShape,
                          shapes,
                          stage.width(),
                          stage.height(),
                          {
                            GAP: 6,
                            grid: Array.from(
                              { length: Math.floor(stage.width() / 50) },
                              (_, i) => i * 50
                            ),
                          }
                        );

                        // 🧲 apply magnet snap
                        if (g.snapPosition.x !== undefined)
                          node.x(g.snapPosition.x);
                        if (g.snapPosition.y !== undefined)
                          node.y(g.snapPosition.y);

                        const isSnapping =
                          g.vertical.length > 0 || g.horizontal.length > 0;
                        setGuides({
                          vertical: g.vertical,
                          horizontal: g.horizontal,
                          active: isSnapping,
                        });
                      }}
                      onDragEnd={(e) => {
                        if (!isDuplicating.current) {
                          const { x, y } = e.target.position();
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === shape.id ? { ...s, x, y } : s
                            )
                          );
                        }
                        isDuplicating.current = false;
                        setGuides({ vertical: [], horizontal: [] });
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
                      opacity={shape.opacity ?? 1}
                      shadowColor={shape.shadowColor || "transparent"}
                      shadowBlur={
                        (shape.shadowRadius ?? 10) * (0.5 + adjusted * 1.5)
                      }
                      shadowOffset={{
                        x:
                          (shape.shadowOffset ?? 0) *
                          Math.cos(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                        y:
                          (shape.shadowOffset ?? 0) *
                          Math.sin(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                      }}
                      shadowOpacity={(shape.shadowOpacity ?? 0.5) * adjusted}
                      shadowEnabled={adjusted > 0.01}
                      draggable
                      onClick={(e) => {
                        const isShift = e.evt.shiftKey;
                        setSelectedIds((prev) =>
                          isShift ? [...prev, shape.id] : [shape.id]
                        );
                        setPanelOpen(true);
                      }}
                      onDragStart={(e) =>
                        handleShapeDuplicate({
                          e,
                          shapes,
                          selectedIds,
                          setShapes,
                          setSelectedIds,
                          isDuplicating,
                        })
                      }
                      onDragMove={(e) => {
                        const node = e.target;
                        const { x, y } = node.position();
                        const width =
                          node.width?.() ||
                          node.radiusX?.() * 2 ||
                          shape.width ||
                          0;
                        const height =
                          node.height?.() ||
                          node.radiusY?.() * 2 ||
                          shape.height ||
                          0;

                        // 🧩 use a different name to avoid shadowing
                        const movingShape = {
                          id: shape.id,
                          x,
                          y,
                          width,
                          height,
                          type: shape.type,
                        };

                        const stage = node.getStage();

                        const g = getGuides(
                          movingShape,
                          shapes,
                          stage.width(),
                          stage.height(),
                          {
                            GAP: 6,
                            grid: Array.from(
                              { length: Math.floor(stage.width() / 50) },
                              (_, i) => i * 50
                            ),
                          }
                        );

                        // 🧲 apply magnet snap
                        if (g.snapPosition.x !== undefined)
                          node.x(g.snapPosition.x);
                        if (g.snapPosition.y !== undefined)
                          node.y(g.snapPosition.y);

                        const isSnapping =
                          g.vertical.length > 0 || g.horizontal.length > 0;
                        setGuides({
                          vertical: g.vertical,
                          horizontal: g.horizontal,
                          active: isSnapping,
                        });
                      }}
                      onDragEnd={(e) => {
                        if (!isDuplicating.current) {
                          const { x, y } = e.target.position();
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === shape.id ? { ...s, x, y } : s
                            )
                          );
                        }
                        isDuplicating.current = false;
                        setGuides({ vertical: [], horizontal: [] });
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
                      opacity={shape.opacity ?? 1}
                      perfectDrawEnabled={false}
                      strokeScaleEnabled={false}
                      shadowColor={shape.shadowColor || "transparent"}
                      shadowBlur={
                        (shape.shadowRadius ?? 10) * (0.5 + adjusted * 1.5)
                      }
                      shadowOffset={{
                        x:
                          (shape.shadowOffset ?? 0) *
                          Math.cos(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                        y:
                          (shape.shadowOffset ?? 0) *
                          Math.sin(
                            ((shape.shadowAngle ?? 315) * Math.PI) / 180
                          ),
                      }}
                      shadowOpacity={(shape.shadowOpacity ?? 0.5) * adjusted}
                      shadowEnabled={adjusted > 0.01}
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
                      onDragStart={(e) =>
                        handleShapeDuplicate({
                          e,
                          shapes,
                          selectedIds,
                          setShapes,
                          setSelectedIds,
                          isDuplicating,
                        })
                      }
                      onDragMove={(e) => {
                        const node = e.target;
                        const { x, y } = node.position();
                        const width =
                          node.width?.() ||
                          node.radiusX?.() * 2 ||
                          shape.width ||
                          0;
                        const height =
                          node.height?.() ||
                          node.radiusY?.() * 2 ||
                          shape.height ||
                          0;

                        // 🧩 use a different name to avoid shadowing
                        const movingShape = {
                          id: shape.id,
                          x,
                          y,
                          width,
                          height,
                          type: shape.type,
                        };

                        const stage = node.getStage();

                        const g = getGuides(
                          movingShape,
                          shapes,
                          stage.width(),
                          stage.height(),
                          {
                            GAP: 6,
                            grid: Array.from(
                              { length: Math.floor(stage.width() / 50) },
                              (_, i) => i * 50
                            ),
                          }
                        );

                        // 🧲 apply magnet snap
                        if (g.snapPosition.x !== undefined)
                          node.x(g.snapPosition.x);
                        if (g.snapPosition.y !== undefined)
                          node.y(g.snapPosition.y);

                        const isSnapping =
                          g.vertical.length > 0 || g.horizontal.length > 0;
                        setGuides({
                          vertical: g.vertical,
                          horizontal: g.horizontal,
                          active: isSnapping,
                        });
                      }}
                      onDragEnd={(e) => {
                        if (!isDuplicating.current) {
                          const { x, y } = e.target.position();
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === shape.id ? { ...s, x, y } : s
                            )
                          );
                        }
                        isDuplicating.current = false;
                        setGuides({ vertical: [], horizontal: [] });
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
                listening={false}
              />
            )}
            {Array.from(
              { length: Math.floor(stageSize.width / 50) },
              (_, i) => (
                <Line
                  key={`grid-v-${i}`}
                  points={[i * 50, 0, i * 50, stageSize.height]}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={0.5}
                  listening={false}
                />
              )
            )}
            {Array.from(
              { length: Math.floor(stageSize.height / 50) },
              (_, i) => (
                <Line
                  key={`grid-h-${i}`}
                  points={[0, i * 50, stageSize.width, i * 50]}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={0.5}
                  listening={false}
                />
              )
            )}

            {[...new Set(guides.vertical.map((v) => Math.round(v)))].map(
              (x) => (
                <Line
                  key={`v-${x}`}
                  points={[x, 0, x, stageSize.height]}
                  stroke="#00b4ff"
                  strokeWidth={1}
                  dash={[4, 4]}
                  listening={false}
                />
              )
            )}

            {[...new Set(guides.horizontal.map((h) => Math.round(h)))].map(
              (y) => (
                <Line
                  key={`h-${y}`}
                  points={[0, y, stageSize.width, y]}
                  stroke="#00b4ff"
                  strokeWidth={1}
                  dash={[4, 4]}
                  listening={false}
                />
              )
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
