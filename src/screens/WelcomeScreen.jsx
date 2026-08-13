export default function WelcomeScreen({ hasSave, message, onContinue, onCreate }) {
  return (
    <main className="screen screen--welcome">
      <section className="welcome-panel fantasy-panel">
        <div className="logo-gem" aria-hidden="true" />
        <h1 className="game-logo">
          SKILL
          <span>RPG</span>
        </h1>
        <p className="welcome-title">Добро пожаловать в мир Skill RPG!</p>
        <p className="welcome-subtitle">Твоя история начинается сейчас.</p>

        <div className="welcome-actions">
          <button className="menu-button menu-button--continue" type="button" onClick={onContinue}>
            <strong>Продолжить</strong>
            <span>Продолжить сохранение</span>
          </button>
          <button className="menu-button menu-button--create" type="button" onClick={onCreate}>
            <strong>Создать персонажа</strong>
            <span>Начать новую историю</span>
          </button>
        </div>

        <p className="save-status">{hasSave ? "Сохранение найдено" : "Сохранение пока не создано"}</p>
        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  );
}
