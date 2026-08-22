import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { swampDeepPathArt, swampRootsBurrowArt } from "../src/data/swampSubLocations.js";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const viewSource = await read("../src/components/LocationMapView.jsx");
const meadowSource = await read("../src/components/MeadowLocationView.jsx");
const artSource = await read("../src/data/swampLocationArt.js");
const subLocationsSource = await read("../src/data/swampSubLocations.js");
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

function assertValidWebpDataUri(dataUri) {
  assert.match(dataUri, /^data:image\/webp;base64,/);

  const image = Buffer.from(dataUri.slice(dataUri.indexOf(",") + 1), "base64");
  assert.equal(image.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(image.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(image.readUInt32LE(4) + 8, image.length);
  assert.ok(image.length > 10000);
}

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
  assertValidWebpDataUri(swampDeepPathArt);
  assertValidWebpDataUri(swampRootsBurrowArt);
});

test("swamp art and hotspots share the exact approved crop geometry", () => {
  assert.match(viewSource, /SWAMP_ART_WIDTH = 775/);
  assert.match(viewSource, /SWAMP_ART_HEIGHT = 695/);
  assert.match(cssSource, /\.location-map--swamp[\s\S]*aspect-ratio: 775 \/ 695 !important/);
  assert.match(cssSource, /\.location-map--swamp[\s\S]*object-fit: fill !important/);
  assert.match(cssSource, /\.location-map--swamp[\s\S]*object-position: 50% 50% !important/);
  assert.match(viewSource, /isSwamp \? "location-map--swamp" : ""/);
});

test("all functional swamp hotspots are pinned to measured painted marker pixels", () => {
  for (const [sourceX, sourceY] of paintedMarkerPixels) {
    assert.match(viewSource, new RegExp(`sourceX: ${sourceX},\\s+sourceY: ${sourceY}`));
  }
  assert.match(viewSource, /point\.sourceX \/ SWAMP_ART_WIDTH/);
  assert.match(viewSource, /point\.sourceY \/ SWAMP_ART_HEIGHT/);
});

test("swamp points stay disabled until its scene image is loaded", () => {
  assert.match(viewSource, /const \[swampArtStatus, setSwampArtStatus\] = useState\("loading"\)/);
  assert.match(viewSource, /if \(!isBaseSwamp \|\| swampArtStatus !== "ready"\) return/);
  assert.match(viewSource, /isBaseSwamp &&\s+swampArtStatus === "ready" &&\s+swampPoints\.map/);
  assert.match(viewSource, /Дождитесь загрузки изображения болота/);
});

test("existing meadow npc and chest interactions remain in place", () => {
  assert.match(meadowSource, /field-npc-wanderer/);
  assert.match(meadowSource, /field-chest-01/);
  assert.match(meadowSource, /onOpenChest/);
});
