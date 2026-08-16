import { useState } from "react";
import { meadowLocationArt } from "../data/meadowLocationArt.js";
import "../meadow-location.css";

const meadowObjects = [
  {
    id: "field-npc-wanderer",
    type: "npc",
    name: "Странник",
    x: 56,
    y: 36.5,
    action: "Поговорить",
  },
  {
    id: "field-chest-01",
    type: "chest",
    name: "Старинный сундук",
    x: 84,
    y: 51.5,
    action: "Открыть",
  },
];

export default function MeadowLocationView({ worldState = {}, onOpenChest }) {
  const [selectedId, setSelectedId] = useState(null);
  const [dialogue, setDialogue] = useState("");
  const openedChests = worldState.openedChests ?? [];
  const selectedObject = meadowObjects.find((object) => object.id === selectedId) ?? null;

  function selectObject(objectId) {
    setSelectedId(objectId);
    setDialogue("");
  }

  function interact() {
    if (!selectedObject) return;

    if (selectedObject.type === "npc") {
      setDialogue(
        "Странник: За лугами начинается дорога к лесу. Если пойдёшь дальше, держись ближе к тропе.",
      );
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
          aria-label="Луга. Нажмите на Странника или сундук для взаимодействия."
        >
          <img
            className="map-art-image meadow-location__image"
            src={meadowLocationArt}
            alt="Луга"
            loading="eager"
            decoding="async"
          />

          {meadowObjects.map((object) => {
            const opened = object.type === "chest" && openedChests.includes(object.id);
            return (
              <button
                key={object.id}
                type="button"
                className={`field-object field-object--${object.type} ${
                  selectedId === object.id ? "is-selected" : ""
                } ${opened ? "is-opened" : ""}`}
                style={{ left: `${object.x}%`, top: `${object.y}%` }}
                onClick={() => selectObject(object.id)}
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
                {selectedObject.type === "npc" ? "NPC" : "Объект"}
              </span>
              <strong>{selectedObject.name}</strong>
            </div>
            <button
              type="button"
              className="interaction-panel__button"
              onClick={interact}
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
    </section>
  );
}
