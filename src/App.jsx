import { useMemo, useState } from "react";
import "./reference-theme.css";
import "./exact-reference.css";
import { fantasyBackground } from "./data/assets.js";
import CharacterCreationScreen from "./screens/CharacterCreationScreen.jsx";
import CharacterScreen from "./screens/CharacterScreen.jsx";
import WelcomeScreen from "./screens/WelcomeScreen.jsx";
import { loadCharacter, saveCharacter } from "./utils/storage.js";

export default function App() {
  const initialCharacter = useMemo(() => loadCharacter(), []);
  const [screen, setScreen] = useState("welcome");
  const [character, setCharacter] = useState(initialCharacter);
  const [message, setMessage] = useState("");

  function handleContinue() {
    const saved = loadCharacter();
    if (!saved) {
      setMessage("Сохранение не найдено. Создай нового персонажа.");
      return;
    }
    setCharacter(saved);
    setMessage("");
    setScreen("character");
  }

  function handleCreate(characterToSave) {
    saveCharacter(characterToSave);
    setCharacter(characterToSave);
    setMessage("");
    setScreen("character");
  }

  let content;
  if (screen === "create") {
    content = (
      <CharacterCreationScreen onBack={() => setScreen("welcome")} onCreate={handleCreate} />
    );
  } else if (screen === "character" && character) {
    content = <CharacterScreen character={character} onBack={() => setScreen("welcome")} />;
  } else {
    content = (
      <WelcomeScreen
        hasSave={Boolean(character)}
        message={message}
        onContinue={handleContinue}
        onCreate={() => {
          setMessage("");
          setScreen("create");
        }}
      />
    );
  }

  return <div style={{ "--fantasy-bg": `url("${fantasyBackground}")` }}>{content}</div>;
}
