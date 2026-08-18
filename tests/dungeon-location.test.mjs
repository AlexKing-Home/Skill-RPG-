import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const screen = await read("../src/screens/CharacterScreen.jsx");
const view = await read("../src/components/DungeonLocationView.jsx");
const styles = await read("../src/dungeon-location.css");
const art = await read("../src/data/dungeonLocationArt.js");

const chunkPaths = Array.from(
  { length: 6 },
  (_, index) =>
    `../src/data/dungeonLocationChunks/dungeon-${String(index + 1).padStart(2, "0")}.js`,
);

const chunkSources = await Promise.all(chunkPaths.map(read));

test("dungeon node opens the dedicated dungeon artwork", () => {
  assert.match(screen, /DungeonLocationView/);
  assert.match(screen, /location\.nodeId === "dungeon"/);
  assert.match(view, /data\/dungeonLocationArt\.js/);
  assert.match(view, /location-map--dungeon/);
  assert.match(view, /<h1 id="dungeon-location-title">Подземелье<\/h1>/);
});

test("dungeon artwork is embedded as a complete WebP data URI", () => {
  assert.match(art, /data:image\/webp;base64/);

  const base64 = chunkSources
    .map((source) => {
      const match = source.match(/export default "([A-Za-z0-9+/=]+)";/);
      assert.ok(match, "each dungeon art chunk must export base64 text");
      return match[1];
    })
    .join("");

  const image = Buffer.from(base64, "base64");
  assert.ok(image.length > 12);
  assert.equal(image.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(image.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(image.readUInt32LE(4) + 8, image.length);
});

test("dungeon art stays visible above generic map layers", () => {
  assert.match(styles, /\.location-map--dungeon::before/);
  assert.match(styles, /\.location-map--dungeon::after/);
  assert.match(styles, /content: none !important/);
  assert.match(styles, /opacity: 1 !important/);
  assert.match(styles, /visibility: visible !important/);
  assert.match(styles, /isolation: isolate/);
});

test("all eight painted dungeon markers are clickable", () => {
  const pointIds = [
    "dungeon-sealed-gate",
    "dungeon-silent-guardian",
    "dungeon-sarcophagus",
    "dungeon-blue-passage",
    "dungeon-abyss-bridge",
    "dungeon-deep-chasm",
    "dungeon-bone-niche",
    "dungeon-rune-circle",
  ];

  for (const pointId of pointIds) assert.match(view, new RegExp(pointId));
  assert.match(view, /className={`dungeon-hotspot/);
  assert.match(view, /onClick={handleMapTap}/);
  assert.match(view, /MAP_TAP_RADIUS = 12\.5/);
  assert.match(styles, /\.dungeon-hotspot/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /clamp\(64px, 15%, 104px\)/);
});

test("dungeon hotspot centers match the painted blue markers", () => {
  assert.match(view, /x: 45\.17,\s*y: 15\.36/);
  assert.match(view, /x: 15\.17,\s*y: 24\.13/);
  assert.match(view, /x: 75\.19,\s*y: 22\.37/);
  assert.match(view, /x: 16\.31,\s*y: 50\.72/);
  assert.match(view, /x: 78\.84,\s*y: 53\.68/);
  assert.match(view, /x: 74\.78,\s*y: 68\.16/);
  assert.match(view, /x: 15\.22,\s*y: 77\.52/);
  assert.match(view, /x: 35\.52,\s*y: 82\.98/);
});
