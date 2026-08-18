import { useState } from "react";
import { startCityLocationArt } from "../data/startCityLocationArt.js";
import "../start-city-location.css";

const cityObjects = [
  {
    id: "city-gate",
    name: "Городские ворота",
    x: 51.05,
    y: 9.97,
    action: "Осмотреть",
    description: "Главные ворота ведут из Стартового города к дорогам первого этажа.",
  },
  {
    id: "city-forge",
    name: "Кузница",
    x: 17.23,
    y: 22.66,
    action: "Осмотреть",
    description: "Из кузницы доносится звон металла. Здесь позже можно будет чинить и улучшать снаряжение.",
  },
  {
    id: "city-inn",
    name: "Таверна",
    x: 80.22,
    y: 23.58,
    action: "Осмотреть",
    description: "В таверне собираются путники. Это подходящее место для слухов, заданий и отдыха.",
  },
  {
    id: "city-notice-board",
    name: "Доска объявлений",
    x: 21.55,
    y: 41.62,
    action: "Прочитать",
    description: "На доске закреплены объявления жителей и первые доступные поручения.",
  },
  {
    id: "city-fountain",
    name: "Городской фонтан",
    x: 46.31,
    y: 46.2,
    action: "Осмотреть",
    description: "Фонтан стоит в центре площади и служит главным ориентиром Стартового города.",
  },
  {
    id: "city-market",
    name: "Торговая лавка",
    x: 68.45,
    y: 42.64,
    action: "Осмотреть",
    description: "На прилавке разложены припасы. Здесь позже появится покупка и продажа предметов.",
  },
  {
    id: "city-west-alley",
    name: "Западный переулок",
    x: 12.7,
    y: 58.44,
    action: "Осмотреть",
    description: "Узкий переулок уходит между домами к западной части города.",
  },
  {
    id: "city-shrine",
    name: "Святилище",
    x: 84.09,
    y: 57.37,
    action: "Осмотреть",
    description: "Небольшое городское святилище освещено свечами и фонарями.",
  },
  {
    id: "city-caravan",
    name: "Караванная повозка",
    x: 26.43,
    y: 74.55,
    action: "Осмотреть",
    description: "Повозка с припасами готовится к дороге. Рядом разгружают ящики и бочки.",
  },
  {
    id: "city-training-yard",
    name: "Тренировочный двор",
    x: 75.06,
    y: 78.68,
    action: "Осмотреть",
    description: "Во дворе стоят тренировочные манекены и стойки с оружием.",
  },
];

const CITY_ASPECT_RATIO = 1402 / 1122;
const MAP_TAP_RADIUS = 13.5;

export default function StartCityLocationView() {
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const selectedObject = cityObjects.find((object) => object.id === selectedId) ?? null;

  function selectObject(objectId) {
    setSelectedId(objectId);
    setMessage("");
  }

  function handleMapTap(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const object of cityObjects) {
      const dx = x - object.x;
      const dy = (y - object.y) * CITY_ASPECT_RATIO;
      const distance = Math.hypot(dx, dy);

      if (distance < nearestDistance) {
        nearest = object;
        nearestDistance = distance;
      }
    }

    if (nearest && nearestDistance <= MAP_TAP_RADIUS) selectObject(nearest.id);
  }

  function interact() {
    if (!selectedObject) return;
    setMessage(selectedObject.description);
  }

  return (
    <section className="game-view" aria-labelledby="start-city-location-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Текущая локация</span>
          <h1 id="start-city-location-title">Стартовый город</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--interactive location-map--start-city"
          aria-label="Стартовый город. Все синие точки доступны для взаимодействия."
          onClick={handleMapTap}
        >
          <img
            className="map-art-image start-city-location__image"
            src={startCityLocationArt}
            alt="Стартовый город"
            loading="eager"
            decoding="async"
            draggable="false"
          />

          {cityObjects.map((object) => (
            <button
              key={object.id}
              type="button"
              className={`city-hotspot ${selectedId === object.id ? "is-selected" : ""}`}
              style={{ left: `${object.x}%`, top: `${object.y}%` }}
              onClick={(event) => {
                event.stopPropagation();
                selectObject(object.id);
              }}
              aria-label={object.name}
              aria-pressed={selectedId === object.id}
            />
          ))}
        </div>
      </div>

      <div className="interaction-panel" aria-live="polite">
        {selectedObject ? (
          <>
            <div className="interaction-panel__info">
              <span className="interaction-panel__type">Точка интереса</span>
              <strong>{selectedObject.name}</strong>
            </div>
            <button type="button" className="interaction-panel__button" onClick={interact}>
              {selectedObject.action}
            </button>
          </>
        ) : (
          <p className="interaction-panel__hint">
            Нажмите на любую синюю точку города, чтобы выбрать взаимодействие.
          </p>
        )}

        {message && <p className="interaction-panel__dialogue">{message}</p>}
      </div>
    </section>
  );
}
