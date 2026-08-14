import { EQUIPMENT_SLOTS, createEmptyEquipment } from "../data/equipment.js";

export default function CharacterDetailsView({ character, currentHealth, level }) {
  const equipment = { ...createEmptyEquipment(), ...(character.equipment ?? {}) };

  return (
    <section className="game-view character-details" aria-labelledby="character-title">
      <div className="character-summary">
        <img
          className="character-summary__portrait"
          src={character.skinImage}
          alt={character.skinName}
        />
        <div>
          <span className="game-view__eyebrow">{character.skinName}</span>
          <h1 id="character-title">{character.nickname}</h1>
        </div>
      </div>

      <div className="character-stat-grid">
        <div>
          <span>Уровень героя</span>
          <strong>{level}</strong>
        </div>
        <div>
          <span>Жизни</span>
          <strong>
            {currentHealth} / {character.stats.health}
          </strong>
        </div>
        <div>
          <span>Защита</span>
          <strong>{character.stats.defense}</strong>
        </div>
        <div>
          <span>Сила атаки</span>
          <strong>{character.stats.attack}</strong>
        </div>
      </div>

      <div className="equipment-section">
        <h2>Экипировка</h2>
        <div className="equipment-grid">
          {EQUIPMENT_SLOTS.map((slot) => {
            const item = equipment[slot.id];
            return (
              <div key={slot.id} className={`equipment-slot equipment-slot--${slot.id}`}>
                <span className="equipment-slot__label">{slot.label}</span>
                <strong className="equipment-slot__item">{item?.name ?? "Пусто"}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
