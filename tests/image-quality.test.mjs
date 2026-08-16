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
  assert.match(assetSource, /image-quality-v1/);
});

test("final image rendering rules are loaded after location styles", () => {
  assert.match(mainSource, /import "\.\/swamp-location\.css";\s*import "\.\/image-quality\.css";/);
  assert.match(qualityCss, /image-rendering: auto/);
  assert.match(qualityCss, /-webkit-optimize-contrast/);
  assert.match(qualityCss, /background-attachment: scroll/);
});

test("non-generative enhancer covers static and embedded game artwork", () => {
  assert.match(enhancerSource, /public\/backgrounds\/welcome-bg\.jpg/);
  assert.match(enhancerSource, /public\/skins\/male-swordsman\.jpg/);
  assert.match(enhancerSource, /public\/ui\/navigation/);
  assert.match(enhancerSource, /src\/data\/mapChunks/);
  assert.match(enhancerSource, /src\/data\/swampLocationChunks/);
  assert.match(enhancerSource, /src\/data\/swampSubLocationChunks/);
  assert.match(enhancerSource, /INTER_LANCZOS4/);
  assert.match(enhancerSource, /quality=config\.get\("quality", 95\)/);
});
