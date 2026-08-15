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

test("final reference parity CSS loads after all earlier fix layers", () => {
  assert.match(mainSource, /import "\.\/parity-fixes\.css"/);
  assert.match(mainSource, /import "\.\/device-regression-fixes\.css"/);
  assert.match(mainSource, /import "\.\/reference-parity-final\.css"/);
  assert.ok(
    mainSource.indexOf('import "./reference-parity-final.css"') >
      mainSource.indexOf('import "./device-regression-fixes.css"'),
  );
});

test("creation uses the clean crest and the asset cache key is advanced", () => {
  assert.match(assetsSource, /export const creationCrest = uiCrest/);
  assert.match(assetsSource, /reference-parity-v4/);
});

test("map views render real images with clean fallbacks and no duplicate overlays", () => {
  assert.match(worldSource, /className="map-art-image"/);
  assert.match(worldSource, /map-fallback/);
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

test("game shell is constrained and character equipment is a 3 by 3 reference grid", () => {
  assert.match(finalCss, /\.game-shell[\s\S]*min-width: 0 !important/);
  assert.match(finalCss, /contain: inline-size/);
  assert.match(finalCss, /overflow-x: hidden !important/);
  assert.match(
    finalCss,
    /\.profile-equipment \.equipment-grid[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/,
  );
  assert.match(
    finalCss,
    /\.profile-equipment \.equipment-slot__label[\s\S]*white-space: nowrap !important/,
  );
});
