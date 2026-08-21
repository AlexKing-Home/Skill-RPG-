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
const compatibilityCss = await read("../src/styles/compatibility.css");

test("compatibility styles stay between foundation and navigation layers", () => {
  const foundation = mainSource.indexOf('import "./styles/foundation.css"');
  const compatibility = mainSource.indexOf('import "./styles/compatibility.css"');
  const navigation = mainSource.indexOf('import "./styles/navigation.css"');

  assert.ok(foundation >= 0);
  assert.ok(compatibility > foundation);
  assert.ok(navigation > compatibility);
});

test("creation uses the clean crest and approved assets use the original-art cache identity", () => {
  assert.match(assetsSource, /export const creationCrest = uiCrest/);
  assert.match(assetsSource, /original-art-v2/);
  assert.match(assetsSource, /world-map-reference-v2\.webp/);
  assert.match(assetsSource, /location-map-reference-v2\.webp/);
});

test("map views render real images without duplicate overlays", () => {
  assert.match(worldSource, /map-art-image/);
  assert.match(worldSource, /floor-map-loading/);
  assert.doesNotMatch(worldSource, /className="map-fallback"/);
  assert.doesNotMatch(worldSource, /map-overlay-hero/);
  assert.match(locationSource, /className="map-art-image"/);
  assert.match(locationSource, /location-fallback__road/);
  assert.doesNotMatch(locationSource, /map-overlay-hero/);
  assert.match(compatibilityCss, /\.map-art-image\[hidden\]/);
});

test("phone navigation cannot overflow three five or four column layouts", () => {
  assert.match(compatibilityCss, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(compatibilityCss, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(compatibilityCss, /repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(compatibilityCss, /repeat\(4, minmax\(0, 1fr\)\)/);
});

test("character equipment stays 3 by 3 and mobile labels remain readable", () => {
  assert.match(compatibilityCss, /\.game-shell[\s\S]*min-width: 0 !important/);
  assert.match(compatibilityCss, /contain: inline-size/);
  assert.match(compatibilityCss, /overflow-x: hidden !important/);
  assert.match(
    compatibilityCss,
    /\.profile-equipment \.equipment-grid[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/,
  );
  assert.match(
    compatibilityCss,
    /\.profile-equipment \.equipment-slot__label[\s\S]*white-space: normal !important/,
  );
  assert.match(
    compatibilityCss,
    /\.profile-equipment \.equipment-slot__item[\s\S]*text-overflow: clip !important/,
  );
});

test("mobile profile keeps the full health value inside its stat card", () => {
  assert.match(
    compatibilityCss,
    /\.character-stat--health strong[\s\S]*font-size: clamp\(0\.78rem, 3\.45vw, 1rem\) !important/,
  );
  assert.match(compatibilityCss, /letter-spacing: -0\.025em !important/);
});
