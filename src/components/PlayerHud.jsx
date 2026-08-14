export default function PlayerHud({ nickname, level, currentHealth, maxHealth, experience }) {
  const hpPercent = maxHealth > 0 ? Math.min(100, Math.max(0, (currentHealth / maxHealth) * 100)) : 0;
  const expLabel = experience.end === null ? `${experience.total}` : `${experience.total} / ${experience.end}`;

  return (
    <header className="player-hud fantasy-panel">
      <div className="player-hud__identity">
        <strong className="player-hud__nickname">{nickname}</strong>
        <span className="player-hud__level">Ур. {level}</span>
      </div>

      <div className="player-hud__resources">
        <div className="hud-resource">
          <div className="hud-resource__label">
            <span>HP</span>
            <strong>{currentHealth} / {maxHealth}</strong>
          </div>
          <div className="hud-resource__track">
            <span className="hud-resource__fill hud-resource__fill--hp" style={{ width: `${hpPercent}%` }} />
          </div>
        </div>

        <div className="hud-resource">
          <div className="hud-resource__label">
            <span>EXP</span>
            <strong>{expLabel}</strong>
          </div>
          <div className="hud-resource__track">
            <span
              className="hud-resource__fill hud-resource__fill--exp"
              style={{ width: `${experience.percent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
