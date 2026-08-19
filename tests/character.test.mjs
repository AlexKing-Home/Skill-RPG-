import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fantasyBackground, femaleSwordsman, maleAssassin } from "../src/data/assets.js";
import {
  CHARACTERISTIC_KEYS,
  getMaxHealth,
  getWillBonuses,
  WILL_HP_PER_POINT,
  WILL_REGEN_INTERVAL_MS,
  WILL_REGEN_PER_POINT,
} from "../src/data/characteristics.js";
import { createEmptyEquipment, EQUIPMENT_SLOTS } from "../src/data/equipment.js";
import {
  getExperienceProgress,
  getLevelFromExperience,
  LEVEL_EXPERIENCE_RANGES,
} from "../src/data/progression.js";
import { createCharacter, getSkinsByGender, skins } from "../src/data/skins.js";
import { BASE_STAMINA, normalizeCurrentStamina, normalizeMaxStamina } from "../src/data/stamina.js";
import { normalizeCharacter } from "../src/utils/storage.js";

const externalUrlPattern = /^https?:\/\//;

test("there are exactly eight unique skins", () => {
  assert.equal(skins.length, 8);
  assert.equal(new Set(skins.map((skin) => skin.id)).size, 8);
});

test("male and female each have four classes", () => {
  assert.deepEqual(
    getSkinsByGender("male").map((skin) => skin.classId),
    ["swordsman", "spearman", "assassin", "archer"],
  );
  assert.deepEqual(
    getSkinsByGender("female").map((skin) => skin.classId),
    ["swordsman", "spearman", "assassin", "archer"],
  );
});

