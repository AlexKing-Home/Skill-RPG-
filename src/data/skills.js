export const MASTERY_MAX = 1000;

export const WEAPON_MASTERY_TYPES = [
  { key: "oneHanded", label: "Одноручный меч" },
  { key: "twoHanded", label: "Двуручный меч" },
  { key: "rapier", label: "Рапира" },
  { key: "katana", label: "Катана" },
];

export function normalizeMastery(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(MASTERY_MAX, Math.max(0, Math.floor(numeric)));
}

export function createEmptySkillMastery() {
  return Object.fromEntries(WEAPON_MASTERY_TYPES.map(({ key }) => [key, 0]));
}

export function normalizeSkillMastery(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    WEAPON_MASTERY_TYPES.map(({ key }) => [key, normalizeMastery(source[key])]),
  );
}

export function getMasteryProgress(value) {
  const current = normalizeMastery(value);
  return {
    current,
    max: MASTERY_MAX,
    percent: (current / MASTERY_MAX) * 100,
  };
}
