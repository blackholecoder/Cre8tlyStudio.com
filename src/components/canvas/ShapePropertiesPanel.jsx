import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";

export default function ShapePropertiesPanel({
  panelOpen,
  selectedIds = [],
  shapes,
  updateSelected,
  deleteSelected,
}) {
  useEffect(() => {
  window.onShapeDrawn = () => setSelectedTool(null);
  return () => (window.onShapeDrawn = null);
}, []);

  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
const selectedShape = selectedShapes.length === 1 ? selectedShapes[0] : null;
  const [isDragging, setIsDragging] = useState(false);

  // 🧭 Persistent position
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("cre8tly_panel_position");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  useEffect(() => {
    localStorage.setItem("cre8tly_panel_position", JSON.stringify(position));
  }, [position]);

  // Helper to disable drag on input focus
  const disableDrag = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const enableDrag = useCallback(() => {
    setIsDragging(false);
  }, []);


  return (
    <AnimatePresence>
      {panelOpen && selectedShape && (
        <motion.div
          drag={!isDragging} // 👈 allow drag only when not interacting
          dragMomentum={false}
          onDragEnd={(_, info) =>
            setPosition((prev) => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y,
            }))
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{ x: position.x, y: position.y }}
          className="absolute top-6 right-6 z-[9999] bg-[#111]/95 backdrop-blur-md border border-gray-700/60 rounded-xl p-4 flex flex-col gap-3 shadow-2xl w-72 cursor-grab active:cursor-grabbing select-none"

        >
          <h3 className="text-white font-semibold text-sm">Shape Properties</h3>

          {/* 🎨 Fill */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Fill</label>
            <div className="relative w-5 h-5">
              <input
                type="color"
                value={selectedShape.fill || "#000000"}
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onChange={(e) => updateSelected({ fill: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div
                className="w-full h-full rounded-full border border-gray-500 shadow-inner"
                style={{ backgroundColor: selectedShape.fill || "#000000" }}
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
                value={selectedShape.stroke || "#000000"}
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onChange={(e) => updateSelected({ stroke: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div
                className="w-full h-full rounded-full border border-gray-500 shadow-inner"
                style={{ backgroundColor: selectedShape.stroke || "#000000" }}
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
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onTouchStart={disableDrag}
                onTouchEnd={enableDrag}
                value={selectedShape.strokeWidth || 2}
                onChange={(e) =>
                  updateSelected({ strokeWidth: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-24"
              />
              <span className="text-[11px] text-gray-400 w-8 text-right">
                {(selectedShape.strokeWidth || 0).toFixed(1)}
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
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onTouchStart={disableDrag}
                onTouchEnd={enableDrag}
                value={selectedShape.opacity ?? 1}
                onChange={(e) =>
                  updateSelected({ opacity: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-24"
              />
              <span className="text-[11px] text-gray-400 w-8 text-right">
                {(selectedShape.opacity ?? 1).toFixed(2)}
              </span>
            </div>
          </div>

          {/* 🟣 Rounded Corners */}
          {selectedShape.type === "rect" && (
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300">Rounded Corners</label>
              <input
                type="checkbox"
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onChange={(e) => {
                  const isRounded = e.target.checked;
                  updateSelected({
                    cornerRadius: isRounded
                      ? Math.min(
                          selectedShape.width || 0,
                          selectedShape.height || 0
                        ) * 0.1
                      : 0,
                  });
                }}
                checked={!!selectedShape.cornerRadius}
                className="accent-blue w-4 h-4 cursor-pointer"
              />
            </div>
          )}

          {/* 🗑️ Delete */}
          <button
            onMouseDown={disableDrag}
            onMouseUp={enableDrag}
            onClick={() => deleteSelected(selectedIds)}
            className="self-end mt-2 p-1 bg-white/5 hover:bg-red-700/20 text-white rounded-md flex items-center justify-center transition-all duration-150"
            title="Delete shape"
          >
            <Trash2 className="text-red-500" size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
