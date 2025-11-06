import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export default function ImageShape({ shape, setShapes, setSelectedIds, setPanelOpen }) {
  const [img] = useImage(shape.src);
  if (!shape) return null;

  return (
    <KonvaImage
      id={shape.id.toString()}
      image={img}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      draggable
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
                  width: Math.max(20, s.width * scaleX),
                  height: Math.max(20, s.height * scaleY),
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
