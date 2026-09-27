import test from "node:test";
import assert from "node:assert/strict";
import {
  createBattle,
  resumeBattle,
  resolvePlayerAction,
  resolveEnemyAttack,
  ENEMY_ATTACK_INTERVAL_MS,
  PARRY_WINDOW_MS,
} from "../src/data/combat.js";
import { wildBoarEncounter } from "../src/data/travelEncounters.js";
import { ONE_HANDED_SWORD_SKILLS } from "../src/data/oneHandedSwordSkills.js";
import { saveCharacter, loadCharacter } from "../src/utils/storage.js";
import { createCharacter, skins } from "../src/data/skins.js";

function fixture() {
  return {
    stats: { attack: 14, defense: 12 },
    currentHealth: 120,
    currentStamina: 10,
    activeEncounter: createBattle(wildBoarEncounter, 0),
  };
}
function act(state, action, now = 0) {
  const result = resolvePlayerAction(state, action, now);
  assert.equal(result.accepted, true);
  return { ...state, ...result.changes };
}

test("basic attacks deal damage even without stamina, for all four classes", () => {
  for (const classId of ["swordsman", "spearman", "assassin", "archer"]) {
    const hero = createCharacter(
      "Тест",
      skins.find((s) => s.classId === classId),
    );
    const before = { ...fixture(), stats: hero.stats, currentStamina: 0 };
    const after = act(before, { direction: "left" });
    assert.ok(after.activeEncounter.currentHealth < 25);
    assert.equal(after.currentStamina, 0);
    assert.equal(before.activeEncounter.currentHealth, 25);
  }
});

test("every configured skill deals damage and consumes its exact stamina cost", () => {
  for (const skill of ONE_HANDED_SWORD_SKILLS) {
    const result = act(fixture(), { skill });
    assert.ok(result.activeEncounter.currentHealth < 25, skill.id);
    assert.equal(result.currentStamina, 10 - skill.staminaCost);
  }
});

test("insufficient stamina rejects skills and defense without changing the battle", () => {
  const state = { ...fixture(), currentStamina: 0 };
  for (const action of [
    { skill: ONE_HANDED_SWORD_SKILLS[0] },
    { direction: "up" },
    { direction: "down" },
  ]) {
    assert.equal(resolvePlayerAction(state, action).accepted, false);
  }
  assert.equal(state.activeEncounter.currentHealth, 25);
});

test("enemy attacks only when due and schedules the next attack", () => {
  const state = fixture();
  assert.equal(resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS - 1), null);
  const next = resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS);
  assert.equal(next.currentHealth, 108);
  assert.equal(next.activeEncounter.nextAttackAt, ENEMY_ATTACK_INTERVAL_MS * 2);
});

test("block reduces one attack by 75 percent then expires", () => {
  const state = act(fixture(), { direction: "up" });
  const blocked = resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS);
  assert.equal(blocked.currentHealth, 117);
  assert.equal(blocked.activeEncounter.guard, null);
  const second = resolveEnemyAttack({ ...state, ...blocked }, ENEMY_ATTACK_INTERVAL_MS * 2);
  assert.equal(second.currentHealth, 105);
});

test("timed parry prevents damage and deals counter damage", () => {
  const state = act(fixture(), { direction: "down" }, ENEMY_ATTACK_INTERVAL_MS - 500);
  const result = resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS);
  assert.equal(result.currentHealth, 120);
  assert.equal(result.activeEncounter.currentHealth, 21);
  assert.equal(state.currentStamina, 8);
});

test("early parry expires and offensive actions cancel the guard", () => {
  const state = act(fixture(), { direction: "down" }, 0);
  assert.ok(PARRY_WINDOW_MS < ENEMY_ATTACK_INTERVAL_MS);
  assert.equal(resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS).currentHealth, 108);
  const blocked = act(fixture(), { direction: "up" });
  assert.equal(act(blocked, { direction: "right" }).activeEncounter.guard, null);
});

test("victory clamps HP to zero and prevents any further combat actions", () => {
  let state = fixture();
  for (let i = 0; i < 7; i++) state = act(state, { direction: "left" });
  assert.equal(state.activeEncounter.currentHealth, 0);
  assert.equal(state.activeEncounter.status, "victory");
  assert.equal(resolvePlayerAction(state, { direction: "left" }).accepted, false);
  assert.equal(resolveEnemyAttack(state, 100000), null);
});

test("a parry counter can win a fight", () => {
  let state = fixture();
  state.activeEncounter.currentHealth = 3;
  state = act(state, { direction: "down" }, ENEMY_ATTACK_INTERVAL_MS - 100);
  assert.equal(
    resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS).activeEncounter.status,
    "victory",
  );
});

test("lethal enemy damage produces defeat, clamps health, and stops attacks", () => {
  const state = { ...fixture(), currentHealth: 2 };
  const result = resolveEnemyAttack(state, ENEMY_ATTACK_INTERVAL_MS);
  assert.equal(result.currentHealth, 0);
  assert.equal(result.activeEncounter.status, "defeat");
  const dead = { ...state, ...result };
  assert.equal(resolvePlayerAction(dead, { skill: ONE_HANDED_SWORD_SKILLS[0] }).accepted, false);
  assert.equal(resolveEnemyAttack(dead, 100000), null);
});

test("no encounter means no attacks or free skill activations", () => {
  const state = { ...fixture(), activeEncounter: null };
  assert.equal(resolvePlayerAction(state, { skill: ONE_HANDED_SWORD_SKILLS[0] }).accepted, false);
  assert.equal(resolveEnemyAttack(state, 100000), null);
});

test("battle survives save/load with enemy HP and hero resources intact", () => {
  const previous = globalThis.localStorage;
  let saved;
  globalThis.localStorage = {
    setItem: (_, value) => {
      saved = value;
    },
    getItem: () => saved,
  };
  try {
    const hero = createCharacter("Тест", skins[0]);
    const state = act({ ...hero, ...fixture() }, { skill: ONE_HANDED_SWORD_SKILLS[0] });
    saveCharacter(state);
    const loaded = loadCharacter();
    assert.equal(loaded.activeEncounter.currentHealth, state.activeEncounter.currentHealth);
    assert.equal(loaded.currentStamina, 9);
    const resumed = resumeBattle(loaded.activeEncounter, loaded.currentHealth, 100000);
    assert.equal(resumed.currentHealth, state.activeEncounter.currentHealth);
    assert.equal(resumed.nextAttackAt, 100000 + ENEMY_ATTACK_INTERVAL_MS);
    assert.equal(resumeBattle(resumed, 0).status, "defeat");
    assert.equal(resumeBattle({ ...resumed, currentHealth: 0 }, 120).status, "victory");
  } finally {
    globalThis.localStorage = previous;
  }
});
