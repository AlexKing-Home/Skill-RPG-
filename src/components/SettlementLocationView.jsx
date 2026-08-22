import { useState } from "react";
import { settlementLocationArt } from "../data/settlementLocationArt.js";
import "../styles/location-scenes.css";

const settlementPoints = [
  {
    id: "settlement-palisade-gate",
    name: "Ворота поселения",
    x: 35.57,
    y: 15.76,
    description:
      "Деревянные ворота ведут за частокол. Рядом дежурят дозорные и горят дорожные факелы.",
  },
  {
    id: "settlement-tavern",
    name: "Таверна",
    x: 72.8,
    y: 20.25,
    description:
      "В окнах таверны горит тёплый свет. Здесь можно услышать слухи, найти проводника или переждать ночь.",
  },
  {
    id: "settlement-smithy",
    name: "Кузница",
    x: 22.24,
    y: 35.94,
    description:
      "В кузне пылает горн, а на наковальне лежит свежая заготовка. Кузнец не прекращает работу даже к сумеркам.",
  },
  {
    id: "settlement-village-well",
    name: "Колодец",
    x: 49.89,
    y: 49.13,
    description:
      "Каменный колодец стоит на перекрёстке троп. Вода здесь холодная и удивительно чистая.",
  },
  {
    id: "settlement-market-stall",
    name: "Торговая лавка",
    x: 81.22,
    y: 46.01,
    description:
      "Под полосатым навесом разложены припасы, овощи и дорожные мелочи. Торговец внимательно следит за путниками.",
  },
  {
    id: "settlement-notice-board",
    name: "Доска объявлений",
    x: 22.64,
    y: 57.59,
    description:
      "На доске висят просьбы жителей, награды за опасных тварей и несколько свежих поручений.",
  },
  {
    id: "settlement-garden",
    name: "Огород",
    x: 67.02,
    y: 66.77,
    description:
      "Небольшие грядки снабжают поселение травами и овощами. Между рядами видны свежие следы.",
  },
  {
    id: "settlement-stable",
    name: "Конюшня",
    x: 20.05,
    y: 76.96,
    description:
      "У навеса стоят лошадь и повозка. Здесь можно пополнить запасы перед дальней дорогой.",
  },
  {
    id: "settlement-training-yard",
    name: "Тренировочный двор",
    x: 65.03,
    y: 86.95,
    description:
      "За оградой расставлены мишени и тренировочные стойки. Стражники отрабатывают удары перед сменой караула.",
  },
];

const SETTLEMENT_ASPECT_RATIO = 5 / 4;
const MAP_TAP_RADIUS = 12.5;

export default function SettlementLocationView() {
  const [selectedId, setSelectedId] = useState(null);
  const [description, setDescription] = useState("");
  const selectedPoint = settlementPoints.find((point) => point.id === selectedId) ?? null;

  function selectPoint(pointId) {
    setSelectedId(pointId);
    setDescription("");
  }

  function handleMapTap(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const point of settlementPoints) {
      const dx = x - point.x;
      const dy = (y - point.y) * SETTLEMENT_ASPECT_RATIO;
      const distance = Math.hypot(dx, dy);

      if (distance < nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    }

    if (nearest && nearestDistance <= MAP_TAP_RADIUS) {
      selectPoint(nearest.id);
    }
  }

  function inspectPoint() {
    if (!selectedPoint) return;
    setDescription(selectedPoint.description);
  }

  return (
    <section className="game-view" aria-labelledby="settlement-location-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Мирная локация</span>
          <h1 id="settlement-location-title">Поселение</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--interactive location-map--settlement-art"
          aria-label="Поселение. Все девять синих точек доступны для взаимодействия."
          onClick={handleMapTap}
        >
          <img
            className="map-art-image settlement-location__image"
            src={settlementLocationArt}
            alt="Поселение"
            loading="eager"
            decoding="async"
            draggable="false"
          />

          {settlementPoints.map((point) => (
            <button
              key={point.id}
              type="button"
              className={`settlement-hotspot ${selectedId === point.id ? "is-selected" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={(event) => {
                event.stopPropagation();
                selectPoint(point.id);
              }}
              aria-label={point.name}
              aria-pressed={selectedId === point.id}
            />
          ))}
        </div>
      </div>

      <div className="interaction-panel" aria-live="polite">
        {selectedPoint ? (
          <>
            <div className="interaction-panel__info">
              <span className="interaction-panel__type">Точка интереса</span>
              <strong>{selectedPoint.name}</strong>
            </div>
            <button type="button" className="interaction-panel__button" onClick={inspectPoint}>
              Осмотреть
            </button>
          </>
        ) : (
          <p className="interaction-panel__hint">
            Нажмите на любую синюю точку в Поселении, чтобы выбрать взаимодействие.
          </p>
        )}

        {description && <p className="interaction-panel__dialogue">{description}</p>}
      </div>
    </section>
  );
}
