import { useEffect, useRef, useState } from "react";
import "../battle.css";

const directions = [
  { id: "up", label: "Вверх", symbol: "↑", className: "battle-pad__button--up" },
  { id: "left", label: "Влево", symbol: "←", className: "battle-pad__button--left" },
  { id: "right", label: "Вправо", symbol: "→", className: "battle-pad__button--right" },
  { id: "down", label: "Вниз", symbol: "↓", className: "battle-pad__button--down" },
];

const BASIC_ACTIONS = {
  left: "УДАР СЛЕВА!",
  right: "УДАР СПРАВА!",
  up: "БЛОК!",
  down: "ПАРИРОВАНИЕ!",
};

const DIRECTION_SYMBOLS = {
  left: "←",
  right: "→",
  up: "↑",
  down: "↓",
};

const COMBO_INPUT_TIMEOUT_MS = 1500;
const MAX_COMBO_LENGTH = 5;

export default function BattleView({
  encounter,
  currentStamina = 0,
  maxStamina = 0,
  onSkillActivate,
  onFlee,
  findSkill = null,
  weaponLabel = "Оружие",
}) {
  const [activeAction, setActiveAction] = useState("");
  const [comboSequence, setComboSequence] = useState([]);
  const [comboTimerKey, setComboTimerKey] = useState(0);
  const actionTimerRef = useRef(null);
  const comboTimerRef = useRef(null);
  const comboSequenceRef = useRef([]);
  const enemyName = encounter?.name ?? "Неизвестный противник";
  const staminaPercent =
    maxStamina > 0 ? Math.min(100, Math.max(0, (currentStamina / maxStamina) * 100)) : 0;

  useEffect(
    () => () => {
      window.clearTimeout(actionTimerRef.current);
      window.clearTimeout(comboTimerRef.current);
    },
    [],
  );

  function showAction(action) {
    if (!action) return;

    setActiveAction(action);
    window.clearTimeout(actionTimerRef.current);
    actionTimerRef.current = window.setTimeout(() => setActiveAction(""), 700);
  }

  function resolveCombo(sequence) {
    if (sequence.length === 1) {
      showAction(BASIC_ACTIONS[sequence[0]]);
    } else {
      const skill = typeof findSkill === "function" ? findSkill(sequence) : null;
      if (skill) {
        const activated = onSkillActivate ? onSkillActivate(skill) : true;
        if (activated) {
          showAction(`НАВЫК: ${skill.name}! −${skill.staminaCost} ВЫН.`);
        } else {
          showAction("НЕДОСТАТОЧНО ВЫНОСЛИВОСТИ!");
        }
      } else if (sequence.length > 1) {
        showAction(`КОМБИНАЦИЯ «${weaponLabel}» НЕ РАСПОЗНАНА`);
      }
    }

    comboSequenceRef.current = [];
    setComboSequence([]);
  }

  function startComboTimer() {
    if (comboTimerRef.current !== null) return;

    setComboTimerKey((key) => key + 1);
    comboTimerRef.current = window.setTimeout(() => {
      comboTimerRef.current = null;
      resolveCombo(comboSequenceRef.current);
    }, COMBO_INPUT_TIMEOUT_MS);
  }

  function handleDirection(directionId) {
    if (!BASIC_ACTIONS[directionId]) return;

    window.clearTimeout(actionTimerRef.current);
    setActiveAction("");

    const nextSequence = [...comboSequenceRef.current, directionId].slice(-MAX_COMBO_LENGTH);
    comboSequenceRef.current = nextSequence;
    setComboSequence(nextSequence);
    startComboTimer();
  }

  const comboLabel = comboSequence.map((direction) => DIRECTION_SYMBOLS[direction]).join(" ");
  const actionLabel =
    activeAction || (comboSequence.length ? "Ввод комбинации…" : "Выберите направление");

  return (
    <section
      className={`game-view battle-view ${activeAction ? "battle-view--action-active" : ""}`}
      aria-labelledby="battle-title"
    >
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Случайная встреча</span>
          <h1 id="battle-title">Бой</h1>
        </div>
        <span className="location-badge battle-view__badge">⚔ Бой</span>
      </div>

      <div className="battle-card battle-card--compact" role="status" aria-live="assertive">
        <span className="battle-card__eyebrow">Противник</span>
        <strong className="battle-card__enemy">{enemyName}</strong>
        <div className="battle-card__divider" aria-hidden="true" />
        <p>{enemyName} преградил путь и напал на героя.</p>
      </div>

      <div className="battle-controls" aria-label="Боевые элементы управления">
        <div className="battle-stamina">
          <div className="battle-stamina__label">
            <span>ВЫНОСЛИВОСТЬ</span>
            <strong>
              {currentStamina} / {maxStamina}
            </strong>
          </div>
          <div
            className="battle-stamina__track"
            aria-label={`Выносливость ${currentStamina} из ${maxStamina}`}
          >
            <span className="battle-stamina__fill" style={{ width: `${staminaPercent}%` }} />
          </div>
        </div>

        <div className="battle-action" aria-live="polite">
          <strong>{actionLabel}</strong>
          <span>← удар слева · → удар справа · ↑ блок · ↓ парирование</span>
        </div>

        <div className={`battle-combo ${comboSequence.length ? "is-active" : ""}`}>
          <div className="battle-combo__label">
            <span>КОМБИНАЦИЯ · {weaponLabel}</span>
            <strong>{comboLabel || "—"}</strong>
          </div>
          <div className="battle-combo__timer" aria-label="Общее время на ввод комбинации">
            {comboSequence.length ? (
              <span
                key={comboTimerKey}
                className="battle-combo__timer-fill"
                style={{ animationDuration: `${COMBO_INPUT_TIMEOUT_MS}ms` }}
              />
            ) : null}
          </div>
        </div>

        <div className="battle-pad" aria-label="Направления боевых комбинаций">
          {directions.map((direction) => (
            <button
              key={direction.id}
              type="button"
              className={`battle-pad__button ${direction.className}`}
              aria-label={direction.label}
              onClick={() => handleDirection(direction.id)}
            >
              <span aria-hidden="true">{direction.symbol}</span>
            </button>
          ))}
        </div>

        {onFlee ? (
          <button type="button" className="battle-flee" onClick={onFlee}>
            Бегство
          </button>
        ) : null}
      </div>
    </section>
  );
}
