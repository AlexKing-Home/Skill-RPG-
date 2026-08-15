import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), "utf8");
}

const appSource = await read("../src/App.jsx");
const welcomeSource = await read("../src/screens/WelcomeScreen.jsx");
const creationSource = await read("../src/screens/CharacterCreationScreen.jsx");
const characterScreenSource = await read("../src/screens/CharacterScreen.jsx");
const skinCardSource = await read("../src/components/SkinCard.jsx");
const tabsSource = await read("../src/components/GameTabs.jsx");
const detailsSource = await read("../src/components/CharacterDetailsView.jsx");
const bottomNavSource = await read("../src/components/BottomNav.jsx");

test("creating a character opens the integrated game screen", () => {
  assert.match(appSource, /setScreen\("character"\)/);
  assert.match(appSource, /<CharacterScreen character=\{character\}/);
  assert.match(appSource, /exact-reference\.css/);
});

test("game screen contains HUD maps tabs and dedicated character profile", () => {
  assert.match(characterScreenSource, /<PlayerHud/);
  assert.match(characterScreenSource, /<GameTabs/);
  assert.match(characterScreenSource, /WorldMapView/);
  assert.match(characterScreenSource, /LocationMapView/);
  assert.match(characterScreenSource, /CharacterDetailsView/);
  assert.match(characterScreenSource, /<BottomNav/);
});

test("welcome and creation menu buttons have real click handlers", () => {
  assert.match(welcomeSource, /onClick=\{onContinue\}/);
  assert.match(welcomeSource, /onClick=\{onCreate\}/);
  assert.match(creationSource, /onClick=\{onBack\}/);
  assert.match(creationSource, /onClick=\{\(\) => chooseGender\("male"\)\}/);
  assert.match(creationSource, /onClick=\{\(\) => chooseGender\("female"\)\}/);
  assert.match(creationSource, /type="submit"/);
});

test("class cards tabs bottom navigation and equipment slots are clickable", () => {
  assert.match(skinCardSource, /onClick=\{onSelect\}/);
  assert.match(tabsSource, /onClick=\{\(\) => onChange\(tab\.id\)\}/);
  assert.match(bottomNavSource, /onClick=/);
  assert.match(bottomNavSource, /item\.id === "home"/);
  assert.match(bottomNavSource, /onHome\(\)/);
  assert.match(bottomNavSource, /onChange\(item\.id\)/);
  assert.match(detailsSource, /onClick=\{onBack\}/);
  assert.match(detailsSource, /onClick=\{\(\) => handleSlotClick\(slot, item\)\}/);
});

test("bottom navigation exposes all approved destinations", () => {
  for (const label of ["Главная", "Задания", "Карта", "Инвентарь", "Персонаж"]) {
    assert.match(bottomNavSource, new RegExp(label));
  }
});
