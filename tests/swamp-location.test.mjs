import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const viewSource = await read("../src/components/LocationMapView.jsx");
const artSource = await read("../src/data/swampLocationArt.js");
const canvasSource = await read("../src/components/EmbeddedArtCanvas.jsx");
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

test("swamp node renders approved art through an embedded canvas", () => {
  assert.match(viewSource, /swampLocationArt/);
  assert.match(viewSource, /location\.nodeId === "swamp"/);
  assert.match(viewSource, /<EmbeddedArtCanvas/);
  assert.match(viewSource, /dataUrl=\{swampLocationArt\}/);
  assert.match(artSource, /data:image\/webp;base64/);
  assert.match(canvasSource, /window\.atob/);
  assert.match(canvasSource, /createImageBitmap/);
  assert.match(canvasSource, /context\.drawImage/);
  assert.match(mainSource, /import "\.\/swamp-location\.css"/);
});

test("approved swamp scene exposes all nine clickable interest points", () => {
  for (const pointId of pointIds) {
    assert.match(viewSource, new RegExp(`id: "${pointId}"`));
  }

  assert.match(viewSource, /className={`swamp-point/);
  assert.match(viewSource, /onClick=\{\(\) => handleObjectTap\(point\.id\)\}/);
  assert.match(viewSource, /Нажмите на светящуюся точку на болоте/);
  assert.match(cssSource, /\.swamp-point/);
  assert.match(cssSource, /touch-action: manipulation/);
});

test("swamp rendering never falls back to a blank hidden image", () => {
  assert.doesNotMatch(viewSource, /src=\{sceneArt\}/);
  assert.match(canvasSource, /Загрузка локации/);
  assert.match(canvasSource, /Не удалось загрузить локацию/);
  assert.match(cssSource, /\.embedded-art-status/);
});

test("existing meadow npc and chest interactions remain in place", () => {
  assert.match(viewSource, /field-npc-wanderer/);
  assert.match(viewSource, /field-chest-01/);
  assert.match(viewSource, /onOpenChest/);
});
