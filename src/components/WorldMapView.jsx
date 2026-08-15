import { useEffect, useMemo, useRef, useState } from "react";
import { floorOneMapArt } from "../data/floorOneMapArt.js";
import {
  START_NODE_ID,
  floorOneNavigation,
  getTravelNode,
  getTravelRoute,
} from "../data/worldNavigation.js";

const TAP_MOVE_TOLERANCE = 18;

export default function WorldMapView({ location, onTravel }) {
  const currentNode = getTravelNode(location.nodeId) ?? getTravelNode(START_NODE_ID);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [heroNodeId, setHeroNodeId] = useState(currentNode.id);
  const [activeRoute, setActiveRoute] = useState(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const pointerStartRef = useRef(null);
  const mapImageRef = useRef(null);

  const selectedNode = useMemo(() => getTravelNode(selectedNodeId), [selectedNodeId]);
  const heroNode = getTravelNode(heroNodeId) ?? currentNode;

  useEffect(() => {
    setSelectedNodeId(null);
    setHeroNodeId(currentNode.id);
    setActiveRoute(null);
    setIsTraveling(false);
    pointerStartRef.current = null;
  }, [currentNode.id]);

  useEffect(() => {
    const image = mapImageRef.current;
    if (!image) return undefined;

    let cancelled = false;
    let frameId = null;

    const revealMap = async () => {
      try {
        if (typeof image.decode === "function") await image.decode();
      } catch {
        // The load event is enough if decode is not available or rejects.
      }

      if (cancelled) return;
      frameId = window.requestAnimationFrame(() => {
        if (!cancelled) setIsMapReady(true);
      });
    };

    if (image.complete && image.naturalWidth > 0) {
      revealMap();
    } else {
      image.addEventListener("load", revealMap, { once: true });
    }

    return () => {
      cancelled = true;
      image.removeEventListener("load", revealMap);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  function travelTo(nodeId) {
    if (!isMapReady || isTraveling || nodeId === currentNode.id) return;

    const destination = getTravelNode(nodeId);
    const route = getTravelRoute(currentNode.id, nodeId);
    if (!destination || !route) return;

    setSelectedNodeId(nodeId);
    setActiveRoute(route);
    setIsTraveling(true);

    const steps = route.nodeIds.slice(1);

    function moveStep(index) {
      if (index >= steps.length) {
        onTravel?.(destination.id);
        return;
      }

      setHeroNodeId(steps[index]);
      window.setTimeout(() => moveStep(index + 1), 650);
    }

    moveStep(0);
  }

  function handlePointerDown(event, nodeId) {
    if (!isMapReady || isTraveling || nodeId === currentNode.id) return;

    pointerStartRef.current = {
      pointerId: event.pointerId,
      nodeId,
      x: event.clientX,
      y: event.clientY,
    };

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional; tap still works without it.
    }
  }

  function handlePointerUp(event, nodeId) {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start || start.pointerId !== event.pointerId || start.nodeId !== nodeId) return;

    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (moved > TAP_MOVE_TOLERANCE) return;

    event.preventDefault();
    travelTo(nodeId);
  }

  function handleKeyboardClick(event, nodeId) {
    if (event.detail === 0) travelTo(nodeId);
  }

  return (
    <section className="game-view" aria-labelledby="world-map-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Местоположение героя</span>
          <h1 id="world-map-title">Текущая местность</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          {location.areaName}
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className={`world-map world-map--reference world-map--travel floor-map-art ${
            isMapReady ? "is-map-ready" : "is-map-loading"
          }`}
          aria-label="Карта первого этажа. Нажмите на название или метку локации для перемещения."
        >
          <img
            ref={mapImageRef}
            className={`map-art-image ${isMapReady ? "is-ready" : ""}`}
            src={floorOneMapArt}
            alt="Карта первого этажа"
            loading="eager"
            decoding="sync"
            onLoad={() => {
              if (mapImageRef.current?.complete) setIsMapReady(true);
            }}
          />

          {!isMapReady && (
            <div className="floor-map-loading" role="status" aria-live="polite">
              <span className="floor-map-loading__spinner" aria-hidden="true" />
              <strong>Загрузка карты…</strong>
            </div>
          )}

          {isMapReady && (
            <>
              <div className="swamp-replacement" aria-hidden="true">
                <span className="swamp-replacement__icon">♒</span>
                <strong>Болото</strong>
              </div>

              <svg className="travel-network" viewBox="0 0 100 100" preserveAspectRatio="none">
                {floorOneNavigation.edges.map((edge) => {
                  const from = getTravelNode(edge.from);
                  const to = getTravelNode(edge.to);
                  const key = `${edge.from}-${edge.to}`;
                  const active = activeRoute?.edgeKeys.includes(key);
                  if (!active) return null;

                  return (
                    <line
                      key={key}
                      className="travel-network__edge is-active"
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                    />
                  );
                })}
              </svg>

              {floorOneNavigation.nodes.map((node) => {
                const hitbox = node.hitbox ?? {
                  x: node.x,
                  y: node.y,
                  width: 20,
                  height: 16,
                };

                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`map-hotspot map-hotspot--${node.kind} ${
                      node.id === currentNode.id ? "is-current" : ""
                    } ${node.id === selectedNodeId ? "is-selected" : ""}`}
                    style={{
                      left: `${hitbox.x}%`,
                      top: `${hitbox.y}%`,
                      width: `${hitbox.width}%`,
                      height: `${hitbox.height}%`,
                    }}
                    onPointerDown={(event) => handlePointerDown(event, node.id)}
                    onPointerUp={(event) => handlePointerUp(event, node.id)}
                    onPointerCancel={() => {
                      pointerStartRef.current = null;
                    }}
                    onClick={(event) => handleKeyboardClick(event, node.id)}
                    aria-label={`${node.name}${node.id === currentNode.id ? ", текущее местоположение" : ", перейти"}`}
                    disabled={isTraveling || node.id === currentNode.id}
                  >
                    <span
                      className="map-hotspot__ring"
                      style={{
                        left: `${((node.x - (hitbox.x - hitbox.width / 2)) / hitbox.width) * 100}%`,
                        top: `${((node.y - (hitbox.y - hitbox.height / 2)) / hitbox.height) * 100}%`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="map-hotspot__sr-label">{node.name}</span>
                  </button>
                );
              })}

              <div
                className={`travel-hero travel-hero--floor ${isTraveling ? "is-traveling" : ""}`}
                style={{ left: `${heroNode.x}%`, top: `${heroNode.y}%` }}
                aria-live="polite"
              >
                <span className="travel-hero__marker" aria-hidden="true">
                  ◆
                </span>
                <strong className="travel-hero__label">
                  {isTraveling ? "В пути" : "Вы здесь"}
                </strong>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="travel-panel" aria-live="polite">
        {!isMapReady ? (
          <p className="travel-panel__hint">Карта подготавливается к отображению…</p>
        ) : activeRoute && selectedNode ? (
          <div className="travel-panel__route">
            <div>
              <strong>
                {currentNode.name} → {selectedNode.name}
              </strong>
              <span>
                Путь: {activeRoute.nodeIds.map((nodeId) => getTravelNode(nodeId)?.name).join(" → ")}
              </span>
              <span>Расстояние: {activeRoute.distanceKm.toFixed(1)} км</span>
            </div>
            <span className="travel-panel__status">
              {isTraveling ? "Перемещение..." : "Прибытие"}
            </span>
          </div>
        ) : (
          <p className="travel-panel__hint">
            Тапните по значку, точке или названию нужной локации — вся область вокруг подписи
            кликабельна.
          </p>
        )}
      </div>
    </section>
  );
}
