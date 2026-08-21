import assert from "node:assert/strict";
import test from "node:test";
import { getCombatProfile } from "../src/data/combatProfiles.js";
import { findOneHandedSwordSkill } from "../src/data/oneHandedSwordSkills.js";

test("swordsman uses one-handed sword combo resolver and mastery", () => {
  const profile = getCombatProfile("swordsman");
  assert.equal(profile.weaponType, "oneHanded");
  assert.equal(profile.masteryKey, "oneHanded");
  assert.equal(profile.findSkill, findOneHandedSwordSkill);
});

test("classes without implemented combo tables cannot trigger sword skills", () => {
  for (const classId of ["spearman", "assassin", "archer"]) {
    const profile = getCombatProfile(classId);
    assert.equal(profile.findSkill, null, `${classId} must not use sword combinations`);
    assert.equal(profile.masteryKey, null, `${classId} must not gain sword mastery`);
  }
});

test("unknown classes fall back to a neutral combat profile", () => {
  const profile = getCombatProfile("unknown");
  assert.equal(profile.weaponType, "unarmed");
  assert.equal(profile.findSkill, null);
  assert.equal(profile.masteryKey, null);
});
