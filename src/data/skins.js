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
    stats: {
      health: 120,
      attack: 14,
      defense: 12,
      strength: 14,
      agility: 8,
      stealth: 4,
      scouting: 5,
      lockpicking: 3,
      endurance: 12,
    },
  },
  spearman: {
    maleName: "Копейщик",
    femaleName: "Копейщица",
    stats: {
      health: 110,
      attack: 13,
      defense: 10,
      strength: 13,
      agility: 10,
      stealth: 4,
      scouting: 6,
      lockpicking: 3,
      endurance: 11,
    },
  },
  assassin: {
    maleName: "Убийца",
    femaleName: "Убийца",
    stats: {
      health: 90,
      attack: 16,
      defense: 7,
      strength: 16,
      agility: 15,
      stealth: 15,
      scouting: 10,
      lockpicking: 14,
      endurance: 8,
    },
  },
  archer: {
    maleName: "Лучник",
    femaleName: "Лучница",
    stats: {
      health: 95,
      attack: 14,
      defense: 8,
      strength: 14,
      agility: 13,
      stealth: 10,
      scouting: 14,
      lockpicking: 7,
      endurance: 9,
    },
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

export function getDefaultStatsForClass(classId) {
  const definition = classDefinitions[classId] ?? classDefinitions.swordsman;
  return { ...definition.stats };
}

export function createCharacter(nickname, skin) {
  return {
    version: 4,
    nickname,
    gender: skin.gender,
    classId: skin.classId,
    skinId: skin.id,
    skinName: skin.name,
    skinImage: skin.image,
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
