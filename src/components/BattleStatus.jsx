import { useEffect, useState } from "react";
import { ENEMY_WARNING_MS } from "../data/combat.js";

export default function BattleStatus({ encounter, onFinish }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (encounter?.status !== "active") return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(timer);
  }, [encounter?.status]);
  if (!encounter) return null;
  const remaining = Math.max(0, encounter.nextAttackAt - now);
  const warning = remaining <= ENEMY_WARNING_MS;
  const finished = encounter.status !== "active";
  const victory = encounter.status === "victory";
  const guard = encounter.guard;
  const reward = encounter.reward;
  return (
    <div className="battle-status">
      {finished ? (
        <div
          className={`battle-result battle-result--${victory ? "victory" : "defeat"}`}
          role="alert"
          aria-live="assertive"
        >
          <span className="battle-result__eyebrow">Результат боя</span>
          <strong>{victory ? "Победа!" : "Поражение"}</strong>
          <p>
            {victory
              ? `${encounter.name} повержен. Награда уже добавлена персонажу.`
              : "Герой повержен. Добыча не получена."}
          </p>

          {victory ? (
            <div className="battle-result__loot">
              <span className="battle-result__loot-title">Добыча</span>
              {reward ? (
                <>
                  <div className="battle-result__loot-row">
                    <span>Монеты</span>
                    <strong>+{reward.coins}</strong>
                  </div>
                  {reward.items.length ? (
                    <ul className="battle-result__loot-list">
                      {reward.items.map((item, index) => (
                        <li key={`${item.id}-${index}`}>
                          <span>{item.name}</span>
                          {item.stackable ? <strong>×{item.quantity ?? 1}</strong> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="battle-result__loot-empty">Предметов не выпало.</p>
                  )}
                </>
              ) : (
                <p className="battle-result__loot-empty">Подсчёт добычи…</p>
              )}
            </div>
          ) : null}

          <button type="button" className="battle-flee" onClick={onFinish}>
            {victory ? "Продолжить путь" : "Вернуться в город"}
          </button>
        </div>
      ) : (
        <>
          <p className={`battle-intent ${warning ? "is-warning" : ""}`}>
            {warning ? "Кабан готовит удар!" : "Кабан выжидает."} Удар через{" "}
            {(remaining / 1000).toFixed(1)} сек.
          </p>
          <p className="battle-guard" role="status">
            {guard?.type === "block"
              ? "Блок готов: −75% урона от следующего удара."
              : guard?.type === "parry" && now <= guard.expiresAt
                ? "Окно парирования открыто!"
                : "Защита не активна."}
          </p>
        </>
      )}
      <details className="battle-history">
        <summary>Журнал боя</summary>
        <ol className="battle-log" aria-label="Журнал боя" aria-live="polite">
          {(encounter.log ?? []).map((entry, index) => (
            <li key={`${index}-${entry}`}>{entry}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
