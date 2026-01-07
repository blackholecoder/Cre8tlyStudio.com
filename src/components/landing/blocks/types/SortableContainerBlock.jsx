import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { MemoizedSortableBlock } from "../../../../sections/landing/SortableBlock";

export function SortableContainerBlock({
  id,
  block,
  index,
  updateBlock,
  removeBlock,
  bgTheme,
  pdfList,
  landing,
  openAIModal,
}) {
  // const DROPPABLE_ID = `container-${block.id}`;
  const DROPPABLE_ID = `container-body-${block.id}`;
  const [isOverChild, setIsOverChild] = useState(false);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: DROPPABLE_ID,
    disabled: isOverChild,
  });

  const { setNodeRef, listeners, attributes } = useDraggable({
    id,
    disabled: !block.collapsed, // 🔑 same rule as blocks
  });

  const updateChildBlock = (childIndex, key, value) => {
    updateBlock(index, "children", (prevChildren = []) => {
      const updated = [...prevChildren];
      updated[childIndex] = {
        ...updated[childIndex],
        [key]: value,
      };
      return updated;
    });
  };

  const updateChildField = (i, key, value) => {
    console.log("CHILD UPDATE:", key, value);
    updateChildBlock(i, key, value);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
      mb-4 sm:mb-6
      rounded-xl
      p-2 sm:p-4
      bg-black/60
      transition-all duration-200
      border
    ${
      isOver
        ? "border-dashed border-green/50 bg-green/5"
        : "border-white/10 hover:border-dashed hover:border-white/30"
    }
  `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-300 hover:text-white select-none"
        >
          ☰
        </div>

        <h3 className="text-green font-bold text-lg flex-1">
          {block.title || "Untitled Section"}
        </h3>

        <button
          type="button"
          onClick={() => updateBlock(index, "collapsed", !block.collapsed)}
          className="text-gray-400 hover:text-white"
        >
          ▼
        </button>
      </div>

      {!block.collapsed && (
        <input
          value={block.title || ""}
          onChange={(e) => updateBlock(index, "title", e.target.value)}
          className="mb-3 w-full bg-black text-white border border-gray-700 rounded px-3 py-2 text-sm"
        />
      )}

      {/* ✅ CHILD DROP ZONE (isolated) */}
      {!block.collapsed && (
        <div
          ref={setDroppableRef}
          className={`rounded-md p-0.5 sm:p-1 transition-colors
            ${isOver && !isOverChild ? "bg-green/10 border-green/50" : ""}
          `}
        >
          <SortableContext
            items={(block.children || []).map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {block.children?.map((child, childIndex) => (
              <MemoizedSortableBlock
                key={child.id}
                id={child.id}
                block={child}
                index={childIndex}
                updateChildBlock={updateChildBlock}
                onHoverStart={() => setIsOverChild(true)}
                onHoverEnd={() => setIsOverChild(false)}
                containerIndex={index}
                updateBlock={updateChildField}
                removeBlock={(i) => {
                  updateBlock(
                    index,
                    "children",
                    block.children.filter((_, idx) => idx !== i)
                  );
                }}
                bgTheme={bgTheme}
                pdfList={pdfList}
                landing={landing}
                openAIModal={openAIModal}
              />
            ))}
          </SortableContext>

          {block.children?.length === 0 && (
            <div className="text-xs text-gray-500 text-center py-4">
              Drop blocks here
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => removeBlock(index)}
        className="mt-4 text-red-400 text-sm"
      >
        Remove Section
      </button>
    </div>
  );
}
