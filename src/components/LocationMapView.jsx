export default function LocationMapView({ location }) {
  return (
    <section className="game-view" aria-labelledby="location-map-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Текущая локация</span>
          <h1 id="location-map-title">{location.areaName}</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">◇</span>
          {location.worldName}
        </span>
      </div>

      <div className="map-frame">
        <div className="location-map" aria-label="Карта текущей локации">
          <div className="location-map__path location-map__path--horizontal" />
          <div className="location-map__path location-map__path--vertical" />
          <div className="location-map__zone location-map__zone--one">
            <span>Лесная чаща</span>
          </div>
          <div className="location-map__zone location-map__zone--two">
            <span>Заброшенные руины</span>
          </div>
          <div className="location-map__zone location-map__zone--three">
            <span>Каменные холмы</span>
          </div>
          <div className="location-map__zone location-map__zone--four">
            <span>Туманные топи</span>
          </div>
          <div
            className="hero-marker hero-marker--local"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            title="Положение героя внутри локации"
          >
            <span>◆</span>
            <strong>Герой</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
