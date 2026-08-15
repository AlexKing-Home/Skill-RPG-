export default function WorldMapView({ location }) {
  return (
    <section className="game-view" aria-labelledby="world-map-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Местоположение героя</span>
          <h1 id="world-map-title">{location.worldName}</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          {location.areaName}
        </span>
      </div>

      <div className="map-frame">
        <div className="world-map" aria-label="Карта всей местности">
          <div className="world-map__terrain world-map__terrain--north">
            <span>Северные земли</span>
          </div>
          <div className="world-map__terrain world-map__terrain--west">
            <span>Тёмный лес</span>
          </div>
          <div className="world-map__terrain world-map__terrain--east">
            <span>Древние руины</span>
          </div>
          <div className="world-map__terrain world-map__terrain--south">
            <span>Каменные земли</span>
          </div>
          <span className="map-landmark map-landmark--one" aria-hidden="true">
            ♜
          </span>
          <span className="map-landmark map-landmark--two" aria-hidden="true">
            △
          </span>
          <span className="map-landmark map-landmark--three" aria-hidden="true">
            ♢
          </span>
          <div
            className="hero-marker"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            title="Герой находится здесь"
          >
            <span>◆</span>
            <strong>Вы здесь</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
