import { useMemo, useState } from "react";
import SkinCard from "../components/SkinCard.jsx";
import { createCharacter, getSkinsByGender } from "../data/skins.js";

export default function CharacterCreationScreen({ onBack, onCreate }) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("male");
  const [selectedSkinId, setSelectedSkinId] = useState("male-swordsman");
  const [error, setError] = useState("");

  const visibleSkins = useMemo(() => getSkinsByGender(gender), [gender]);
  const selectedSkin = visibleSkins.find((skin) => skin.id === selectedSkinId) ?? visibleSkins[0];
  const accent = gender === "male" ? "#4dccff" : "#ec78a2";

  function chooseGender(nextGender) {
    setGender(nextGender);
    setSelectedSkinId(`${nextGender}-swordsman`);
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    const cleanNickname = nickname.trim();
    if (cleanNickname.length < 2 || cleanNickname.length > 20) {
      setError("Никнейм должен содержать от 2 до 20 символов.");
      return;
    }
    onCreate(createCharacter(cleanNickname, selectedSkin));
  }

  return (
    <main className="screen screen--creation">
      <form className="creation-panel fantasy-panel" onSubmit={submit}>
        <h1 className="section-title">Создание персонажа</h1>

        <label className="field-label" htmlFor="nickname">Никнейм</label>
        <input
          id="nickname"
          className="nickname-input"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={20}
          autoComplete="off"
          placeholder="Введите никнейм..."
        />

        <span className="field-label">Пол</span>
        <div className="gender-grid">
          <button
            type="button"
            className={`gender-button gender-button--male ${gender === "male" ? "is-active" : ""}`}
            onClick={() => chooseGender("male")}
          >
            <span>♂</span> Мужской
          </button>
          <button
            type="button"
            className={`gender-button gender-button--female ${gender === "female" ? "is-active" : ""}`}
            onClick={() => chooseGender("female")}
          >
            <span>♀</span> Женский
          </button>
        </div>

        <h2 className="classes-title">Выберите класс / внешность</h2>
        <div className="skins-grid">
          {visibleSkins.map((skin) => (
            <SkinCard
              key={skin.id}
              skin={skin}
              selected={selectedSkin.id === skin.id}
              accent={accent}
              onSelect={() => {
                setSelectedSkinId(skin.id);
                setError("");
              }}
            />
          ))}
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="creation-actions">
          <button type="button" className="secondary-button" onClick={onBack}>← Назад</button>
          <button type="submit" className="primary-button">Создать персонажа</button>
        </div>
      </form>
    </main>
  );
}