test("all game art uses local Vite assets", () => {
  assert.equal(externalUrlPattern.test(fantasyBackground), false);
  assert.match(fantasyBackground, /^\/backgrounds\//);
  for (const skin of skins) {
    assert.equal(externalUrlPattern.test(skin.image), false, `${skin.id} uses an external URL`);
    assert.match(skin.image, /^\/skins\//, `${skin.id} is not a local skin asset`);
  }
});

test("male assassin and female swordswoman use repaired standalone paths", () => {
  assert.match(maleAssassin, /male-assassin\.jpg/);
  assert.match(femaleSwordsman, /female-swordsman\.jpg/);
  assert.notEqual(maleAssassin, femaleSwordsman);
});

test("character has defense and no mana", () => {
  const character = createCharacter("Hero", skins[0]);
  assert.equal(character.stats.defense, 12);
  assert.equal("mana" in character.stats, false);
});

test("all requested character characteristics start at zero", () => {
  for (const skin of skins) {
    const character = createCharacter("Hero", skin);
    for (const key of CHARACTERISTIC_KEYS) {
      assert.equal(character.stats[key], 0, `${skin.id}.${key} must start at zero`);
    }
  }
});

test("will grants 100 HP and 10 regeneration every 10 seconds per point", () => {
  const character = createCharacter("Hero", skins[0]);
  const baseHealth = character.stats.health;
  const stats = { ...character.stats, will: 1 };
  const bonuses = getWillBonuses(stats);

  assert.equal(WILL_HP_PER_POINT, 100);
  assert.equal(WILL_REGEN_PER_POINT, 10);
  assert.equal(WILL_REGEN_INTERVAL_MS, 10_000);
  assert.equal(bonuses.maxHealthBonus, 100);
  assert.equal(bonuses.regenerationPerTick, 10);
  assert.equal(getMaxHealth(stats), baseHealth + 100);
});

test("new character starts with 10 stamina and HUD defaults", () => {
  const character = createCharacter("Hero", skins[0]);
  assert.equal(character.version, 6);
  assert.equal(character.experience, 0);
  assert.equal("level" in character, false);
  assert.equal(character.currentHealth, character.stats.health);
  assert.equal(BASE_STAMINA, 10);
  assert.equal(character.maxStamina, 10);
  assert.equal(character.currentStamina, 10);
  assert.deepEqual(character.equipment, createEmptyEquipment());
  assert.equal(EQUIPMENT_SLOTS.length, 9);
});

test("stamina normalization keeps the resource between zero and maximum", () => {
  assert.equal(normalizeMaxStamina(undefined), 10);
  assert.equal(normalizeCurrentStamina(undefined, 10), 10);
  assert.equal(normalizeCurrentStamina(12, 10), 10);
  assert.equal(normalizeCurrentStamina(-3, 10), 0);
});

test("legacy saves drop stored level and preserve experience as the source of truth", () => {
  const legacy = {
    ...createCharacter("Hero", skins[0]),
    version: 2,
    level: 99,
    experience: 250,
  };
  delete legacy.maxStamina;
  delete legacy.currentStamina;
  const normalized = normalizeCharacter(legacy);

  assert.equal(normalized.version, 6);
  assert.equal(normalized.experience, 250);
  assert.equal("level" in normalized, false);
  assert.equal(normalized.maxStamina, 10);
  assert.equal(normalized.currentStamina, 10);
  assert.equal(getLevelFromExperience(normalized.experience), 3);
});

test("version 4 saves reset old characteristic values to zero", () => {
  const legacy = createCharacter("Hero", skins[2]);
  legacy.version = 4;
  legacy.stats = {
    ...legacy.stats,
    strength: 16,
    agility: 15,
    stealth: 15,
    scouting: 10,
    lockpicking: 14,
    endurance: 8,
  };
  const normalized = normalizeCharacter(legacy);

  assert.equal(normalized.version, 6);
  for (const key of CHARACTERISTIC_KEYS) {
    assert.equal(normalized.stats[key], 0, `${key} was not reset`);
  }
  assert.equal(normalized.stats.attack, 16);
  assert.equal(normalized.stats.health, 90);
});

test("version 5 saves preserve allocated characteristic points", () => {
  const current = createCharacter("Hero", skins[0]);
  current.version = 5;
  current.stats.will = 3;
  current.stats.strength = 2;
  const normalized = normalizeCharacter(current);

  assert.equal(normalized.version, 6);
  assert.equal(normalized.stats.will, 3);
  assert.equal(normalized.stats.strength, 2);
  assert.equal(getMaxHealth(normalized.stats), normalized.stats.health + 300);
});

test("experience thresholds match levels 1 through 5", () => {
  assert.deepEqual(LEVEL_EXPERIENCE_RANGES, [
    { level: 1, start: 0, end: 100 },
    { level: 2, start: 100, end: 200 },
    { level: 3, start: 200, end: 400 },
    { level: 4, start: 400, end: 800 },
  ]);

  assert.equal(getLevelFromExperience(0), 1);
  assert.equal(getLevelFromExperience(99), 1);
  assert.equal(getLevelFromExperience(100), 2);
  assert.equal(getLevelFromExperience(199), 2);
  assert.equal(getLevelFromExperience(200), 3);
  assert.equal(getLevelFromExperience(399), 3);
  assert.equal(getLevelFromExperience(400), 4);
  assert.equal(getLevelFromExperience(799), 4);
  assert.equal(getLevelFromExperience(800), 5);
});

test("experience bar uses progress inside the active level range", () => {
  assert.equal(getExperienceProgress(50).percent, 50);
  assert.equal(getExperienceProgress(150).percent, 50);
  assert.equal(getExperienceProgress(300).percent, 50);
  assert.equal(getExperienceProgress(600).percent, 50);
});

test("navigation remains driven by the approved reference crops", () => {
  const css = readFileSync(new URL("../src/navigation-reference-v9.css", import.meta.url), "utf8");
  const navigationAssets = [
    "tabs-map.webp",
    "tabs-location.webp",
    "tabs-character.webp",
    "bottom-main-map.webp",
    "bottom-character.webp",
  ];

  for (const asset of navigationAssets) {
    assert.match(css, new RegExp(asset.replace(".", "\\.")), `${asset} is no longer referenced`);
    assert.equal(
      existsSync(new URL(`../public/ui/navigation/${asset}`, import.meta.url)),
      true,
      `${asset} is missing`,
    );
  }

  assert.match(css, /\.game-tabs--map\s*\{[^}]*background-image:\s*var\(--nav-tabs-map\)/s);
  assert.match(
    css,
    /\.bottom-nav--main\s*\{[^}]*background-image:\s*var\(--nav-bottom-main-map\)/s,
  );
  assert.match(
    css,
    /\.bottom-nav--character\s*\{[^}]*background-image:\s*var\(--nav-bottom-character\)/s,
  );
  assert.match(css, /\.game-tab > span[\s\S]*visibility:\s*hidden/);
  assert.match(css, /\.bottom-nav--main \.bottom-nav__item > span[\s\S]*visibility:\s*hidden/);
});
