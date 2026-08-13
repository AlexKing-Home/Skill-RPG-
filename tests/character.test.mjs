import assert from "node:assert/strict";
import test from "node:test";
import { createCharacter, getSkinsByGender, skins } from "../src/data/skins.js";

const dataUriPattern = /^data:image\/jpeg;base64,/;

test("there are exactly eight unique skins", () => {
  assert.equal(skins.length, 8);
  assert.equal(new Set(skins.map((skin) => skin.id)).size, 8);
});

test("male and female each have four classes", () => {
  assert.deepEqual(getSkinsByGender("male").map((skin) => skin.classId), ["swordsman", "spearman", "assassin", "archer"]);
  assert.deepEqual(getSkinsByGender("female").map((skin) => skin.classId), ["swordsman", "spearman", "assassin", "archer"]);
});

test("all eight skin images are embedded locally in React data", () => {
  for (const skin of skins) {
    assert.match(skin.image, dataUriPattern, `${skin.id} image is not embedded`);
    assert.ok(skin.image.length > 4000, `${skin.id} image data is unexpectedly short`);
  }
});

test("female assassin and archer are separate standalone assets", () => {
  const assassin = skins.find((skin) => skin.id === "female-assassin");
  const archer = skins.find((skin) => skin.id === "female-archer");
  assert.notEqual(assassin.image, archer.image);
  assert.match(assassin.image, dataUriPattern);
  assert.match(archer.image, dataUriPattern);
});

test("character has defense and no mana", () => {
  const character = createCharacter("Hero", skins[0]);
  assert.equal(character.stats.defense, 12);
  assert.equal("mana" in character.stats, false);
});
