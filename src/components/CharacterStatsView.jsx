const STAT_ROWS = [
  { key: "strength", label: "Сила", icon: "⚔" },
  { key: "agility", label: "Ловкость", icon: "✦" },
  { key: "stealth", label: "Скрытность", icon: "◈" },
  { key: "scouting", label: "Разведка", icon: "⌖" },
  { key: "lockpicking", label: "Взлом", icon: "◇" },
  { key: "endurance", label: "Выносливость", icon: "◆" },
];

export default function CharacterStatsView({ character, currentHealth }) {
  const stats = character.stats ?? {};
  const maxHealth = Math.max(0, Number(stats.health) || 0);
  const safeCurrentHealth = Math.min(maxHealth, Math.max(0, Number(currentHealth) || 0));

  return (
    <section className="game-view character-stats-view">
      <span className="game-view__eyebrow">Параметры героя</span>
      <h1>Характеристики</h1>

      <div className="character-stats-grid">
        {STAT_ROWS.map((stat) => (
          <article className="character-stat-card" key={stat.key}>
            <span className="character-stat-card__icon" aria-hidden="true">
              {stat.icon}
            </span>
            <span className="character-stat-card__label">{stat.label}</span>
            <strong className="character-stat-card__value">{stats[stat.key] ?? 0}</strong>
          </article>
        ))}

        <article className="character-stat-card character-stat-card--hp">
          <span className="character-stat-card__icon" aria-hidden="true">
            ♥
          </span>
          <span className="character-stat-card__label">HP</span>
          <strong className="character-stat-card__value">
            {safeCurrentHealth} / {maxHealth}
          </strong>
        </article>
      </div>
    </section>
  );
}
