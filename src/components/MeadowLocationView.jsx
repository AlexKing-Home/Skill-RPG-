import { useState } from "react";
import { meadowLocationArt } from "../data/meadowLocationArt.js";
import "../meadow-location.css";

const meadowObjects = [
  {
    id: "field-point-flower-meadow",
    type: "point",
    name: "Цветочная поляна",
    x: 22.59,
    y: 17.76,
    action: "Осмотреть",
    description:
      "Среди высокой травы и цветов заметны примятые следы, уходящие к северной части лугов.",
  },
  {
    id: "field-point-north-trail",
    type: "point",
    name: "Северная тропа",
    x: 59.1,
    y: 20.5,
    action: "Осмотреть",
    description: "Старая тропа уходит между холмами. По ней часто ходят путники и торговцы.",
  },
  {
    id: "field-point-old-fence",
    type: "point",
    name: "Старая ограда",
    x: 86.41,
    y: 27.1,
    action: "Осмотреть",
    description: "Деревянная ограда почти заросла травой. За ней видна узкая боковая тропинка.",
  },
  {
    id: "field-point-stone-wall",
    type: "point",
    name: "Каменная ограда",
    x: 20.44,
    y: 40.82,
    action: "Осмотреть",
    description:
      "Низкая каменная стена давно разрушена, но рядом можно заметить следы недавнего привала.",
  },
  {
    id: "field-npc-wanderer",
    type: "npc",
    name: "Странник",
    x: 56.22,
    y: 36.94,
    action: "Поговорить",
  },
  {
    id: "field-chest-01",
    type: "chest",
    name: "Старинный сундук",
    x: 83.99,
    y: 51.7,
    action: "Открыть",
  },
  {
    id: "field-point-bridge",
    type: "point",
    name: "Деревянный мостик",
    x: 31.04,
    y: 65.94,
    action: "Осмотреть",
    description:
      "Небольшой мост перекинут через ручей. Доски старые, но пока выдерживают вес путника.",
  },
  {
    id: "field-point-signpost",
    type: "point",
    name: "Указатель",
    x: 16.87,
    y: 81.44,
    action: "Осмотреть",
    description: "На выцветших табличках ещё можно разобрать направления к ближайшим дорогам.",
  },
  {
    id: "field-point-well",
    type: "point",
    name: "Колодец",
    x: 78.23,
    y: 81.23,
    action: "Осмотреть",
    description: "Каменный колодец выглядит старым. Внизу слышно тихое журчание воды.",
  },
];

const MEADOW_ASPECT_RATIO = 960 / 768;
const MAP_TAP_RADIUS = 12.5;

export default function MeadowLocationView({ worldState = {}, onOpenChest }) {
  const [selectedId, setSelectedId] = useState(null);
  const [dialogue, setDialogue] = useState("");
  const openedChests = worldState.openedChests ?? [];
  const selectedObject = meadowObjects.find((object) => object.id === selectedId) ?? null;

  function selectObject(objectId) {
    setSelectedId(objectId);
    setDialogue("");
  }

  function handleMapTap(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const object of meadowObjects) {
      const dx = x - object.x;
      const dy = (y - object.y) * MEADOW_ASPECT_RATIO;
      const distance = Math.hypot(dx, dy);

      if (distance < nearestDistance) {
        nearest = object;
        nearestDistance = distance;
      }
    }

    if (nearest && nearestDistance <= MAP_TAP_RADIUS) {
      selectObject(nearest.id);
    }
  }

  function interact() {
    if (!selectedObject) return;

    if (selectedObject.type === "npc") {
      setDialogue(
        "Странник: За лугами начинается дорога к лесу. Если пойдёшь дальше, держись ближе к тропе.",
      );
      return;
    }

    if (selectedObject.type === "point") {
      setDialogue(selectedObject.description);
      return;
    }

    const isOpened = openedChests.includes(selectedObject.id);
    if (!isOpened) onOpenChest?.(selectedObject.id);
    setDialogue(isOpened ? "Сундук уже открыт." : "Вы открыли старинный сундук.");
  }

  return (
    <section className="game-view" aria-labelledby="meadow-location-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Текущая локация</span>
          <h1 id="meadow-location-title">Луга</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="location-map location-map--interactive location-map--meadow"
          aria-label="Луга. Все отмеченные синим точки доступны для взаимодействия."
          onClick={handleMapTap}
        >
          <img
            className="map-art-image meadow-location__image"
            src={meadowLocationArt}
            alt="Луга"
            loading="eager"
            decoding="async"
            draggable="false"
          />

          {meadowObjects.map((object) => {
            const opened = object.type === "chest" && openedChests.includes(object.id);

            if (object.type === "point") {
              return (
                <button
                  key={object.id}
                  type="button"
                  className={`meadow-hotspot ${selectedId === object.id ? "is-selected" : ""}`}
                  style={{ left: `${object.x}%`, top: `${object.y}%` }}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectObject(object.id);
                  }}
                  aria-label={object.name}
                  aria-pressed={selectedId === object.id}
                />
              );
            }

            return (
              <button
                key={object.id}
                type="button"
                className={`field-object field-object--${object.type} ${
                  selectedId === object.id ? "is-selected" : ""
                } ${opened ? "is-opened" : ""}`}
                style={{ left: `${object.x}%`, top: `${object.y}%` }}
                onClick={(event) => {
                  event.stopPropagation();
                  selectObject(object.id);
                }}
                aria-pressed={selectedId === object.id}
              >
                <span className="field-object__icon" aria-hidden="true">
                  {object.type === "npc" ? "!" : opened ? "□" : "▣"}
                </span>
                <span className="field-object__label">{object.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="interaction-panel" aria-live="polite">
        {selectedObject ? (
          <>
            <div className="interaction-panel__info">
              <span className="interaction-panel__type">
                {selectedObject.type === "npc"
                  ? "NPC"
                  : selectedObject.type === "point"
                    ? "Точка интереса"
                    : "Объект"}
              </span>
              <strong>{selectedObject.name}</strong>
            </div>
            <button
              type="button"
              className="interaction-panel__button"
              onClick={interact}
              disabled={selectedObject.type === "chest" && openedChests.includes(selectedObject.id)}
            >
              {selectedObject.type === "chest" && openedChests.includes(selectedObject.id)
                ? "Открыт"
                : selectedObject.action}
            </button>
          </>
        ) : (
          <p className="interaction-panel__hint">
            Нажмите на любую синюю точку на локации, чтобы выбрать взаимодействие.
          </p>
        )}

        {dialogue && <p className="interaction-panel__dialogue">{dialogue}</p>}
      </div>
    </section>
  );
}
