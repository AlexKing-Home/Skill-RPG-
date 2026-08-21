import assert from "node:assert/strict";
import test from "node:test";
import {
  ONE_HANDED_SWORD_SKILLS,
  findOneHandedSwordSkill,
} from "../src/data/oneHandedSwordSkills.js";

const expectedSkills = [
  "Косой удар",
  "Вертикальный удар",
  "Горизонтальный удар",
  "Восходящий удар",
  "Яростный выпад",
  "Звуковой прыжок",
  "Вертикальная дуга",
  "Острый гвоздь",
  "Свирепый рычаг",
  "Горизонтальный квадрат",
  "Вертикальный квадрат",
  "Смертельный удар",
  "Смертные грехи",
  "Воющая октава",
  "Восхождение Новы",
];

const expectedCombos = {
  slant: ["left", "down"],
  vertical: ["up", "down"],
  horizontal: ["left", "right"],
  uppercut: ["down", "up"],
  "rage-spike": ["right", "right", "right"],
  "sonic-leap": ["up", "up", "down"],
  "vertical-arc": ["down", "up", "left", "down"],
  "sharp-nail": ["left", "right", "left", "down"],
  "savage-fulcrum": ["right", "left", "down", "right"],
  "horizontal-square": ["left", "right", "left", "right", "down"],
  "vertical-square": ["up", "down", "up", "down", "right"],
  "vorpal-strike": ["right", "right", "down", "right", "up"],
  "deadly-sins": ["left", "down", "right", "up", "down"],
  "howling-octave": ["up", "right", "down", "left", "right"],
  "nova-ascension": ["down", "left", "up", "right", "down"],
};

const expectedStaminaCosts = {
  slant: 1,
  vertical: 1,
  horizontal: 1,
  uppercut: 1,
  "rage-spike": 2,
  "sonic-leap": 2,
  "vertical-arc": 2,
  "sharp-nail": 3,
  "savage-fulcrum": 3,
  "horizontal-square": 3,
  "vertical-square": 3,
  "vorpal-strike": 4,
  "deadly-sins": 4,
  "howling-octave": 5,
  "nova-ascension": 6,
};

test("one-handed sword exposes all 15 configured skills in Russian", () => {
  assert.deepEqual(
    ONE_HANDED_SWORD_SKILLS.map((skill) => skill.name),
    expectedSkills,
  );
});

test("all one-handed sword skills keep their configured combat combinations", () => {
  for (const skill of ONE_HANDED_SWORD_SKILLS) {
    assert.deepEqual(skill.combo, expectedCombos[skill.id], skill.name);
    assert.ok(skill.originalName.length > 0, skill.name);
  }
});

test("all one-handed sword skills keep their configured stamina costs", () => {
  for (const skill of ONE_HANDED_SWORD_SKILLS) {
    assert.equal(skill.staminaCost, expectedStaminaCosts[skill.id], skill.name);
  }
});

test("one-handed sword skill combinations are unique and fit the five-input limit", () => {
  const comboKeys = ONE_HANDED_SWORD_SKILLS.map((skill) => skill.combo.join("|"));
  assert.equal(new Set(comboKeys).size, comboKeys.length);

  for (const skill of ONE_HANDED_SWORD_SKILLS) {
    assert.ok(skill.combo.length >= 2 && skill.combo.length <= 5, skill.name);
    assert.ok(skill.description.length > 0, skill.name);
  }
});

test("skills after Sonic Leap use harder four- and five-input combinations", () => {
  const sonicLeapIndex = ONE_HANDED_SWORD_SKILLS.findIndex((skill) => skill.id === "sonic-leap");
  const advancedSkills = ONE_HANDED_SWORD_SKILLS.slice(sonicLeapIndex + 1);

  for (const skill of advancedSkills.slice(0, 3)) {
    assert.equal(skill.combo.length, 4, skill.name);
  }

  for (const skill of advancedSkills.slice(3)) {
    assert.equal(skill.combo.length, 5, skill.name);
  }
});

test("one-handed sword resolver returns the matching skill only for a complete combo", () => {
  for (const skill of ONE_HANDED_SWORD_SKILLS) {
    assert.equal(findOneHandedSwordSkill(skill.combo)?.id, skill.id);
  }

  assert.equal(findOneHandedSwordSkill(["left"]), undefined);
  assert.equal(findOneHandedSwordSkill(["left", "left"]), undefined);
});
