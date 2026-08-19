import { normalizeCharacteristicPoints } from "./characteristics.js";

export const BASE_STAMINA = 10;
export const STAMINA_PER_ENDURANCE_POINT = 1;

export function getMaxStamina(stats = {}) {
  const endurance = normalizeCharacteristicPoints(stats).endurance;
  return BASE_STAMINA + endurance * STAMINA_PER_ENDURANCE_POINT;
}

export function normalizeMaxStamina(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : BASE_STAMINA;
}

export function normalizeCurrentStamina(value, maxStamina = BASE_STAMINA) {
  const maximum = normalizeMaxStamina(maxStamina);
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return maximum;
  return Math.min(maximum, Math.max(0, Math.floor(numeric)));
}
