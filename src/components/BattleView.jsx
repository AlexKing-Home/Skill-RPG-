import "../battle.css";

export default function BattleView({ encounter }) {
  const enemyName = encounter?.name ?? "Неизвестный противник";

  return (
    <section className="game-view battle-view" aria-labelledby="battle-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Случайная встреча</span>
          <h1 id="battle-title">Бой</h1>
        </div>
        <span className="location-badge battle-view__badge">⚔ Бой</span>
      </div>

      <div className="battle-card" role="status" aria-live="assertive">
        <span className="battle-card__eyebrow">Противник</span>
        <strong className="battle-card__enemy">{enemyName}</strong>
        <div className="battle-card__divider" aria-hidden="true" />
        <p>{enemyName} преградил путь и напал на героя.</p>
        <span className="battle-card__status">Сражение началось</span>
      </div>
    </section>
  );
}
