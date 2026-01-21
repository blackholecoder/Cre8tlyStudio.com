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
        bg-dashboard-bg-light/70 dark:bg-dashboard-bg-dark/70
        transition-all duration-200
        border
        border-dashboard-border-light dark:border-dashboard-border-dark
        hover:border-dashed
        hover:border-dashboard-muted-light dark:hover:border-dashboard-muted-dark
      "
    >
      <div className="flex items-center gap-2 mb-2">
        {/* TITLE — FAR LEFT */}
        <h3 className="text-dashboard-muted-light dark:text-green font-bold text-lg mr-auto">
          {block.title || "Untitled Section"}
        </h3>

        {/* MOVE UP */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveBlockUp(block.id);
          }}
          className="
            px-2 py-1 text-xs rounded
            bg-dashboard-hover-light dark:bg-dashboard-hover-dark
            text-dashboard-muted-light dark:text-dashboard-muted-dark
            hover:text-dashboard-text-light dark:hover:text-dashboard-text-dark
          "
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
          className="
            px-2 py-1 text-xs rounded
            bg-dashboard-hover-light dark:bg-dashboard-hover-dark
            text-dashboard-muted-light dark:text-dashboard-muted-dark
            hover:text-dashboard-text-light dark:hover:text-dashboard-text-dark
          "
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
          className="
            text-dashboard-muted-light dark:text-dashboard-muted-dark
            hover:text-dashboard-text-light dark:hover:text-dashboard-text-dark
          "
        >
          ▼
        </button>
      </div>

      {!block.collapsed && (
        <input
          value={block.title || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateBlock(index, "title", e.target.value)}
          className="
            mb-3 w-full
            rounded px-3 py-2 text-sm
            bg-dashboard-bg-light dark:bg-dashboard-bg-dark
            text-dashboard-text-light dark:text-dashboard-text-dark
            border
            border-dashboard-border-light dark:border-dashboard-border-dark
          "
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
