import { useState } from "react";
import { uiCrest } from "../data/assets.js";
import { EQUIPMENT_SLOTS, createEmptyEquipment } from "../data/equipment.js";

const slotIcons = {
  helmet: "♜",
  chest: "◈",
  cloak: "⌁",
  gloves: "✦",
  pants: "⋈",
  boots: "⌙",
  ring: "○",
  weapon1: "⚔",
  weapon2: "⚔",
};

export default function CharacterDetailsView({
  character,
  currentHealth,
  level,
  experience,
  onBack,
}) {
  const [slotMessage, setSlotMessage] = useState("");
  const equipment = { ...createEmptyEquipment(), ...(character.equipment ?? {}) };
  const expLabel =
    experience.end === null ? `${experience.total}` : `${experience.total} / ${experience.end}`;
  const hpPercent = character.stats.health > 0 ? (currentHealth / character.stats.health) * 100 : 0;

  function handleSlotClick(slot, item) {
    setSlotMessage(
      item?.name
        ? `Выбран предмет «${item.name}» в слоте «${slot.label}».`
        : `Слот «${slot.label}» пуст. Здесь будет открываться выбор предмета из инвентаря.`,
    );
  }

  return (
    <section className="character-page" aria-labelledby="character-title">
      <header className="character-page__header">
        <button className="profile-back" type="button" onClick={onBack} aria-label="Назад к карте">
          ←
        </button>
        <img className="character-page__crest" src={uiCrest} alt="" aria-hidden="true" />
        <div className="character-page__identity">
          <h1 id="character-title">{character.nickname}</h1>
          <span>
            <b aria-hidden="true">⚔</b> {character.skinName}
          </span>
        </div>
        <div className="level-shield" aria-label={`Уровень ${level}`}>
          <span>Уровень</span>
          <strong>{level}</strong>
        </div>
      </header>

      <div className="profile-resources">
        <div className="profile-resource profile-resource--hp">
          <div>
            <span>♥ Здоровье</span>
            <strong>
              {currentHealth}/{character.stats.health}
            </strong>
          </div>
          <div className="profile-resource__track">
            <i style={{ width: `${hpPercent}%` }} />
          </div>
        </div>
        <div className="profile-resource profile-resource--exp">
          <div>
            <span>XP Опыт</span>
            <strong>{expLabel}</strong>
          </div>
          <div className="profile-resource__track">
            <i style={{ width: `${experience.percent}%` }} />
          </div>
        </div>
      </div>

      <div className="profile-portrait-frame">
        <img className="profile-portrait" src={character.skinImage} alt={character.skinName} />
        <span className="profile-portrait__gem" aria-hidden="true">
          ✦
        </span>
      </div>

      <div className="profile-stat-grid">
        <div className="profile-stat profile-stat--level">
          <span className="profile-stat__icon">♛</span>
          <span>Уровень</span>
          <strong>{level}</strong>
        </div>
        <div className="profile-stat profile-stat--health">
          <span className="profile-stat__icon">♥</span>
          <span>Здоровье</span>
          <strong>{character.stats.health}</strong>
        </div>
        <div className="profile-stat profile-stat--attack">
          <span className="profile-stat__icon">⚔</span>
          <span>Атака</span>
          <strong>{character.stats.attack}</strong>
        </div>
        <div className="profile-stat profile-stat--defense">
          <span className="profile-stat__icon">⬡</span>
          <span>Защита</span>
          <strong>{character.stats.defense}</strong>
        </div>
      </div>

      <div className="equipment-section profile-equipment">
        <div className="ornate-heading ornate-heading--equipment">
          <span aria-hidden="true">◆</span>
          <h2>Экипировка</h2>
          <span aria-hidden="true">◆</span>
        </div>
        <div className="equipment-grid">
          {EQUIPMENT_SLOTS.map((slot) => {
            const item = equipment[slot.id];
            return (
              <button
                key={slot.id}
                type="button"
                className={`equipment-slot equipment-slot--${slot.id}`}
                onClick={() => handleSlotClick(slot, item)}
                aria-label={`${slot.label}: ${item?.name ?? "пусто"}`}
              >
                <span className="equipment-slot__icon" aria-hidden="true">
                  {slotIcons[slot.id] ?? "◇"}
                </span>
                <span className="equipment-slot__label">{slot.label}</span>
                <strong className="equipment-slot__item">{item?.name ?? "Пусто"}</strong>
              </button>
            );
          })}
        </div>
        {slotMessage ? (
          <p className="equipment-message" role="status">
            {slotMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
