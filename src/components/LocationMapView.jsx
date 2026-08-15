import { useEffect, useMemo, useState } from "react";
import { locationMapArt } from "../data/assets.js";

const fieldObjects = [
  {
    id: "field-npc-wanderer",
    type: "npc",
    name: "Странник",
    x: 34,
    y: 43,
    action: "Поговорить",
  },
  {
    id: "field-chest-01",
    type: "chest",
    name: "Старинный сундук",
    x: 72,
    y: 64,
    action: "Открыть",
  },
];

export default function LocationMapView({ location, worldState = {}, onOpenChest }) {
  const [selectedId, setSelectedId] = useState(null);
  const [dialogue, setDialogue] = useState("");
  const isField = location.nodeId === "field";
  const openedChests = worldState.openedChests ?? [];

  const selectedObject = useMemo(
    () => fieldObjects.find((object) => object.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    setSelectedId(null);
    setDialogue("");
  }, [location.nodeId]);

  function handleObjectTap(objectId) {
    setSelectedId(objectId);
    setDialogue("");
  }

  function handleInteract() {
    if (!selectedObject) return;

    if (selectedObject.type === "npc") {
      setDialogue(
        "Странник: За полем начинается дорога к лесу. Если пойдёшь дальше, держись ближе к тропе.",
      );
      return;
    }

    if (selectedObject.type === "chest") {
      const isOpened = openedChests.includes(selectedObject.id);
      if (!isOpened) onOpenChest?.(selectedObject.id);
      setDialogue(isOpened ? "Сундук уже открыт." : "Вы открыли старинный сундук.");
    }
  }

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
          className={`location-map location-map--reference map-art-shell ${
            isField ? "location-map--interactive" : ""
          }`}
          aria-label={
            isField
              ? "Поле. На локации есть NPC и сундук, доступные для взаимодействия."
              : "Карта текущей локации. Герой отмечен на перекрёстке дорог."
          }
        >
          <div className="map-fallback" aria-hidden="true">
            <span className="location-fallback__road location-fallback__road--h" />
            <span className="location-fallback__road location-fallback__road--v" />
            <span className="location-fallback__zone location-fallback__zone--one">
              Лесная чаща
            </span>
            <span className="location-fallback__zone location-fallback__zone--two">
              Заброшенные руины
            </span>
            <span className="location-fallback__zone location-fallback__zone--three">
              Каменные холмы
            </span>
            <span className="location-fallback__zone location-fallback__zone--four">
              Туманные топи
            </span>
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

          {isField &&
            fieldObjects.map((object) => {
              const opened = object.type === "chest" && openedChests.includes(object.id);
              return (
                <button
                  key={object.id}
                  type="button"
                  className={`field-object field-object--${object.type} ${
                    selectedId === object.id ? "is-selected" : ""
                  } ${opened ? "is-opened" : ""}`}
                  style={{ left: `${object.x}%`, top: `${object.y}%` }}
                  onClick={() => handleObjectTap(object.id)}
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

      {isField && (
        <div className="interaction-panel" aria-live="polite">
          {selectedObject ? (
            <>
              <div className="interaction-panel__info">
                <span className="interaction-panel__type">
                  {selectedObject.type === "npc" ? "NPC" : "Объект"}
                </span>
                <strong>{selectedObject.name}</strong>
              </div>
              <button
                type="button"
                className="interaction-panel__button"
                onClick={handleInteract}
                disabled={
                  selectedObject.type === "chest" && openedChests.includes(selectedObject.id)
                }
              >
                {selectedObject.type === "chest" && openedChests.includes(selectedObject.id)
                  ? "Открыт"
                  : selectedObject.action}
              </button>
            </>
          ) : (
            <p className="interaction-panel__hint">
              Нажмите на Странника или сундук на локации, чтобы выбрать взаимодействие.
            </p>
          )}

          {dialogue && <p className="interaction-panel__dialogue">{dialogue}</p>}
        </div>
      )}
    </section>
  );
}
