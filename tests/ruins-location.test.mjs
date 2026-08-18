import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const screen = await read("../src/screens/CharacterScreen.jsx");
const view = await read("../src/components/RuinsLocationView.jsx");
const styles = await read("../src/ruins-location.css");

test("ruins node opens the dedicated approved location art", () => {
  assert.match(screen, /RuinsLocationView/);
  assert.match(screen, /location\.nodeId === "ruins"/);
  assert.match(view, /assets\/ruins-location\.webp/);
  assert.match(view, /location-map--ruins/);
  assert.match(view, /<h1 id="ruins-location-title">Руины<\/h1>/);
});

test("all eight painted ruins markers are clickable", () => {
  const pointIds = [
    "ruins-sealed-gate",
    "ruins-guardian-statue",
    "ruins-broken-column",
    "ruins-crypt-collapse",
    "ruins-ancient-circle",
    "ruins-shadow-passage",
    "ruins-fallen-statue",
    "ruins-stone-pedestal",
  ];

  for (const pointId of pointIds) assert.match(view, new RegExp(pointId));
  assert.match(view, /className={`ruins-hotspot/);
  assert.match(view, /onClick={handleMapTap}/);
  assert.match(view, /MAP_TAP_RADIUS = 12\.5/);
  assert.match(styles, /\.ruins-hotspot/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /clamp\(64px, 15%, 104px\)/);
});

test("ruins hotspot centers match the painted blue markers", () => {
  assert.match(view, /x: 23\.34,\s*y: 23\.95/);
  assert.match(view, /x: 83\.71,\s*y: 21\.88/);
  assert.match(view, /x: 13\.36,\s*y: 39\.4/);
  assert.match(view, /x: 67\.81,\s*y: 41\.78/);
  assert.match(view, /x: 31\.87,\s*y: 56\.27/);
  assert.match(view, /x: 75\.35,\s*y: 68\.53/);
  assert.match(view, /x: 12\.26,\s*y: 81\.45/);
  assert.match(view, /x: 50\.05,\s*y: 84\.28/);
});
