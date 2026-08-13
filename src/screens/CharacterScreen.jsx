export default function CharacterScreen({ character, onBack }) {
  return (
    <main className="screen screen--character">
      <section className="character-panel fantasy-panel">
        <img className="character-portrait" src={character.skinImage} alt={character.skinName} />
        <h1 className="character-name">{character.nickname}</h1>
        <p className="character-class">{character.skinName}</p>
        <div className="stats-grid">
          <div><span>Уровень</span><strong>{character.level}</strong></div>
          <div><span>Здоровье</span><strong>{character.stats.health}</strong></div>
          <div><span>Атака</span><strong>{character.stats.attack}</strong></div>
          <div><span>Защита</span><strong>{character.stats.defense}</strong></div>
          <div><span>Ловкость</span><strong>{character.stats.agility}</strong></div>
        </div>
        <button className="secondary-button" type="button" onClick={onBack}>В главное меню</button>
      </section>
    </main>
  );
}
