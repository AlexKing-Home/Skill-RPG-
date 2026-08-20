export const MASTERY_MAX = 1000;

export function normalizeMastery(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(MASTERY_MAX, Math.max(0, Math.floor(numeric)));
}

export function getMasteryProgress(value) {
  const current = normalizeMastery(value);
  return {
    current,
    max: MASTERY_MAX,
    percent: (current / MASTERY_MAX) * 100,
  };
}
