import {
  findOneHandedSwordSkill,
  ONE_HANDED_SWORD_SKILLS,
} from "./oneHandedSwordSkills.js";
import {
  BOW_SKILLS,
  DAGGER_SKILLS,
  DUAL_WIELD_SKILLS,
  findSkillInList,
  KATANA_SKILLS,
  RAPIER_SKILLS,
  SPEAR_SKILLS,
  TWO_HANDED_SWORD_SKILLS,
} from "./weaponTechniqueSkills.js";

const genericProfile = {
  weaponType: "unarmed",
  label: "Без оружия",
  masteryKey: null,
  findSkill: null,
  skills: [],
};

function createWeaponProfile(weaponType, label, skills) {
  return {
    weaponType,
    label,
    masteryKey: weaponType,
    findSkill: (sequence) => findSkillInList(skills, sequence),
    skills,
  };
}

const weaponProfiles = {
  oneHanded: {
    weaponType: "oneHanded",
    label: "Одноручный меч",
    masteryKey: "oneHanded",
    findSkill: findOneHandedSwordSkill,
    skills: ONE_HANDED_SWORD_SKILLS,
  },
  twoHanded: createWeaponProfile("twoHanded", "Двуручный меч", TWO_HANDED_SWORD_SKILLS),
  rapier: createWeaponProfile("rapier", "Рапира", RAPIER_SKILLS),
  katana: createWeaponProfile("katana", "Катана", KATANA_SKILLS),
  spear: createWeaponProfile("spear", "Копьё", SPEAR_SKILLS),
  dagger: createWeaponProfile("dagger", "Кинжал", DAGGER_SKILLS),
  bow: createWeaponProfile("bow", "Лук", BOW_SKILLS),
  dualWield: createWeaponProfile("dualWield", "Два меча", DUAL_WIELD_SKILLS),
};

const classWeaponTypes = {
  swordsman: "oneHanded",
  spearman: "spear",
  assassin: "dagger",
  archer: "bow",
};

function getEquippedWeaponType(equipment = {}) {
  const weaponType = equipment?.weapon1?.weaponType;
  return typeof weaponType === "string" && weaponType ? weaponType : null;
}

export function getCombatProfileForWeapon(weaponType) {
  return weaponProfiles[weaponType] ?? genericProfile;
}

export function getCombatProfile(classId, equipment = {}) {
  const weaponType = getEquippedWeaponType(equipment) ?? classWeaponTypes[classId];
  return getCombatProfileForWeapon(weaponType);
}

