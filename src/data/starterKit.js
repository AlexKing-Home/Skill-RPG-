import { createEmptyEquipment } from "./equipment.js";

export const STARTER_COINS = 100;

const STARTER_WEAPON_CONFIG = {
  swordsman: {
    id: "starter-one-handed-sword",
    name: "Учебный одноручный меч",
    typeLabel: "Одноручный меч",
    weaponType: "oneHanded",
    attack: 8,
    critChancePercent: 0,
  },
  spearman: {
    id: "starter-spear",
    name: "Учебное копьё",
    typeLabel: "Копьё",
    weaponType: "spear",
    attack: 8,
    critChancePercent: 0,
  },
  assassin: {
    id: "starter-dagger",
    name: "Учебный кинжал",
    typeLabel: "Кинжал",
    weaponType: "dagger",
    attack: 7,
    critChancePercent: 2,
  },
  archer: {
    id: "starter-bow",
    name: "Учебный лук",
    typeLabel: "Лук",
    weaponType: "bow",
    attack: 8,
    critChancePercent: 0,
  },
};

function createStarterWeapon(classId) {
  const config = STARTER_WEAPON_CONFIG[classId] ?? STARTER_WEAPON_CONFIG.swordsman;

  return {
    id: config.id,
    category: "weapon",
    slot: "weapon1",
    weaponType: config.weaponType,
    typeLabel: config.typeLabel,
    name: config.name,
    level: 1,
    rarity: "common",
    rarityLabel: "Обычный",
    baseStats: { attack: config.attack },
    bonusStats: {
      accuracy: 0,
      critChancePercent: config.critChancePercent,
    },
    durability: { current: 80, max: 80 },
    enhancement: { level: 0, max: 3 },
    specialEffect: null,
    requirements: {
      heroLevel: 1,
      mastery: { key: config.weaponType, value: 0 },
    },
  };
}

const STARTER_ARMOR = {
  chest: {
    id: "starter-leather-jacket",
    category: "armor",
    slot: "chest",
    name: "Потрёпанная кожаная куртка",
    level: 1,
    rarity: "common",
    rarityLabel: "Обычный",
    baseStats: { defense: 2 },
    durability: { current: 60, max: 60 },
    enhancement: { level: 0, max: 3 },
    requirements: { heroLevel: 1 },
  },
  gloves: {
    id: "starter-leather-gloves",
    category: "armor",
    slot: "gloves",
    name: "Кожаные перчатки",
    level: 1,
    rarity: "common",
    rarityLabel: "Обычный",
    baseStats: { defense: 1 },
    durability: { current: 55, max: 55 },
    enhancement: { level: 0, max: 3 },
    requirements: { heroLevel: 1 },
  },
  boots: {
    id: "starter-leather-boots",
    category: "armor",
    slot: "boots",
    name: "Кожаные сапоги",
    level: 1,
    rarity: "common",
    rarityLabel: "Обычный",
    baseStats: { defense: 1 },
    durability: { current: 55, max: 55 },
    enhancement: { level: 0, max: 3 },
    requirements: { heroLevel: 1 },
  },
};

export const STARTER_HEALING_POTION = {
  id: "starter-healing-potion",
  category: "consumable",
  name: "Лечебное зелье",
  rarity: "common",
  rarityLabel: "Обычный",
  quantity: 2,
  effect: {
    type: "heal",
    amount: 25,
  },
};

function cloneItem(item) {
  return structuredClone(item);
}

export function createStarterKit(classId) {
  const equipment = createEmptyEquipment();
  equipment.weapon1 = createStarterWeapon(classId);
  equipment.chest = cloneItem(STARTER_ARMOR.chest);
  equipment.gloves = cloneItem(STARTER_ARMOR.gloves);
  equipment.boots = cloneItem(STARTER_ARMOR.boots);

  return {
    equipment,
    inventory: [cloneItem(STARTER_HEALING_POTION)],
    coins: STARTER_COINS,
  };
}
