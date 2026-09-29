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
  { id: "level", label: "Уровень героя" },
  { id: "health", label: "Жизни" },
  { id: "defense", label: "Защита" },
  { id: "attack", label: "Сила атаки" },
];

function CharacterStatIcon({ type }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "level") {
    return (
      <svg {...commonProps}>
        <path d="M12 18V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </svg>
    );
  }

  if (type === "health") {
    return (
      <svg {...commonProps}>
        <path d="M20.8 5.8a5.3 5.3 0 0 0-7.5 0L12 7.1l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 22l8.8-8.7a5.3 5.3 0 0 0 0-7.5Z" />
      </svg>
    );
  }

  if (type === "defense") {
    return (
      <svg {...commonProps}>
        <path d="M12 3 19 6v5c0 4.6-2.7 8.2-7 10-4.3-1.8-7-5.4-7-10V6l7-3Z" />
        <path d="M9 12.2 11.2 14 15.5 9.5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m14.5 4.5 5-1-1 5-9 9-3 1 1-3 9-9Z" />
      <path d="m6.5 17.5-2 2" />
      <path d="m13 7 4 4" />
    </svg>
  );
}

export default function CharacterDetailsView({
  character,
  currentHealth,
  maxHealth,
  level,
  onUnequip,
}) {
  const [slotMessage, setSlotMessage] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const equipment = { ...createEmptyEquipment(), ...(character.equipment ?? {}) };

  function handleSlotClick(slot, item) {
    setSelectedSlotId(slot.id);
    setSlotMessage(
      item?.name
        ? `Выбран предмет «${item.name}» в слоте «${slot.label}».`
        : `Слот «${slot.label}» пуст. Здесь будет открываться выбор предмета из инвентаря.`,
    );
  }

  const selectedSlot = EQUIPMENT_SLOTS.find(({ id }) => id === selectedSlotId);
  const selectedItem = selectedSlot ? equipment[selectedSlot.id] : null;

  function handleUnequip() {
    if (!selectedSlot || !selectedItem || !onUnequip) return;
    const itemName = selectedItem.name;
    if (onUnequip(selectedSlot.id)) {
      setSlotMessage(`«${itemName}» снят и перемещён в инвентарь.`);
    }
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
                  <CharacterStatIcon type={stat.id} />
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

        {selectedItem && onUnequip ? (
          <div className="equipment-actions">
            <button type="button" className="equipment-action-button" onClick={handleUnequip}>
              Снять
            </button>
          </div>
        ) : null}

        {slotMessage ? (
          <p className="equipment-message" role="status">
            {slotMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
