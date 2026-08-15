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

export default function CharacterDetailsView({ character, currentHealth, level }) {
  const [slotMessage, setSlotMessage] = useState("");
  const equipment = { ...createEmptyEquipment(), ...(character.equipment ?? {}) };

  function handleSlotClick(slot, item) {
    setSlotMessage(
      item?.name
        ? `Выбран предмет «${item.name}» в слоте «${slot.label}».`
        : `Слот «${slot.label}» пуст. Здесь будет открываться выбор предмета из инвентаря.`,
    );
  }

  return (
    <section className="game-view character-details" aria-labelledby="character-title">
      <div className="character-profile">
        <div className="character-summary__portrait-frame">
          <img
            className="character-summary__portrait"
            src={character.skinImage}
            alt={character.skinName}
          />
          <span className="character-summary__gem" aria-hidden="true">
            ◆
          </span>
        </div>

        <div className="character-profile__main">
          <div className="character-summary__copy">
            <div className="character-class-heading">
              <img src={uiCrest} alt="" aria-hidden="true" />
              <span className="game-view__eyebrow">{character.skinName}</span>
            </div>
            <h1 id="character-title">{character.nickname}</h1>
          </div>

          <div className="character-stat-grid">
            <div className="character-stat character-stat--level">
              <span className="character-stat__icon" aria-hidden="true">
                ♛
              </span>
              <span>Уровень героя</span>
              <strong>{level}</strong>
            </div>
            <div className="character-stat character-stat--health">
              <span className="character-stat__icon" aria-hidden="true">
                ♥
              </span>
              <span>Жизни</span>
              <strong>
                {currentHealth} / {character.stats.health}
              </strong>
            </div>
            <div className="character-stat character-stat--defense">
              <span className="character-stat__icon" aria-hidden="true">
                ◆
              </span>
              <span>Защита</span>
              <strong>{character.stats.defense}</strong>
            </div>
            <div className="character-stat character-stat--attack">
              <span className="character-stat__icon" aria-hidden="true">
                ⚔
              </span>
              <span>Сила атаки</span>
              <strong>{character.stats.attack}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="equipment-section">
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
