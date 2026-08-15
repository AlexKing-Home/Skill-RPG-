import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const viewSource = await read("../src/components/LocationMapView.jsx");
const artSource = await read("../src/data/swampLocationArt.js");
const firstChunkSource = await read("../src/data/swampLocationChunks/swamp-01.js");
const lastChunkSource = await read("../src/data/swampLocationChunks/swamp-06.js");
const cssSource = await read("../src/swamp-location.css");
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

test("swamp node renders the exact uploaded scene as an embedded image", () => {
  assert.match(viewSource, /\.\.\/data\/swampLocationArt\.js/);
  assert.match(viewSource, /location\.nodeId === "swamp"/);
  assert.match(viewSource, /src=\{swampLocationArt\}/);
  assert.match(viewSource, /onLoad=\{\(\) => setSwampArtStatus\("ready"\)\}/);
  assert.match(artSource, /data:image\/webp;base64/);
  assert.match(artSource, /c1.*c2.*c3.*c4.*c5.*c6/);
  assert.match(firstChunkSource, /UklGRgjIAABXRUJQVlA4IPzH/);
  assert.match(lastChunkSource, /MWX5Ru2qOHRdzapWsFK4B1KQNSAAAA/);
  assert.match(mainSource, /import "\.\/swamp-location\.css"/);
});

test("approved swamp scene exposes all nine clickable interest points", () => {
  for (const pointId of pointIds) {
    assert.match(viewSource, new RegExp(`id: "${pointId}"`));
  }

  assert.match(viewSource, /className={`swamp-point/);
  assert.match(viewSource, /onClick=\{\(\) => handleObjectTap\(point\.id\)\}/);
  assert.match(viewSource, /onPointerDown=\{isSwamp \? handleSwampPointerDown : undefined\}/);
  assert.match(viewSource, /onPointerUp=\{isSwamp \? handleSwampPointerUp : undefined\}/);
  assert.match(viewSource, /SWAMP_TAP_RADIUS = 72/);
  assert.match(viewSource, /nearestDistance <= SWAMP_TAP_RADIUS/);
  assert.match(cssSource, /\.swamp-point/);
  assert.match(cssSource, /touch-action: manipulation/);
});

test("swamp art and hotspots share the exact approved crop geometry", () => {
  assert.match(viewSource, /SWAMP_ART_WIDTH = 775/);
  assert.match(viewSource, /SWAMP_ART_HEIGHT = 695/);
  assert.match(cssSource, /aspect-ratio: 775 \/ 695 !important/);
  assert.match(cssSource, /object-fit: fill !important/);
  assert.match(cssSource, /transform: none !important/);
  assert.match(cssSource, /translate: none !important/);
  assert.match(cssSource, /scale: 1 !important/);
});

test("all functional swamp hotspots are pinned to measured painted marker pixels", () => {
  for (const [sourceX, sourceY] of paintedMarkerPixels) {
    assert.match(viewSource, new RegExp(`sourceX: ${sourceX},\\s+sourceY: ${sourceY}`));
  }

  assert.match(viewSource, /point\.sourceX \/ SWAMP_ART_WIDTH/);
  assert.match(viewSource, /point\.sourceY \/ SWAMP_ART_HEIGHT/);
});

test("swamp points stay disabled until its real image is loaded", () => {
  assert.match(viewSource, /swampArtStatus !== "ready"/);
  assert.match(viewSource, /Дождитесь загрузки изображения болота/);
  assert.match(viewSource, /Не удалось загрузить локацию/);
});

test("existing meadow npc and chest interactions remain in place", () => {
  assert.match(viewSource, /field-npc-wanderer/);
  assert.match(viewSource, /field-chest-01/);
  assert.match(viewSource, /onOpenChest/);
});
