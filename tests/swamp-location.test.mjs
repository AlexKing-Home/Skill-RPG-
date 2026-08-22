import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const viewSource = await read("../src/components/LocationMapView.jsx");
const artSource = await read("../src/data/swampLocationArt.js");
const subLocationsSource = await read("../src/data/swampSubLocations.js");
const deepChunk1 = await read("../src/data/swampSubLocationChunks/deep-01.js");
const deepChunk2 = await read("../src/data/swampSubLocationChunks/deep-02.js");
const rootsChunk1 = await read("../src/data/swampSubLocationChunks/roots-01.js");
const rootsChunk2 = await read("../src/data/swampSubLocationChunks/roots-02.js");
const firstChunkSource = await read("../src/data/swampLocationChunks/swamp-01.js");
const lastChunkSource = await read("../src/data/swampLocationChunks/swamp-06.js");
const cssSource = await read("../src/styles/world.css");
const mainSource = await read("../src/main.jsx");

const pointIds = [
  "swamp-arch",
  "swamp-deep-path",
  "swamp-tree",
  "swamp-pool",
  "swamp-cave",
  "swamp-statue",
  "swamp-remains",
  "swamp-roots",
  "swamp-bridge",
];

const paintedMarkerPixels = [
  [148, 142],
  [368, 130],
  [526, 150],
  [263, 279],
  [681, 316],
  [97, 429],
  [322, 487],
  [678, 564],
  [346, 627],
];

test("swamp node renders the approved base scene", () => {
  assert.match(viewSource, /\.\.\/data\/swampLocationArt\.js/);
  assert.match(viewSource, /location\.nodeId === "swamp"/);
  assert.match(viewSource, /art: swampLocationArt/);
  assert.match(viewSource, /src=\{swampScene\.art\}/);
  assert.match(viewSource, /onLoad=\{\(\) => setSwampArtStatus\("ready"\)\}/);
  assert.match(artSource, /data:image\/webp;base64/);
  assert.match(artSource, /c1.*c2.*c3.*c4.*c5.*c6/);
  assert.match(firstChunkSource, /UklGRgjIAABXRUJQVlA4IPzH/);
  assert.match(lastChunkSource, /MWX5Ru2qOHRdzapWsFK4B1KQNSAAAA/);
  assert.match(mainSource, /import "\.\/styles\/world\.css"/);
  assert.match(cssSource, /\.location-map--swamp/);
});

test("approved swamp scene exposes all nine clickable interest points", () => {
  for (const pointId of pointIds) {
    assert.match(viewSource, new RegExp(`id: "${pointId}"`));
  }

  assert.match(viewSource, /className={`swamp-point/);
  assert.match(viewSource, /onClick=\{\(\) => handleObjectTap\(point\.id\)\}/);
  assert.match(viewSource, /onPointerDown=\{isBaseSwamp \? handleSwampPointerDown : undefined\}/);
  assert.match(viewSource, /onPointerUp=\{isBaseSwamp \? handleSwampPointerUp : undefined\}/);
  assert.match(viewSource, /SWAMP_TAP_RADIUS = 72/);
  assert.match(viewSource, /nearestDistance <= SWAMP_TAP_RADIUS/);
  assert.match(cssSource, /\.swamp-point/);
  assert.match(cssSource, /touch-action: manipulation/);
});

test("swamp transition actions switch to their supplied sublocation scenes", () => {
  assert.match(viewSource, /targetScene: "deep-path"/);
  assert.match(viewSource, /targetScene: "roots-burrow"/);
  assert.match(viewSource, /setSwampSceneId\(selectedObject\.targetScene\)/);
  assert.match(viewSource, /title: "Тропа в глубь болота"/);
  assert.match(viewSource, /title: "Нора среди корней"/);
  assert.match(viewSource, /Вернуться на Болото/);
});

test("both swamp sublocations use valid embedded WebP data instead of external paths", () => {
  assert.match(subLocationsSource, /swampSubLocationChunks\/deep-01\.js/);
  assert.match(subLocationsSource, /swampSubLocationChunks\/deep-02\.js/);
  assert.match(subLocationsSource, /swampSubLocationChunks\/roots-01\.js/);
  assert.match(subLocationsSource, /swampSubLocationChunks\/roots-02\.js/);
  assert.match(subLocationsSource, /data:image\/webp;base64,\$\{deep1\}\$\{deep2\}/);
  assert.match(subLocationsSource, /data:image\/webp;base64,\$\{roots1\}\$\{roots2\}/);
  assert.match(deepChunk1, /UklGRhA9AABXRUJQVlA4IAQ9/);
  assert.match(deepChunk2, /AC1gXyAACOcAAA==/);
  assert.match(rootsChunk1, /UklGRsg9AABXRUJQVlA4ILw9/);
  assert.match(rootsChunk2, /W15cCkLQNSAAAA==/);
});

test("swamp art and hotspots share the exact approved crop geometry", () => {
  assert.match(cssSource, /\.location-map--swamp[\s\S]*aspect-ratio: 4 \/ 3/);
  assert.match(cssSource, /\.location-map--swamp[\s\S]*object-fit: fill/);
  assert.match(cssSource, /\.location-map--swamp[\s\S]*object-position: 50% 50%/);
  assert.match(viewSource, /className="location-map location-map--swamp"/);
});

test("all functional swamp hotspots are pinned to measured painted marker pixels", () => {
  for (const [x, y] of paintedMarkerPixels) {
    assert.match(viewSource, new RegExp(`x: ${x}, y: ${y}`));
  }
  assert.match(viewSource, /SWAMP_ART_WIDTH = 768/);
  assert.match(viewSource, /SWAMP_ART_HEIGHT = 680/);
});

test("swamp points stay disabled until its scene image is loaded", () => {
  assert.match(viewSource, /const \[swampArtStatus, setSwampArtStatus\] = useState\("loading"\)/);
  assert.match(viewSource, /const swampArtReady = !isBaseSwamp \|\| swampArtStatus === "ready"/);
  assert.match(viewSource, /disabled=\{!swampArtReady\}/);
});

test("existing meadow npc and chest interactions remain in place", () => {
  assert.match(viewSource, /meadow-npc/);
  assert.match(viewSource, /meadow-chest/);
  assert.match(viewSource, /onObjectAction/);
});
