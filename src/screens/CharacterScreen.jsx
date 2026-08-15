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

  if (activeTab === "character") {
    return (
      <main className="screen screen--game screen--profile">
        <section className="game-shell game-shell--profile">
          <CharacterDetailsView
            character={character}
            currentHealth={currentHealth}
            level={level}
            experience={experience}
            onBack={() => setActiveTab("map")}
          />
        </section>
      </main>
    );
  }

  let content;
  if (activeTab === "location") {
    content = <LocationMapView location={location} />;
  } else if (activeTab === "tasks" || activeTab === "inventory") {
    content = <PlaceholderView type={activeTab} />;
  } else {
    content = <WorldMapView location={location} />;
  }

  const topTab = activeTab === "location" ? "location" : "map";

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

        <GameTabs activeTab={topTab} onChange={setActiveTab} />

        <div className="game-content fantasy-panel">{content}</div>

        {activeTab !== "location" ? (
          <BottomNav active={activeTab} onChange={setActiveTab} onHome={onBack} />
        ) : null}
      </section>
    </main>
  );
}
