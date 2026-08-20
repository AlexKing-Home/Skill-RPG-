export const WILD_BOAR_ENCOUNTER_CHANCE = 0.5;

export const wildBoarEncounter = {
  id: "wild-boar",
  name: "Дикий кабан",
  kind: "mob",
};

export function shouldTriggerWildBoarEncounter(randomValue = Math.random()) {
  return randomValue < WILD_BOAR_ENCOUNTER_CHANCE;
}

export function rollTravelEncounter(randomValue = Math.random()) {
  return shouldTriggerWildBoarEncounter(randomValue) ? { ...wildBoarEncounter } : null;
}
