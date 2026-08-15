import { useEffect, useState } from "react";
import { locationMapArt } from "../data/assets.js";
import { swampLocationArt } from "../data/swampLocationArt.js";
import EmbeddedArtCanvas from "./EmbeddedArtCanvas.jsx";

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

const swampPoints = [
  {
    id: "swamp-arch",
    type: "inspect",
    name: "Затопленная арка",
    action: "Осмотреть",
    x: 19.4,
    y: 20.7,
    text: "Старая каменная арка почти ушла под воду. На камнях заметны стёртые символы.",
  },
  {
    id: "swamp-deep-path",
    type: "move",
    name: "Тропа в глубь болота",
    action: "Перейти",
    x: 47.5,
    y: 18.7,
    text: "Топкая тропа уходит дальше в густой туман. Путь обнаружен.",
  },
  {
    id: "swamp-tree",
    type: "inspect",
    name: "Искажённое дерево",
    action: "Осмотреть",
    x: 68,
    y: 21.6,
    text: "Из полого ствола сочится слабое зелёное свечение.",
  },
  {
    id: "swamp-pool",
    type: "inspect",
    name: "Ядовитая заводь",
    action: "Осмотреть",
    x: 33.9,
    y: 40.3,
    text: "Вода здесь пузырится и светится изнутри. Прикасаться к ней опасно.",
  },
  {
    id: "swamp-cave",
    type: "move",
    name: "Нора среди корней",
    action: "Перейти",
    x: 87.9,
    y: 45.3,
    text: "Между корнями виднеется узкий тёмный проход. Путь обнаружен.",
  },
  {
    id: "swamp-statue",
    type: "inspect",
    name: "Затонувшая статуя",
    action: "Осмотреть",
    x: 12.5,
    y: 61,
    text: "Каменное лицо выступает из воды. Кто-то оставил здесь древний идол.",
  },
  {
    id: "swamp-remains",
    type: "inspect",
    name: "Останки путника",
    action: "Осмотреть",
    x: 41.4,
    y: 70,
    text: "Кости лежат прямо в воде. Рядом могут остаться полезные вещи.",
  },
  {
    id: "swamp-roots",
    type: "inspect",
    name: "Корни у топи",
    action: "Осмотреть",
    x: 87,
    y: 80.7,
    text: "Корни образуют естественное укрытие. Внутри что-то блеснуло.",
  },
  {
    id: "swamp-bridge",
    type: "move",
    name: "Гнилой мост",
    action: "Перейти",
    x: 44.6,
    y: 90,
    text: "Старый настил ещё держится и ведёт к другой части болота. Путь обнаружен.",
  },
];

export default function LocationMapView({ location, worldState = {}, onOpenChest }) {
  const [selectedId, setSelectedId] = useState(null);
  const [dialogue, setDialogue] = useState("");
  const isField = ["field", "meadows"].includes(location.nodeId);
  const isSwamp = location.nodeId === "swamp";
  const openedChests = worldState.openedChests ?? [];
  const sceneObjects = isSwamp ? swampPoints : isField ? fieldObjects : [];
  const selectedObject = sceneObjects.find((object) => object.id === selectedId) ?? null;

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

    if (isSwamp) {
      setDialogue(selectedObject.text);
      return;
    }

    if (selectedObject.type === "npc") {
      setDialogue(
        "Странник: За лугами начинается дорога к лесу. Если пойдёшь дальше, держись ближе к тропе.",
      );
      return;
    }

    if (selectedObject.type === "chest") {
      const isOpened = openedChests.includes(selectedObject.id);
      if (!isOpened) onOpenChest?.(selectedObject.id);
      setDialogue(isOpened ? "Сундук уже открыт." : "Вы открыли старинный сундук.");
    }
  }

  function getObjectType(object) {
    if (object.type === "npc") return "NPC";
    if (object.type === "chest") return "Объект";
    if (object.type === "move") return "Переход";
    return "Точка интереса";
  }

  return (
    <section className="game-view" aria-labelledby="location-map-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">
            {isSwamp ? "Местоположение героя" : "Текущая локация"}
          </span>
          <h1 id="location-map-title">{location.areaName}</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          Текущая локация
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className={`location-map location-map--reference map-art-shell ${
            isField ? "location-map--interactive" : ""
          } ${isSwamp ? "location-map--swamp" : ""}`}
          aria-label={
            isSwamp
              ? "Болото. Нажмите на светящуюся точку для взаимодействия."
              : isField
                ? "Луга. На локации есть NPC и сундук, доступные для взаимодействия."
                : "Карта текущей локации."
          }
        >
          {!isSwamp && (
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
          )}

          {isSwamp ? (
            <EmbeddedArtCanvas
              className="map-art-image"
              dataUrl={swampLocationArt}
              ariaLabel="Болото"
            />
          ) : (
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
          )}

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

          {isSwamp &&
            swampPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                className={`swamp-point ${selectedId === point.id ? "is-selected" : ""}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => handleObjectTap(point.id)}
                aria-label={`${point.name}. ${point.action}`}
                aria-pressed={selectedId === point.id}
              >
                <span className="swamp-point__pulse" aria-hidden="true" />
                <span className="swamp-point__sr-label">{point.name}</span>
              </button>
            ))}
        </div>
      </div>

      {(isField || isSwamp) && (
        <div className="interaction-panel" aria-live="polite">
          {selectedObject ? (
            <>
              <div className="interaction-panel__info">
                <span className="interaction-panel__type">{getObjectType(selectedObject)}</span>
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
              {isSwamp
                ? "Нажмите на светящуюся точку на болоте, чтобы выбрать действие."
                : "Нажмите на Странника или сундук на локации, чтобы выбрать взаимодействие."}
            </p>
          )}

          {dialogue && <p className="interaction-panel__dialogue">{dialogue}</p>}
        </div>
      )}
    </section>
  );
}
