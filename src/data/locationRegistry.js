export const dedicatedLocationRegistry = {
  forest: {
    id: "forest",
    title: "Лес",
    type: "forest",
    eyebrow: "Лесная локация",
    description:
      "Густой лес первого этажа. Уникальный утверждённый арт будет добавлен отдельным этапом.",
  },
};

export function getDedicatedLocation(nodeId) {
  return dedicatedLocationRegistry[nodeId] ?? null;
}
