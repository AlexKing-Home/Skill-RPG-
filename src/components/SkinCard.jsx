export default function SkinCard({ skin, selected, accent, onSelect }) {
  return (
    <button
      type="button"
      className={`skin-card ${selected ? "skin-card--selected" : ""}`}
      style={{ "--selection-accent": accent }}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Выбрать класс ${skin.name}`}
    >
      <span className="skin-card__ornament" aria-hidden="true">
        ◆
      </span>
      <span className="skin-card__name">{skin.name}</span>
      <span className="skin-card__portrait-shell">
        <img
          className="skin-card__image"
          src={skin.image}
          alt={skin.name}
          draggable="false"
          loading="eager"
        />
      </span>
      <span className="skin-card__footer">
        {selected ? <span className="skin-card__selected">✓ Выбрано</span> : <span>Выбрать</span>}
      </span>
    </button>
  );
}
