import { getMasteryProgress } from "../data/skills.js";

export default function CharacterSkillsView({ character }) {
  const mastery = getMasteryProgress(character.skillMastery);

  return (
    <section className="game-view character-skills-view">
      <span className="game-view__eyebrow">Развитие героя</span>
      <h1>Навыки</h1>

      <article className="mastery-card">
        <div className="mastery-card__header">
          <div>
            <span className="mastery-card__caption">Общее развитие</span>
            <strong>Мастерство</strong>
          </div>
          <strong className="mastery-card__value">
            {mastery.current} / {mastery.max}
          </strong>
        </div>

        <div
          className="mastery-bar"
          role="progressbar"
          aria-label="Мастерство"
          aria-valuemin="0"
          aria-valuemax={mastery.max}
          aria-valuenow={mastery.current}
        >
          <span className="mastery-bar__fill" style={{ width: `${mastery.percent}%` }} />
        </div>
      </article>
    </section>
  );
}
