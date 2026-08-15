import { useEffect, useRef, useState } from "react";
import { locationMapArt } from "../data/assets.js";
import { swampLocationArt } from "../data/swampLocationArt.js";

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

/*
 * Exact pixel coordinate system of the approved swamp scene crop.
 * The functional points below are measured from the actual painted blue/gold
 * marker centres in that image, not from screenshots of the rendered page.
 */
const SWAMP_ART_WIDTH = 775;
const SWAMP_ART_HEIGHT = 695;
const SWAMP_TAP_RADIUS = 72;

const swampPoints = [
  {
    id: "swamp-arch",
    type: "inspect",
    name: "Затопленная арка",
    action: "Осмотреть",
    sourceX: 148,
    sourceY: 142,
    text: "Старая каменная арка почти ушла под воду. На камнях заметны стёртые символы.",
  },
  {
    id: "swamp-deep-path",
    type: "move",
    name: "Тропа в глубь болота",
    action: "Перейти",
    sourceX: 368,
    sourceY: 130,
    text: "Топкая тропа уходит дальше в густой туман. Путь обнаружен.",
  },
  {
    id: "swamp-tree",
    type: "inspect",
    name: "Искажённое дерево",
    action: "Осмотреть",
    sourceX: 526,
    sourceY: 150,
    text: "Из полого ствола сочится слабое зелёное свечение.",
  },
  {
    id: "swamp-pool",
    type: "inspect",
    name: "Ядовитая заводь",
    action: "Осмотреть",
    sourceX: 263,
    sourceY: 279,
    text: "Вода здесь пузырится и светится изнутри. Прикасаться к ней опасно.",
  },
  {
    id: "swamp-cave",
    type: "move",
    name: "Нора среди корней",
    action: "Перейти",
    sourceX: 681,
    sourceY: 316,
    text: "Между корнями виднеется узкий тёмный проход. Путь обнаружен.",
  },
  {
    id: "swamp-statue",
    type: "inspect",
    name: "Затонувшая статуя",
    action: "Осмотреть",
    sourceX: 97,
    sourceY: 429,
    text: "Каменное лицо выступает из воды. Кто-то оставил здесь древний идол.",
  },
  {
    id: "swamp-remains",
    type: "inspect",
    name: "Останки путника",
    action: "Осмотреть",
    sourceX: 322,
    sourceY: 487,
    text: "Кости лежат прямо в воде. Рядом могут остаться полезные вещи.",
  },
  {
    id: "swamp-roots",
    type: "inspect",
    name: "Корни у топи",
    action: "Осмотреть",
    sourceX: 678,
    sourceY: 564,
    text: "Корни образуют естественное укрытие. Внутри что-то блеснуло.",
  },
  {
    id: "swamp-bridge",
    type: "move",
    name: "Гнилой мост",
    action: "Перейти",
    sourceX: 346,
    sourceY: 627,
    text: "Старый настил ещё держится и ведёт к другой части болота. Путь обнаружен.",
  },
];

function swampPointStyle(point) {
  return {
    left: `${(point.sourceX / SWAMP_ART_WIDTH) * 100}%`,
    top: `${(point.sourceY / SWAMP_ART_HEIGHT) * 100}%`,
  };
}

export default function LocationMapView({ location, worldState = {}, onOpenChest }) {
  const [selectedId, setSelectedId] = useState(null);
  const [dialogue, setDialogue] = useState("");
  const [swampArtStatus, setSwampArtStatus] = useState("loading");
  const swampPointerStart = useRef(null);
  const isField = ["field", "meadows"].includes(location.nodeId);
  const isSwamp = location.nodeId === "swamp";
  const openedChests = worldState.openedChests ?? [];
  const sceneObjects = isSwamp ? swampPoints : isField ? fieldObjects : [];
  const selectedObject = sceneObjects.find((object) => object.id === selectedId) ?? null;

  useEffect(() => {
    setSelectedId(null);
    setDialogue("");
    swampPointerStart.current = null;
    if (location.nodeId === "swamp") setSwampArtStatus("loading");
  }, [location.nodeId]);

  function handleObjectTap(objectId) {
    setSelectedId(objectId);
    setDialogue("");
  }

  function handleSwampPointerDown(event) {
    if (!isSwamp || swampArtStatus !== "ready") return;

    swampPointerStart.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  function handleSwampPointerUp(event) {
    if (!isSwamp || swampArtStatus !== "ready") return;

    const start = swampPointerStart.current;
    swampPointerStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;

    const movement = Math.hypot(event.clientX - start.clientX, event.clientY - start.clientY);
    if (movement > 18) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const sourceX = ((event.clientX - rect.left) / rect.width) * SWAMP_ART_WIDTH;
    const sourceY = ((event.clientY - rect.top) / rect.height) * SWAMP_ART_HEIGHT;

    let nearestPoint = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const point of swampPoints) {
      const distance = Math.hypot(sourceX - point.sourceX, sourceY - point.sourceY);
      if (distance < nearestDistance) {
        nearestPoint = point;
        nearestDistance = distance;
      }
    }

    if (nearestPoint && nearestDistance <= SWAMP_TAP_RADIUS) {
      handleObjectTap(nearestPoint.id);
    }
  }

  function handleSwampPointerCancel() {
    swampPointerStart.current = null;
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
          onPointerDown={isSwamp ? handleSwampPointerDown : undefined}
          onPointerUp={isSwamp ? handleSwampPointerUp : undefined}
          onPointerCancel={isSwamp ? handleSwampPointerCancel : undefined}
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
            <>
              <img
                className="map-art-image"
                src={swampLocationArt}
                alt="Болото"
                loading="eager"
                decoding="async"
                onLoad={() => setSwampArtStatus("ready")}
                onError={() => setSwampArtStatus("error")}
              />
              {swampArtStatus !== "ready" && (
                <div className="embedded-art-status" aria-live="polite">
                  {swampArtStatus === "error"
                    ? "Не удалось загрузить локацию"
                    : "Загрузка локации…"}
                </div>
              )}
            </>
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
            swampArtStatus === "ready" &&
            swampPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                className={`swamp-point ${selectedId === point.id ? "is-selected" : ""}`}
                style={swampPointStyle(point)}
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
                ? swampArtStatus === "ready"
                  ? "Нажмите на светящуюся точку на болоте, чтобы выбрать действие."
                  : "Дождитесь загрузки изображения болота."
                : "Нажмите на Странника или сундук на локации, чтобы выбрать взаимодействие."}
            </p>
          )}

          {dialogue && <p className="interaction-panel__dialogue">{dialogue}</p>}
        </div>
      )}
    </section>
  );
}
