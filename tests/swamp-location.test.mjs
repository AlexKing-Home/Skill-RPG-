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

const calibratedCenters = [
  [10.74, 20.23],
  [46.65, 18.17],
  [73.54, 21.26],
  [29.27, 40.09],
  [98.78, 44.96],
  [1.59, 61.53],
  [39.15, 70.13],
  [98.25, 81.09],
  [43.09, 90.91],
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
  assert.match(viewSource, /swampArtStatus === "ready"/);
  assert.match(viewSource, /Нажмите на светящуюся точку на болоте/);
  assert.match(cssSource, /\.swamp-point/);
  assert.match(cssSource, /touch-action: manipulation/);
});

test("swamp hotspots use the exact uploaded image geometry and calibrated marker centers", () => {
  assert.match(cssSource, /aspect-ratio: 768 \/ 687/);
  assert.match(cssSource, /transform: none !important/);
  assert.match(cssSource, /scale: 1 !important/);

  for (const [x, y] of calibratedCenters) {
    assert.match(
      viewSource,
      new RegExp(`x: ${String(x).replace(".", "\\.")},\\s+y: ${String(y).replace(".", "\\.")}`),
    );
  }
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
