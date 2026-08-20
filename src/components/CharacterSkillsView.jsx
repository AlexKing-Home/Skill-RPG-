import {
  getMasteryProgress,
  normalizeSkillMastery,
  WEAPON_MASTERY_TYPES,
} from "../data/skills.js";

export default function CharacterSkillsView({ character }) {
  const skillMastery = normalizeSkillMastery(character.skillMastery);

  return (
    <section className="game-view character-skills-view">
      <span className="game-view__eyebrow">Развитие героя</span>
      <h1>Навыки</h1>

      <div className="mastery-list">
        {WEAPON_MASTERY_TYPES.map((weapon) => {
          const mastery = getMasteryProgress(skillMastery[weapon.key]);

          return (
            <article className="mastery-card" key={weapon.key}>
              <div className="mastery-card__header">
                <div>
                  <span className="mastery-card__caption">Оружейный навык</span>
                  <strong>{weapon.label}</strong>
                </div>
                <strong className="mastery-card__value">
                  {mastery.current} / {mastery.max}
                </strong>
              </div>

              <div
                className="mastery-bar"
                role="progressbar"
                aria-label={`Мастерство: ${weapon.label}`}
                aria-valuemin="0"
                aria-valuemax={mastery.max}
                aria-valuenow={mastery.current}
              >
                <span className="mastery-bar__fill" style={{ width: `${mastery.percent}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
