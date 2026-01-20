import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

function PropertyRow({ label, children }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
      <label className="text-xs text-gray-300 leading-none">{label}</label>
      {children}
    </div>
  );
}

function ColorSwatch({ value, onChange, onMouseDown, onMouseUp }) {
  return (
    <div className="relative w-8 h-8 rounded-md bg-[#1a1a1a] border border-gray-700">
      <input
        type="color"
        value={value}
        onChange={onChange}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div
        className="absolute inset-0 rounded-md"
        style={{ backgroundColor: value }}
      />
    </div>
  );
}

export default function ShapePropertiesPanel({
  panelOpen,
  selectedIds = [],
  shapes,
  updateSelected,
  deleteSelected,
}) {
  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
  const selectedShape = selectedShapes.length === 1 ? selectedShapes[0] : null;

  const panelRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const disableDrag = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const enableDrag = useCallback(() => setIsDragging(false), []);

  if (selectedShape?.type === "image") {
    return (
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            ref={panelRef}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 right-0 h-screen w-96 bg-[#111]/95 backdrop-blur-md border-l border-gray-700/60 p-5 flex flex-col gap-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] overflow-y-auto z-[9999] properties-panel"
          >
            <h3 className="text-white font-semibold text-sm mb-1 sticky top-0 bg-[#111]/95 py-1 z-10">
              Image Properties
            </h3>

            {/* Size */}
            <div className="flex flex-col gap-2 mt-3">
              <label className="text-xs text-gray-300">Width</label>
              <input
                type="range"
                min="10"
                max="2000"
                step="1"
                value={selectedShape.width ?? 200}
                onChange={(e) =>
                  updateSelected({ width: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
              <input
                type="number"
                value={selectedShape.width ?? 200}
                onChange={(e) =>
                  updateSelected({ width: parseFloat(e.target.value) || 200 })
                }
                className="w-full bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1 text-center"
              />

              <label className="text-xs text-gray-300 mt-3">Height</label>
              <input
                type="range"
                min="10"
                max="2000"
                step="1"
                value={selectedShape.height ?? 200}
                onChange={(e) =>
                  updateSelected({ height: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
              <input
                type="number"
                value={selectedShape.height ?? 200}
                onChange={(e) =>
                  updateSelected({ height: parseFloat(e.target.value) || 200 })
                }
                className="w-full bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1 text-center"
              />
            </div>

            {/* Rotation */}
            <div className="flex flex-col gap-2 mt-3">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Rotation</label>
                <span className="text-[11px] text-gray-400">
                  {Math.round(selectedShape.rotation ?? 0)}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={selectedShape.rotation ?? 0}
                onChange={(e) =>
                  updateSelected({ rotation: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Opacity */}
            <div className="flex flex-col gap-2 mt-3">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Opacity</label>
                <span className="text-[11px] text-gray-400">
                  {(selectedShape.opacity ?? 1).toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedShape.opacity ?? 1}
                onChange={(e) =>
                  updateSelected({ opacity: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Corner Radius */}
            <div className="flex flex-col gap-2 mt-3">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Corner Radius</label>
                <span className="text-[11px] text-gray-400">
                  {selectedShape.cornerRadius ?? 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={selectedShape.cornerRadius ?? 0}
                onChange={(e) =>
                  updateSelected({ cornerRadius: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Tint */}
            <PropertyRow label="Tint">
              <ColorSwatch
                value={selectedShape.tint || "#ffffff"}
                onChange={(e) => updateSelected({ tint: e.target.value })}
              />
            </PropertyRow>

            {/* Stroke */}
            <hr className="border-gray-700/40 my-2" />
            <PropertyRow label="Stroke">
              <ColorSwatch
                value={selectedShape.stroke || "#000000"}
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onChange={(e) => updateSelected({ stroke: e.target.value })}
              />
            </PropertyRow>

            <hr className="border-gray-700/40 my-2" />
            {/* Stroke Width*/}
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Width</label>
                <span className="text-[11px] text-gray-400 w-8 text-right">
                  {(selectedShape.strokeWidth || 0).toFixed(1)}
                </span>
              </div>
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
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Shadow */}
            <hr className="border-gray-700/40 my-2" />
            <h4 className="text-white text-sm font-semibold">Shadow</h4>

            {/* Blend Mode */}
            <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
              <label className="text-xs text-gray-300">Blend Mode</label>
              <select
                value={selectedShape.shadowBlend || "multiply"}
                onChange={(e) =>
                  updateSelected({ shadowBlend: e.target.value })
                }
                className="bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1"
              >
                <option value="multiply">Multiply</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
                <option value="hard-light">Hard Light</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            {/* Opacity */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Opacity</label>
                <span className="text-[11px] text-gray-400">
                  {Math.round((selectedShape.shadowOpacity ?? 0.5) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedShape.shadowOpacity ?? 0.5}
                onChange={(e) =>
                  updateSelected({ shadowOpacity: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Radius */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Radius</label>
                <span className="text-[11px] text-gray-400">
                  {selectedShape.shadowRadius ?? 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={selectedShape.shadowRadius ?? 0}
                onChange={(e) =>
                  updateSelected({ shadowRadius: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Offset */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Offset</label>
                <span className="text-[11px] text-gray-400">
                  {selectedShape.shadowOffset ?? 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={selectedShape.shadowOffset ?? 0}
                onChange={(e) =>
                  updateSelected({ shadowOffset: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>

            {/* Color */}
            <PropertyRow label="Color">
              <ColorSwatch
                value={selectedShape.shadowColor || "#000000"}
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onChange={(e) =>
                  updateSelected({ shadowColor: e.target.value })
                }
              />
            </PropertyRow>

            {/* Angle Dial */}
            <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
              <PropertyRow label="Angle">
                <span className="text-[11px] text-gray-400">
                  {Math.round(selectedShape.shadowAngle ?? 315)}°
                </span>
              </PropertyRow>
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <div className="relative w-16 h-16">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-gray-500 cursor-pointer select-none"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      disableDrag(e);

                      const handleMove = (moveEvent) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const cx = rect.left + rect.width / 2;
                        const cy = rect.top + rect.height / 2;

                        // Compute angle based on mouse position
                        const dx = moveEvent.clientX - cx;
                        const dy = moveEvent.clientY - cy;

                        // Convert radians → degrees (0° = up)
                        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
                        const normalized = ((angle % 360) + 360) % 360;

                        // Update immediately for live feedback
                        updateSelected({ shadowAngle: normalized });
                      };

                      const handleUp = () => {
                        enableDrag();
                        window.removeEventListener("mousemove", handleMove);
                        window.removeEventListener("mouseup", handleUp);
                      };

                      // Attach listeners globally
                      window.addEventListener("mousemove", handleMove);
                      window.addEventListener("mouseup", handleUp);
                    }}
                  >
                    {/* Dial circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Needle */}
                    <line
                      x1="50"
                      y1="50"
                      x2={
                        50 +
                        40 *
                          Math.sin(
                            ((selectedShape.shadowAngle ?? 315) * Math.PI) / 180
                          )
                      }
                      y2={
                        50 -
                        40 *
                          Math.cos(
                            ((selectedShape.shadowAngle ?? 315) * Math.PI) / 180
                          )
                      }
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Center angle label */}
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300 font-medium">
                    {Math.round(selectedShape.shadowAngle ?? 315)}°
                  </div>
                </div>

                {/* Numeric input fallback */}
                <input
                  type="number"
                  min="0"
                  max="360"
                  step="1"
                  value={Math.round(selectedShape.shadowAngle ?? 315)}
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onChange={(e) =>
                    updateSelected({
                      shadowAngle: Number(e.target.value) || 0, // ✅ stays shadowAngle
                    })
                  }
                  className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-md text-gray-300 text-xs text-center px-2 py-1"
                />
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteSelected(selectedIds)}
              className="self-end mt-6 p-1.5 bg-white/5 hover:bg-red-700/20 text-white rounded-md flex items-center justify-center transition-all duration-150"
              title="Delete image"
            >
              <Trash2 className="text-red-500" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {panelOpen && selectedShape && (
        <motion.div
          ref={panelRef}
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-0 right-0 h-screen w-96 bg-[#111]/95 backdrop-blur-md border-l border-gray-700/60 p-5 flex flex-col gap-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] overflow-y-auto z-[9999] select-none properties-panel"
        >
          <h3 className="text-white font-semibold text-sm mb-1 sticky top-0 bg-[#111]/95 py-1 z-10">
            Shape Properties
          </h3>

          {/* 🎨 Fill */}

          <PropertyRow label="Fill">
            <ColorSwatch
              value={selectedShape.fill || "#000000"}
              onMouseDown={disableDrag}
              onMouseUp={enableDrag}
              onChange={(e) => updateSelected({ fill: e.target.value })}
            />
          </PropertyRow>

          {/* 🎨 Gradient Fill */}
          {selectedShape && (
            <div className="flex flex-col gap-2 mt-3 border-t border-gray-700/40 pt-3">
              <PropertyRow label="Fill Type">
                <select
                  value={selectedShape.fillType || "solid"}
                  onChange={(e) => updateSelected({ fillType: e.target.value })}
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  className="bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1"
                >
                  <option value="solid">Solid</option>
                  <option value="gradient">Gradient</option>
                </select>
              </PropertyRow>

              {selectedShape.fillType === "gradient" && (
                <>
                  {/* From Color */}
                  <PropertyRow label="From">
                    <ColorSwatch
                      value={selectedShape.gradient?.from || "#00b4ff"}
                      onMouseDown={disableDrag}
                      onMouseUp={enableDrag}
                      onChange={(e) =>
                        updateSelected({
                          gradient: {
                            ...selectedShape.gradient,
                            from: e.target.value,
                          },
                        })
                      }
                    />
                  </PropertyRow>

                  {/* To Color */}
                  <PropertyRow label="To">
                    <ColorSwatch
                      value={selectedShape.gradient?.to || "#ff00ff"}
                      onMouseDown={disableDrag}
                      onMouseUp={enableDrag}
                      onChange={(e) =>
                        updateSelected({
                          gradient: {
                            ...selectedShape.gradient,
                            to: e.target.value,
                          },
                        })
                      }
                    />
                  </PropertyRow>

                  {/* Angle */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                      <label className="text-xs text-gray-300">Angle</label>
                      <span className="text-[11px] text-gray-400">
                        {Math.round(selectedShape.gradient?.angle ?? 0)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      onMouseDown={disableDrag}
                      onMouseUp={enableDrag}
                      value={selectedShape.gradient?.angle ?? 0}
                      onChange={(e) =>
                        updateSelected({
                          gradient: {
                            ...selectedShape.gradient,
                            angle: parseInt(e.target.value),
                          },
                        })
                      }
                      className="cre8tly-slider w-full"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* 🧠 Stroke */}

          <hr className="border-gray-700/40 my-2" />
          <PropertyRow label="Stroke">
            <ColorSwatch
              value={selectedShape.stroke || "#000000"}
              onMouseDown={disableDrag}
              onMouseUp={enableDrag}
              onChange={(e) => updateSelected({ stroke: e.target.value })}
            />
          </PropertyRow>
          {/* Stroke Width */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
              <label className="text-xs text-gray-300">Width</label>
              <span className="text-[11px] text-gray-400 w-8 text-right">
                {(selectedShape.strokeWidth || 0).toFixed(1)}
              </span>
            </div>
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
              className="cre8tly-slider w-full"
            />
          </div>

          {/* 🫧 Opacity */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
              <label className="text-xs text-gray-300">Opacity</label>
              <span className="text-[11px] text-gray-400 w-8 text-right">
                {(selectedShape.opacity ?? 1).toFixed(2)}
              </span>
            </div>
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
              className="cre8tly-slider w-full"
            />
          </div>

          {selectedShape.type === "text" && (
            <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px] mt-2">
              <label className="text-xs text-gray-300">Word Wrap</label>
              <button
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onClick={() =>
                  updateSelected({
                    textMode: selectedShape.textMode === "box" ? "line" : "box",
                  })
                }
                className={`px-2 py-1 text-xs rounded-md transition-all duration-150 ${
                  selectedShape.textMode === "box"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {selectedShape.textMode === "box" ? "Box" : "Line"}
              </button>
            </div>
          )}

          {selectedShape.type === "text" && (
            <>
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px] mt-2">
                <label className="text-xs text-gray-300">Font Size</label>
                <input
                  type="number"
                  value={selectedShape.fontSize || 20}
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onChange={(e) =>
                    updateSelected({ fontSize: parseFloat(e.target.value) })
                  }
                  className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-md text-gray-300 text-xs text-center px-2 py-1"
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px] mt-2">
                <label className="text-xs text-gray-300">Font</label>
                <select
                  value={selectedShape.fontFamily || "Inter"}
                  onChange={(e) =>
                    updateSelected({ fontFamily: e.target.value })
                  }
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  className="bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1"
                >
                  <option value="Inter">Inter</option>
                  <option value="Palanquin">Palanquin</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Cormorant">Cormorant</option>
                  <option value="Ephesis">Ephesis</option>
                </select>
              </div>
            </>
          )}

          {/* 🟣 Corners */}
          {selectedShape.type === "rect" && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Corners</label>
                <input
                  type="number"
                  min="0"
                  max={
                    Math.min(
                      selectedShape.width || 0,
                      selectedShape.height || 0
                    ) / 2
                  }
                  step="0.1"
                  value={selectedShape.cornerRadius?.toFixed(1) || 0}
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onChange={(e) =>
                    updateSelected({ cornerRadius: parseFloat(e.target.value) })
                  }
                  className="w-14 bg-[#1a1a1a] border border-gray-700 rounded-md text-gray-300 text-xs text-right px-2 py-1"
                />
              </div>
              <input
                type="range"
                min="0"
                max={
                  Math.min(
                    selectedShape.width || 0,
                    selectedShape.height || 0
                  ) / 2
                }
                step="0.1"
                value={selectedShape.cornerRadius || 0}
                onMouseDown={disableDrag}
                onMouseUp={enableDrag}
                onTouchStart={disableDrag}
                onTouchEnd={enableDrag}
                onChange={(e) =>
                  updateSelected({ cornerRadius: parseFloat(e.target.value) })
                }
                className="cre8tly-slider w-full"
              />
            </div>
          )}

          {/* 🌗 Shadow Tool */}
          {selectedShape && (
            <div className="flex flex-col gap-3 mt-4 border-t border-gray-700/40 pt-3">
              <h4 className="text-white text-sm font-semibold">Shadow</h4>

              {/* Blend Mode */}
              <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                <label className="text-xs text-gray-300">Blend mode</label>
                <select
                  value={selectedShape.shadowBlend || "multiply"}
                  onChange={(e) =>
                    updateSelected({ shadowBlend: e.target.value })
                  }
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  className="bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="multiply">Multiply</option>
                  <option value="overlay">Overlay</option>
                  <option value="soft-light">Soft Light</option>
                  <option value="hard-light">Hard Light</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              {/* Opacity */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                  <label className="text-xs text-gray-300">Opacity</label>
                  <span className="text-[11px] text-gray-400 w-8 text-right">
                    {Math.round((selectedShape.shadowOpacity ?? 0.5) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onTouchStart={disableDrag}
                  onTouchEnd={enableDrag}
                  value={selectedShape.shadowOpacity ?? 0.5}
                  onChange={(e) =>
                    updateSelected({
                      shadowOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="cre8tly-slider w-full"
                />
              </div>

              {/* Radius */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                  <label className="text-xs text-gray-300">Radius</label>
                  <span className="text-[11px] text-gray-400 w-8 text-right">
                    {selectedShape.shadowRadius ?? 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onTouchStart={disableDrag}
                  onTouchEnd={enableDrag}
                  value={selectedShape.shadowRadius ?? 0}
                  onChange={(e) =>
                    updateSelected({ shadowRadius: parseFloat(e.target.value) })
                  }
                  className="cre8tly-slider w-full"
                />
              </div>

              {/* Offset */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                  <label className="text-xs text-gray-300">Offset</label>
                  <span className="text-[11px] text-gray-400 w-8 text-right">
                    {selectedShape.shadowOffset ?? 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onTouchStart={disableDrag}
                  onTouchEnd={enableDrag}
                  value={selectedShape.shadowOffset ?? 0}
                  onChange={(e) =>
                    updateSelected({ shadowOffset: parseFloat(e.target.value) })
                  }
                  className="cre8tly-slider w-full"
                />
              </div>

              {/* Intensity */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                  <label className="text-xs text-gray-300">Intensity</label>
                  <span className="text-[11px] text-gray-400 w-8 text-right">
                    {selectedShape.shadowIntensity ?? 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onTouchStart={disableDrag}
                  onTouchEnd={enableDrag}
                  value={selectedShape.shadowIntensity ?? 0}
                  onChange={(e) =>
                    updateSelected({
                      shadowIntensity: parseFloat(e.target.value),
                    })
                  }
                  className="cre8tly-slider w-full"
                />
              </div>

              {/* Color */}

              <PropertyRow label="Color">
                <ColorSwatch
                  value={selectedShape.shadowColor || "#000000"}
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  onChange={(e) =>
                    updateSelected({ shadowColor: e.target.value })
                  }
                />
              </PropertyRow>
              {/* Angle Dial */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300">Angle</label>
                <div className="grid grid-cols-[1fr_auto] items-center min-h-[36px]">
                  <div
                    className="relative w-16 h-16"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-gray-500 cursor-pointer select-none"
                      onMouseDown={(e) => {
                        disableDrag();

                        const handleMove = (moveEvent) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const cx = rect.left + rect.width / 2;
                          const cy = rect.top + rect.height / 2;

                          // Compute angle based on mouse position
                          const dx = moveEvent.clientX - cx;
                          const dy = moveEvent.clientY - cy;

                          // Convert radians → degrees (0° = up)
                          const angle =
                            (Math.atan2(dy, dx) * 180) / Math.PI + 90;
                          const normalized = ((angle % 360) + 360) % 360;

                          // Update immediately for live feedback
                          updateSelected({ shadowAngle: normalized });
                        };

                        const handleUp = () => {
                          enableDrag();
                          window.removeEventListener("mousemove", handleMove);
                          window.removeEventListener("mouseup", handleUp);
                        };

                        // Attach listeners globally
                        window.addEventListener("mousemove", handleMove);
                        window.addEventListener("mouseup", handleUp);
                      }}
                    >
                      {/* Dial circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="48"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Needle */}
                      <line
                        x1="50"
                        y1="50"
                        x2={
                          50 +
                          40 *
                            Math.sin(
                              ((selectedShape.shadowAngle ?? 315) * Math.PI) /
                                180
                            )
                        }
                        y2={
                          50 -
                          40 *
                            Math.cos(
                              ((selectedShape.shadowAngle ?? 315) * Math.PI) /
                                180
                            )
                        }
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Center angle label */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300 font-medium">
                      {Math.round(selectedShape.shadowAngle ?? 315)}°
                    </div>
                  </div>

                  {/* Numeric input fallback */}
                  <input
                    type="number"
                    min="0"
                    max="360"
                    step="1"
                    value={Math.round(selectedShape.shadowAngle ?? 315)}
                    onMouseDown={disableDrag}
                    onMouseUp={enableDrag}
                    onChange={(e) =>
                      updateSelected({
                        shadowAngle: Number(e.target.value) || 0, // ✅ stays shadowAngle
                      })
                    }
                    className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-md text-gray-300 text-xs text-center px-2 py-1"
                  />
                </div>
              </div>

              {/* Knockout */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!selectedShape.shadowKnockout}
                  onChange={(e) =>
                    updateSelected({ shadowKnockout: e.target.checked })
                  }
                  onMouseDown={disableDrag}
                  onMouseUp={enableDrag}
                  className="accent-blue-500 w-4 h-4"
                />
                <label className="text-xs text-gray-300">
                  Fill knocks out shadow
                </label>
              </div>
            </div>
          )}

          {/* 🗑️ Delete */}
          <button
            onMouseDown={disableDrag}
            onMouseUp={enableDrag}
            onClick={() => deleteSelected(selectedIds)}
            className="self-end mt-4 p-1.5 bg-white/5 hover:bg-red-700/20 text-white rounded-md flex items-center justify-center transition-all duration-150"
            title="Delete shape"
          >
            <Trash2 className="text-red-500" size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
