import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const mainSource = await read("../src/main.jsx");
const navCss = await read("../src/navigation-unified.css");
const characterNavCss = await read("../src/character-navigation-art.css");
const bottomNavSource = await read("../src/components/BottomNav.jsx");

test("unified tab skin loads after state-specific navigation artwork", () => {
  const stateSpecific = mainSource.indexOf('import "./navigation-reference-v9.css"');
  const unified = mainSource.indexOf('import "./navigation-unified.css"');
  assert.ok(stateSpecific >= 0);
  assert.ok(unified > stateSpecific);
});

test("character artwork override loads after unified navigation", () => {
  const unified = mainSource.indexOf('import "./navigation-unified.css"');
  const characterArtwork = mainSource.indexOf('import "./character-navigation-art.css"');
  assert.ok(unified >= 0);
  assert.ok(characterArtwork > unified);
});

test("map location and character share one top navigation geometry", () => {
  assert.match(
    navCss,
    /\.game-tabs--map,[\s\S]*\.game-tabs--location,[\s\S]*\.game-tabs--character/,
  );
  assert.match(navCss, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(navCss, /background-image:\s*none !important/);
});

test("only active tab receives the same gold highlight and diamonds", () => {
  assert.match(navCss, /\.game-tab\.is-active\s*\{/);
  assert.match(navCss, /\.game-tab\.is-active::before,[\s\S]*\.game-tab\.is-active::after/);
  assert.match(navCss, /transform:\s*translateX\(-50%\) rotate\(45deg\)/);
});

test("character bottom navigation switches approved artwork with four real hit targets", () => {
  assert.match(characterNavCss, /\.bottom-nav--character\s*\{/);
  assert.match(characterNavCss, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(characterNavCss, /background-image:\s*var\(--character-nav-sprite\) !important/);
  assert.match(characterNavCss, /background-size:\s*100% 400% !important/);
  assert.match(
    bottomNavSource,
    /import characterNavSpriteAsset from "\.\.\/assets\/character-nav-sprite\.webp"/,
  );
  assert.match(bottomNavSource, /new URL\(characterNavSpriteAsset, window\.location\.href\)\.href/);

  for (const state of ["skills", "inventory", "stats", "character"]) {
    assert.match(characterNavCss, new RegExp(`bottom-nav--active-${state}`));
  }

  assert.match(
    characterNavCss,
    /\.bottom-nav--character \.bottom-nav__item > span,[\s\S]*opacity:\s*0 !important/,
  );
  assert.match(
    characterNavCss,
    /\.bottom-nav--character \.bottom-nav__item,[\s\S]*background:\s*transparent !important/,
  );
});
