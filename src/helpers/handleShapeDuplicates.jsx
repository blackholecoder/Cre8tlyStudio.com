export const handleShapeDuplicate = ({
  e,
  shapes,
  selectedIds,
  setShapes,
  setSelectedIds,
  isDuplicating,
  offset = 20, // distance for new copies
}) => {
  const isMeta = e.evt.metaKey || e.evt.ctrlKey;
  if (!isMeta) return;

  isDuplicating.current = true;

  const node = e.target;
  const id = node.id();
  const isMultiple = selectedIds?.length > 1;
  const now = Date.now();

  // 🔍 Find which shapes to duplicate
  const shapesToDuplicate = isMultiple
    ? shapes.filter((s) => selectedIds.includes(s.id))
    : [shapes.find((s) => s.id.toString() === id)].filter(Boolean);

  if (!shapesToDuplicate.length) return;

  // 🧊 Stop drag on the original node(s)
  node.stopDrag();

  // 🆕 Create new shapes
  const duplicates = shapesToDuplicate.map((s, index) => ({
    ...s,
    id: `shape-${now}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    x: (s.x || 0) + offset,
    y: (s.y || 0) + offset,
  }));

  // ➕ Add duplicates to shapes
  setShapes((prev) => [...prev, ...duplicates]);

  // 🧹 Clear previous selection
  setSelectedIds([]);

  // 🎯 After render, select new duplicates and start dragging one
  requestAnimationFrame(() => {
    const newIds = duplicates.map((d) => d.id);
    setSelectedIds(newIds);

    const stage = node.getStage();
    const firstNewNode = stage.findOne(`#${duplicates[0].id}`);
    if (firstNewNode) firstNewNode.startDrag();
  });
};
