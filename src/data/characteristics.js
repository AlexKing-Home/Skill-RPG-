export const CHARACTERISTIC_KEYS = [
  "strength",
  "agility",
  "accuracy",
  "stealth",
  "scouting",
  "lockpicking",
  "endurance",
  "will",
];

export const STARTING_CHARACTERISTIC_POINTS = 10;
export const WILL_HP_PER_POINT = 100;
export const WILL_REGEN_PER_POINT = 10;
export const WILL_REGEN_INTERVAL_MS = 10_000;

export function createEmptyCharacteristics() {
  return Object.fromEntries(CHARACTERISTIC_KEYS.map((key) => [key, 0]));
}

export function normalizeCharacteristicPoints(stats = {}) {
  return Object.fromEntries(
    CHARACTERISTIC_KEYS.map((key) => {
      const raw = Number(stats[key]);
      return [key, Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0];
    }),
  );
}

export function normalizeAvailableCharacteristicPoints(value) {
  const raw = Number(value);
  return Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : STARTING_CHARACTERISTIC_POINTS;
}

export function getSpentCharacteristicPoints(stats = {}) {
  return Object.values(normalizeCharacteristicPoints(stats)).reduce((total, value) => total + value, 0);
}

export function getWillBonuses(stats = {}) {
  const will = normalizeCharacteristicPoints(stats).will;
  return {
    will,
    maxHealthBonus: will * WILL_HP_PER_POINT,
    regenerationPerTick: will * WILL_REGEN_PER_POINT,
    regenerationIntervalMs: WILL_REGEN_INTERVAL_MS,
  };
}

export function getMaxHealth(stats = {}) {
  const baseHealth = Math.max(0, Number(stats.health) || 0);
  return baseHealth + getWillBonuses(stats).maxHealthBonus;
}
