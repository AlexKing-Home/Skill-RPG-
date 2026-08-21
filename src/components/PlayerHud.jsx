import { uiCrest } from "../data/assets.js";

export default function PlayerHud({
  nickname,
  level,
  currentHealth,
  maxHealth,
  currentStamina,
  maxStamina,
  progression,
  mode = "default",
}) {
  const hpPercent =
    maxHealth > 0 ? Math.min(100, Math.max(0, (currentHealth / maxHealth) * 100)) : 0;
  const staminaPercent =
    maxStamina > 0 ? Math.min(100, Math.max(0, (currentStamina / maxStamina) * 100)) : 0;
  const masteryLabel = `${progression.total} / ${progression.end}`;
  const characterMode = mode === "character";

  return (
    <header
      className={`player-hud fantasy-panel ornate-panel ${
        characterMode ? "player-hud--character" : ""
      }`}
    >
      <div className="player-hud__crest" aria-hidden="true">
        <img src={uiCrest} alt="" />
      </div>
      <div className="player-hud__identity">
        <strong className="player-hud__nickname">{nickname}</strong>
        <span className="player-hud__level">Ур. {level}</span>
      </div>

      <div className="player-hud__resources">
        <div className="hud-resource hud-resource--hp">
          <div className="hud-resource__label">
            <span>
              <b aria-hidden="true">♥</b> {characterMode ? "ЖИЗНИ" : "HP"}
            </span>
            <strong>
              {currentHealth} / {maxHealth}
            </strong>
          </div>
          <div
            className="hud-resource__track"
            aria-label={`Здоровье ${currentHealth} из ${maxHealth}`}
          >
            <span
              className="hud-resource__fill hud-resource__fill--hp"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        <div className="hud-resource hud-resource--exp">
          <div className="hud-resource__label">
            <span>
              <b aria-hidden="true">✦</b> {characterMode ? "МАСТЕРСТВО" : "SKILL"}
            </span>
            <strong>{masteryLabel}</strong>
          </div>
          <div className="hud-resource__track" aria-label={`Мастерство ${masteryLabel}`}>
            <span
              className="hud-resource__fill hud-resource__fill--exp"
              style={{ width: `${progression.percent}%` }}
            />
          </div>
        </div>

        {characterMode ? (
          <div className="hud-resource hud-resource--stamina">
            <div className="hud-resource__label">
              <span>
                <b aria-hidden="true">◆</b> ВЫНОСЛИВОСТЬ
              </span>
              <strong>
                {currentStamina} / {maxStamina}
              </strong>
            </div>
            <div
              className="hud-resource__track"
              aria-label={`Выносливость ${currentStamina} из ${maxStamina}`}
            >
              <span
                className="hud-resource__fill hud-resource__fill--stamina"
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
