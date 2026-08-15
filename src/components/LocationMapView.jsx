import { locationMapArt } from "../data/assets.js";

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

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--reference"
          style={{ backgroundImage: `url("${locationMapArt}")` }}
          aria-label="Карта текущей локации. Герой отмечен на перекрёстке дорог."
          role="img"
        />
      </div>
    </section>
  );
}
