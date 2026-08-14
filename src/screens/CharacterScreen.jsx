import "../game-interface.css";
import { useState } from "react";
import CharacterDetailsView from "../components/CharacterDetailsView.jsx";
import GameTabs from "../components/GameTabs.jsx";
import LocationMapView from "../components/LocationMapView.jsx";
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
  if (activeTab === "location") {
    content = <LocationMapView location={location} />;
  } else if (activeTab === "character") {
    content = (
      <CharacterDetailsView character={character} currentHealth={currentHealth} level={level} />
    );
  } else {
    content = <WorldMapView location={location} />;
  }

  return (
    <main className="screen screen--game">
      <section className="game-shell">
        <PlayerHud
          nickname={character.nickname}
          level={level}
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          experience={experience}
        />

        <GameTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="game-content fantasy-panel">{content}</div>

        <button className="secondary-button game-back-button" type="button" onClick={onBack}>
          В главное меню
        </button>
      </section>
    </main>
  );
}
