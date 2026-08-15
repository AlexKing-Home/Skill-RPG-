import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const mainSource = await read("../src/main.jsx");
const assetsSource = await read("../src/data/assets.js");
const worldSource = await read("../src/components/WorldMapView.jsx");
const locationSource = await read("../src/components/LocationMapView.jsx");
const parityCss = await read("../src/parity-fixes.css");

test("mobile parity CSS loads after the application styles", () => {
  assert.match(mainSource, /import "\.\/parity-fixes\.css"/);
});

test("creation uses the clean crest instead of the cropped mockup fragment", () => {
  assert.match(assetsSource, /export const creationCrest = uiCrest/);
});

test("map views render real image elements with fallbacks", () => {
  assert.match(worldSource, /className="map-art-image"/);
  assert.match(worldSource, /map-fallback/);
  assert.match(locationSource, /className="map-art-image"/);
  assert.match(locationSource, /location-fallback__road/);
});

test("phone navigation cannot overflow its three and five column layouts", () => {
  assert.match(parityCss, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(parityCss, /repeat\(5, minmax\(0, 1fr\)\)/);
});

test("equipment labels stay on one line instead of stacking letters", () => {
  assert.match(parityCss, /\.profile-equipment \.equipment-slot__label/);
  assert.match(parityCss, /white-space: nowrap/);
});
