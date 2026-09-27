import assert from "node:assert/strict";
import test from "node:test";
import { getCombatProfile, getCombatProfileForWeapon } from "../src/data/combatProfiles.js";
import { findOneHandedSwordSkill } from "../src/data/oneHandedSwordSkills.js";

test("swordsman uses one-handed sword combo resolver and mastery", () => {
  const profile = getCombatProfile("swordsman");
  assert.equal(profile.weaponType, "oneHanded");
  assert.equal(profile.masteryKey, "oneHanded");
  assert.equal(profile.findSkill, findOneHandedSwordSkill);
  assert.ok(profile.skills.length > 0);
});

test("starting classes use their own weapon mastery and techniques", () => {
  const expected = {
    spearman: "spear",
    assassin: "dagger",
    archer: "bow",
  };

  for (const [classId, weaponType] of Object.entries(expected)) {
    const profile = getCombatProfile(classId);
    assert.equal(profile.weaponType, weaponType);
    assert.equal(profile.masteryKey, weaponType);
    assert.equal(typeof profile.findSkill, "function");
    assert.ok(profile.skills.length > 0);
  }
});

test("equipped weapon overrides the class default combat profile", () => {
  const profile = getCombatProfile("swordsman", {
    weapon1: { name: "Учебная рапира", weaponType: "rapier" },
  });

  assert.equal(profile.weaponType, "rapier");
  assert.equal(profile.masteryKey, "rapier");
  assert.equal(profile.label, "Рапира");
  assert.ok(profile.skills.length > 0);
});

test("future equipment weapon types already have independent combat profiles", () => {
  for (const weaponType of ["twoHanded", "rapier", "katana", "dualWield"]) {
    const profile = getCombatProfileForWeapon(weaponType);
    assert.equal(profile.weaponType, weaponType);
    assert.equal(profile.masteryKey, weaponType);
    assert.ok(profile.skills.length > 0);
  }
});

test("unknown classes and weapon types fall back to a neutral combat profile", () => {
  const classProfile = getCombatProfile("unknown");
  const weaponProfile = getCombatProfileForWeapon("unknown");

  assert.equal(classProfile.weaponType, "unarmed");
  assert.equal(classProfile.findSkill, null);
  assert.equal(classProfile.masteryKey, null);
  assert.equal(weaponProfile.weaponType, "unarmed");
});
