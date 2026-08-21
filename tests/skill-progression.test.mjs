import assert from "node:assert/strict";
import test from "node:test";
import {
  CHARACTERISTIC_POINTS_PER_LEVEL,
  getAvailableCharacteristicPoints,
  getCharacteristicPointBudget,
  getLevelFromSkillMastery,
  getSkillProgression,
  getTotalSkillMastery,
  MASTERY_PER_HERO_LEVEL,
} from "../src/data/progression.js";
import {
  increaseWeaponMastery,
  MASTERY_GAIN_PER_ACTIVATION,
  MASTERY_MAX,
} from "../src/data/skills.js";

test("successful skill activations increase only the matching weapon mastery", () => {
  const initial = { oneHanded: 99, twoHanded: 7 };
  const next = increaseWeaponMastery(initial, "oneHanded");

  assert.equal(MASTERY_GAIN_PER_ACTIVATION, 1);
  assert.equal(next.oneHanded, 100);
  assert.equal(next.twoHanded, 7);
});

test("weapon mastery remains capped at one thousand", () => {
  const next = increaseWeaponMastery({ oneHanded: MASTERY_MAX }, "oneHanded", 50);
  assert.equal(next.oneHanded, MASTERY_MAX);
});

test("hero level is derived from total weapon mastery", () => {
  assert.equal(MASTERY_PER_HERO_LEVEL, 100);
  assert.equal(getLevelFromSkillMastery({ oneHanded: 0 }), 1);
  assert.equal(getLevelFromSkillMastery({ oneHanded: 99 }), 1);
  assert.equal(getLevelFromSkillMastery({ oneHanded: 100 }), 2);
  assert.equal(getLevelFromSkillMastery({ oneHanded: 80, rapier: 20 }), 2);
  assert.equal(getTotalSkillMastery({ oneHanded: 80, rapier: 20 }), 100);
});

test("mastery progress resets within each hero level", () => {
  assert.deepEqual(getSkillProgression({ oneHanded: 50 }), {
    level: 1,
    total: 50,
    start: 0,
    end: 100,
    segmentProgress: 50,
    segmentRequired: 100,
    percent: 50,
  });

  assert.deepEqual(getSkillProgression({ oneHanded: 150 }), {
    level: 2,
    total: 150,
    start: 100,
    end: 200,
    segmentProgress: 50,
    segmentRequired: 100,
    percent: 50,
  });
});

test("each hero level grants ten total characteristic points", () => {
  assert.equal(CHARACTERISTIC_POINTS_PER_LEVEL, 10);
  assert.equal(getCharacteristicPointBudget(1), 10);
  assert.equal(getCharacteristicPointBudget(2), 20);
  assert.equal(getCharacteristicPointBudget(5), 50);
  assert.equal(getAvailableCharacteristicPoints(2, { strength: 4, endurance: 6 }), 10);
});
