export const ONE_HANDED_SWORD_SKILLS = [
  {
    id: "slant",
    masteryRequired: 0,
    name: "Косой удар",
    originalName: "Slant",
    description: "Одиночный диагональный удар.",
    combo: ["left", "down"],
    staminaCost: 1,
  },
  {
    id: "vertical",
    masteryRequired: 0,
    name: "Вертикальный удар",
    originalName: "Vertical",
    description: "Вертикальный удар.",
    combo: ["up", "down"],
    staminaCost: 1,
  },
  {
    id: "horizontal",
    masteryRequired: 50,
    name: "Горизонтальный удар",
    originalName: "Horizontal",
    description: "Горизонтальный удар.",
    combo: ["left", "right"],
    staminaCost: 1,
  },
  {
    id: "uppercut",
    masteryRequired: 100,
    name: "Восходящий удар",
    originalName: "Uppercut",
    description: "Восходящий удар.",
    combo: ["down", "up"],
    staminaCost: 1,
  },
  {
    id: "rage-spike",
    masteryRequired: 175,
    name: "Яростный выпад",
    originalName: "Rage Spike",
    description: "Рывок к противнику с атакой.",
    combo: ["right", "right", "right"],
    staminaCost: 2,
  },
  {
    id: "sonic-leap",
    masteryRequired: 250,
    name: "Звуковой прыжок",
    originalName: "Sonic Leap",
    description: "Быстрый прыжок или рывок с ударом сверху.",
    combo: ["up", "up", "down"],
    staminaCost: 2,
  },
  {
    id: "vertical-arc",
    masteryRequired: 325,
    name: "Вертикальная дуга",
    originalName: "Vertical Arc",
    description: "Два удара по V-траектории.",
    combo: ["down", "up", "left", "down"],
    staminaCost: 2,
  },
  {
    id: "sharp-nail",
    masteryRequired: 400,
    name: "Острый гвоздь",
    originalName: "Sharp Nail",
    description: "Трёхударная комбинация.",
    combo: ["left", "right", "left", "down"],
    staminaCost: 3,
  },
  {
    id: "savage-fulcrum",
    masteryRequired: 475,
    name: "Свирепый рычаг",
    originalName: "Savage Fulcrum",
    description: "Комбинация из трёх ударов.",
    combo: ["right", "left", "down", "right"],
    staminaCost: 3,
  },
  {
    id: "horizontal-square",
    masteryRequired: 550,
    name: "Горизонтальный квадрат",
    originalName: "Horizontal Square",
    description: "Четыре горизонтальных удара.",
    combo: ["left", "right", "left", "right", "down"],
    staminaCost: 3,
  },
  {
    id: "vertical-square",
    masteryRequired: 625,
    name: "Вертикальный квадрат",
    originalName: "Vertical Square",
    description: "Комбинация из четырёх вертикальных ударов.",
    combo: ["up", "down", "up", "down", "right"],
    staminaCost: 3,
  },
  {
    id: "vorpal-strike",
    masteryRequired: 700,
    name: "Смертельный удар",
    originalName: "Vorpal Strike",
    description: "Мощный дальний выпад.",
    combo: ["right", "right", "down", "right", "up"],
    staminaCost: 4,
  },
  {
    id: "deadly-sins",
    masteryRequired: 800,
    name: "Смертные грехи",
    originalName: "Deadly Sins",
    description: "Семь последовательных ударов.",
    combo: ["left", "down", "right", "up", "down"],
    staminaCost: 4,
  },
  {
    id: "howling-octave",
    masteryRequired: 900,
    name: "Воющая октава",
    originalName: "Howling Octave",
    description: "Восьмиударная комбинация.",
    combo: ["up", "right", "down", "left", "right"],
    staminaCost: 5,
  },
  {
    id: "nova-ascension",
    masteryRequired: 1000,
    name: "Восхождение Новы",
    originalName: "Nova Ascension",
    description: "Десятиударная высшая техника одноручного меча.",
    combo: ["down", "left", "up", "right", "down"],
    staminaCost: 6,
  },
];

function normalizeMasteryValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
}

export function isOneHandedSwordSkillUnlocked(skill, mastery = 0) {
  return normalizeMasteryValue(mastery) >= normalizeMasteryValue(skill?.masteryRequired);
}

export function getUnlockedOneHandedSwordSkills(mastery = 0) {
  return ONE_HANDED_SWORD_SKILLS.filter((skill) => isOneHandedSwordSkillUnlocked(skill, mastery));
}

export function getNextOneHandedSwordSkillUnlock(mastery = 0) {
  return ONE_HANDED_SWORD_SKILLS.find((skill) => !isOneHandedSwordSkillUnlocked(skill, mastery));
}

export function findOneHandedSwordSkill(sequence) {
  return ONE_HANDED_SWORD_SKILLS.find(
    (skill) =>
      skill.combo.length === sequence.length &&
      skill.combo.every((direction, index) => direction === sequence[index]),
  );
}
