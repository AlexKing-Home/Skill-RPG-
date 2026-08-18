export const dedicatedLocationRegistry = {
  forest: {
    id: "forest",
    title: "Лес",
    type: "forest",
    eyebrow: "Лесная локация",
    description: "Густой лес первого этажа. Уникальный арт будет добавлен отдельным этапом.",
  },
  ruins: {
    id: "ruins",
    title: "Руины",
    type: "ruins",
    eyebrow: "Заброшенная локация",
    description: "Древние руины первого этажа. Уникальный арт будет добавлен отдельным этапом.",
  },
  settlement: {
    id: "settlement",
    title: "Поселение",
    type: "settlement",
    eyebrow: "Мирная локация",
    description: "Поселение первого этажа. Уникальный арт будет добавлен отдельным этапом.",
  },
  dungeon: {
    id: "dungeon",
    title: "Подземелье",
    type: "dungeon",
    eyebrow: "Опасная локация",
    description: "Подземелье первого этажа. Уникальный арт будет добавлен отдельным этапом.",
  },
};

export function getDedicatedLocation(nodeId) {
  return dedicatedLocationRegistry[nodeId] ?? null;
}
