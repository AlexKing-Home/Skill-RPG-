import { EQUIPMENT_CATALOG } from "./equipmentCatalog.js";

export const WILD_BOAR_LOOT_CHANCES = {
  hide: 0.6,
  fang: 0.25,
  meat: 0.7,
  equipment: 0.05,
};

export const WILD_BOAR_MATERIALS = {
  hide: {
    id: "wild-boar-hide",
    category: "material",
    name: "Кабанья шкура",
    rarity: "common",
    rarityLabel: "Обычный",
    stackable: true,
    quantity: 1,
  },
  fang: {
    id: "wild-boar-fang",
    category: "material",
    name: "Клык кабана",
    rarity: "common",
    rarityLabel: "Обычный",
    stackable: true,
    quantity: 1,
  },
  meat: {
    id: "raw-boar-meat",
    category: "material",
    name: "Сырое мясо",
    rarity: "common",
    rarityLabel: "Обычный",
    stackable: true,
    quantity: 1,
  },
};

const COMMON_LEVEL_ONE_EQUIPMENT = EQUIPMENT_CATALOG.filter(
  (item) => item.rarity === "common" && item.level === 1,
);

function cloneItem(item) {
  return structuredClone(item);
}

function rollInt(randomValue, min, max) {
  return min + Math.floor(randomValue * (max - min + 1));
}

export function rollWildBoarLoot(random = Math.random) {
  const items = [];

  if (random() < WILD_BOAR_LOOT_CHANCES.hide) {
    items.push(cloneItem(WILD_BOAR_MATERIALS.hide));
  }
  if (random() < WILD_BOAR_LOOT_CHANCES.fang) {
    items.push(cloneItem(WILD_BOAR_MATERIALS.fang));
  }
  if (random() < WILD_BOAR_LOOT_CHANCES.meat) {
    items.push(cloneItem(WILD_BOAR_MATERIALS.meat));
  }

  const coins = rollInt(random(), 5, 15);

  if (random() < WILD_BOAR_LOOT_CHANCES.equipment && COMMON_LEVEL_ONE_EQUIPMENT.length) {
    const itemIndex = Math.min(
      COMMON_LEVEL_ONE_EQUIPMENT.length - 1,
      Math.floor(random() * COMMON_LEVEL_ONE_EQUIPMENT.length),
    );
    items.push(cloneItem(COMMON_LEVEL_ONE_EQUIPMENT[itemIndex]));
  }

  return { coins, items };
}

export function mergeInventoryItems(inventory = [], incomingItems = []) {
  const nextInventory = inventory.map((item) => cloneItem(item));

  for (const incoming of incomingItems) {
    const item = cloneItem(incoming);
    if (item.stackable) {
      const existing = nextInventory.find(
        (candidate) => candidate.id === item.id && candidate.stackable,
      );
      if (existing) {
        existing.quantity =
          Math.max(0, Number(existing.quantity) || 0) + Math.max(1, Number(item.quantity) || 1);
        continue;
      }
    }

    nextInventory.push(item);
  }

  return nextInventory;
}

export function formatLootSummary(loot) {
  const itemText = loot.items.map((item) =>
    item.stackable ? `${item.name} ×${item.quantity ?? 1}` : item.name,
  );
  return [`${loot.coins} монет`, ...itemText].join(", ");
}
