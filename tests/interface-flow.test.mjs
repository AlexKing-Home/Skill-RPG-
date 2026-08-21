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
const statsSource = await read("../src/components/CharacterStatsView.jsx");
const playerHudSource = await read("../src/components/PlayerHud.jsx");
const battleViewSource = await read("../src/components/BattleView.jsx");
const bottomNavSource = await read("../src/components/BottomNav.jsx");
const placeholderSource = await read("../src/components/PlaceholderView.jsx");

test("creating a character opens the integrated game screen", () => {
  assert.match(appSource, /setScreen\("character"\)/);
  assert.match(appSource, /<CharacterScreen character=\{character\}/);
  assert.match(appSource, /exact-reference\.css/);
});

test("game screen contains HUD maps tabs and integrated character profile", () => {
  assert.match(characterScreenSource, /<PlayerHud/);
  assert.match(characterScreenSource, /<GameTabs/);
  assert.match(characterScreenSource, /WorldMapView/);
  assert.match(characterScreenSource, /LocationMapView/);
  assert.match(characterScreenSource, /CharacterDetailsView/);
  assert.match(characterScreenSource, /game-content--character-reference/);
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
  assert.match(detailsSource, /onClick=\{\(\) => handleSlotClick\(slot, item\)\}/);
});

test("character bottom navigation exposes profile subsections", () => {
  for (const label of ["Навыки", "Инвентарь", "Характеристики", "Персонаж"]) {
    assert.match(bottomNavSource, new RegExp(label));
  }
  assert.match(bottomNavSource, /const characterItems/);
  assert.match(bottomNavSource, /variant === "character"/);
});

test("character subsections stay inside the character tab", () => {
  assert.match(characterScreenSource, /\[characterSection, setCharacterSection\]/);
  assert.match(characterScreenSource, /characterSection === "character"/);
  assert.match(characterScreenSource, /<PlaceholderView type=\{characterSection\}/);
  assert.match(characterScreenSource, /active=\{profileMode \? characterSection : activeTab\}/);
  assert.match(
    characterScreenSource,
    /onChange=\{profileMode \? setCharacterSection : handleTabChange\}/,
  );
  assert.match(placeholderSource, /title: "Навыки"/);
  assert.match(placeholderSource, /title: "Характеристики"/);
});

test("characteristic rows include accuracy mobility and plus-minus controls", () => {
  assert.match(statsSource, /key: "accuracy", label: "Точность"/);
  assert.match(statsSource, /key: "mobility", label: "Мобильность"/);
  assert.match(statsSource, /character-stat-button--minus/);
  assert.match(statsSource, /character-stat-button--plus/);
  assert.match(statsSource, /onStatChange\(stat\.key, -1\)/);
  assert.match(statsSource, /onStatChange\(stat\.key, 1\)/);
  assert.match(statsSource, /disabled=\{value <= 0\}/);
  assert.match(characterScreenSource, /function handleStatChange\(key, delta\)/);
  assert.match(characterScreenSource, /stats: nextStats/);
  assert.match(characterScreenSource, /function persist\(overrides = \{\}\)/);
});

test("character HUD includes stamina and skill mastery progression", () => {
  assert.match(playerHudSource, /hud-resource--stamina/);
  assert.match(playerHudSource, /ВЫНОСЛИВОСТЬ/);
  assert.match(playerHudSource, /currentStamina/);
  assert.match(playerHudSource, /maxStamina/);
  assert.match(playerHudSource, /МАСТЕРСТВО/);
  assert.match(playerHudSource, /progression\.percent/);
  assert.match(characterScreenSource, /progression=\{progression\}/);
});

test("battle direction buttons define their basic combat actions", () => {
  assert.match(battleViewSource, /left: "УДАР СЛЕВА!"/);
  assert.match(battleViewSource, /right: "УДАР СПРАВА!"/);
  assert.match(battleViewSource, /up: "БЛОК!"/);
  assert.match(battleViewSource, /down: "ПАРИРОВАНИЕ!"/);
  assert.match(battleViewSource, /function handleDirection\(directionId\)/);
  assert.match(battleViewSource, /onClick=\{\(\) => handleDirection\(direction\.id\)\}/);
});

test("battle action notification appears only after the shared 1.5 second combo window", () => {
  assert.match(battleViewSource, /COMBO_INPUT_TIMEOUT_MS = 1500/);
  assert.match(battleViewSource, /function resolveCombo\(sequence\)/);
  assert.match(battleViewSource, /sequence\.length === 1/);
  assert.match(battleViewSource, /showAction\(BASIC_ACTIONS\[sequence\[0\]\]\)/);
  assert.match(battleViewSource, /resolveCombo\(comboSequenceRef\.current\)/);
  assert.match(battleViewSource, /"Ввод комбинации…"/);
});

