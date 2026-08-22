import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const screen = await read("../src/screens/CharacterScreen.jsx");
const view = await read("../src/components/MeadowLocationView.jsx");
const art = await read("../src/data/meadowLocationArt.js");
const styles = await read("../src/styles/location-scenes.css");

test("meadows use the approved meadow scene instead of the generic location map", () => {
  assert.match(screen, /MeadowLocationView/);
  assert.match(screen, /\["field", "meadows"\]/);
  assert.match(view, /meadowLocationArt/);
  assert.match(view, /location-map--meadow/);
  assert.match(art, /data:image\/webp;base64/);
  assert.match(art, /meadow-01\.js/);
  assert.match(art, /meadow-06\.js/);
});

test("NPC and chest interactions remain available", () => {
  assert.match(view, /field-npc-wanderer/);
  assert.match(view, /field-chest-01/);
});

test("all blue meadow markers remain interactive", () => {
  const pointIds = [
    "field-point-flower-meadow",
    "field-point-north-trail",
    "field-point-old-fence",
    "field-point-stone-wall",
    "field-point-bridge",
    "field-point-signpost",
    "field-point-well",
  ];

  for (const pointId of pointIds) assert.match(view, new RegExp(pointId));
  assert.match(view, /className={`meadow-hotspot/);
  assert.match(view, /Нажмите на любую синюю точку/);
});

test("meadow taps use nearest-marker fallback and large mobile hit targets", () => {
  assert.match(view, /function handleMapTap/);
  assert.match(view, /getBoundingClientRect/);
  assert.match(view, /MAP_TAP_RADIUS = 12\.5/);
  assert.match(view, /onClick={handleMapTap}/);
  assert.match(view, /MEADOW_ASPECT_RATIO = 960 \/ 768/);
  assert.match(styles, /width: clamp\(64px, 15%, 104px\)/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /-webkit-tap-highlight-color: transparent/);
});
