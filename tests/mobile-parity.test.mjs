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
const deviceCss = await read("../src/device-regression-fixes.css");
const finalCss = await read("../src/reference-parity-final.css");
const mobilePolishCss = await read("../src/mobile-polish.css");

test("mobile polish loads after all parity layers", () => {
  assert.match(mainSource, /import "\.\/parity-fixes\.css"/);
  assert.match(mainSource, /import "\.\/device-regression-fixes\.css"/);
  assert.match(mainSource, /import "\.\/reference-parity-final\.css"/);
  assert.match(mainSource, /import "\.\/mobile-polish\.css"/);
  assert.ok(
    mainSource.indexOf('import "./mobile-polish.css"') >
      mainSource.indexOf('import "./reference-parity-final.css"'),
  );
});

test("creation uses the clean crest and enhanced assets use a fresh cache identity", () => {
  assert.match(assetsSource, /export const creationCrest = uiCrest/);
  assert.match(assetsSource, /reference-parity-v6/);
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
  assert.match(finalCss, /\.map-art-image\[hidden\]/);
});

test("phone navigation cannot overflow three five or four column layouts", () => {
  assert.match(parityCss, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(deviceCss, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(finalCss, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(finalCss, /repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(finalCss, /repeat\(4, minmax\(0, 1fr\)\)/);
});

test("character equipment stays 3 by 3 and mobile labels remain readable", () => {
  assert.match(finalCss, /\.game-shell[\s\S]*min-width: 0 !important/);
  assert.match(finalCss, /contain: inline-size/);
  assert.match(finalCss, /overflow-x: hidden !important/);
  assert.match(
    finalCss,
    /\.profile-equipment \.equipment-grid[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/,
  );
  assert.match(
    mobilePolishCss,
    /\.profile-equipment \.equipment-slot__label[\s\S]*white-space: normal !important/,
  );
  assert.match(
    mobilePolishCss,
    /\.profile-equipment \.equipment-slot__item[\s\S]*text-overflow: clip !important/,
  );
});

test("mobile profile keeps the full health value inside its stat card", () => {
  assert.match(
    mobilePolishCss,
    /\.character-stat--health strong[\s\S]*font-size: clamp\(0\.78rem, 3\.45vw, 1rem\) !important/,
  );
  assert.match(mobilePolishCss, /letter-spacing: -0\.025em !important/);
});
