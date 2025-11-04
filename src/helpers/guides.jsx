// helpers/guides.js

/**
 * Calculates snapping guides for alignment between shapes, grid lines, and canvas center.
 *
 * @param {Object} shape - The shape being moved or transformed.
 * @param {Array} allShapes - All shapes currently on the canvas.
 * @param {number} stageWidth - Width of the canvas.
 * @param {number} stageHeight - Height of the canvas.
 * @param {Object} [options]
 * @param {number} [options.GAP=6] - Snap threshold (px).
 * @param {number[]} [options.grid=[]] - Optional array of grid line positions (e.g. [50, 100, 150]).
 * @param {boolean} [options.snapToCanvasCenter=true] - Whether to snap to canvas center.
 * @param {boolean} [options.snapToEdges=true] - Whether to snap to other shapes' edges.
 * @returns {{vertical: number[], horizontal: number[], snapPosition?: {x?: number, y?: number}}}
 */
export function getGuides(
  shape,
  allShapes,
  stageWidth,
  stageHeight,
  options = {}
) {
  const {
    GAP = 6,
    grid = [],
    snapToCanvasCenter = true,
    snapToEdges = true,
  } = options;

  const result = { vertical: [], horizontal: [] };
  const snapPosition = {};

  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;

  const left = shape.x;
  const right = shape.x + shape.width;
  const top = shape.y;
  const bottom = shape.y + shape.height;
  const midX = shape.x + shape.width / 2;
  const midY = shape.y + shape.height / 2;

  // 🧭 Snap to canvas center
  if (snapToCanvasCenter) {
    if (Math.abs(midX - centerX) < GAP) {
      result.vertical.push(centerX);
      snapPosition.x = centerX - shape.width / 2;
    }
    if (Math.abs(midY - centerY) < GAP) {
      result.horizontal.push(centerY);
      snapPosition.y = centerY - shape.height / 2;
    }
  }

  // 🧩 Snap to grid lines
  for (const gx of grid) {
    if (Math.abs(midX - gx) < GAP) {
      result.vertical.push(gx);
      snapPosition.x = gx - shape.width / 2;
    }
  }
  for (const gy of grid) {
    if (Math.abs(midY - gy) < GAP) {
      result.horizontal.push(gy);
      snapPosition.y = gy - shape.height / 2;
    }
  }

  // 🧲 Snap to other shapes (edges + centers)
  if (snapToEdges) {
    for (const s of allShapes) {
      if (s.id === shape.id) continue;

      const sLeft = s.x;
      const sRight = s.x + s.width;
      const sTop = s.y;
      const sBottom = s.y + s.height;
      const sMidX = s.x + s.width / 2;
      const sMidY = s.y + s.height / 2;

      // Vertical (left, right, center)
      if (Math.abs(left - sLeft) < GAP) {
        result.vertical.push(sLeft);
        snapPosition.x = sLeft;
      } else if (Math.abs(right - sRight) < GAP) {
        result.vertical.push(sRight);
        snapPosition.x = sRight - shape.width;
      } else if (Math.abs(midX - sMidX) < GAP) {
        result.vertical.push(sMidX);
        snapPosition.x = sMidX - shape.width / 2;
      }

      // Horizontal (top, bottom, center)
      if (Math.abs(top - sTop) < GAP) {
        result.horizontal.push(sTop);
        snapPosition.y = sTop;
      } else if (Math.abs(bottom - sBottom) < GAP) {
        result.horizontal.push(sBottom);
        snapPosition.y = sBottom - shape.height;
      } else if (Math.abs(midY - sMidY) < GAP) {
        result.horizontal.push(sMidY);
        snapPosition.y = sMidY - shape.height / 2;
      }

      // 🪶 Text baseline alignment (optional)
      if (s.type === "text" && s.fontSize) {
        const sBaseline = s.y + s.fontSize;
        if (Math.abs(bottom - sBaseline) < GAP) {
          result.horizontal.push(sBaseline);
          snapPosition.y = sBaseline - shape.height;
        }
      }
    }
  }

  // ✅ Deduplicate and round to avoid double guides
  result.vertical = [...new Set(result.vertical.map((v) => Math.round(v)))];
  result.horizontal = [...new Set(result.horizontal.map((h) => Math.round(h)))];

  return { ...result, snapPosition };
}
