import assert from "node:assert/strict";
import test from "node:test";
import {
  BOW_SKILLS,
  DAGGER_SKILLS,
  DUAL_WIELD_SKILLS,
  findSkillInList,
  KATANA_SKILLS,
  RAPIER_SKILLS,
  SPEAR_SKILLS,
  TWO_HANDED_SWORD_SKILLS,
} from "../src/data/weaponTechniqueSkills.js";

const weaponSkillSets = {
  twoHanded: TWO_HANDED_SWORD_SKILLS,
  rapier: RAPIER_SKILLS,
  katana: KATANA_SKILLS,
  spear: SPEAR_SKILLS,
  dagger: DAGGER_SKILLS,
  bow: BOW_SKILLS,
  dualWield: DUAL_WIELD_SKILLS,
};

test("every configured weapon has starter techniques and a mastery capstone", () => {
  for (const [weaponType, skills] of Object.entries(weaponSkillSets)) {
    assert.ok(skills.length >= 6, weaponType);
    assert.equal(skills[0].masteryRequired, 0, weaponType);
    assert.equal(skills[1].masteryRequired, 0, weaponType);
    assert.equal(skills.at(-1).masteryRequired, 1000, weaponType);

    for (let index = 1; index < skills.length; index += 1) {
      assert.ok(
        skills[index].masteryRequired >= skills[index - 1].masteryRequired,
        `${weaponType}: ${skills[index].name}`,
      );
    }
  }
});

test("weapon technique combinations resolve only within their active weapon list", () => {
  for (const [weaponType, skills] of Object.entries(weaponSkillSets)) {
    const comboKeys = skills.map((skill) => skill.combo.join("|"));
    assert.equal(new Set(comboKeys).size, comboKeys.length, weaponType);

    for (const skill of skills) {
      assert.equal(findSkillInList(skills, skill.combo)?.id, skill.id, skill.name);
      assert.ok(skill.combo.length >= 2 && skill.combo.length <= 5, skill.name);
      assert.ok(skill.staminaCost >= 1 && skill.staminaCost <= 6, skill.name);
    }
  }
});

test("previously defined weapon technique names are preserved", () => {
  assert.deepEqual(
    RAPIER_SKILLS.map(({ originalName }) => originalName),
    [
      "Linear",
      "Oblique",
      "Parallel Sting",
      "Triangular",
      "Shooting Star",
      "Quadruple Pain",
      "Star Splash",
      "Flashing Penetrator",
    ],
  );

  assert.deepEqual(
    KATANA_SKILLS.map(({ originalName }) => originalName),
    ["Tsujikaze", "Gengetsu", "Ukifune", "Tsumujiguruma", "Hiōgi", "Iai"],
  );

  assert.deepEqual(
    SPEAR_SKILLS.map(({ originalName }) => originalName),
    [
      "Sonic Charge",
      "Helical Twice",
      "Triple Thrust",
      "Spin Slash",
      "Digger Glint",
      "Forward Spiral",
      "Blast Spear",
      "Spiral Gate",
      "Vulture Stinger",
      "Wild Twister",
      "Fatal Thrust",
    ],
  );

  assert.deepEqual(
    DAGGER_SKILLS.map(({ originalName }) => originalName),
    [
      "Rapid Bite",
      "Venom Bite",
      "Quick Throw",
      "Fade Edge",
      "Mirage Fang",
      "Paralyze Bite",
      "Reckless Tusk",
      "Axel Raid",
      "Lightning Ripper",
    ],
  );

  assert.deepEqual(
    TWO_HANDED_SWORD_SKILLS.map(({ originalName }) => originalName),
    [
      "Swordfall",
      "Avalanche",
      "Cyclone",
      "Brave Leap",
      "Blade Torrent",
      "Brutal Fang",
      "Backlash",
      "Piercing Blast",
      "Cascade",
      "Vertical Blaster",
    ],
  );

  assert.deepEqual(
    DUAL_WIELD_SKILLS.map(({ originalName }) => originalName),
    [
      "Double Circular",
      "Gale Slicer",
      "End Revolver",
      "Cygnus Onslaught",
      "Specula Cross",
      "Cross Combination",
      "Twin Blade Rush",
      "Skill Explode",
      "Starburst Stream",
      "The Eclipse",
    ],
  );
});
