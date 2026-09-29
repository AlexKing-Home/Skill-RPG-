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
const skillsSource = await read("../src/components/CharacterSkillsView.jsx");
const playerHudSource = await read("../src/components/PlayerHud.jsx");
const battleViewSource = await read("../src/components/BattleView.jsx");
const worldMapSource = await read("../src/components/WorldMapView.jsx");
const bottomNavSource = await read("../src/components/BottomNav.jsx");
const placeholderSource = await read("../src/components/PlaceholderView.jsx");
const inventorySource = await read("../src/components/InventoryView.jsx");
const encounterSource = await read("../src/data/travelEncounters.js");

test("creating a character opens the integrated game screen", () => {
  assert.match(appSource, /setScreen\("character"\)/);
  assert.match(appSource, /<CharacterScreen character=\{character\}/);
  assert.match(appSource, /styles\/app-theme\.css/);
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

test("wild boar encounter provides and displays enemy artwork in battle", () => {
  assert.match(encounterSource, /image: wildBoarArt/);
  assert.match(encounterSource, /attack: 18/);
  assert.match(encounterSource, /defense: 2/);
  assert.match(encounterSource, /maxHealth: 25/);
  assert.match(battleViewSource, /className="battle-card__enemy-art"/);
  assert.match(battleViewSource, /className="battle-enemy-health"/);
  assert.match(battleViewSource, /enemyHealthPercent/);
  assert.match(battleViewSource, /\{enemyCurrentHealth\} \/ \{enemyMaxHealth\}/);
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
  assert.match(battleViewSource, /resolveComboRef\.current\(comboSequenceRef\.current\)/);
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
  assert.match(characterScreenSource, /getCombatProfile\(character\.classId, equipment\)/);
  assert.match(characterScreenSource, /findSkill=\{combatProfile\.findSkill\}/);
});

test("character combat state applies damage stamina and weapon mastery together", () => {
  assert.match(characterScreenSource, /\[currentStamina, setCurrentStamina\]/);
  assert.match(characterScreenSource, /\[skillMastery, setSkillMastery\]/);
  assert.match(characterScreenSource, /function handleSkillActivate\(skill\)/);
  assert.match(characterScreenSource, /resolvePlayerAction\(current, \{ skill \}\)/);
  assert.match(characterScreenSource, /if \(!result.accepted\) return false/);
  assert.match(characterScreenSource, /increaseWeaponMastery\(current.skillMastery, masteryKey\)/);
  assert.match(characterScreenSource, /setSkillMastery\(nextSkillMastery\)/);
  assert.match(characterScreenSource, /applyCombatChanges\(\{/);
  assert.match(characterScreenSource, /skillMastery: nextSkillMastery/);
  assert.match(
    characterScreenSource,
    /onSkillActivate=\{trainingMode \? \(\) => \(\{ activated: true \}\) : handleSkillActivate\}/,
  );
});
test("world map rest button restores stamina to the current maximum and persists it", () => {
  assert.match(worldMapSource, />\s*Отдохнуть\s*</);
  assert.match(worldMapSource, /onClick=\{onRest\}/);
  assert.match(characterScreenSource, /function handleRest\(\)/);
  assert.match(characterScreenSource, /setCurrentStamina\(maxStamina\)/);
  assert.match(characterScreenSource, /persist\(\{ currentStamina: maxStamina \}\)/);
  assert.match(characterScreenSource, /onRest=\{handleRest\}/);
});

test("active encounters lock navigation and expose an explicit flee action", () => {
  assert.match(characterScreenSource, /if \(activeEncounter && nextTab !== "battle"\) return/);
  assert.match(characterScreenSource, /if \(activeEncounter\) return;[\s\S]*const nextLocation/);
  assert.match(characterScreenSource, /const battleLocked = Boolean\(activeEncounter\)/);
  assert.match(characterScreenSource, /locked=\{battleLocked\}/);
  assert.match(characterScreenSource, /function handleFleeBattle\(\)/);
  assert.match(characterScreenSource, /onFlee=\{activeEncounter \? handleFleeBattle : undefined\}/);
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
  assert.doesNotMatch(characterScreenSource, /\}, \[[^\]]*currentStamina[^\]]*\]\);/);
});

