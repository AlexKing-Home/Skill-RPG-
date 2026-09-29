import { lazy, Suspense, useEffect, useRef, useState } from "react";
import BattleView from "../components/BattleView.jsx";
import BottomNav from "../components/BottomNav.jsx";
import CharacterDetailsView from "../components/CharacterDetailsView.jsx";
import CharacterSkillsView from "../components/CharacterSkillsView.jsx";
import CharacterStatsView from "../components/CharacterStatsView.jsx";
import InventoryView from "../components/InventoryView.jsx";
import GameTabs from "../components/GameTabs.jsx";
import PlaceholderView from "../components/PlaceholderView.jsx";
import PlayerHud from "../components/PlayerHud.jsx";
import WorldMapView from "../components/WorldMapView.jsx";
import { getMaxHealth, getWillBonuses } from "../data/characteristics.js";
import {
  createBattle,
  resumeBattle,
  resolvePlayerAction,
  resolveEnemyAttack,
} from "../data/combat.js";
import { getCombatProfile } from "../data/combatProfiles.js";
import {
  equipInventoryItem,
  getEquipmentCombatBonuses,
  unequipItem,
} from "../data/equipment.js";
import { getDedicatedLocation } from "../data/locationRegistry.js";
import { getAvailableCharacteristicPoints, getSkillProgression } from "../data/progression.js";
import { increaseWeaponMastery, normalizeSkillMastery } from "../data/skills.js";
import { getMaxStamina, normalizeCurrentStamina } from "../data/stamina.js";
import { resolveTravelEncounter } from "../data/travelEncounters.js";
import {
  FLOOR_MAP_VERSION,
  START_NODE_ID,
  CITY_NODE_ID,
  locationFromNode,
} from "../data/worldNavigation.js";
import { saveCharacter } from "../utils/storage.js";
import "../game-interface.css";

const DedicatedLocationView = lazy(() => import("../components/DedicatedLocationView.jsx"));
const DungeonLocationView = lazy(() => import("../components/DungeonLocationView.jsx"));
const ForestLocationView = lazy(() => import("../components/ForestLocationView.jsx"));
const LocationMapView = lazy(() => import("../components/LocationMapView.jsx"));
const MeadowLocationView = lazy(() => import("../components/MeadowLocationView.jsx"));
const RuinsLocationView = lazy(() => import("../components/RuinsLocationView.jsx"));
const SettlementLocationView = lazy(() => import("../components/SettlementLocationView.jsx"));
const StartCityLocationView = lazy(() => import("../components/StartCityLocationView.jsx"));

const defaultLocation = locationFromNode(START_NODE_ID);

function LocationFallback() {
  return (
    <div className="embedded-art-status" role="status" aria-live="polite">
      Загрузка локации…
    </div>
  );
}

