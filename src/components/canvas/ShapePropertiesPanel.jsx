// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect, useCallback } from "react";
// import { Trash2 } from "lucide-react";

// export default function ShapePropertiesPanel({
//   panelOpen,
//   selectedIds = [],
//   shapes,
//   updateSelected,
//   deleteSelected,
// }) {
//   useEffect(() => {
//     window.onShapeDrawn = () => setSelectedTool(null);
//     return () => (window.onShapeDrawn = null);
//   }, []);

//   const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
//   const selectedShape = selectedShapes.length === 1 ? selectedShapes[0] : null;
//   const [isDragging, setIsDragging] = useState(false);

//   // 🧭 Persistent position
//   const [position, setPosition] = useState(() => {
//     const saved = localStorage.getItem("cre8tly_panel_position");
//     return saved ? JSON.parse(saved) : { x: 0, y: 0 };
//   });

//   useEffect(() => {
//     localStorage.setItem("cre8tly_panel_position", JSON.stringify(position));
//   }, [position]);

//   // Helper to disable drag on input focus
//   const disableDrag = useCallback((e) => {
//     e.stopPropagation();
//     setIsDragging(true);
//   }, []);

//   const enableDrag = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   return (
//     <AnimatePresence>
//       {panelOpen && selectedShape && (
//         <motion.div
//           // drag={!isDragging}
//           // dragMomentum={false}
//           // onDragEnd={(_, info) =>
//           //   setPosition((prev) => ({
//           //     x: prev.x + info.offset.x,
//           //     y: prev.y + info.offset.y,
//           //   }))
//           // }
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           style={{ x: position.x, y: position.y }}
//           className="absolute top-6 right-6 z-[9999] bg-[#111]/95 backdrop-blur-md border border-gray-700/60 rounded-xl p-5 flex flex-col gap-4 shadow-2xl w-72 cursor-grab active:cursor-grabbing select-none"
//         >
//           <h3 className="text-white font-semibold text-sm mb-1">
//             Shape Properties
//           </h3>

//           {/* 🎨 Fill */}
//           <div className="flex items-center justify-between">
//             <label className="text-xs text-gray-300">Fill</label>
//             <div className="relative w-5 h-5">
//               <input
//                 type="color"
//                 value={selectedShape.fill || "#000000"}
//                 onMouseDown={disableDrag}
//                 onMouseUp={enableDrag}
//                 onChange={(e) => updateSelected({ fill: e.target.value })}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//               <div
//                 className="w-full h-full rounded-full border border-gray-500 shadow-inner"
//                 style={{ backgroundColor: selectedShape.fill || "#000000" }}
//               />
//             </div>
//           </div>

//           <hr className="border-gray-700/40" />

//           {/* 🧠 Stroke */}
//           <div className="flex items-center justify-between">
//             <label className="text-xs text-gray-300">Stroke</label>
//             <div className="relative w-5 h-5">
//               <input
//                 type="color"
//                 value={selectedShape.stroke || "#000000"}
//                 onMouseDown={disableDrag}
//                 onMouseUp={enableDrag}
//                 onChange={(e) => updateSelected({ stroke: e.target.value })}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//               <div
//                 className="w-full h-full rounded-full border border-gray-500 shadow-inner"
//                 style={{ backgroundColor: selectedShape.stroke || "#000000" }}
//               />
//             </div>
//           </div>

//           <hr className="border-gray-700/40" />

//           {/* Stroke Width */}
//           <div className="flex flex-col gap-2 mt-2">
//             <div className="flex items-center justify-between">
//               <label className="text-xs text-gray-300">Width</label>
//               <span className="text-[11px] text-gray-400 w-8 text-right">
//                 {(selectedShape.strokeWidth || 0).toFixed(1)}
//               </span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               step="0.01"
//               onMouseDown={disableDrag}
//               onMouseUp={enableDrag}
//               onTouchStart={disableDrag}
//               onTouchEnd={enableDrag}
//               value={selectedShape.strokeWidth || 2}
//               onChange={(e) =>
//                 updateSelected({ strokeWidth: parseFloat(e.target.value) })
//               }
//               className="cre8tly-slider w-full"
//             />
//           </div>

