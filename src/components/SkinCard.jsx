export default function SkinCard({ skin, selected, accent, onSelect }) {
  return (
    <button
      type="button"
      className={`skin-card ${selected ? "skin-card--selected" : ""}`}
      style={{ "--selection-accent": accent }}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="skin-card__name">{skin.name}</span>
      <img
        className="skin-card__image"
        src={skin.image}
        alt={skin.name}
        draggable="false"
        loading="eager"
      />
      {selected ? <span className="skin-card__selected">Выбрано</span> : null}
    </button>
  );
}
