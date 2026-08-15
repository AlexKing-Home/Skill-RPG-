import { useMemo, useState } from "react";
import SkinCard from "../components/SkinCard.jsx";
import { creationCrest } from "../data/assets.js";
import { createCharacter, getSkinsByGender } from "../data/skins.js";

export default function CharacterCreationScreen({ onBack, onCreate }) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("male");
  const [selectedSkinId, setSelectedSkinId] = useState("male-swordsman");
  const [error, setError] = useState("");

  const visibleSkins = useMemo(() => getSkinsByGender(gender), [gender]);
  const selectedSkin = visibleSkins.find((skin) => skin.id === selectedSkinId) ?? visibleSkins[0];
  const accent = gender === "male" ? "#52c7ff" : "#ef6aa4";

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
      <form
        className={`creation-panel fantasy-panel ornate-panel creation-panel--${gender}`}
        style={{ "--gender-accent": accent }}
        onSubmit={submit}
      >
        <header className="creation-header creation-header--reference">
          <button className="round-back-button" type="button" onClick={onBack} aria-label="Назад">
            ←
          </button>
          <img className="creation-emblem-image" src={creationCrest} alt="" aria-hidden="true" />
          <h1 className="section-title">Создание персонажа</h1>
        </header>

        <section className="creation-section">
          <label className="field-label" htmlFor="nickname">
            Никнейм
          </label>
          <div className="input-shell">
            <input
              id="nickname"
              className="nickname-input"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={20}
              autoComplete="off"
              placeholder="Введите никнейм..."
            />
            <span aria-hidden="true">◇</span>
          </div>
        </section>

        <section className="creation-section">
          <span className="field-label">Пол</span>
          <div className="gender-grid">
            <button
              type="button"
              className={`gender-button gender-button--male ${gender === "male" ? "is-active" : ""}`}
              onClick={() => chooseGender("male")}
              aria-pressed={gender === "male"}
            >
              <span className="gender-button__symbol">♂</span>
              <strong>Мужской</strong>
            </button>
            <button
              type="button"
              className={`gender-button gender-button--female ${gender === "female" ? "is-active" : ""}`}
              onClick={() => chooseGender("female")}
              aria-pressed={gender === "female"}
            >
              <span className="gender-button__symbol">♀</span>
              <strong>Женский</strong>
            </button>
          </div>
        </section>

        <section className="creation-section creation-section--classes">
          <div className="ornate-heading">
            <span aria-hidden="true">◆</span>
            <h2 className="classes-title">Выберите класс / внешность</h2>
            <span aria-hidden="true">◆</span>
          </div>
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
        </section>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="creation-actions">
          <button type="submit" className="primary-button primary-button--hero">
            <span aria-hidden="true">✦</span>
            Создать персонажа
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            ← Назад
          </button>
        </div>
      </form>
    </main>
  );
}
