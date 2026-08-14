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
