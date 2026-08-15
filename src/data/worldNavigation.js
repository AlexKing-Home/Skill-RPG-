export const START_NODE_ID = "swamp";
export const CITY_NODE_ID = "start-city";
export const FLOOR_MAP_VERSION = 2;

export const floorOneNavigation = {
  id: "floor-1",
  name: "Этаж 1",
  nodes: [
    { id: CITY_NODE_ID, name: "Стартовый город", kind: "city", x: 24.5, y: 28.5 },
    { id: "meadows", name: "Луга", kind: "meadows", x: 52, y: 31 },
    { id: "forest", name: "Лес", kind: "forest", x: 77, y: 35 },
    { id: START_NODE_ID, name: "Болото", kind: "swamp", x: 47.2, y: 46.5 },
    { id: "ruins", name: "Руины", kind: "ruins", x: 24.5, y: 68 },
    { id: "settlement", name: "Поселение", kind: "settlement", x: 76.5, y: 69 },
    { id: "dungeon", name: "Подземелье", kind: "dungeon", x: 52, y: 92.5 },
  ],
  edges: [
    { from: CITY_NODE_ID, to: "meadows", distanceKm: 1.1 },
    { from: CITY_NODE_ID, to: "ruins", distanceKm: 1.7 },
    { from: "meadows", to: START_NODE_ID, distanceKm: 1.2 },
    { from: "forest", to: START_NODE_ID, distanceKm: 1.4 },
    { from: "forest", to: "settlement", distanceKm: 1.3 },
    { from: START_NODE_ID, to: "ruins", distanceKm: 1.2 },
    { from: START_NODE_ID, to: "settlement", distanceKm: 1.4 },
    { from: "ruins", to: "dungeon", distanceKm: 1.6 },
    { from: "settlement", to: "dungeon", distanceKm: 1.5 },
  ],
};

const legacyNodeAliases = {
  field: "meadows",
};

export function normalizeNodeId(nodeId) {
  return legacyNodeAliases[nodeId] ?? nodeId;
}

export function getTravelNode(nodeId) {
  const normalized = normalizeNodeId(nodeId);
  return floorOneNavigation.nodes.find((node) => node.id === normalized) ?? null;
}

function neighbors(nodeId) {
  return floorOneNavigation.edges.flatMap((edge) => {
    if (edge.from === nodeId) return [{ id: edge.to, edge }];
    if (edge.to === nodeId) return [{ id: edge.from, edge }];
    return [];
  });
}

export function getTravelRoute(fromId, toId) {
  const start = normalizeNodeId(fromId);
  const target = normalizeNodeId(toId);
  if (!getTravelNode(start) || !getTravelNode(target) || start === target) return null;

  const queue = [{ id: start, distance: 0, path: [start], edges: [] }];
  const best = new Map([[start, 0]]);

  while (queue.length) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();
    if (current.id === target) {
      return {
        from: start,
        to: target,
        nodeIds: current.path,
        edgeKeys: current.edges,
        distanceKm: current.distance,
        travelMs: Math.max(750, (current.path.length - 1) * 650),
      };
    }

    for (const next of neighbors(current.id)) {
      const distance = current.distance + next.edge.distanceKm;
      if (distance >= (best.get(next.id) ?? Infinity)) continue;
      best.set(next.id, distance);
      queue.push({
        id: next.id,
        distance,
        path: [...current.path, next.id],
        edges: [...current.edges, `${next.edge.from}-${next.edge.to}`],
      });
    }
  }

  return null;
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
