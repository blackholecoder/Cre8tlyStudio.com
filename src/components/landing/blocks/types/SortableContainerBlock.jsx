import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MemoizedSortableBlock } from "../../../../sections/landing/SortableBlock";

export function SortableContainerBlock({
  block,
  index,
  updateBlock,
  removeBlock,
  moveBlockUp,
  moveBlockDown,
  activeChild,
  setActiveChild,
  bgTheme,
  pdfList,
  landing,
  openAIModal,
}) {
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
    updateChildBlock(i, key, value);
  };

  return (
    <div
      data-drop-id={index}
      data-parent-id={null}
      onClick={(e) => {
        e.stopPropagation(); // 🔒 REQUIRED
        setActiveChild(null); // selecting container clears child
      }}
      className="
      mb-4 sm:mb-6
      rounded-xl
      p-2 sm:p-4
      bg-black/60
      transition-all duration-200
      border
      border-white/10 hover:border-dashed hover:border-white/30"
    >
      <div className="flex items-center gap-2 mb-2">
        {/* TITLE — FAR LEFT */}
        <h3 className="text-green font-bold text-lg mr-auto">
          {block.title || "Untitled Section"}
        </h3>

        {/* MOVE UP */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveBlockUp(block.id);
          }}
          className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-gray-300"
        >
          ↑
        </button>

        {/* MOVE DOWN */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveBlockDown(block.id);
          }}
          className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-gray-300"
        >
          ↓
        </button>

        {/* COLLAPSE */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            updateBlock(index, "collapsed", !block.collapsed);
          }}
          className="text-gray-400 hover:text-white"
        >
          ▼
        </button>
      </div>

      {!block.collapsed && (
        <input
          value={block.title || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateBlock(index, "title", e.target.value)}
          className="mb-3 w-full bg-black text-white border border-gray-700 rounded px-3 py-2 text-sm"
        />
      )}

      {!block.collapsed && (
        <div className={"rounded-md p-0.5 sm:p-1 transition-colors"}>
          <SortableContext
            items={(block.children || []).map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {block.children?.map((child, childIndex) => (
              <React.Fragment key={child.id}>
                <MemoizedSortableBlock
                  key={child.id}
                  id={child.id}
                  block={child}
                  index={childIndex}
                  updateChildBlock={updateChildBlock}
                  containerIndex={index}
                  updateBlock={updateChildField}
                  activeChild={activeChild}
                  setActiveChild={setActiveChild}
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
              </React.Fragment>
            ))}
          </SortableContext>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation(); // 🔒 REQUIRED
          removeBlock(index);
        }}
        className="mt-4 text-red-400 text-sm"
      >
        Remove Section
      </button>
    </div>
  );
}
