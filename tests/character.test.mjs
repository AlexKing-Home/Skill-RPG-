import assert from "node:assert/strict";
import test from "node:test";
import {
  fantasyBackground,
  femaleSwordsman,
  maleAssassin,
} from "../src/data/assets.js";
import { createCharacter, getSkinsByGender, skins } from "../src/data/skins.js";

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
