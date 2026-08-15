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
          className="location-map location-map--reference map-art-shell"
          aria-label="Карта текущей локации. Герой отмечен на перекрёстке дорог."
          role="img"
        >
          <div className="map-fallback" aria-hidden="true">
            <span className="location-fallback__road location-fallback__road--h" />
            <span className="location-fallback__road location-fallback__road--v" />
            <span className="location-fallback__zone location-fallback__zone--one">Лесная чаща</span>
            <span className="location-fallback__zone location-fallback__zone--two">
              Заброшенные руины
            </span>
            <span className="location-fallback__zone location-fallback__zone--three">
              Каменные холмы
            </span>
            <span className="location-fallback__zone location-fallback__zone--four">Туманные топи</span>
          </div>

          <img
            className="map-art-image"
            src={locationMapArt}
            alt=""
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="map-overlay-hero" aria-hidden="true">
            <span className="map-overlay-hero__gem">◆</span>
            <strong>Герой</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
