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

test("all nine painted dungeon markers are clickable", () => {
  const pointIds = [
    "dungeon-palisade-gate",
    "dungeon-tavern",
    "dungeon-smithy",
    "dungeon-village-well",
    "dungeon-market-stall",
    "dungeon-notice-board",
    "dungeon-garden",
    "dungeon-stable",
    "dungeon-training-yard",
  ];

  for (const pointId of pointIds) assert.match(view, new RegExp(pointId));
  assert.match(view, /className={`dungeon-hotspot/);
  assert.match(view, /onClick={handleMapTap}/);
  assert.match(view, /MAP_TAP_RADIUS = 12\.5/);
  assert.match(view, /Все девять синих точек/);
  assert.match(styles, /\.dungeon-hotspot/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /clamp\(64px, 15%, 104px\)/);
});

test("dungeon hotspot centers match the painted blue markers", () => {
  assert.match(view, /x: 35\.57,\s*y: 15\.76/);
  assert.match(view, /x: 72\.8,\s*y: 20\.25/);
  assert.match(view, /x: 22\.24,\s*y: 35\.94/);
  assert.match(view, /x: 49\.89,\s*y: 49\.13/);
  assert.match(view, /x: 81\.22,\s*y: 46\.01/);
  assert.match(view, /x: 22\.64,\s*y: 57\.59/);
  assert.match(view, /x: 67\.02,\s*y: 66\.77/);
  assert.match(view, /x: 20\.05,\s*y: 76\.96/);
  assert.match(view, /x: 65\.03,\s*y: 86\.95/);
});
