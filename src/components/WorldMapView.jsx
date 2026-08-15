import { worldMapArt } from "../data/assets.js";

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

      <div className="map-frame map-frame--reference">
        <div
          className="world-map world-map--reference map-art-shell"
          aria-label="Карта всей местности. Герой отмечен на карте."
          role="img"
        >
          <div className="map-fallback" aria-hidden="true">
            <span className="world-fallback__land" />
          </div>

          <img
            className="map-art-image"
            src={worldMapArt}
            alt=""
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </section>
  );
}
