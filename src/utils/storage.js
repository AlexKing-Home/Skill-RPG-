import {
  createEmptyCharacteristics,
  STARTING_CHARACTERISTIC_POINTS,
} from "../data/characteristics.js";
import { getAvailableCharacteristicPoints, getLevelFromSkillMastery } from "../data/progression.js";
import { normalizeSkillMastery } from "../data/skills.js";
import { getDefaultStatsForClass } from "../data/skins.js";
import { getMaxStamina, normalizeCurrentStamina } from "../data/stamina.js";

const SAVE_KEY = "skill-rpg.save.v1";
const CURRENT_CHARACTER_VERSION = 7;
const CHARACTERISTICS_POINT_POOL_VERSION = 7;

export function normalizeCharacter(character) {
  if (!character || typeof character !== "object") return null;

  const { level: _legacyLevel, ...rest } = character;
  const rawExperience = Number(rest.experience);
  const experience = Number.isFinite(rawExperience) ? Math.max(0, Math.floor(rawExperience)) : 0;
  const skillMastery = normalizeSkillMastery(rest.skillMastery);
  const rawVersion = Number(rest.version);
  const sourceVersion = Number.isFinite(rawVersion) ? Math.floor(rawVersion) : 1;
  const version = Math.max(CURRENT_CHARACTER_VERSION, sourceVersion);
  const defaults = getDefaultStatsForClass(rest.classId);
  const existingStats = rest.stats ?? {};
  const usesPointPool = sourceVersion >= CHARACTERISTICS_POINT_POOL_VERSION;
  const characteristics = usesPointPool
    ? Object.fromEntries(
        Object.entries(createEmptyCharacteristics()).map(([key]) => {
          const raw = Number(existingStats[key]);
          return [key, Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0];
        }),
      )
    : createEmptyCharacteristics();
  const stats = {
    ...defaults,
    ...existingStats,
    ...characteristics,
  };
  const level = getLevelFromSkillMastery(skillMastery);
  const characteristicPoints = usesPointPool
    ? getAvailableCharacteristicPoints(level, stats)
    : STARTING_CHARACTERISTIC_POINTS;
  const maxStamina = getMaxStamina(stats);
  const currentStamina = normalizeCurrentStamina(rest.currentStamina, maxStamina);

  return {
    ...rest,
    version,
    experience,
    skillMastery,
    characteristicPoints,
    maxStamina,
    currentStamina,
    stats,
  };
}

export function saveCharacter(character) {
  const normalized = normalizeCharacter(character);
  if (!normalized) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(normalized));
}

export function loadCharacter() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const normalized = normalizeCharacter(JSON.parse(raw));
    if (!normalized?.nickname || !normalized?.skinId || !normalized?.stats) return null;
    return normalized;
  } catch {
    return null;
  }
}
