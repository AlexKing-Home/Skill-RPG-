import { getDedicatedLocation } from "../data/locationRegistry.js";

export default function DedicatedLocationView({ location }) {
  const scene = getDedicatedLocation(location.nodeId);
  if (!scene) return null;

  return (
    <section className="game-view" aria-labelledby={`${scene.id}-location-title`}>
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">{scene.eyebrow}</span>
          <h1 id={`${scene.id}-location-title`}>{scene.title}</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className={`location-map location-map--reference map-art-shell dedicated-location dedicated-location--${scene.type}`}
          aria-label={`${scene.title}. Отдельная игровая локация.`}
        >
          <div className="map-fallback dedicated-location__placeholder">
            <span className="location-fallback__road location-fallback__road--h" />
            <span className="location-fallback__road location-fallback__road--v" />
            <strong>{scene.title}</strong>
            <span>{scene.description}</span>
          </div>
        </div>
      </div>

      <div className="interaction-panel" aria-live="polite">
        <div className="interaction-panel__info">
          <span className="interaction-panel__type">Локация</span>
          <strong>{scene.title}</strong>
          <span>{scene.description}</span>
        </div>
      </div>
    </section>
  );
}
