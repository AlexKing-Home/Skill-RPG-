import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const screen = await read("../src/screens/CharacterScreen.jsx");
const view = await read("../src/components/MeadowLocationView.jsx");
const art = await read("../src/data/meadowLocationArt.js");

test("meadows use the approved meadow scene instead of the generic location map", () => {
  assert.match(screen, /MeadowLocationView/);
  assert.match(screen, /\["field", "meadows"\]/);
  assert.match(view, /meadowLocationArt/);
  assert.match(view, /location-map--meadow/);
  assert.match(art, /data:image\/webp;base64/);
  assert.match(art, /meadow-01\.js/);
  assert.match(art, /meadow-06\.js/);
});

test("meadow NPC and chest interactions remain available", () => {
  assert.match(view, /field-npc-wanderer/);
  assert.match(view, /field-chest-01/);
});
