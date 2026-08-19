import { getWillBonuses } from "../data/characteristics.js";

const STAT_ROWS = [
  { key: "strength", label: "Сила", icon: "⚔" },
  { key: "agility", label: "Ловкость", icon: "✦" },
  { key: "stealth", label: "Скрытность", icon: "◈" },
  { key: "scouting", label: "Разведка", icon: "⌖" },
  { key: "lockpicking", label: "Взлом", icon: "◇" },
  { key: "endurance", label: "Выносливость", icon: "◆" },
  { key: "will", label: "Воля", icon: "♥" },
];

export default function CharacterStatsView({ character }) {
  const stats = character.stats ?? {};
  const willBonuses = getWillBonuses(stats);

  return (
    <section className="game-view character-stats-view">
      <span className="game-view__eyebrow">Параметры героя</span>
      <h1>Характеристики</h1>

      <div className="character-stats-list" role="list">
        {STAT_ROWS.map((stat) => (
          <article
            className={`character-stat-row ${stat.key === "will" ? "character-stat-row--will" : ""}`}
            key={stat.key}
            role="listitem"
          >
            <span className="character-stat-row__icon" aria-hidden="true">
              {stat.icon}
            </span>
            <span className="character-stat-row__label">{stat.label}</span>
            <strong className="character-stat-row__value">{stats[stat.key] ?? 0}</strong>
            {stat.key === "will" ? (
              <span className="character-stat-row__effect">
                1 очко = +100 HP и +10 HP раз в 10 сек.
                {willBonuses.will > 0
                  ? ` Сейчас: +${willBonuses.maxHealthBonus} HP, +${willBonuses.regenerationPerTick} HP / 10 сек.`
                  : ""}
              </span>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
