export default function WorldMapView({ location }) {
  return (
    <section className="game-view" aria-labelledby="world-map-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Местоположение героя</span>
          <h1 id="world-map-title">{location.worldName}</h1>
        </div>
        <span className="location-badge">{location.areaName}</span>
      </div>

      <div className="world-map" aria-label="Карта всей местности">
        <div className="world-map__terrain world-map__terrain--north" />
        <div className="world-map__terrain world-map__terrain--west" />
        <div className="world-map__terrain world-map__terrain--east" />
        <div className="world-map__terrain world-map__terrain--south" />
        <div
          className="hero-marker"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          title="Герой находится здесь"
        >
          <span>◆</span>
          <strong>Вы здесь</strong>
        </div>
      </div>
    </section>
  );
}
