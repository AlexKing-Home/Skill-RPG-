import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const mainSource = await read("../src/main.jsx");
const navCss = await read("../src/styles/navigation.css");
const characterNavCss = await read("../src/styles/character.css");
const tabsSource = await read("../src/components/GameTabs.jsx");
const bottomNavSource = await read("../src/components/BottomNav.jsx");

test("navigation and character layers keep their cascade order", () => {
  const navigation = mainSource.indexOf('import "./styles/navigation.css"');
  const world = mainSource.indexOf('import "./styles/world.css"');
  const character = mainSource.indexOf('import "./styles/character.css"');
  assert.ok(navigation >= 0);
  assert.ok(world > navigation);
  assert.ok(character > world);
});

test("map location battle and character share one four-column top navigation geometry", () => {
  assert.match(
    navCss,
    /\.game-tabs--map,[\s\S]*\.game-tabs--location,[\s\S]*\.game-tabs--battle,[\s\S]*\.game-tabs--character/,
  );
  assert.match(navCss, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(navCss, /background-image:\s*none !important/);
  for (const label of ["Карта", "Локация", "Бой", "Персонаж"]) {
    assert.match(tabsSource, new RegExp(label));
  }
});

test("active battle can lock navigation without removing the battle tab", () => {
  assert.match(tabsSource, /locked = false/);
  assert.match(tabsSource, /locked && tab\.id !== activeTab/);
  assert.match(tabsSource, /disabled=\{disabled\}/);
  assert.match(bottomNavSource, /locked = false/);
  assert.match(bottomNavSource, /if \(locked\) return/);
  assert.match(bottomNavSource, /disabled=\{locked\}/);
});

test("only active tab receives the same gold highlight and diamonds", () => {
  assert.match(navCss, /\.game-tab\.is-active\s*\{/);
  assert.match(navCss, /\.game-tab\.is-active::before,[\s\S]*\.game-tab\.is-active::after/);
  assert.match(navCss, /transform:\s*translateX\(-50%\) rotate\(45deg\)/);
});

test("character bottom navigation switches approved high-quality artwork with four real hit targets", () => {
  assert.match(characterNavCss, /\.bottom-nav--character\s*\{/);
  assert.match(characterNavCss, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(characterNavCss, /background-image:\s*var\(--character-nav-sprite\) !important/);
  assert.match(characterNavCss, /background-size:\s*100% 400% !important/);

  for (const part of ["01", "02", "03", "04"]) {
    assert.match(bottomNavSource, new RegExp(`character-nav-hq/part-${part}\\.b64\\?raw`));
  }
  assert.match(bottomNavSource, /data:image\/webp;base64/);
  assert.match(bottomNavSource, /--character-nav-sprite/);

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
