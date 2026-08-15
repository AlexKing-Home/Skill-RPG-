import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const locationSource = await read("../src/components/LocationMapView.jsx");
const characterSource = await read("../src/screens/CharacterScreen.jsx");

test("field contains an NPC and a chest with click interaction", () => {
  assert.match(locationSource, /field-npc-wanderer/);
  assert.match(locationSource, /field-chest-01/);
  assert.match(locationSource, /Странник/);
  assert.match(locationSource, /Старинный сундук/);
  assert.match(locationSource, /onClick=\{\(\) => handleObjectTap\(object\.id\)\}/);
});

test("selected NPC can be spoken to", () => {
  assert.match(locationSource, /selectedObject\.type === "npc"/);
  assert.match(locationSource, /Поговорить/);
  assert.match(locationSource, /Странник:/);
});

test("field chest opens once and persists in save state", () => {
  assert.match(locationSource, /onOpenChest\?\.\(selectedObject\.id\)/);
  assert.match(locationSource, /openedChests\.includes/);
  assert.match(characterSource, /function handleOpenChest\(chestId\)/);
  assert.match(characterSource, /openedChests: \[\.\.\.openedChests, chestId\]/);
  assert.match(characterSource, /worldState: nextWorldState/);
});
