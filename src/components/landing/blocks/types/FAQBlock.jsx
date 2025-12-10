import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function FAQBlock({ block, index, updateBlock }) {
  // Sortable Item Wrapper (no listeners here anymore!)
  function SortableFAQItem({ i, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: i });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style}>
        {children({ attributes, listeners })}
      </div>
    );
  }

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Drag End Handler
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const items = block.items || [];

      const oldIndex = active.id;
      const newIndex = over.id;

      const reordered = arrayMove(items, oldIndex, newIndex);
      updateBlock(index, "items", reordered);
    }
  }

  return (
    <div className="rounded-xl p-6 mt-3 bg-[#0F172A]/60 border border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-silver mb-4">FAQ Section</h3>

      {/* Section Title */}
      <label className="text-sm font-semibold text-gray-300 mt-6">
        Section Title
      </label>
      <input
        type="text"
        value={block.title || ""}
        onChange={(e) => updateBlock(index, "title", e.target.value)}
        className="w-full p-2 border border-gray-600 rounded bg-black text-white mt-1"
      />

      {/* Text & Background */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Text Color */}
        <div>
          <label className="text-sm font-semibold text-gray-300">
            Text Color
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={block.text_color || "#ffffff"}
              onChange={(e) => updateBlock(index, "text_color", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-600"
            />
            <span className="text-xs text-gray-400">{block.text_color}</span>
          </div>
        </div>

        {/* BG Color */}
        <div>
          <label className="text-sm font-semibold text-gray-300">
            Background
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={block.bg_color || "#000000"}
              onChange={(e) => updateBlock(index, "bg_color", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-600"
            />
            <span className="text-xs text-gray-400">{block.bg_color}</span>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Match Page Background
        </label>
        <input
          type="checkbox"
          checked={block.match_main_bg || false}
          onChange={(e) =>
            updateBlock(index, "match_main_bg", e.target.checked)
          }
        />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          Use Gradient
        </label>
        <input
          type="checkbox"
          checked={block.use_gradient || false}
          onChange={(e) => updateBlock(index, "use_gradient", e.target.checked)}
        />
      </div>

      {/* Gradient Options */}
      {block.use_gradient && (
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-sm font-semibold text-gray-300">Start</label>
            <input
              type="color"
              value={block.gradient_start || "#F285C3"}
              onChange={(e) =>
                updateBlock(index, "gradient_start", e.target.value)
              }
              className="w-full h-10 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">End</label>
            <input
              type="color"
              value={block.gradient_end || "#7bed9f"}
              onChange={(e) =>
                updateBlock(index, "gradient_end", e.target.value)
              }
              className="w-full h-10 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-300">
              Direction
            </label>
            <select
              value={block.gradient_direction || "90deg"}
              onChange={(e) =>
                updateBlock(index, "gradient_direction", e.target.value)
              }
              className="w-full p-2 border border-gray-600 rounded bg-black text-white"
            >
              <option value="90deg">Left to Right</option>
              <option value="180deg">Top to Bottom</option>
              <option value="45deg">Diagonal</option>
              <option value="135deg">Diagonal</option>
            </select>
          </div>
        </div>
      )}

      {/* No BG */}
      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm font-semibold text-gray-300">
          No Background
        </label>
        <input
          type="checkbox"
          checked={block.use_no_bg || false}
          onChange={(e) => updateBlock(index, "use_no_bg", e.target.checked)}
        />
      </div>

      {/* Alignment */}
      <label className="text-sm font-semibold text-gray-300 mt-4 block">
        Alignment
      </label>
      <select
        value={block.alignment || "left"}
        onChange={(e) => updateBlock(index, "alignment", e.target.value)}
        className="p-2 bg-black border border-gray-700 rounded text-white text-sm w-full"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>

      {/* FAQ Items */}
      <div className="mt-6 space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={(block.items || []).map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
            {(block.items || []).map((item, i) => (
              <SortableFAQItem key={i} i={i}>
                {({ attributes, listeners }) => (
                  <div className="bg-[#1f2937]/60 p-4 rounded-lg border border-gray-700">
                    {/* Row: Drag Handle + Question */}
                    <div className="flex items-center justify-between">
                      {/* Drag Handle */}
                      <div
                        {...attributes}
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-grab active:cursor-grabbing text-gray-400 mr-3 select-none text-xl"
                      >
                        ⋮⋮
                      </div>

                      {/* Question Input */}
                      <input
                        type="text"
                        value={item.q}
                        onChange={(e) => {
                          const updated = [...block.items];
                          updated[i].q = e.target.value;
                          updateBlock(index, "items", updated);
                        }}
                        className="w-full bg-black border border-gray-600 rounded text-white p-2"
                      />

                      {/* Expand Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...block.items];
                          updated[i].open = !updated[i].open;
                          updateBlock(index, "items", updated);
                        }}
                        className="ml-3 text-gray-300 text-xl"
                      >
                        {item.open ? "−" : "+"}
                      </button>
                    </div>

                    {/* Answer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        item.open ? "max-h-40 mt-3" : "max-h-0"
                      }`}
                    >
                      <textarea
                        value={item.a}
                        onChange={(e) => {
                          const updated = [...block.items];
                          updated[i].a = e.target.value;
                          updateBlock(index, "items", updated);
                        }}
                        className="w-full bg-black border border-gray-600 rounded text-white p-2 h-20"
                      />
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = block.items.filter(
                          (_, idx) => idx !== i
                        );
                        updateBlock(index, "items", updated);
                      }}
                      className="text-red-400 text-xs mt-3 hover:underline"
                    >
                      Remove Question
                    </button>
                  </div>
                )}
              </SortableFAQItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Item */}
      <button
        type="button"
        onClick={() =>
          updateBlock(index, "items", [
            ...(block.items || []),
            { q: "New Question", a: "Your answer...", open: false },
          ])
        }
        className="mt-4 bg-green text-black rounded-lg px-4 py-2 text-sm font-semibold hover:bg-green/80"
      >
        Add FAQ Item
      </button>
    </div>
  );
}
