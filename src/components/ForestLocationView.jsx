import { useState } from "react";
import forestLocationArt from "../assets/forest-location.webp";
import "../forest-location.css";

const forestPoints = [
  {
    id: "forest-stone-arch",
    name: "Каменная арка",
    x: 18.37,
    y: 25.66,
    description:
      "Старая арка почти полностью заросла мхом. За ней начинается узкая тропа, уходящая глубже в лес.",
  },
  {
    id: "forest-ancient-tree",
    name: "Древнее дерево",
    x: 51.98,
    y: 21.69,
    description:
      "Исполинское дерево возвышается над лесом. Его корни оплели остатки каменных построек, а кора покрыта необычными узорами.",
  },
  {
    id: "forest-root-tunnel",
    name: "Тоннель в корнях",
    x: 87.57,
    y: 24.97,
    description:
      "Между переплетёнными корнями образовался тёмный проход. Из глубины тянет прохладой и сырой землёй.",
  },
  {
    id: "forest-hunter-camp",
    name: "Охотничий лагерь",
    x: 71.13,
    y: 42.75,
    description:
      "Небольшой лагерь выглядит недавно покинутым. У костра лежат припасы и простое охотничье снаряжение.",
  },
  {
    id: "forest-wooden-bridge",
    name: "Лесной мост",
    x: 26.01,
    y: 55.59,
    description:
      "Старый деревянный мост перекинут через быстрый ручей. Доски скрипят, но пока выдерживают вес путника.",
  },
  {
    id: "forest-fallen-log",
    name: "Упавший ствол",
    x: 45.26,
    y: 68.44,
    description:
      "Огромный поваленный ствол лежит над водой и образует естественную переправу к другой части леса.",
  },
  {
    id: "forest-old-shrine",
    name: "Старое святилище",
    x: 80.25,
    y: 65.37,
    description:
      "Небольшое каменное святилище скрыто среди зелени. На центральной плите сохранился древний символ.",
  },
  {
    id: "forest-signpost",
    name: "Старый указатель",
    x: 18.65,
    y: 78.59,
    description:
      "Покосившийся указатель отмечает несколько заросших дорог. Надписи почти стёрлись от времени и дождей.",
  },
];

const FOREST_ASPECT_RATIO = 4 / 3;
const MAP_TAP_RADIUS = 12.5;

export default function ForestLocationView() {
  const [selectedId, setSelectedId] = useState(null);
  const [description, setDescription] = useState("");
  const selectedPoint = forestPoints.find((point) => point.id === selectedId) ?? null;

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

    for (const point of forestPoints) {
      const dx = x - point.x;
      const dy = (y - point.y) * FOREST_ASPECT_RATIO;
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
    <section className="game-view" aria-labelledby="forest-location-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Текущая локация</span>
          <h1 id="forest-location-title">Лес</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--interactive location-map--forest"
          aria-label="Лес. Все восемь синих точек доступны для взаимодействия."
          onClick={handleMapTap}
        >
          <img
            className="map-art-image forest-location__image"
            src={forestLocationArt}
            alt="Лес"
            loading="eager"
            decoding="async"
            draggable="false"
          />

          {forestPoints.map((point) => (
            <button
              key={point.id}
              type="button"
              className={`forest-hotspot ${selectedId === point.id ? "is-selected" : ""}`}
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
            Нажмите на любую синюю точку в Лесу, чтобы выбрать взаимодействие.
          </p>
        )}

        {description && <p className="interaction-panel__dialogue">{description}</p>}
      </div>
    </section>
  );
}
