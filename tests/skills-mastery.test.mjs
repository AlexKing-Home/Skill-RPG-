import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  createEmptySkillMastery,
  getMasteryProgress,
  getVisibleWeaponMasteryTypes,
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

const expectedWeaponTypes = [
  { key: "oneHanded", label: "Одноручный меч" },
  { key: "twoHanded", label: "Двуручный меч" },
  { key: "rapier", label: "Рапира" },
  { key: "katana", label: "Катана" },
  { key: "spear", label: "Копьё" },
  { key: "dagger", label: "Кинжал" },
  { key: "bow", label: "Лук" },
  { key: "dualWield", label: "Два меча" },
];

test("skill mastery runs from zero to one thousand", () => {
  assert.equal(MASTERY_MAX, 1000);
  assert.equal(normalizeMastery(undefined), 0);
  assert.equal(normalizeMastery(-1), 0);
  assert.equal(normalizeMastery(1001), 1000);
  assert.deepEqual(getMasteryProgress(0), { current: 0, max: 1000, percent: 0 });
  assert.deepEqual(getMasteryProgress(500), { current: 500, max: 1000, percent: 50 });
});

test("weapon classes have independent mastery values", () => {
  assert.deepEqual(
    WEAPON_MASTERY_TYPES.map(({ key, label }) => ({ key, label })),
    expectedWeaponTypes,
  );

  assert.deepEqual(
    createEmptySkillMastery(),
    Object.fromEntries(expectedWeaponTypes.map(({ key }) => [key, 0])),
  );

  assert.deepEqual(normalizeSkillMastery({ oneHanded: 500, rapier: 1200, spear: 75 }), {
    oneHanded: 500,
    twoHanded: 0,
    rapier: 1000,
    katana: 0,
    spear: 75,
    dagger: 0,
    bow: 0,
    dualWield: 0,
  });
});

test("dual swords stay hidden until one-handed mastery is complete", () => {
  assert.deepEqual(
    getVisibleWeaponMasteryTypes({ oneHanded: 999 }).map(({ key }) => key),
    ["oneHanded", "twoHanded", "rapier", "katana", "spear", "dagger", "bow"],
  );

  assert.deepEqual(
    getVisibleWeaponMasteryTypes({ oneHanded: 1000 }).map(({ key }) => key),
    [
      "oneHanded",
      "twoHanded",
      "rapier",
      "katana",
      "spear",
      "dagger",
      "bow",
      "dualWield",
    ],
  );
});

test("skills subsection renders mastery and technique unlock progress", () => {
  assert.equal(WEAPON_MASTERY_TYPES.length, 8);
  assert.match(skillsViewSource, /getVisibleWeaponMasteryTypes/);
  assert.match(skillsViewSource, /getCombatProfileForWeapon/);
  assert.match(skillsViewSource, /visibleWeapons\.map/);
  assert.match(skillsViewSource, /weapon\.label/);
  assert.match(skillsViewSource, /role="progressbar"/);
  assert.match(skillsViewSource, /mastery\.current/);
  assert.match(skillsViewSource, /Открыто приёмов:/);
  assert.match(skillsViewSource, /Следующий:/);
  assert.match(characterScreenSource, /characterSection === "skills"/);
  assert.match(characterScreenSource, /<CharacterSkillsView character=\{activeCharacter\}/);
});

