import { useState } from "react";
import { ruinsLocationArt } from "../data/generated/ruinsLocationArt.js";
import "../ruins-location.css";

const ruinsPoints = [
  {
    id: "ruins-sealed-gate",
    name: "Запечатанные врата",
    x: 23.34,
    y: 23.95,
    description:
      "Внутри разрушенной арки сохранился каменный диск с древним узором. Механизм давно молчит, но печать выглядит нетронутой.",
  },
  {
    id: "ruins-guardian-statue",
    name: "Статуя хранителя",
    x: 83.71,
    y: 21.88,
    description:
      "Каменный хранитель возвышается над площадкой. У подножия статуи всё ещё горят редкие огни.",
  },
  {
    id: "ruins-broken-column",
    name: "Разбитая колонна",
    x: 13.36,
    y: 39.4,
    description:
      "Одинокая колонна пережила обрушение стен. На её основании сохранились почти стёртые знаки.",
  },
  {
    id: "ruins-crypt-collapse",
    name: "Провал в крипту",
    x: 67.81,
    y: 41.78,
    description:
      "Под обвалившейся кладкой видна глубокая полость. Из провала тянет холодным воздухом.",
  },
  {
    id: "ruins-ancient-circle",
    name: "Древний круг",
    x: 31.87,
    y: 56.27,
    description:
      "Круглая площадка покрыта резьбой. Часть символов всё ещё различима между трещинами и мхом.",
  },
  {
    id: "ruins-shadow-passage",
    name: "Тёмный проход",
    x: 75.35,
    y: 68.53,
    description:
      "За полуразрушенной аркой вниз уходит лестница. Пока неизвестно, куда ведёт этот проход.",
  },
  {
    id: "ruins-fallen-statue",
    name: "Павшая статуя",
    x: 12.26,
    y: 81.45,
    description:
      "Огромная каменная фигура расколота и почти скрыта растительностью. На доспехах заметен старый герб.",
  },
  {
    id: "ruins-stone-pedestal",
    name: "Каменный пьедестал",
    x: 50.05,
    y: 84.28,
    description:
      "На верхней плите пьедестала вырезан круглый знак. Возможно, здесь когда-то находился важный предмет.",
  },
];

const RUINS_ASPECT_RATIO = 1120 / 896;
const MAP_TAP_RADIUS = 12.5;

export default function RuinsLocationView() {
  const [selectedId, setSelectedId] = useState(null);
  const [description, setDescription] = useState("");
  const selectedPoint = ruinsPoints.find((point) => point.id === selectedId) ?? null;

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

    for (const point of ruinsPoints) {
      const dx = x - point.x;
      const dy = (y - point.y) * RUINS_ASPECT_RATIO;
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
    <section className="game-view" aria-labelledby="ruins-location-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Текущая локация</span>
          <h1 id="ruins-location-title">Руины</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--interactive location-map--ruins"
          aria-label="Руины. Все восемь синих точек доступны для взаимодействия."
          onClick={handleMapTap}
        >
          <img
            className="map-art-image ruins-location__image"
            src={ruinsLocationArt}
            alt="Руины"
            loading="eager"
            decoding="async"
            draggable="false"
          />

          {ruinsPoints.map((point) => (
            <button
              key={point.id}
              type="button"
              className={`ruins-hotspot ${selectedId === point.id ? "is-selected" : ""}`}
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
            Нажмите на любую синюю точку в Руинах, чтобы выбрать взаимодействие.
          </p>
        )}

        {description && <p className="interaction-panel__dialogue">{description}</p>}
      </div>
    </section>
  );
}
