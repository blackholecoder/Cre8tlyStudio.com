export function duplicateSelectedShapes(shapes, selectedIds, setShapes, setSelectedIds) {
  const selected = shapes.filter((s) => selectedIds.includes(s.id));
  if (selected.length === 0) return;

  // Create duplicates with new IDs + slight offset
  const duplicates = selected.map((s, index) => ({
    ...s,
    id: `shape-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`, // unique id
    x: (s.x || 0) + 20,
    y: (s.y || 0) + 20,
  }));

  // Add new duplicates to shapes
  setShapes((prev) => [...prev, ...duplicates]);

  // ✅ Keep originals + new ones selected
  setSelectedIds((prev) => [...prev, ...duplicates.map((d) => d.id)]);
}
