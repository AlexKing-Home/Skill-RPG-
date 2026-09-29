export const EQUIPMENT_SLOTS = [
  { id: "helmet", label: "Шлем" },
  { id: "chest", label: "Нагрудник" },
  { id: "cloak", label: "Накидка" },
  { id: "gloves", label: "Перчатки" },
  { id: "pants", label: "Штаны" },
  { id: "boots", label: "Ботинки" },
  { id: "ring", label: "Кольцо" },
  { id: "weapon1", label: "Оружие 1" },
  { id: "weapon2", label: "Оружие 2" },
];

export function createEmptyEquipment() {
  return Object.fromEntries(EQUIPMENT_SLOTS.map(({ id }) => [id, null]));
}

const EQUIPMENT_SLOT_IDS = new Set(EQUIPMENT_SLOTS.map(({ id }) => id));

export function isEquippableItem(item) {
  return Boolean(
    item &&
      ["weapon", "armor"].includes(item.category) &&
      EQUIPMENT_SLOT_IDS.has(item.slot),
  );
}

export function equipInventoryItem(equipment = {}, inventory = [], itemId) {
  const itemIndex = inventory.findIndex(
    (item) => item?.id === itemId && isEquippableItem(item),
  );
  if (itemIndex < 0) {
    return { equipment, inventory, changed: false };
  }

  const item = inventory[itemIndex];
  const nextEquipment = { ...createEmptyEquipment(), ...equipment };
  const nextInventory = inventory.filter((_, index) => index !== itemIndex);
  const replacedItem = nextEquipment[item.slot];

  if (replacedItem) nextInventory.push(replacedItem);
  nextEquipment[item.slot] = item;

  return {
    equipment: nextEquipment,
    inventory: nextInventory,
    changed: true,
  };
}

export function unequipItem(equipment = {}, inventory = [], slotId) {
  const nextEquipment = { ...createEmptyEquipment(), ...equipment };
  const item = nextEquipment[slotId];

  if (!item || !EQUIPMENT_SLOT_IDS.has(slotId)) {
    return { equipment, inventory, changed: false };
  }

  nextEquipment[slotId] = null;
  return {
    equipment: nextEquipment,
    inventory: [...inventory, item],
    changed: true,
  };
}

export function getEquipmentCombatBonuses(equipment = {}) {
  return Object.values(equipment).reduce(
    (total, item) => {
      if (!item) return total;
      total.attack += Math.max(0, Number(item.baseStats?.attack) || 0);
      total.defense += Math.max(0, Number(item.baseStats?.defense) || 0);
      return total;
    },
    { attack: 0, defense: 0 },
  );
}

export {
  EQUIPMENT_BY_ID,
  EQUIPMENT_CATALOG,
  EQUIPMENT_RARITIES,
  canMeetEquipmentRequirements,
  getEquipmentById,
  getWeaponsByMastery,
} from "./equipmentCatalog.js";

