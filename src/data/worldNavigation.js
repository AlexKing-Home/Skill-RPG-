export const START_NODE_ID = "swamp";
export const CITY_NODE_ID = "start-city";
export const FLOOR_MAP_VERSION = 3;

export const floorOneNavigation = {
  id: "floor-1",
  name: "Этаж 1",
  nodes: [
    {
      id: CITY_NODE_ID,
      name: "Стартовый город",
      kind: "city",
      x: 24.9,
      y: 29,
      hitbox: { x: 25, y: 26.5, width: 31, height: 18 },
    },
    {
      id: "meadows",
      name: "Луга",
      kind: "meadows",
      x: 51.1,
      y: 31.4,
      hitbox: { x: 51.1, y: 29.5, width: 21, height: 17 },
    },
    {
      id: "forest",
      name: "Лес",
      kind: "forest",
      x: 75.5,
      y: 35.4,
      hitbox: { x: 75.5, y: 33.5, width: 21, height: 18 },
    },
    {
      id: START_NODE_ID,
      name: "Болото",
      kind: "swamp",
      x: 46.4,
      y: 55,
      hitbox: { x: 46.4, y: 51.5, width: 27, height: 22 },
    },
    {
      id: "ruins",
      name: "Руины",
      kind: "ruins",
      x: 24.8,
      y: 68.8,
      hitbox: { x: 23.5, y: 67, width: 26, height: 20 },
    },
    {
      id: "settlement",
      name: "Поселение",
      kind: "settlement",
      x: 75,
      y: 69,
      hitbox: { x: 76, y: 68.5, width: 29, height: 21 },
    },
    {
      id: "dungeon",
      name: "Подземелье",
      kind: "dungeon",
      x: 50.8,
      y: 91.5,
      hitbox: { x: 50.8, y: 89, width: 31, height: 18 },
    },
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
