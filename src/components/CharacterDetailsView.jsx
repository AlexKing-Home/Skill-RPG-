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

const stats = [
  { id: "level", label: "Уровень героя", icon: "♛" },
  { id: "health", label: "Жизни", icon: "♥" },
  { id: "defense", label: "Защита", icon: "⬡" },
  { id: "attack", label: "Сила атаки", icon: "⚔" },
];

export default function CharacterDetailsView({ character, currentHealth, maxHealth, level }) {
  const [slotMessage, setSlotMessage] = useState("");
  const equipment = { ...createEmptyEquipment(), ...(character.equipment ?? {}) };

  function handleSlotClick(slot, item) {
    setSlotMessage(
      item?.name
        ? `Выбран предмет «${item.name}» в слоте «${slot.label}».`
        : `Слот «${slot.label}» пуст. Здесь будет открываться выбор предмета из инвентаря.`,
    );
  }

  function statValue(id) {
    if (id === "level") return level;
    if (id === "health") return `${currentHealth} / ${maxHealth}`;
    if (id === "defense") return character.stats.defense;
    return character.stats.attack;
  }

  return (
    <section
      className="character-details character-details--reference"
      aria-label={`Персонаж ${character.nickname}`}
    >
      <div className="character-profile character-profile--reference">
        <div className="character-summary__portrait-frame">
          <img
            className="character-summary__portrait"
            src={character.skinImage}
            alt={character.skinName}
          />
          <span className="character-summary__gem" aria-hidden="true">
            ✦
          </span>
        </div>

        <div className="character-profile__main">
          <div className="character-summary__copy">
            <div className="character-class-heading">
              <img src={uiCrest} alt="" aria-hidden="true" />
              <span className="game-view__eyebrow">{character.skinName}</span>
            </div>
            <h1>{character.nickname}</h1>
          </div>

          <div className="character-stat-grid">
            {stats.map((stat) => (
              <div key={stat.id} className={`character-stat character-stat--${stat.id}`}>
                <span className="character-stat__icon" aria-hidden="true">
                  {stat.icon}
                </span>
                <span>{stat.label}</span>
                <strong>{statValue(stat.id)}</strong>
              </div>
            ))}
          </div>
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
