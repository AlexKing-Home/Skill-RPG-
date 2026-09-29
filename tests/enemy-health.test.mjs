import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { resolveTravelEncounter, wildBoarEncounter } from "../src/data/travelEncounters.js";

const battleViewSource = await readFile(
  new URL("../src/components/BattleView.jsx", import.meta.url),
  "utf8",
);

test("wild boar starts battle with exactly 25 HP", () => {
  assert.equal(wildBoarEncounter.maxHealth, 25);
  assert.equal(wildBoarEncounter.currentHealth, 25);

  const resolved = resolveTravelEncounter({ id: "wild-boar" });
  assert.equal(resolved.maxHealth, 25);
  assert.equal(resolved.currentHealth, 25);
});

test("battle view displays enemy HP", () => {
  assert.match(battleViewSource, /encounter\?\.maxHealth/);
  assert.match(battleViewSource, /encounter\?\.currentHealth/);
  assert.match(battleViewSource, /HP \{enemyCurrentHealth\} \/ \{enemyMaxHealth\}/);
});
