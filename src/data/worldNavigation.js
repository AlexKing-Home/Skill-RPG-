export const START_NODE_ID = "start-city";

export const floorOneNavigation = {
  id: "floor-1",
  name: "Этаж 1",
  nodes: [
    {
      id: START_NODE_ID,
      name: "Стартовый город",
      kind: "city",
      x: 34,
      y: 63,
    },
    {
      id: "field",
      name: "Поле",
      kind: "field",
      x: 63,
      y: 39,
    },
  ],
  edges: [
    {
      from: START_NODE_ID,
      to: "field",
      distanceKm: 1.2,
      travelMs: 1100,
    },
  ],
};

export function getTravelNode(nodeId) {
  return floorOneNavigation.nodes.find((node) => node.id === nodeId) ?? null;
}

export function getTravelRoute(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return null;

  const edge = floorOneNavigation.edges.find(
    (item) =>
      (item.from === fromId && item.to === toId) ||
      (item.from === toId && item.to === fromId),
  );

  if (!edge) return null;

  return {
    ...edge,
    from: fromId,
    to: toId,
  };
}

export function locationFromNode(nodeId) {
  const node = getTravelNode(nodeId) ?? getTravelNode(START_NODE_ID);

  return {
    worldName: floorOneNavigation.name,
    areaName: node.name,
    nodeId: node.id,
    x: node.x,
    y: node.y,
  };
}
