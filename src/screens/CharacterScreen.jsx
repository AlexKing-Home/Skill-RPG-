import { lazy, Suspense, useEffect, useState } from "react";
import BattleView from "../components/BattleView.jsx";
import BottomNav from "../components/BottomNav.jsx";
import CharacterDetailsView from "../components/CharacterDetailsView.jsx";
import CharacterSkillsView from "../components/CharacterSkillsView.jsx";
import CharacterStatsView from "../components/CharacterStatsView.jsx";
import GameTabs from "../components/GameTabs.jsx";
import PlaceholderView from "../components/PlaceholderView.jsx";
import PlayerHud from "../components/PlayerHud.jsx";
import WorldMapView from "../components/WorldMapView.jsx";
import { getMaxHealth, getWillBonuses } from "../data/characteristics.js";
import { getDedicatedLocation } from "../data/locationRegistry.js";
import { getExperienceProgress } from "../data/progression.js";
import { getMaxStamina, normalizeCurrentStamina } from "../data/stamina.js";
import { FLOOR_MAP_VERSION, START_NODE_ID, locationFromNode } from "../data/worldNavigation.js";
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
  const [activeTab, setActiveTab] = useState("map");
  const [activeEncounter, setActiveEncounter] = useState(null);
  const [characterSection, setCharacterSection] = useState("character");
  const [stats, setStats] = useState(() => ({ ...character.stats }));
  const [characteristicPoints, setCharacteristicPoints] = useState(() =>
    Math.max(0, Math.floor(Number(character.characteristicPoints) || 0)),
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
  const experience = getExperienceProgress(character.experience ?? 0);
  const level = experience.level;
  const maxHealth = getMaxHealth(stats);
  const willBonuses = getWillBonuses(stats);
  const maxStamina = getMaxStamina(stats);
  const [currentHealth, setCurrentHealth] = useState(() =>
    Math.min(maxHealth, Math.max(0, character.currentHealth ?? maxHealth)),
  );
  const [currentStamina, setCurrentStamina] = useState(() =>
    normalizeCurrentStamina(character.currentStamina, maxStamina),
  );
  const activeCharacter = {
    ...character,
    characteristicPoints,
    maxStamina,
    currentStamina,
    stats,
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
      setCurrentHealth((health) => {
        const nextHealth = Math.min(maxHealth, health + willBonuses.regenerationPerTick);
        if (nextHealth !== health) {
          saveCharacter({
            ...character,
            characteristicPoints,
            stats,
            maxStamina,
            currentStamina,
            currentHealth: nextHealth,
            location,
            worldState,
          });
        }
        return nextHealth;
      });
    }, willBonuses.regenerationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [
    character,
    characteristicPoints,
    currentStamina,
    location,
    maxHealth,
    maxStamina,
    stats,
    willBonuses.regenerationIntervalMs,
    willBonuses.regenerationPerTick,
    worldState,
  ]);

  function persist(nextLocation = location, nextWorldState = worldState) {
    saveCharacter({
      ...character,
      characteristicPoints,
      stats,
      maxStamina,
      currentStamina,
      currentHealth,
      location: nextLocation,
      worldState: nextWorldState,
    });
  }

  function handleStatChange(key, delta) {
    const currentValue = Math.max(0, Math.floor(Number(stats[key]) || 0));
    if (delta > 0 && characteristicPoints <= 0) return;
    if (delta < 0 && currentValue <= 0) return;

    const nextValue = Math.max(0, currentValue + delta);
    if (nextValue === currentValue) return;

    const nextStats = { ...stats, [key]: nextValue };
    const nextCharacteristicPoints = Math.max(0, characteristicPoints - delta);
    const nextMaxHealth = getMaxHealth(nextStats);
    const nextCurrentHealth = Math.min(nextMaxHealth, currentHealth);
    const nextMaxStamina = getMaxStamina(nextStats);
    const nextCurrentStamina = normalizeCurrentStamina(currentStamina, nextMaxStamina);

    setStats(nextStats);
    setCharacteristicPoints(nextCharacteristicPoints);
    if (nextCurrentHealth !== currentHealth) setCurrentHealth(nextCurrentHealth);
    if (nextCurrentStamina !== currentStamina) setCurrentStamina(nextCurrentStamina);

    saveCharacter({
      ...character,
      characteristicPoints: nextCharacteristicPoints,
      stats: nextStats,
      maxStamina: nextMaxStamina,
      currentStamina: nextCurrentStamina,
      currentHealth: nextCurrentHealth,
      location,
      worldState,
    });
  }

  function handleTabChange(nextTab) {
    setActiveTab(nextTab);
    if (nextTab === "character") setCharacterSection("character");
  }

  function handleTravel(nodeId) {
    const nextLocation = locationFromNode(nodeId);
    const nextWorldState = {
      ...worldState,
      floorMapVersion: FLOOR_MAP_VERSION,
    };
    setActiveEncounter(null);
    setLocation(nextLocation);
    setWorldState(nextWorldState);
    persist(nextLocation, nextWorldState);
  }

  function handleEncounter(encounter) {
    setActiveEncounter(encounter);
    setActiveTab("battle");
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
    persist(location, nextWorldState);
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
          experience={experience}
        />
      );
    } else if (characterSection === "skills") {
      content = <CharacterSkillsView character={activeCharacter} />;
    } else if (characterSection === "stats") {
      content = <CharacterStatsView character={activeCharacter} onStatChange={handleStatChange} />;
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
      locationContent = <StartCityLocationView />;
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
    content = activeEncounter ? (
      <BattleView encounter={activeEncounter} />
    ) : (
      <PlaceholderView type="battle" />
    );
  } else if (["tasks", "inventory"].includes(activeTab)) {
    content = <PlaceholderView type={activeTab} />;
  } else {
    content = (
      <WorldMapView location={location} onTravel={handleTravel} onEncounter={handleEncounter} />
    );
  }

  const topTab = ["map", "location", "battle", "character"].includes(activeTab) ? activeTab : "map";
  const profileMode = activeTab === "character";

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
          experience={experience}
          mode={profileMode ? "character" : "default"}
        />

        <GameTabs activeTab={topTab} onChange={handleTabChange} />

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
          onHome={onBack}
          variant={profileMode ? "character" : "main"}
        />
      </section>
    </main>
  );
}
