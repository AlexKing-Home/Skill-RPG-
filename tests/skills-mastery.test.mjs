import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  createEmptySkillMastery,
  getMasteryProgress,
  MASTERY_MAX,
  normalizeMastery,
  normalizeSkillMastery,
  WEAPON_MASTERY_TYPES,
} from "../src/data/skills.js";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const skillsViewSource = await read("../src/components/CharacterSkillsView.jsx");
const characterScreenSource = await read("../src/screens/CharacterScreen.jsx");

test("skill mastery runs from zero to one thousand", () => {
  assert.equal(MASTERY_MAX, 1000);
  assert.equal(normalizeMastery(undefined), 0);
  assert.equal(normalizeMastery(-1), 0);
  assert.equal(normalizeMastery(1001), 1000);
  assert.deepEqual(getMasteryProgress(0), { current: 0, max: 1000, percent: 0 });
  assert.deepEqual(getMasteryProgress(500), { current: 500, max: 1000, percent: 50 });
});

test("four requested weapon classes have independent mastery values", () => {
  assert.deepEqual(
    WEAPON_MASTERY_TYPES.map(({ key, label }) => ({ key, label })),
    [
      { key: "oneHanded", label: "Одноручный меч" },
      { key: "twoHanded", label: "Двуручный меч" },
      { key: "rapier", label: "Рапира" },
      { key: "katana", label: "Катана" },
    ],
  );

  assert.deepEqual(createEmptySkillMastery(), {
    oneHanded: 0,
    twoHanded: 0,
    rapier: 0,
    katana: 0,
  });

  assert.deepEqual(normalizeSkillMastery({ oneHanded: 500, rapier: 1200 }), {
    oneHanded: 500,
    twoHanded: 0,
    rapier: 1000,
    katana: 0,
  });
});

test("skills subsection renders a mastery bar for every weapon class", () => {
  assert.equal(WEAPON_MASTERY_TYPES.length, 4);
  assert.match(skillsViewSource, /WEAPON_MASTERY_TYPES\.map/);
  assert.match(skillsViewSource, /weapon\.label/);
  assert.match(skillsViewSource, /role="progressbar"/);
  assert.match(skillsViewSource, /mastery\.current/);
  assert.match(skillsViewSource, /mastery\.max/);
  assert.match(characterScreenSource, /characterSection === "skills"/);
  assert.match(characterScreenSource, /<CharacterSkillsView character=\{activeCharacter\}/);
});