export default function CharacterScreen({ character, onBack }) {
  const [activeTab, setActiveTab] = useState(character.activeEncounter ? "battle" : "map");
  const [activeEncounter, setActiveEncounter] = useState(() =>
    character.activeEncounter
      ? resumeBattle(
          resolveTravelEncounter(character.activeEncounter),
          character.currentHealth ?? getMaxHealth(character.stats),
        )
      : null,
  );
  const [trainingMode, setTrainingMode] = useState(false);
  const [characterSection, setCharacterSection] = useState("character");
  const [stats, setStats] = useState(() => ({ ...character.stats }));
  const [equipment, setEquipment] = useState(() => ({ ...character.equipment }));
  const [inventory, setInventory] = useState(() =>
    Array.isArray(character.inventory) ? [...character.inventory] : [],
  );
  const [skillMastery, setSkillMastery] = useState(() =>
    normalizeSkillMastery(character.skillMastery),
  );
  const [location, setLocation] = useState(() => {
    const usesCurrentMap = character.worldState?.floorMapVersion === FLOOR_MAP_VERSION;
    if (!usesCurrentMap) return defaultLocation;
    return character.location?.nodeId
      ? locationFromNode(character.location.nodeId)
      : defaultLocation;
  });
  const [worldState, setWorldState] = useState(() => ({
    ...(character.worldState ?? {}),
    floorMapVersion: FLOOR_MAP_VERSION,
  }));

  const progression = getSkillProgression(skillMastery);
  const level = progression.level;
  const characteristicPoints = getAvailableCharacteristicPoints(level, stats);
  const maxHealth = getMaxHealth(stats);
  const willBonuses = getWillBonuses(stats);
  const maxStamina = getMaxStamina(stats);
  const combatProfile = getCombatProfile(character.classId, equipment);
  const equipmentBonuses = getEquipmentCombatBonuses(equipment);
  const combatStats = {
    ...stats,
    attack: Math.max(0, Number(stats.attack) || 0) + equipmentBonuses.attack,
    defense: Math.max(0, Number(stats.defense) || 0) + equipmentBonuses.defense,
  };
  const combatStatsRef = useRef(combatStats);
  combatStatsRef.current = combatStats;
  const [currentHealth, setCurrentHealth] = useState(() =>
    Math.min(maxHealth, Math.max(0, character.currentHealth ?? maxHealth)),
  );
  const [currentStamina, setCurrentStamina] = useState(() =>
    normalizeCurrentStamina(character.currentStamina, maxStamina),
  );
  const activeCharacter = {
    ...character,
    skillMastery,
    characteristicPoints,
    maxStamina,
    currentStamina,
    equipment,
    inventory,
    stats: combatStats,
  };
  const snapshotRef = useRef(null);
  snapshotRef.current = {
    ...activeCharacter,
    stats,
    currentHealth,
    activeEncounter,
    location,
    worldState,
  };

  useEffect(() => {
    setCurrentHealth((health) => Math.min(maxHealth, Math.max(0, health)));
  }, [maxHealth]);

  useEffect(() => {
    setCurrentStamina((stamina) => normalizeCurrentStamina(stamina, maxStamina));
  }, [maxStamina]);

  useEffect(() => {
    if (willBonuses.regenerationPerTick <= 0) return undefined;

    const intervalId = window.setInterval(() => {
      const current = snapshotRef.current;
      if (current.currentHealth <= 0 || current.activeEncounter?.status === "defeat") return;
      const nextHealth = Math.min(
        maxHealth,
        current.currentHealth + willBonuses.regenerationPerTick,
      );
      if (nextHealth !== current.currentHealth) {
        setCurrentHealth(nextHealth);
        persist({ currentHealth: nextHealth });
      }
    }, willBonuses.regenerationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [maxHealth, willBonuses.regenerationIntervalMs, willBonuses.regenerationPerTick]);

  function persist(overrides = {}) {
    const nextSnapshot = {
      ...snapshotRef.current,
      ...overrides,
    };
    snapshotRef.current = nextSnapshot;
    saveCharacter(nextSnapshot);
  }

  function handleEquipItem(itemId) {
    const result = equipInventoryItem(equipment, inventory, itemId);
    if (!result.changed) return false;

    setEquipment(result.equipment);
    setInventory(result.inventory);
    persist({
      equipment: result.equipment,
      inventory: result.inventory,
    });
    return true;
  }

  function handleUnequipItem(slotId) {
    const result = unequipItem(equipment, inventory, slotId);
    if (!result.changed) return false;

    setEquipment(result.equipment);
    setInventory(result.inventory);
    persist({
      equipment: result.equipment,
      inventory: result.inventory,
    });
    return true;
  }

  function handleStatChange(key, delta) {
    const currentValue = Math.max(0, Math.floor(Number(stats[key]) || 0));
    if (delta > 0 && characteristicPoints <= 0) return;
    if (delta < 0 && currentValue <= 0) return;

    const nextValue = Math.max(0, currentValue + delta);
    if (nextValue === currentValue) return;

    const nextStats = { ...stats, [key]: nextValue };
    const nextCharacteristicPoints = getAvailableCharacteristicPoints(level, nextStats);
    const nextMaxHealth = getMaxHealth(nextStats);
    const nextCurrentHealth = Math.min(nextMaxHealth, currentHealth);
    const nextMaxStamina = getMaxStamina(nextStats);
    const nextCurrentStamina = normalizeCurrentStamina(currentStamina, nextMaxStamina);

    setStats(nextStats);
    if (nextCurrentHealth !== currentHealth) setCurrentHealth(nextCurrentHealth);
    if (nextCurrentStamina !== currentStamina) setCurrentStamina(nextCurrentStamina);

    persist({
      characteristicPoints: nextCharacteristicPoints,
      stats: nextStats,
      maxStamina: nextMaxStamina,
      currentStamina: nextCurrentStamina,
      currentHealth: nextCurrentHealth,
    });
  }

  function applyCombatChanges(changes) {
    if (!changes) return;
    if (changes.currentHealth !== undefined) setCurrentHealth(changes.currentHealth);
    if (changes.currentStamina !== undefined) setCurrentStamina(changes.currentStamina);
    if (changes.activeEncounter !== undefined) setActiveEncounter(changes.activeEncounter);
    persist(changes);
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      applyCombatChanges(
        resolveEnemyAttack({ ...snapshotRef.current, stats: combatStatsRef.current }),
      );
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  function handleBasicAction(direction) {
    const result = resolvePlayerAction(
      { ...snapshotRef.current, stats: combatStats },
      { direction },
    );
    if (result.accepted) applyCombatChanges(result.changes);
    return result;
  }

  function handleSkillActivate(skill) {
    const current = { ...snapshotRef.current, stats: combatStats };
    const result = resolvePlayerAction(current, { skill });
    if (!result.accepted) return false;

    const masteryKey = combatProfile.masteryKey;
    const previousMastery = masteryKey ? (current.skillMastery[masteryKey] ?? 0) : 0;
    const nextSkillMastery = masteryKey
      ? increaseWeaponMastery(current.skillMastery, masteryKey)
      : current.skillMastery;
    const nextMastery = masteryKey ? (nextSkillMastery[masteryKey] ?? previousMastery) : 0;
    const unlockedSkill = (combatProfile.skills ?? []).find(
      (candidate) =>
        (candidate.masteryRequired ?? 0) > previousMastery &&
        (candidate.masteryRequired ?? 0) <= nextMastery,
    );
    const nextProgression = getSkillProgression(nextSkillMastery);
    const nextCharacteristicPoints = getAvailableCharacteristicPoints(
      nextProgression.level,
      current.stats,
    );

    setSkillMastery(nextSkillMastery);
    applyCombatChanges({
      ...result.changes,
      skillMastery: nextSkillMastery,
      characteristicPoints: nextCharacteristicPoints,
    });
    return { activated: true, unlockedSkill: unlockedSkill ?? null };
  }

  function handleFinishBattle() {
    const current = snapshotRef.current;
    if (!current.activeEncounter || current.activeEncounter.status === "active") return;
    const defeated = current.activeEncounter.status === "defeat";
    const nextLocation = defeated
      ? locationFromNode(CITY_NODE_ID)
      : locationFromNode(current.activeEncounter.destinationNodeId ?? current.location.nodeId);
    setLocation(nextLocation);
    applyCombatChanges({
      activeEncounter: null,
      location: nextLocation,
      ...(defeated ? { currentHealth: maxHealth, currentStamina: maxStamina } : {}),
    });
    setActiveTab("map");
  }

  function handleRest() {
    if (activeEncounter || currentStamina >= maxStamina) return;

    setCurrentStamina(maxStamina);
    persist({ currentStamina: maxStamina });
  }

  function handleTabChange(nextTab) {
    if (activeEncounter && nextTab !== "battle") return;
    setActiveTab(nextTab);
    if (nextTab === "character") setCharacterSection("character");
  }

  function handleTravel(nodeId) {
    if (activeEncounter) return;

    const nextLocation = locationFromNode(nodeId);
    const nextWorldState = {
      ...worldState,
      floorMapVersion: FLOOR_MAP_VERSION,
    };
    setLocation(nextLocation);
    setWorldState(nextWorldState);
    persist({ location: nextLocation, worldState: nextWorldState });
  }

  function handleEncounter(encounter) {
    if (activeEncounter || trainingMode) return;

    const nextEncounter = createBattle(resolveTravelEncounter(encounter));
    setActiveEncounter(nextEncounter);
    setTrainingMode(false);
    persist({ activeEncounter: nextEncounter });
    setActiveTab("battle");
  }

  function handleStartTraining() {
    if (activeEncounter) return;
    setActiveEncounter(null);
    setTrainingMode(true);
    setActiveTab("battle");
  }

  function handleEndTraining() {
    setTrainingMode(false);
    setActiveTab("location");
  }

  function handleFleeBattle() {
    if (snapshotRef.current.activeEncounter?.status !== "active") return;
    setActiveEncounter(null);
    persist({ activeEncounter: null });
    setActiveTab("map");
  }

  function handleHome() {
    if (activeEncounter) return;
    onBack();
  }

  function handleOpenChest(chestId) {
    const openedChests = worldState.openedChests ?? [];
    if (openedChests.includes(chestId)) return;

    const nextWorldState = {
      ...worldState,
      floorMapVersion: FLOOR_MAP_VERSION,
      openedChests: [...openedChests, chestId],
    };
    setWorldState(nextWorldState);
    persist({ worldState: nextWorldState });
  }

  let content;
  if (activeTab === "character") {
    if (characterSection === "character") {
      content = (
        <CharacterDetailsView
          character={activeCharacter}
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          level={level}
          onUnequip={handleUnequipItem}
        />
      );
    } else if (characterSection === "skills") {
      content = <CharacterSkillsView character={activeCharacter} />;
    } else if (characterSection === "stats") {
      content = <CharacterStatsView character={activeCharacter} onStatChange={handleStatChange} />;
    } else if (characterSection === "inventory") {
      content = <InventoryView character={activeCharacter} onEquip={handleEquipItem} />;
    } else {
      content = <PlaceholderView type={characterSection} />;
    }
  } else if (activeTab === "location") {
    const isStartCity = location.nodeId === "start-city";
    const isMeadows = ["field", "meadows"].includes(location.nodeId);
    const isForest = location.nodeId === "forest";
    const isRuins = location.nodeId === "ruins";
    const isSettlement = location.nodeId === "settlement";
    const isDungeon = location.nodeId === "dungeon";
    const dedicatedLocation = getDedicatedLocation(location.nodeId);

    let locationContent;
    if (isStartCity) {
      locationContent = <StartCityLocationView onStartTraining={handleStartTraining} />;
    } else if (isMeadows) {
      locationContent = (
        <MeadowLocationView worldState={worldState} onOpenChest={handleOpenChest} />
      );
    } else if (isForest) {
      locationContent = <ForestLocationView />;
    } else if (isRuins) {
      locationContent = <RuinsLocationView />;
    } else if (isSettlement) {
      locationContent = <SettlementLocationView />;
    } else if (isDungeon) {
      locationContent = <DungeonLocationView />;
    } else if (dedicatedLocation) {
      locationContent = <DedicatedLocationView location={location} />;
    } else {
      locationContent = (
        <LocationMapView
          location={location}
          worldState={worldState}
          onOpenChest={handleOpenChest}
        />
      );
    }

    content = <Suspense fallback={<LocationFallback />}>{locationContent}</Suspense>;
  } else if (activeTab === "battle") {
    content = (
      <BattleView
        encounter={activeEncounter}
        trainingMode={trainingMode}
        currentStamina={currentStamina}
        maxStamina={maxStamina}
        onSkillActivate={trainingMode ? () => ({ activated: true }) : handleSkillActivate}
        onBasicAction={trainingMode ? undefined : handleBasicAction}
        onFinish={trainingMode ? undefined : handleFinishBattle}
        onFlee={activeEncounter ? handleFleeBattle : undefined}
        onExitTraining={trainingMode ? handleEndTraining : undefined}
        findSkill={combatProfile.findSkill}
        currentMastery={
          combatProfile.masteryKey ? (skillMastery[combatProfile.masteryKey] ?? 0) : 0
        }
        weaponLabel={combatProfile.label}
      />
    );
  } else if (activeTab === "inventory") {
    content = <InventoryView character={activeCharacter} onEquip={handleEquipItem} />;
  } else if (activeTab === "tasks") {
    content = <PlaceholderView type={activeTab} />;
  } else {
    content = (
      <WorldMapView
        location={location}
        onTravel={handleTravel}
        onEncounter={handleEncounter}
        onRest={handleRest}
      />
    );
  }

  const topTab = ["map", "location", "battle", "character"].includes(activeTab) ? activeTab : "map";
  const profileMode = activeTab === "character";
  const battleLocked = Boolean(activeEncounter);

  return (
    <main className="screen screen--game">
      <section className={`game-shell ${profileMode ? "game-shell--character-reference" : ""}`}>
        <PlayerHud
          nickname={character.nickname}
          level={level}
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          currentStamina={currentStamina}
          maxStamina={maxStamina}
          progression={progression}
          mode={profileMode ? "character" : "default"}
        />

        <GameTabs activeTab={topTab} onChange={handleTabChange} locked={battleLocked} />

        <div
          className={`game-content fantasy-panel ${
            profileMode ? "game-content--character-reference" : ""
          }`}
        >
          {content}
        </div>

        <BottomNav
          active={profileMode ? characterSection : activeTab}
          onChange={profileMode ? setCharacterSection : handleTabChange}
          onHome={handleHome}
          variant={profileMode ? "character" : "main"}
          locked={battleLocked}
        />
      </section>
    </main>
  );
}