//           {/* 🫧 Opacity */}
//           <div className="flex flex-col gap-2 mt-2">
//             <div className="flex items-center justify-between">
//               <label className="text-xs text-gray-300">Opacity</label>
//               <span className="text-[11px] text-gray-400 w-8 text-right">
//                 {(selectedShape.opacity ?? 1).toFixed(2)}
//               </span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="1"
//               step="0.01"
//               onMouseDown={disableDrag}
//               onMouseUp={enableDrag}
//               onTouchStart={disableDrag}
//               onTouchEnd={enableDrag}
//               value={selectedShape.opacity ?? 1}
//               onChange={(e) =>
//                 updateSelected({ opacity: parseFloat(e.target.value) })
//               }
//               className="cre8tly-slider w-full"
//             />
//           </div>

//           {/* 🟣 Corners */}
//           {selectedShape.type === "rect" && (
//             <div className="flex flex-col gap-2 mt-2">
//               <div className="flex items-center justify-between">
//                 <label className="text-xs text-gray-300">Corners</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max={
//                     Math.min(
//                       selectedShape.width || 0,
//                       selectedShape.height || 0
//                     ) / 2
//                   }
//                   step="0.1"
//                   value={selectedShape.cornerRadius?.toFixed(1) || 0}
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   onChange={(e) =>
//                     updateSelected({ cornerRadius: parseFloat(e.target.value) })
//                   }
//                   className="w-14 bg-[#1a1a1a] border border-gray-700 rounded-md text-gray-300 text-xs text-right px-2 py-1"
//                 />
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max={
//                   Math.min(
//                     selectedShape.width || 0,
//                     selectedShape.height || 0
//                   ) / 2
//                 }
//                 step="0.1"
//                 value={selectedShape.cornerRadius || 0}
//                 onMouseDown={disableDrag}
//                 onMouseUp={enableDrag}
//                 onTouchStart={disableDrag}
//                 onTouchEnd={enableDrag}
//                 onChange={(e) =>
//                   updateSelected({ cornerRadius: parseFloat(e.target.value) })
//                 }
//                 className="cre8tly-slider w-full"
//               />
//             </div>
//           )}
//           {/* 🌗 Shadow Tool */}
//           {selectedShape && (
//             <div className="flex flex-col gap-3 mt-4 border-t border-gray-700/40 pt-3">
//               <h4 className="text-white text-sm font-semibold">Shadow</h4>

//               {/* Blend Mode */}
//               <div className="flex items-center justify-between">
//                 <label className="text-xs text-gray-300">Blend mode</label>
//                 <select
//                   value={selectedShape.shadowBlend || "multiply"}
//                   onChange={(e) =>
//                     updateSelected({ shadowBlend: e.target.value })
//                   }
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   className="bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 >
//                   <option value="multiply">Multiply</option>
//                   <option value="overlay">Overlay</option>
//                   <option value="soft-light">Soft Light</option>
//                   <option value="hard-light">Hard Light</option>
//                   <option value="normal">Normal</option>
//                 </select>
//               </div>

//               {/* Opacity */}
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-xs text-gray-300">Opacity</label>
//                   <span className="text-[11px] text-gray-400 w-8 text-right">
//                     {Math.round((selectedShape.shadowOpacity ?? 0.5) * 100)}%
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.01"
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   onTouchStart={disableDrag}
//                   onTouchEnd={enableDrag}
//                   value={selectedShape.shadowOpacity ?? 0.5}
//                   onChange={(e) =>
//                     updateSelected({
//                       shadowOpacity: parseFloat(e.target.value),
//                     })
//                   }
//                   className="cre8tly-slider w-full"
//                 />
//               </div>

//               {/* Radius */}
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-xs text-gray-300">Radius</label>
//                   <span className="text-[11px] text-gray-400 w-8 text-right">
//                     {selectedShape.shadowRadius ?? 0}px
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   step="1"
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   onTouchStart={disableDrag}
//                   onTouchEnd={enableDrag}
//                   value={selectedShape.shadowRadius ?? 0}
//                   onChange={(e) =>
//                     updateSelected({ shadowRadius: parseInt(e.target.value) })
//                   }
//                   className="cre8tly-slider w-full"
//                 />
//               </div>

//               {/* Offset */}
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-xs text-gray-300">Offset</label>
//                   <span className="text-[11px] text-gray-400 w-8 text-right">
//                     {selectedShape.shadowOffset ?? 0}px
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   step="1"
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   onTouchStart={disableDrag}
//                   onTouchEnd={enableDrag}
//                   value={selectedShape.shadowOffset ?? 0}
//                   onChange={(e) =>
//                     updateSelected({ shadowOffset: parseInt(e.target.value) })
//                   }
//                   className="cre8tly-slider w-full"
//                 />
//               </div>

//               {/* Intensity */}
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-xs text-gray-300">Intensity</label>
//                   <span className="text-[11px] text-gray-400 w-8 text-right">
//                     {selectedShape.shadowIntensity ?? 0}%
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   step="1"
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   onTouchStart={disableDrag}
//                   onTouchEnd={enableDrag}
//                   value={selectedShape.shadowIntensity ?? 0}
//                   onChange={(e) =>
//                     updateSelected({
//                       shadowIntensity: parseInt(e.target.value),
//                     })
//                   }
//                   className="cre8tly-slider w-full"
//                 />
//               </div>

//               {/* Color */}
//               <div className="flex items-center justify-between">
//                 <label className="text-xs text-gray-300">Color</label>
//                 <div className="relative w-5 h-5">
//                   <input
//                     type="color"
//                     value={selectedShape.shadowColor || "#000000"}
//                     onMouseDown={disableDrag}
//                     onMouseUp={enableDrag}
//                     onChange={(e) =>
//                       updateSelected({ shadowColor: e.target.value })
//                     }
//                     className="absolute inset-0 opacity-0 cursor-pointer"
//                   />
//                   <div
//                     className="w-full h-full rounded-full border border-gray-500 shadow-inner"
//                     style={{
//                       backgroundColor: selectedShape.shadowColor || "#000000",
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Angle */}
//               <div className="flex flex-col gap-2">
//                 <label className="text-xs text-gray-300">Angle</label>
//                 <div className="flex items-center justify-between">
//                   {/* Dial */}
//                   <div className="relative w-16 h-16">
//                     <svg
//                       viewBox="0 0 100 100"
//                       className="w-full h-full text-gray-500 cursor-pointer select-none"
//                       onMouseDown={(e) => {
//                         disableDrag();

//                         const handleMove = (moveEvent) => {
//                           const rect = e.currentTarget.getBoundingClientRect();
//                           const cx = rect.left + rect.width / 2;
//                           const cy = rect.top + rect.height / 2;
//                           const dx = moveEvent.clientX - cx;
//                           const dy = moveEvent.clientY - cy;
//                           const angle =
//                             (Math.atan2(dy, dx) * 180) / Math.PI + 90;
//                           const normalized = (angle + 360) % 360;
//                           updateSelected({ shadowAngle: normalized });
//                         };

//                         const handleUp = () => {
//                           enableDrag();
//                           window.removeEventListener("mousemove", handleMove);
//                           window.removeEventListener("mouseup", handleUp);
//                         };

//                         window.addEventListener("mousemove", handleMove);
//                         window.addEventListener("mouseup", handleUp);
//                       }}
//                     >
//                       {/* Outer circle */}
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="48"
//                         stroke="rgba(255,255,255,0.1)"
//                         strokeWidth="3"
//                         fill="none"
//                       />
//                       {/* Indicator line */}
//                       <line
//                         x1="50"
//                         y1="50"
//                         x2={
//                           50 +
//                           40 *
//                             Math.sin(
//                               ((selectedShape.shadowAngle ?? 315) * Math.PI) /
//                                 180
//                             )
//                         }
//                         y2={
//                           50 -
//                           40 *
//                             Math.cos(
//                               ((selectedShape.shadowAngle ?? 315) * Math.PI) /
//                                 180
//                             )
//                         }
//                         stroke="#3b82f6"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                       />
//                     </svg>

//                     {/* Angle text overlay */}
//                     <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300 font-medium">
//                       {Math.round(selectedShape.shadowAngle ?? 315)}°
//                     </div>
//                   </div>

//                   {/* Manual numeric input */}
//                   <input
//                     type="number"
//                     min="0"
//                     max="360"
//                     step="1"
//                     value={Math.round(selectedShape.shadowAngle ?? 315)}
//                     onMouseDown={disableDrag}
//                     onMouseUp={enableDrag}
//                     onChange={(e) =>
//                       updateSelected({
//                         shadowAngle: parseFloat(e.target.value),
//                       })
//                     }
//                     className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-md text-gray-300 text-xs text-center px-2 py-1"
//                   />
//                 </div>
//               </div>

//               {/* Fill knocks out shadow */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={!!selectedShape.shadowKnockout}
//                   onChange={(e) =>
//                     updateSelected({ shadowKnockout: e.target.checked })
//                   }
//                   onMouseDown={disableDrag}
//                   onMouseUp={enableDrag}
//                   className="accent-blue-500 w-4 h-4"
//                 />
//                 <label className="text-xs text-gray-300">
//                   Fill knocks out shadow
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* 🗑️ Delete */}
//           <button
//             onMouseDown={disableDrag}
//             onMouseUp={enableDrag}
//             onClick={() => deleteSelected(selectedIds)}
//             className="self-end mt-4 p-1.5 bg-white/5 hover:bg-red-700/20 text-white rounded-md flex items-center justify-center transition-all duration-150"
//             title="Delete shape"
//           >
//             <Trash2 className="text-red-500" size={16} />
//           </button>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function ShapePropertiesPanel({
  panelOpen,
  selectedIds = [],
  shapes,
  updateSelected,
  deleteSelected,
}) {
  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
  const selectedShape = selectedShapes.length === 1 ? selectedShapes[0] : null;
  const [isDragging, setIsDragging] = useState(false);

  const disableDrag = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const enableDrag = useCallback(() => setIsDragging(false), []);

  return (
    <AnimatePresence>
      {panelOpen && selectedShape && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-0 right-0 h-full w-80 bg-[#111]/95 backdrop-blur-md border-l border-gray-700/60 p-5 flex flex-col gap-4 shadow-2xl overflow-y-auto z-[9999] select-none"
        >
          <h3 className="text-white font-semibold text-sm mb-1 sticky top-0 bg-[#111]/95 py-1 z-10">
            Shape Properties
          </h3>

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

          <hr className="border-gray-700/40" />

          {/* 🧠 Stroke */}
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

          <hr className="border-gray-700/40" />

          {/* Stroke Width */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
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
            <div className="flex items-center justify-between">
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

          {/* 🟣 Corners */}
          {selectedShape.type === "rect" && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-300">Color</label>
                <div className="relative w-5 h-5">
                  <input
                    type="color"
                    value={selectedShape.shadowColor || "#000000"}
                    onMouseDown={disableDrag}
                    onMouseUp={enableDrag}
                    onChange={(e) =>
                      updateSelected({ shadowColor: e.target.value })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-full h-full rounded-full border border-gray-500 shadow-inner"
                    style={{
                      backgroundColor: selectedShape.shadowColor || "#000000",
                    }}
                  />
                </div>
              </div>

              {/* Angle Dial */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300">Angle</label>
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16">
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
