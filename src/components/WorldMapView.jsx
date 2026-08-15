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
          className="world-map world-map--reference"
          style={{ backgroundImage: `url("${worldMapArt}")` }}
          aria-label="Карта всей местности. Герой отмечен в центре карты."
          role="img"
        />
      </div>
    </section>
  );
}
