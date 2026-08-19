import { getWillBonuses } from "../data/characteristics.js";
import { BASE_STAMINA, getMaxStamina } from "../data/stamina.js";

const STAT_ROWS = [
  { key: "strength", label: "Сила", icon: "⚔" },
  { key: "agility", label: "Ловкость", icon: "✦" },
  { key: "stealth", label: "Скрытность", icon: "◈" },
  { key: "scouting", label: "Разведка", icon: "⌖" },
  { key: "lockpicking", label: "Взлом", icon: "◇" },
  { key: "endurance", label: "Выносливость", icon: "◆" },
  { key: "will", label: "Воля", icon: "♥" },
];

export default function CharacterStatsView({ character, onStatChange }) {
  const stats = character.stats ?? {};
  const availablePoints = Math.max(0, Math.floor(Number(character.characteristicPoints) || 0));
  const willBonuses = getWillBonuses(stats);
  const maxStamina = getMaxStamina(stats);

  return (
    <section className="game-view character-stats-view">
      <span className="game-view__eyebrow">Параметры героя</span>
      <div className="character-stats-heading">
        <h1>Характеристики</h1>
        <div className="character-points-bank" aria-label={`Свободных очков: ${availablePoints}`}>
          <span>Свободные очки</span>
          <strong>{availablePoints}</strong>
        </div>
      </div>

      <div className="character-stats-list" role="list">
        {STAT_ROWS.map((stat) => {
          const value = Math.max(0, Number(stats[stat.key]) || 0);
          const hasEffect = stat.key === "endurance" || stat.key === "will";

          return (
            <article
              className={`character-stat-row ${hasEffect ? "character-stat-row--with-effect" : ""} ${stat.key === "will" ? "character-stat-row--will" : ""}`}
              key={stat.key}
              role="listitem"
            >
              <span className="character-stat-row__icon" aria-hidden="true">
                {stat.icon}
              </span>
              <span className="character-stat-row__label">{stat.label}</span>
              <strong className="character-stat-row__value">{value}</strong>
              <div className="character-stat-row__controls">
                <button
                  type="button"
                  className="character-stat-button character-stat-button--minus"
                  onClick={() => onStatChange(stat.key, -1)}
                  disabled={value <= 0}
                  aria-label={`Уменьшить ${stat.label.toLowerCase()}`}
                >
                  −
                </button>
                <button
                  type="button"
                  className="character-stat-button character-stat-button--plus"
                  onClick={() => onStatChange(stat.key, 1)}
                  disabled={availablePoints <= 0}
                  aria-label={`Увеличить ${stat.label.toLowerCase()}`}
                >
                  +
                </button>
              </div>
              {stat.key === "endurance" ? (
                <span className="character-stat-row__effect">
                  1 очко = +1 выносливости. Сейчас: {maxStamina} максимум (база {BASE_STAMINA}).
                </span>
              ) : null}
              {stat.key === "will" ? (
                <span className="character-stat-row__effect">
                  1 очко = +100 HP и +10 HP раз в 10 сек.
                  {willBonuses.will > 0
                    ? ` Сейчас: +${willBonuses.maxHealthBonus} HP, +${willBonuses.regenerationPerTick} HP / 10 сек.`
                    : ""}
                </span>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
