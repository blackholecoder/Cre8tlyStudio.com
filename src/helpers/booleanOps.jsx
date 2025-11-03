import paper from "paper";

export function performBooleanOperation(selectedShapes, op) {

  
  if (!selectedShapes || selectedShapes.length !== 2) {
    console.warn("❌ Need exactly 2 shapes to combine:", selectedShapes);
    return null;
  }

  // 🧠 Create an offscreen Paper.js environment
  const canvas = document.createElement("canvas");
  paper.setup(canvas);

  const toPaper = (s) => {
    switch (s.type) {
      case "rect":
        return new paper.Path.Rectangle(
          new paper.Point(s.x, s.y),
          new paper.Size(s.width, s.height)
        );
      case "circle":
        return new paper.Path.Ellipse({
          center: [s.x, s.y],
          radius: [s.radiusX || s.radius || 50, s.radiusY || s.radius || 50],
        });
      default:
        console.warn("⚠️ Unsupported shape type:", s.type);
        return null;
    }
  };

  // ✅ Build paper paths
  const [a, b] = selectedShapes.map(toPaper).filter(Boolean);
  if (!a || !b) return null;

  // ✅ Perform boolean operation
  let result;
  switch (op) {
    case "union":
      result = a.unite(b);
      break;
    case "subtract":
      result = a.subtract(b);
      break;
    case "intersect":
      result = a.intersect(b);
      break;
    case "xor":
      result = a.exclude(b);
      break;
    case "divide":
      result = a.divide(b);
      break;
    default:
      console.warn("⚠️ Unknown operation:", op);
      return null;
  }

  // ✅ Return SVG path for new combined shape
  const pathData = result?.pathData || null;

  // 🧹 Clean up memory
  a.remove();
  b.remove();
  result?.remove();

  return pathData;
}
