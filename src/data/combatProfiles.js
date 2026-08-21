import { findOneHandedSwordSkill } from "./oneHandedSwordSkills.js";

const genericProfile = {
  weaponType: "unarmed",
  label: "Без оружия",
  masteryKey: null,
  findSkill: null,
};

const combatProfiles = {
  swordsman: {
    weaponType: "oneHanded",
    label: "Одноручный меч",
    masteryKey: "oneHanded",
    findSkill: findOneHandedSwordSkill,
  },
  spearman: {
    weaponType: "spear",
    label: "Копьё",
    masteryKey: null,
    findSkill: null,
  },
  assassin: {
    weaponType: "dagger",
    label: "Кинжал",
    masteryKey: null,
    findSkill: null,
  },
  archer: {
    weaponType: "bow",
    label: "Лук",
    masteryKey: null,
    findSkill: null,
  },
};

export function getCombatProfile(classId) {
  return combatProfiles[classId] ?? genericProfile;
}
