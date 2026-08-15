import "../game-interface.css";
import { useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import CharacterDetailsView from "../components/CharacterDetailsView.jsx";
import GameTabs from "../components/GameTabs.jsx";
import LocationMapView from "../components/LocationMapView.jsx";
import PlaceholderView from "../components/PlaceholderView.jsx";
import PlayerHud from "../components/PlayerHud.jsx";
import WorldMapView from "../components/WorldMapView.jsx";
import { getExperienceProgress } from "../data/progression.js";
import { START_NODE_ID, locationFromNode } from "../data/worldNavigation.js";
import { saveCharacter } from "../utils/storage.js";

const defaultLocation = locationFromNode(START_NODE_ID);

export default function CharacterScreen({ character, onBack }) {
  const [activeTab, setActiveTab] = useState("map");
  const [location, setLocation] = useState(() =>
    character.location?.nodeId ? locationFromNode(character.location.nodeId) : defaultLocation,
  );
  const [worldState, setWorldState] = useState(() => character.worldState ?? {});
  const experience = getExperienceProgress(character.experience ?? 0);
  const level = experience.level;
  const maxHealth = character.stats.health;
  const currentHealth = Math.min(maxHealth, Math.max(0, character.currentHealth ?? maxHealth));

  function persist(nextLocation = location, nextWorldState = worldState) {
    saveCharacter({
      ...character,
      location: nextLocation,
      worldState: nextWorldState,
    });
  }

  function handleTravel(nodeId) {
    const nextLocation = locationFromNode(nodeId);
    setLocation(nextLocation);
    persist(nextLocation, worldState);
  }

  function handleOpenChest(chestId) {
    const openedChests = worldState.openedChests ?? [];
    if (openedChests.includes(chestId)) return;

    const nextWorldState = {
      ...worldState,
      openedChests: [...openedChests, chestId],
    };
    setWorldState(nextWorldState);
    persist(location, nextWorldState);
  }

  let content;
  if (activeTab === "character") {
    content = (
      <CharacterDetailsView
        character={character}
        currentHealth={currentHealth}
        level={level}
        experience={experience}
      />
    );
  } else if (activeTab === "location") {
    content = (
      <LocationMapView location={location} worldState={worldState} onOpenChest={handleOpenChest} />
    );
  } else if (activeTab === "tasks" || activeTab === "inventory") {
    content = <PlaceholderView type={activeTab} />;
  } else {
    content = <WorldMapView location={location} onTravel={handleTravel} />;
  }

  const topTab = ["map", "location", "character"].includes(activeTab) ? activeTab : "map";
  const profileMode = activeTab === "character";

  return (
    <main className="screen screen--game">
      <section className={`game-shell ${profileMode ? "game-shell--character-reference" : ""}`}>
        <PlayerHud
          nickname={character.nickname}
          level={level}
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          experience={experience}
          mode={profileMode ? "character" : "default"}
        />

        <GameTabs activeTab={topTab} onChange={setActiveTab} />

        <div
          className={`game-content fantasy-panel ${
            profileMode ? "game-content--character-reference" : ""
          }`}
        >
          {content}
        </div>

        <BottomNav
          active={activeTab}
          onChange={setActiveTab}
          onHome={onBack}
          variant={profileMode ? "character" : "main"}
        />
      </section>
    </main>
  );
}
