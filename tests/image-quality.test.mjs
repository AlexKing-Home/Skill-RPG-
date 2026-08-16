import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const mainSource = await read("../src/main.jsx");
const assetSource = await read("../src/data/assets.js");
const qualityCss = await read("../src/image-quality.css");
const enhancerSource = await read("../scripts/enhance-images.py");

test("enhanced static images use a fresh cache generation", () => {
  assert.ok(assetSource.includes("image-quality-v1"));
});

test("final image rendering rules are loaded after location styles", () => {
  const swampIndex = mainSource.indexOf('import "./swamp-location.css";');
  const qualityIndex = mainSource.indexOf('import "./image-quality.css";');

  assert.ok(swampIndex >= 0);
  assert.ok(qualityIndex > swampIndex);
  assert.ok(qualityCss.includes("image-rendering: auto"));
  assert.ok(qualityCss.includes("-webkit-optimize-contrast"));
  assert.ok(qualityCss.includes("background-attachment: scroll"));
});

test("non-generative enhancer covers static and embedded game artwork", () => {
  assert.ok(enhancerSource.includes('ROOT / "public/backgrounds/welcome-bg.jpg"'));
  assert.ok(enhancerSource.includes('ROOT / "public/skins/male-swordsman.jpg"'));
  assert.ok(enhancerSource.includes('ROOT / "public/ui/navigation"'));
  assert.ok(enhancerSource.includes('ROOT / "src/data/mapChunks"'));
  assert.ok(enhancerSource.includes('ROOT / "src/data/swampLocationChunks"'));
  assert.ok(enhancerSource.includes('ROOT / "src/data/swampSubLocationChunks"'));
  assert.ok(enhancerSource.includes("INTER_LANCZOS4"));
  assert.ok(enhancerSource.includes('config.get("quality", 95)'));
});
