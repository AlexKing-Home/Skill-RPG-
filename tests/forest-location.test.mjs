import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const screen = await read("../src/screens/CharacterScreen.jsx");
const view = await read("../src/components/ForestLocationView.jsx");
const styles = await read("../src/forest-location.css");
const forestArtModule = await read("../src/data/forestLocationArt.js");

test("forest node opens its dedicated artwork view", () => {
  assert.match(screen, /ForestLocationView/);
  assert.match(screen, /location\.nodeId === "forest"/);
  assert.match(screen, /lazy\(\(\) => import\("\.\.\/components\/ForestLocationView\.jsx"\)\)/);
  assert.match(view, /data\/forestLocationArt\.js/);
  assert.doesNotMatch(view, /assets\/forest-location\.webp/);
  assert.match(view, /location-map--forest/);
  assert.match(view, /<h1 id="forest-location-title">Лес<\/h1>/);
});

test("forest artwork uses the same committed chunk data URL pattern as other locations", () => {
  for (let index = 1; index <= 8; index += 1) {
    assert.match(forestArtModule, new RegExp(`forestLocationChunks/forest-0${index}\\.js`));
  }

  assert.match(forestArtModule, /data:image\/webp;base64/);
});

test("forest art stays visible and is not covered by generic map layers", () => {
  assert.match(styles, /\.location-map--forest::before/);
  assert.match(styles, /\.location-map--forest::after/);
  assert.match(styles, /content: none !important/);
  assert.match(styles, /opacity: 1 !important/);
  assert.match(styles, /visibility: visible !important/);
  assert.match(styles, /isolation: isolate/);
  assert.match(styles, /aspect-ratio: 3 \/ 4 !important/);
});

test("all eight painted forest markers are clickable", () => {
  const pointIds = [
    "forest-stone-arch",
    "forest-ancient-tree",
    "forest-root-tunnel",
    "forest-hunter-camp",
    "forest-wooden-bridge",
    "forest-fallen-log",
    "forest-old-shrine",
    "forest-signpost",
  ];

  for (const pointId of pointIds) assert.match(view, new RegExp(pointId));
  assert.match(view, /className={`forest-hotspot/);
  assert.match(view, /onClick={handleMapTap}/);
  assert.match(view, /MAP_TAP_RADIUS = 12\.5/);
  assert.match(view, /FOREST_ASPECT_RATIO = 800 \/ 600/);
  assert.match(styles, /\.forest-hotspot/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /clamp\(64px, 15%, 104px\)/);
});

test("forest hotspot centers match the eight painted blue markers", () => {
  assert.match(view, /x: 18\.37,\s*y: 25\.66/);
  assert.match(view, /x: 51\.98,\s*y: 21\.69/);
  assert.match(view, /x: 87\.57,\s*y: 24\.97/);
  assert.match(view, /x: 71\.13,\s*y: 42\.75/);
  assert.match(view, /x: 26\.01,\s*y: 55\.59/);
  assert.match(view, /x: 45\.26,\s*y: 68\.44/);
  assert.match(view, /x: 80\.25,\s*y: 65\.37/);
  assert.match(view, /x: 18\.65,\s*y: 78\.59/);
});
