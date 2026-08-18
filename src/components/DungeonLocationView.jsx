import { useState } from "react";
import { dungeonLocationArt } from "../data/dungeonLocationArt.js";
import "../dungeon-location.css";

const dungeonPoints = [
  {
    id: "dungeon-sealed-gate",
    name: "Запертые врата",
    x: 45.17,
    y: 15.36,
    description:
      "Тяжёлая решётка перекрывает древний проход. На каменной арке сохранились следы старой печати.",
  },
  {
    id: "dungeon-silent-guardian",
    name: "Безмолвный страж",
    x: 15.17,
    y: 24.13,
    description:
      "Высокая статуя в капюшоне стоит среди цепей и костей. Кажется, она следит за каждым движением.",
  },
  {
    id: "dungeon-sarcophagus",
    name: "Каменный саркофаг",
    x: 75.19,
    y: 22.37,
    description: "На возвышении лежит массивный саркофаг. По его краям ещё горят редкие огни.",
  },
  {
    id: "dungeon-blue-passage",
    name: "Холодный проход",
    x: 16.31,
    y: 50.72,
    description:
      "Из нижнего прохода тянет ледяным воздухом и слабым синим свечением. Дальше ничего не видно.",
  },
  {
    id: "dungeon-abyss-bridge",
    name: "Мост над бездной",
    x: 78.84,
    y: 53.68,
    description:
      "Узкий каменный переход висит над тёмным провалом. Часть ограждения давно обрушилась.",
  },
  {
    id: "dungeon-deep-chasm",
    name: "Глубокий провал",
    x: 74.78,
    y: 68.16,
    description: "Из глубины поднимается холодный туман. Дна не видно даже при свете факелов.",
  },
  {
    id: "dungeon-bone-niche",
    name: "Ниша с останками",
    x: 15.22,
    y: 77.52,
    description:
      "У стены скопились старые кости и обломки снаряжения. Среди них может скрываться что-то полезное.",
  },
  {
    id: "dungeon-rune-circle",
    name: "Рунический круг",
    x: 35.52,
    y: 82.98,
    description:
      "Вырезанные в камне руны всё ещё светятся холодным синим светом. Магия этого места не угасла.",
  },
];

const DUNGEON_ASPECT_RATIO = 5 / 4;
const MAP_TAP_RADIUS = 12.5;

export default function DungeonLocationView() {
  const [selectedId, setSelectedId] = useState(null);
  const [description, setDescription] = useState("");
  const selectedPoint = dungeonPoints.find((point) => point.id === selectedId) ?? null;

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

    for (const point of dungeonPoints) {
      const dx = x - point.x;
      const dy = (y - point.y) * DUNGEON_ASPECT_RATIO;
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
    <section className="game-view" aria-labelledby="dungeon-location-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Опасная локация</span>
          <h1 id="dungeon-location-title">Подземелье</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--interactive location-map--dungeon"
          aria-label="Подземелье. Все восемь синих точек доступны для взаимодействия."
          onClick={handleMapTap}
        >
          <img
            className="map-art-image dungeon-location__image"
            src={dungeonLocationArt}
            alt="Подземелье"
            loading="eager"
            decoding="async"
            draggable="false"
          />

          {dungeonPoints.map((point) => (
            <button
              key={point.id}
              type="button"
              className={`dungeon-hotspot ${selectedId === point.id ? "is-selected" : ""}`}
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
            Нажмите на любую синюю точку в Подземелье, чтобы выбрать взаимодействие.
          </p>
        )}

        {description && <p className="interaction-panel__dialogue">{description}</p>}
      </div>
    </section>
  );
}
