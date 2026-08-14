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
