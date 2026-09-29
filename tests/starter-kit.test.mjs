import assert from "node:assert/strict";
import test from "node:test";

import {
  equipInventoryItem,
  getEquipmentCombatBonuses,
  unequipItem,
} from "../src/data/equipment.js";
import { createStarterKit, STARTER_COINS, STARTER_HEALING_POTION } from "../src/data/starterKit.js";
import { createCharacter, skins } from "../src/data/skins.js";
import { mergeInventoryItems, rollWildBoarLoot, WILD_BOAR_LOOT_CHANCES } from "../src/data/loot.js";

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

test("unequipping moves the item into inventory without duplication", () => {
  const kit = createStarterKit("swordsman");
  const result = unequipItem(kit.equipment, kit.inventory, "weapon1");

  assert.equal(result.changed, true);
  assert.equal(result.equipment.weapon1, null);
  assert.equal(result.inventory.filter((item) => item.id === "starter-one-handed-sword").length, 1);
  assert.equal(result.inventory.filter((item) => item.id === STARTER_HEALING_POTION.id).length, 1);
});

test("equipping removes the item from inventory and restores the slot", () => {
  const kit = createStarterKit("swordsman");
  const removed = unequipItem(kit.equipment, kit.inventory, "weapon1");
  const restored = equipInventoryItem(
    removed.equipment,
    removed.inventory,
    "starter-one-handed-sword",
  );

  assert.equal(restored.changed, true);
  assert.equal(restored.equipment.weapon1.id, "starter-one-handed-sword");
  assert.equal(
    restored.inventory.some((item) => item.id === "starter-one-handed-sword"),
    false,
  );
});

test("equipping into an occupied slot swaps the old item back to inventory", () => {
  const kit = createStarterKit("swordsman");
  const replacement = {
    ...kit.equipment.weapon1,
    id: "test-replacement-sword",
    name: "Проверочный меч",
    baseStats: { attack: 12 },
  };
  const result = equipInventoryItem(kit.equipment, [...kit.inventory, replacement], replacement.id);

  assert.equal(result.changed, true);
  assert.equal(result.equipment.weapon1.id, replacement.id);
  assert.equal(result.inventory.filter((item) => item.id === "starter-one-handed-sword").length, 1);
  assert.equal(
    result.inventory.some((item) => item.id === replacement.id),
    false,
  );
});

test("consumables cannot be equipped and remain in inventory", () => {
  const kit = createStarterKit("swordsman");
  const result = equipInventoryItem(kit.equipment, kit.inventory, STARTER_HEALING_POTION.id);

  assert.equal(result.changed, false);
  assert.equal(result.equipment.weapon1.id, "starter-one-handed-sword");
  assert.equal(result.inventory[0].quantity, 2);
});

test("wild boar loot follows the configured drop table and coin range", () => {
  assert.deepEqual(WILD_BOAR_LOOT_CHANCES, {
    hide: 0.6,
    fang: 0.25,
    meat: 0.7,
    equipment: 0.05,
  });

  const rolls = [0, 0, 0, 0, 0, 0];
  const loot = rollWildBoarLoot(() => rolls.shift() ?? 0);

  assert.equal(loot.coins, 5);
  assert.ok(loot.items.some((item) => item.id === "wild-boar-hide"));
  assert.ok(loot.items.some((item) => item.id === "wild-boar-fang"));
  assert.ok(loot.items.some((item) => item.id === "raw-boar-meat"));
  assert.ok(loot.items.some((item) => item.category === "weapon"));
});

test("wild boar materials stack while equipment stays separate", () => {
  const firstLoot = rollWildBoarLoot(() => 0);
  const firstInventory = mergeInventoryItems([], firstLoot.items);
  const secondInventory = mergeInventoryItems(firstInventory, firstLoot.items);

  assert.equal(secondInventory.find((item) => item.id === "wild-boar-hide").quantity, 2);
  assert.equal(secondInventory.find((item) => item.id === "wild-boar-fang").quantity, 2);
  assert.equal(secondInventory.find((item) => item.id === "raw-boar-meat").quantity, 2);
  assert.equal(secondInventory.filter((item) => item.category === "weapon").length, 2);
});
