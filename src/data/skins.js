import {
  femaleArcher,
  femaleAssassin,
  femaleSpearman,
  femaleSwordsman,
  maleArcher,
  maleAssassin,
  maleSpearman,
  maleSwordsman,
} from "./assets.js";
import { createEmptyEquipment } from "./equipment.js";

const classDefinitions = {
  swordsman: {
    maleName: "Мечник",
    femaleName: "Мечница",
    stats: { health: 120, attack: 14, defense: 12, agility: 8 },
  },
  spearman: {
    maleName: "Копейщик",
    femaleName: "Копейщица",
    stats: { health: 110, attack: 13, defense: 10, agility: 10 },
  },
  assassin: {
    maleName: "Убийца",
    femaleName: "Убийца",
    stats: { health: 90, attack: 16, defense: 7, agility: 15 },
  },
  archer: {
    maleName: "Лучник",
    femaleName: "Лучница",
    stats: { health: 95, attack: 14, defense: 8, agility: 13 },
  },
};

const images = {
  "male-swordsman": maleSwordsman,
  "male-spearman": maleSpearman,
  "male-assassin": maleAssassin,
  "male-archer": maleArcher,
  "female-swordsman": femaleSwordsman,
  "female-spearman": femaleSpearman,
  "female-assassin": femaleAssassin,
  "female-archer": femaleArcher,
};

const classOrder = ["swordsman", "spearman", "assassin", "archer"];

export const skins = ["male", "female"].flatMap((gender) =>
  classOrder.map((classId) => {
    const definition = classDefinitions[classId];
    const id = `${gender}-${classId}`;
    return {
      id,
      gender,
      classId,
      name: gender === "male" ? definition.maleName : definition.femaleName,
      image: images[id],
      stats: { ...definition.stats },
    };
  }),
);

export function getSkinsByGender(gender) {
  return skins.filter((skin) => skin.gender === gender);
}

export function createCharacter(nickname, skin) {
  return {
    version: 2,
    nickname,
    gender: skin.gender,
    classId: skin.classId,
    skinId: skin.id,
    skinName: skin.name,
    skinImage: skin.image,
    level: 1,
    experience: 0,
    currentHealth: skin.stats.health,
    stats: { ...skin.stats },
    equipment: createEmptyEquipment(),
    location: {
      worldName: "Текущая местность",
      areaName: "Текущая локация",
      x: 50,
      y: 50,
    },
    createdAt: new Date().toISOString(),
  };
}
