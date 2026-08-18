import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const screen = await read("../src/screens/CharacterScreen.jsx");
const view = await read("../src/components/StartCityLocationView.jsx");
const art = await read("../src/data/startCityLocationArt.js");
const styles = await read("../src/start-city-location.css");

test("start city uses the approved generated city scene", () => {
  assert.match(screen, /StartCityLocationView/);
  assert.match(screen, /location\.nodeId === "start-city"/);
  assert.match(view, /startCityLocationArt/);
  assert.match(view, /location-map--start-city/);
  assert.match(art, /data:image\/webp;base64/);
  assert.match(art, /city-v2-01\.js/);
  assert.match(art, /city-v2-08\.js/);
});

test("all visible start-city markers are clickable", () => {
  const pointIds = [
    "city-gate",
    "city-forge",
    "city-inn",
    "city-notice-board",
    "city-fountain",
    "city-market",
    "city-west-alley",
    "city-shrine",
    "city-caravan",
    "city-training-yard",
  ];

  for (const pointId of pointIds) assert.match(view, new RegExp(pointId));
  assert.match(view, /className={`city-hotspot/);
  assert.match(view, /onClick={handleMapTap}/);
  assert.match(view, /MAP_TAP_RADIUS = 13\.5/);
  assert.match(styles, /\.city-hotspot/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /clamp\(58px, 11%, 92px\)/);
});

test("start-city hotspot centers are tied to the painted marker coordinates", () => {
  assert.match(view, /x: 51\.05,\s*y: 9\.97/);
  assert.match(view, /x: 17\.23,\s*y: 22\.66/);
  assert.match(view, /x: 80\.22,\s*y: 23\.58/);
  assert.match(view, /x: 21\.55,\s*y: 41\.62/);
  assert.match(view, /x: 46\.31,\s*y: 46\.2/);
  assert.match(view, /x: 68\.45,\s*y: 42\.64/);
  assert.match(view, /x: 12\.7,\s*y: 58\.44/);
  assert.match(view, /x: 84\.09,\s*y: 57\.37/);
  assert.match(view, /x: 26\.43,\s*y: 74\.55/);
  assert.match(view, /x: 75\.06,\s*y: 78\.68/);
});
