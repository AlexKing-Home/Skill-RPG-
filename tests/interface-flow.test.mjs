import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const characterScreenSource = await readFile(
  new URL("../src/screens/CharacterScreen.jsx", import.meta.url),
  "utf8",
);

test("creating a character opens the integrated game screen", () => {
  assert.match(appSource, /setScreen\("character"\)/);
  assert.match(appSource, /<CharacterScreen character=\{character\}/);
});

test("game screen contains HUD and all three main tabs", () => {
  assert.match(characterScreenSource, /<PlayerHud/);
  assert.match(characterScreenSource, /<GameTabs/);
  assert.match(characterScreenSource, /WorldMapView/);
  assert.match(characterScreenSource, /LocationMapView/);
  assert.match(characterScreenSource, /CharacterDetailsView/);
});
