import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { getMasteryProgress, MASTERY_MAX, normalizeMastery } from "../src/data/skills.js";

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

test("skills subsection renders the mastery bar", () => {
  assert.match(skillsViewSource, /Мастерство/);
  assert.match(skillsViewSource, /role="progressbar"/);
  assert.match(skillsViewSource, /mastery\.current/);
  assert.match(skillsViewSource, /mastery\.max/);
  assert.match(characterScreenSource, /characterSection === "skills"/);
  assert.match(characterScreenSource, /<CharacterSkillsView character=\{activeCharacter\}/);
});
