import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const mapSource = await read("../src/components/WorldMapView.jsx");
const mapArtSource = await read("../src/data/floorOneMapArt.js");
const cssSource = await read("../src/floor-map.css");

test("approved floor map art is used by the world map", () => {
  assert.match(mapSource, /floorOneMapArt/);
  assert.match(mapArtSource, /data:image\/webp;base64/);
});

test("all map locations use large direct tappable hotspots", () => {
  assert.match(mapSource, /map-hotspot/);
  assert.match(mapSource, /node\.hitbox/);
  assert.match(mapSource, /onPointerUp=\{\(event\) => handlePointerUp\(event, node\.id\)\}/);
  assert.match(mapSource, /onClick=\{\(\) => travelTo\(node\.id\)\}/);
  assert.match(mapSource, /swamp-replacement/);
  assert.match(mapSource, /Болото/);
  assert.match(cssSource, /\.map-hotspot/);
  assert.match(cssSource, /pointer-events: auto/);
  assert.match(cssSource, /min-width: 64px/);
  assert.match(cssSource, /min-height: 52px/);
});