test("character summary stats use vector icons instead of text glyphs", () => {
  assert.match(detailsSource, /function CharacterStatIcon/);
  assert.match(detailsSource, /<CharacterStatIcon type=\{stat\.id\}/);
  assert.doesNotMatch(detailsSource, /icon: "♛"/);
  assert.doesNotMatch(detailsSource, /icon: "⬡"/);
});

test("reference character view keeps portrait stats and equipment in one integrated page", () => {
  assert.match(detailsSource, /character-profile--reference/);
  assert.match(detailsSource, /character-summary__portrait/);
  assert.match(detailsSource, /character-stat-grid/);
  assert.match(detailsSource, /equipment-grid/);
  assert.match(detailsSource, /Уровень героя/);
  assert.match(detailsSource, /Сила атаки/);
});

test("mastery unlock progression is visible and enforced in combat", () => {
  assert.match(skillsSource, /Открыто приёмов:/);
  assert.match(skillsSource, /Следующий:/);
  assert.match(skillsSource, /masteryRequired/);
  assert.match(battleViewSource, /ПРИЁМ ЗАКРЫТ:/);
  assert.match(battleViewSource, /НОВЫЙ ПРИЁМ:/);
  assert.match(characterScreenSource, /currentMastery=/);
  assert.match(characterScreenSource, /unlockedSkill/);
});

test("combat profile follows the weapon currently stored in the primary equipment slot", () => {
  assert.match(characterScreenSource, /getCombatProfile\(character\.classId, equipment\)/);
  assert.match(characterScreenSource, /combatProfile\.masteryKey/);
  assert.match(characterScreenSource, /combatProfile\.skills/);
});

test("character creation hides the archer class", async () => {
  const skinsSource = await read("../src/data/skins.js");
  assert.match(skinsSource, /creationClassOrder = \["swordsman", "spearman", "assassin"\]/);
  assert.match(creationSource, /getSkinsByGender\(gender\)/);
});

test("starter inventory is rendered as a real game view", () => {
  assert.match(characterScreenSource, /<InventoryView character=\{activeCharacter\}/);
  assert.match(inventorySource, /Монеты:/);
  assert.match(inventorySource, /item\.effect\?\.type === "heal"/);
  assert.doesNotMatch(characterScreenSource, /\["tasks", "inventory"\]\.includes\(activeTab\)/);
});

test("equipped starter items contribute attack and defense without mutating base stats", () => {
  assert.match(characterScreenSource, /getEquipmentCombatBonuses\(equipment\)/);
  assert.match(characterScreenSource, /stats: combatStats/);
  assert.match(characterScreenSource, /snapshotRef\.current = \{[\s\S]*stats,/);
  assert.match(
    characterScreenSource,
    /resolvePlayerAction\(\s*\{ \.\.\.snapshotRef\.current, stats: combatStats \},\s*\{ direction \},?\s*\)/,
  );
});

test("equipment moves between slots and inventory through explicit controls", () => {
  assert.match(characterScreenSource, /function handleEquipItem\(itemId\)/);
  assert.match(characterScreenSource, /equipInventoryItem\(equipment, inventory, itemId\)/);
  assert.match(characterScreenSource, /function handleUnequipItem\(slotId\)/);
  assert.match(characterScreenSource, /unequipItem\(equipment, inventory, slotId\)/);
  assert.match(characterScreenSource, /equipment: result\.equipment/);
  assert.match(characterScreenSource, /inventory: result\.inventory/);
  assert.match(detailsSource, /onUnequip\(selectedSlot\.id\)/);
  assert.match(detailsSource, />\s*Снять\s*</);
  assert.match(inventorySource, /onEquip\(item\.id\)/);
  assert.match(inventorySource, />\s*Надеть\s*</);
});

test("wild boar victory grants persistent loot", () => {
  assert.match(characterScreenSource, /rollWildBoarLoot\(\)/);
  assert.match(characterScreenSource, /mergeInventoryItems\(current\.inventory, loot\.items\)/);
  assert.match(characterScreenSource, /nextCoins/);
  assert.match(characterScreenSource, /lastLoot: lootRecord/);
  assert.match(inventorySource, /Последняя добыча:/);
});
