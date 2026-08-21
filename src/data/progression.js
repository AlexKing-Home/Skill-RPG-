import { getSpentCharacteristicPoints, STARTING_CHARACTERISTIC_POINTS } from "./characteristics.js";
import { normalizeSkillMastery } from "./skills.js";

export const MASTERY_PER_HERO_LEVEL = 100;
export const CHARACTERISTIC_POINTS_PER_LEVEL = 10;

export const LEVEL_EXPERIENCE_RANGES = [
  { level: 1, start: 0, end: 100 },
  { level: 2, start: 100, end: 200 },
  { level: 3, start: 200, end: 400 },
  { level: 4, start: 400, end: 800 },
];

function normalizeExperience(experience) {
  const value = Number(experience);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function normalizeLevel(level) {
  const value = Number(level);
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

export function getTotalSkillMastery(skillMastery = {}) {
  return Object.values(normalizeSkillMastery(skillMastery)).reduce(
    (total, mastery) => total + mastery,
    0,
  );
}

export function getLevelFromSkillMastery(skillMastery = {}) {
  return Math.floor(getTotalSkillMastery(skillMastery) / MASTERY_PER_HERO_LEVEL) + 1;
}

export function getSkillProgression(skillMastery = {}) {
  const total = getTotalSkillMastery(skillMastery);
  const level = getLevelFromSkillMastery(skillMastery);
  const start = (level - 1) * MASTERY_PER_HERO_LEVEL;
  const end = level * MASTERY_PER_HERO_LEVEL;
  const segmentProgress = total - start;

  return {
    level,
    total,
    start,
    end,
    segmentProgress,
    segmentRequired: MASTERY_PER_HERO_LEVEL,
    percent: Math.min(100, Math.max(0, (segmentProgress / MASTERY_PER_HERO_LEVEL) * 100)),
  };
}

export function getCharacteristicPointBudget(level) {
  return Math.max(
    STARTING_CHARACTERISTIC_POINTS,
    normalizeLevel(level) * CHARACTERISTIC_POINTS_PER_LEVEL,
  );
}

export function getAvailableCharacteristicPoints(level, stats = {}) {
  return Math.max(0, getCharacteristicPointBudget(level) - getSpentCharacteristicPoints(stats));
}

// Legacy EXP helpers stay available so old saves and tests can still be migrated safely.
export function getLevelFromExperience(experience) {
  const total = normalizeExperience(experience);
  const range = LEVEL_EXPERIENCE_RANGES.find(({ end }) => total < end);
  return range?.level ?? 5;
}

export function getExperienceProgress(experience) {
  const total = normalizeExperience(experience);
  const range = LEVEL_EXPERIENCE_RANGES.find(({ end }) => total < end);

  if (!range) {
    return {
      level: 5,
      total,
      start: 800,
      end: null,
      segmentProgress: Math.max(0, total - 800),
      segmentRequired: null,
      percent: 100,
    };
  }

  const segmentRequired = range.end - range.start;
  const segmentProgress = total - range.start;

  return {
    level: range.level,
    total,
    start: range.start,
    end: range.end,
    segmentProgress,
    segmentRequired,
    percent: Math.min(100, Math.max(0, (segmentProgress / segmentRequired) * 100)),
  };
}
