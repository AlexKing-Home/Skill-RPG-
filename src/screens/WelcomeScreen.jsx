export default function WelcomeScreen({ hasSave, message, onContinue, onCreate }) {
  return (
    <main className="screen screen--welcome">
      <section className="welcome-panel fantasy-panel ornate-panel">
        <div className="welcome-emblem" aria-hidden="true">
          <span>◆</span>
        </div>
        <p className="welcome-kicker">Dark fantasy adventure</p>
        <h1 className="game-logo">
          SKILL
          <span>RPG</span>
        </h1>
        <p className="welcome-title">Добро пожаловать в мир Skill RPG!</p>
        <p className="welcome-subtitle">Твоя история начинается сейчас.</p>

        <div className="welcome-actions">
          <button className="menu-button menu-button--continue" type="button" onClick={onContinue}>
            <span className="menu-button__icon" aria-hidden="true">↻</span>
            <span className="menu-button__copy">
              <strong>Продолжить</strong>
              <small>Продолжить сохранение</small>
            </span>
            <span className="menu-button__arrow" aria-hidden="true">›</span>
          </button>
          <button className="menu-button menu-button--create" type="button" onClick={onCreate}>
            <span className="menu-button__icon" aria-hidden="true">✦</span>
            <span className="menu-button__copy">
              <strong>Создать персонажа</strong>
              <small>Начать новую историю</small>
            </span>
            <span className="menu-button__arrow" aria-hidden="true">›</span>
          </button>
        </div>

        <div className={`save-chip ${hasSave ? "save-chip--ready" : ""}`}>
          <span aria-hidden="true">{hasSave ? "◆" : "◇"}</span>
          {hasSave ? "Сохранение найдено" : "Сохранение пока не создано"}
        </div>
        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  );
}
