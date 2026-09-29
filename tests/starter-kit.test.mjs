import assert from "node:assert/strict";
import test from "node:test";

import { getEquipmentCombatBonuses } from "../src/data/equipment.js";
import { createStarterKit, STARTER_COINS, STARTER_HEALING_POTION } from "../src/data/starterKit.js";
import { createCharacter, skins } from "../src/data/skins.js";

const expectedWeapons = {
  swordsman: ["oneHanded", "Учебный одноручный меч", 8],
  spearman: ["spear", "Учебное копьё", 8],
  assassin: ["dagger", "Учебный кинжал", 7],
};

test("starter kit equips class weapon and three light armor pieces", () => {
  for (const [classId, [weaponType, weaponName, attack]] of Object.entries(expectedWeapons)) {
    const kit = createStarterKit(classId);
    assert.equal(kit.equipment.weapon1.weaponType, weaponType);
    assert.equal(kit.equipment.weapon1.name, weaponName);
    assert.equal(kit.equipment.weapon1.baseStats.attack, attack);
    assert.equal(kit.equipment.weapon1.level, 1);
    assert.equal(kit.equipment.weapon1.rarity, "common");
    assert.equal(kit.equipment.weapon1.enhancement.level, 0);
    assert.equal(kit.equipment.weapon1.specialEffect, null);
    assert.equal(kit.equipment.chest.baseStats.defense, 2);
    assert.equal(kit.equipment.gloves.baseStats.defense, 1);
    assert.equal(kit.equipment.boots.baseStats.defense, 1);
  }
});

test("assassin starter dagger has two percent crit bonus", () => {
  const kit = createStarterKit("assassin");
  assert.equal(kit.equipment.weapon1.bonusStats.critChancePercent, 2);
});

test("starter kit contains two 25 HP potions and 100 coins", () => {
  const kit = createStarterKit("swordsman");
  assert.equal(STARTER_COINS, 100);
  assert.equal(kit.coins, 100);
  assert.equal(kit.inventory.length, 1);
  assert.equal(kit.inventory[0].id, STARTER_HEALING_POTION.id);
  assert.equal(kit.inventory[0].quantity, 2);
  assert.equal(kit.inventory[0].effect.amount, 25);
});

test("starter equipment contributes weapon attack and four defense", () => {
  for (const [classId, [, , attack]] of Object.entries(expectedWeapons)) {
    const bonuses = getEquipmentCombatBonuses(createStarterKit(classId).equipment);
    assert.equal(bonuses.attack, attack);
    assert.equal(bonuses.defense, 4);
  }
});

test("new visible classes receive starter kit on creation", () => {
  for (const classId of Object.keys(expectedWeapons)) {
    const skin = skins.find((candidate) => candidate.classId === classId);
    const character = createCharacter("Starter", skin);
    assert.equal(character.coins, 100);
    assert.equal(character.inventory[0].quantity, 2);
    assert.equal(character.equipment.weapon1.weaponType, expectedWeapons[classId][0]);
  }
});
