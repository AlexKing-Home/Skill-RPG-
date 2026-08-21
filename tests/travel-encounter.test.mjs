import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  WILD_BOAR_ENCOUNTER_CHANCE,
  rollTravelEncounter,
  shouldTriggerWildBoarEncounter,
} from "../src/data/travelEncounters.js";
import { getTravelRoute } from "../src/data/worldNavigation.js";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const worldMapView = await read("../src/components/WorldMapView.jsx");
const characterScreen = await read("../src/screens/CharacterScreen.jsx");

test("wild boar encounter chance is exactly 50 percent", () => {
  assert.equal(WILD_BOAR_ENCOUNTER_CHANCE, 0.5);
  assert.equal(shouldTriggerWildBoarEncounter(0), true);
  assert.equal(shouldTriggerWildBoarEncounter(0.499999), true);
  assert.equal(shouldTriggerWildBoarEncounter(0.5), false);
  assert.equal(shouldTriggerWildBoarEncounter(0.99), false);
  assert.equal(rollTravelEncounter(0.25)?.name, "Дикий кабан");
  assert.equal(rollTravelEncounter(0.75), null);
});

test("world travel is twice as slow and encounter interrupts the route", () => {
  const directRoute = getTravelRoute("swamp", "ruins");
  assert.equal(directRoute.travelMs, 1300);
  assert.match(worldMapView, /const TRAVEL_STEP_MS = 1300/);
  assert.match(worldMapView, /rollTravelEncounter\(\)/);
  assert.match(worldMapView, /onEncounter\?\./);
  assert.match(worldMapView, /clearTravelTimers\(\);\s*setIsTraveling\(false\)/);
});

test("wild boar attack automatically opens the battle tab", () => {
  assert.match(characterScreen, /function handleEncounter\(encounter\)/);
  assert.match(characterScreen, /setActiveEncounter\(encounter\)/);
  assert.match(characterScreen, /setActiveTab\("battle"\)/);
  assert.match(characterScreen, /<BattleView[\s\S]*encounter=\{activeEncounter\}/);
  assert.match(characterScreen, /currentStamina=\{currentStamina\}/);
  assert.match(characterScreen, /maxStamina=\{maxStamina\}/);
  assert.match(characterScreen, /onSkillActivate=\{handleSkillActivate\}/);
  assert.match(characterScreen, /onEncounter=\{handleEncounter\}/);
});