test("battle resolves skills through the active weapon profile instead of hardcoded sword logic", () => {
  assert.doesNotMatch(battleViewSource, /findOneHandedSwordSkill/);
  assert.match(battleViewSource, /typeof findSkill === "function" \? findSkill\(sequence\) : null/);
  assert.match(battleViewSource, /onSkillActivate \? onSkillActivate\(skill\) : true/);
  assert.match(
    battleViewSource,
    /showAction\(`НАВЫК: \$\{skill\.name\}! −\$\{skill\.staminaCost\} ВЫН\.`\)/,
  );
  assert.match(battleViewSource, /НЕДОСТАТОЧНО ВЫНОСЛИВОСТИ!/);
  assert.match(characterScreenSource, /getCombatProfile\(character\.classId\)/);
  assert.match(characterScreenSource, /findSkill=\{combatProfile\.findSkill\}/);
});

test("character combat state deducts stamina and advances weapon mastery", () => {
  assert.match(characterScreenSource, /\[currentStamina, setCurrentStamina\]/);
  assert.match(characterScreenSource, /\[skillMastery, setSkillMastery\]/);
  assert.match(characterScreenSource, /function handleSkillActivate\(skill\)/);
  assert.match(characterScreenSource, /currentStamina < staminaCost/);
  assert.match(characterScreenSource, /const nextStamina = currentStamina - staminaCost/);
  assert.match(characterScreenSource, /increaseWeaponMastery\(skillMastery, combatProfile\.masteryKey\)/);
  assert.match(characterScreenSource, /setCurrentStamina\(nextStamina\)/);
  assert.match(characterScreenSource, /setSkillMastery\(nextSkillMastery\)/);
  assert.match(characterScreenSource, /currentStamina: nextStamina/);
  assert.match(characterScreenSource, /skillMastery: nextSkillMastery/);
  assert.match(characterScreenSource, /onSkillActivate=\{handleSkillActivate\}/);
});

test("active encounters lock navigation and expose an explicit flee action", () => {
  assert.match(characterScreenSource, /if \(activeEncounter && nextTab !== "battle"\) return/);
  assert.match(characterScreenSource, /if \(activeEncounter\) return;[\s\S]*const nextLocation/);
  assert.match(characterScreenSource, /const battleLocked = Boolean\(activeEncounter\)/);
  assert.match(characterScreenSource, /locked=\{battleLocked\}/);
  assert.match(characterScreenSource, /function handleFleeBattle\(\)/);
  assert.match(characterScreenSource, /onFlee=\{handleFleeBattle\}/);
  assert.match(battleViewSource, /className="battle-flee"/);
  assert.match(battleViewSource, />\s*Бегство\s*</);
});

test("battle combo timer starts once on the first input and does not restart", () => {
  assert.match(battleViewSource, /function startComboTimer\(\)/);
  assert.match(battleViewSource, /if \(comboTimerRef\.current !== null\) return/);
  assert.match(battleViewSource, /startComboTimer\(\)/);
  assert.doesNotMatch(battleViewSource, /restartComboTimer/);
  assert.match(battleViewSource, /comboTimerRef\.current = null/);
  assert.match(battleViewSource, /comboSequenceRef\.current = \[\]/);
  assert.match(battleViewSource, /setComboSequence\(\[\]\)/);
  assert.match(battleViewSource, /battle-combo__timer-fill/);
  assert.match(battleViewSource, /animationDuration: `\$\{COMBO_INPUT_TIMEOUT_MS\}ms`/);
});

test("regeneration timer depends on regeneration parameters rather than stamina or travel state", () => {
  assert.match(characterScreenSource, /snapshotRef/);
  assert.match(
    characterScreenSource,
    /\}, \[maxHealth, willBonuses\.regenerationIntervalMs, willBonuses\.regenerationPerTick\]\);/,
  );
  assert.doesNotMatch(
    characterScreenSource,
    /\}, \[[^\]]*currentStamina[^\]]*\]\);/,
  );
});

test("reference character view keeps portrait stats and equipment in one integrated page", () => {
  assert.match(detailsSource, /character-profile--reference/);
  assert.match(detailsSource, /character-summary__portrait/);
  assert.match(detailsSource, /character-stat-grid/);
  assert.match(detailsSource, /equipment-grid/);
  assert.match(detailsSource, /Уровень героя/);
  assert.match(detailsSource, /Сила атаки/);
});
