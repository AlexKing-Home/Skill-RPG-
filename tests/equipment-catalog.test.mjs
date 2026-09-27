import assert from "node:assert/strict";
import test from "node:test";

import {
  EQUIPMENT_CATALOG,
  EQUIPMENT_RARITIES,
  canMeetEquipmentRequirements,
  getEquipmentById,
  getWeaponsByMastery,
} from "../src/data/equipmentCatalog.js";

const MASTERY_KEYS = [
  "oneHanded",
  "twoHanded",
  "rapier",
  "katana",
  "spear",
  "dagger",
  "bow",
  "dualWield",
];

test("equipment catalog contains 50 weapons for every mastery", () => {
  assert.equal(EQUIPMENT_CATALOG.length, 400);
  assert.equal(new Set(EQUIPMENT_CATALOG.map(({ id }) => id)).size, 400);

  for (const masteryKey of MASTERY_KEYS) {
    const weapons = getWeaponsByMastery(masteryKey);

    assert.equal(weapons.length, 50);
    assert.equal(new Set(weapons.map(({ name }) => name)).size, 50);
    assert.equal(weapons[0].requirements.mastery.value, 0);
    assert.equal(weapons.at(-1).requirements.mastery.value, 1000);
    assert.equal(weapons[0].level, 1);
    assert.equal(weapons.at(-1).level, 50);
  }
});

test("equipment entries include MMO item progression fields", () => {
  for (const item of EQUIPMENT_CATALOG) {
    assert.equal(item.category, "weapon");
    assert.equal(item.slot, "weapon1");
    assert.ok(item.name);
    assert.ok(item.typeLabel);
    assert.ok(item.baseStats.attack > 0);
    assert.ok(item.bonusStats.accuracy >= 0);
    assert.ok(item.bonusStats.critChancePercent >= 0);
    assert.ok(item.durability.max > 0);
    assert.equal(item.durability.current, item.durability.max);
    assert.ok(item.enhancement.max >= 3);
    assert.ok(item.specialEffect);
    assert.ok(item.requirements.heroLevel >= 1);
    assert.equal(item.requirements.mastery.key, item.weaponType);
  }
});

test("rarity and enhancement progression ends with unique +12 items", () => {
  assert.deepEqual(
    EQUIPMENT_RARITIES.map(({ id, maxEnhancement }) => [id, maxEnhancement]),
    [
      ["common", 3],
      ["uncommon", 4],
      ["rare", 6],
      ["epic", 8],
      ["legendary", 10],
      ["unique", 12],
    ],
  );

  for (const masteryKey of MASTERY_KEYS) {
    const finalItems = getWeaponsByMastery(masteryKey).slice(-4);

    assert.ok(finalItems.every(({ rarity }) => rarity === "unique"));
    assert.ok(finalItems.every(({ enhancement }) => enhancement.max === 12));
  }
});

test("catalog helpers resolve items and requirements", () => {
  const starter = getEquipmentById("oneHanded-weapon-01");
  const capstone = getEquipmentById("oneHanded-weapon-50");

  assert.equal(starter.weaponType, "oneHanded");
  assert.equal(getEquipmentById("missing-item"), null);
  assert.equal(canMeetEquipmentRequirements(starter, 1, { oneHanded: 0 }), true);
  assert.equal(canMeetEquipmentRequirements(capstone, 50, { oneHanded: 999 }), false);
  assert.equal(canMeetEquipmentRequirements(capstone, 50, { oneHanded: 1000 }), true);
});
