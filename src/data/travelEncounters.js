import { wildBoarArt } from "./wildBoarArt.js";

export const WILD_BOAR_ENCOUNTER_CHANCE = 0.5;

export const wildBoarEncounter = {
  id: "wild-boar",
  name: "Дикий кабан",
  kind: "mob",
  image: wildBoarArt,
};

export function resolveTravelEncounter(encounter) {
  if (!encounter || encounter.id === wildBoarEncounter.id) {
    return { ...wildBoarEncounter, ...(encounter ?? {}) };
  }

  return encounter;
}

export function shouldTriggerWildBoarEncounter(randomValue = Math.random()) {
  return randomValue < WILD_BOAR_ENCOUNTER_CHANCE;
}

export function rollTravelEncounter(randomValue = Math.random()) {
  return shouldTriggerWildBoarEncounter(randomValue) ? { ...wildBoarEncounter } : null;
}
