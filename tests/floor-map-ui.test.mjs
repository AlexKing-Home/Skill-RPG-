import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { floorOneMapArt } from "../src/data/floorOneMapArt.js";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const mapSource = await read("../src/components/WorldMapView.jsx");
const mapArtSource = await read("../src/data/floorOneMapArt.js");
const navigationSource = await read("../src/data/worldNavigation.js");
const cssSource = await read("../src/floor-map.css");

test("approved floor map art is used by the world map", () => {
  assert.match(mapSource, /floorOneMapArt/);
  assert.match(mapArtSource, /data:image\/webp;base64/);

  const encoded = floorOneMapArt.replace("data:image/webp;base64,", "");
  const image = Buffer.from(encoded, "base64");
  assert.equal(image.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(image.subarray(8, 12).toString("ascii"), "WEBP");
  assert.ok(image.length > 80000);
});

test("approved map contains swamp as the real central location", () => {
  assert.match(navigationSource, /START_NODE_ID = "swamp"/);
  assert.match(navigationSource, /name: "Болото"/);
  assert.doesNotMatch(mapSource, /swamp-replacement/);
  assert.doesNotMatch(cssSource, /\.swamp-replacement/);
});

test("all map locations use large direct tappable hotspots", () => {
  assert.match(mapSource, /map-hotspot/);
  assert.match(mapSource, /node\.hitbox/);
  assert.match(mapSource, /onPointerDown=\{\(event\) => handlePointerDown\(event, node\.id\)\}/);
  assert.match(mapSource, /onPointerUp=\{\(event\) => handlePointerUp\(event, node\.id\)\}/);
  assert.match(mapSource, /handleKeyboardClick/);
  assert.match(mapSource, /TAP_MOVE_TOLERANCE/);
  assert.match(cssSource, /\.map-hotspot/);
  assert.match(cssSource, /pointer-events: auto/);
  assert.match(cssSource, /min-width: 82px/);
  assert.match(cssSource, /min-height: 64px/);
});

test("touch tap is handled once instead of firing pointer and click travel together", () => {
  assert.match(mapSource, /event\.detail === 0/);
  assert.doesNotMatch(mapSource, /onClick=\{\(\) => travelTo\(node\.id\)\}/);
});

test("real floor map is explicitly decoded and revealed on the first mount", () => {
  assert.match(mapSource, /isMapReady/);
  assert.match(mapSource, /mapImageRef/);
  assert.match(mapSource, /image\.decode/);
  assert.match(mapSource, /loading="eager"/);
  assert.match(mapSource, /decoding="sync"/);
  assert.match(mapSource, /floor-map-loading/);
  assert.doesNotMatch(mapSource, /className="map-fallback"/);
  assert.match(cssSource, /\.map-art-image\.is-ready/);
  assert.match(cssSource, /\.floor-map-loading/);
});
