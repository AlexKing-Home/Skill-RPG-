import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navigationAssets = [
  "tabs-map.webp",
  "tabs-location.webp",
  "tabs-character.webp",
  "bottom-main-map.webp",
  "bottom-character.webp",
  "character-nav-sprite.webp",
];

test("navigation WebP files are complete RIFF images", () => {
  for (const asset of navigationAssets) {
    const data = readFileSync(new URL(`../public/ui/navigation/${asset}`, import.meta.url));
    assert.equal(data.subarray(0, 4).toString("ascii"), "RIFF", `${asset} has no RIFF header`);
    assert.equal(data.subarray(8, 12).toString("ascii"), "WEBP", `${asset} is not WebP`);
    assert.equal(data.readUInt32LE(4) + 8, data.length, `${asset} is truncated`);
  }
});

test("all game tabs and the bottom navigation stay rendered", () => {
  const screen = readFileSync(
    new URL("../src/screens/CharacterScreen.jsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(new URL("../src/navigation-reference-v9.css", import.meta.url), "utf8");

  assert.doesNotMatch(screen, /activeTab\s*!==\s*["']location["']/);
  assert.match(screen, /<BottomNav/);
  assert.match(screen, /active=\{profileMode \? characterSection : activeTab\}/);
  assert.match(screen, /onChange=\{profileMode \? setCharacterSection : handleTabChange\}/);
  assert.match(css, /tabs-location\.webp\?v=11/);
  assert.match(css, /tabs-character\.webp\?v=11/);
  assert.match(css, /bottom-main-map\.webp\?v=11/);
  assert.match(css, /bottom-character\.webp\?v=11/);
});
