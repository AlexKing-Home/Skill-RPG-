import {
  getCombatProfileForWeapon,
} from "../data/combatProfiles.js";
import {
  getMasteryProgress,
  getVisibleWeaponMasteryTypes,
  normalizeSkillMastery,
} from "../data/skills.js";

const directionSymbols = {
  left: "←",
  right: "→",
  up: "↑",
  down: "↓",
};

export default function CharacterSkillsView({ character }) {
  const skillMastery = normalizeSkillMastery(character.skillMastery);
  const visibleWeapons = getVisibleWeaponMasteryTypes(skillMastery);

  return (
    <section className="game-view character-skills-view">
      <span className="game-view__eyebrow">Развитие героя</span>
      <h1>Навыки</h1>

      <div className="mastery-list">
        {visibleWeapons.map((weapon) => {
          const mastery = getMasteryProgress(skillMastery[weapon.key]);
          const techniques = getCombatProfileForWeapon(weapon.key).skills ?? [];
          const unlockedTechniques = techniques.filter(
            (skill) => mastery.current >= (skill.masteryRequired ?? 0),
          );
          const nextTechnique = techniques.find(
            (skill) => mastery.current < (skill.masteryRequired ?? 0),
          );

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

              {techniques.length ? (
                <div className="mastery-techniques">
                  <div className="mastery-techniques__summary">
                    <span>
                      Открыто приёмов: {unlockedTechniques.length} / {techniques.length}
                    </span>
                    <strong>
                      {nextTechnique
                        ? `Следующий: ${nextTechnique.name} · ещё ${nextTechnique.masteryRequired - mastery.current}`
                        : "Все приёмы открыты"}
                    </strong>
                  </div>

                  <div className="mastery-techniques__list">
                    {techniques.map((skill) => {
                      const unlocked = mastery.current >= (skill.masteryRequired ?? 0);
                      const combo = skill.combo
                        .map((direction) => directionSymbols[direction] ?? direction)
                        .join(" ");

                      return (
                        <div
                          className={`mastery-technique ${unlocked ? "is-unlocked" : "is-locked"}`}
                          key={skill.id}
                        >
                          <div>
                            <strong>{skill.name}</strong>
                            <span className="mastery-technique__combo">{combo}</span>
                          </div>
                          <span className="mastery-technique__status">
                            {unlocked ? "Открыт" : `${skill.masteryRequired} мастерства`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
