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

const defaultLocation = {
  worldName: "Текущая местность",
  areaName: "Текущая локация",
  x: 50,
  y: 50,
};

export default function CharacterScreen({ character, onBack }) {
  const [activeTab, setActiveTab] = useState("map");
  const experience = getExperienceProgress(character.experience ?? 0);
  const level = experience.level;
  const maxHealth = character.stats.health;
  const currentHealth = Math.min(maxHealth, Math.max(0, character.currentHealth ?? maxHealth));
  const location = { ...defaultLocation, ...(character.location ?? {}) };

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
    content = <LocationMapView location={location} />;
  } else if (activeTab === "tasks" || activeTab === "inventory") {
    content = <PlaceholderView type={activeTab} />;
  } else {
    content = <WorldMapView location={location} />;
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

        {activeTab !== "location" ? (
          <BottomNav
            active={activeTab}
            onChange={setActiveTab}
            onHome={onBack}
            variant={profileMode ? "character" : "main"}
          />
        ) : null}
      </section>
    </main>
  );
}
