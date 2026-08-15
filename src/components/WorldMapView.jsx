import { useEffect, useMemo, useState } from "react";
import { floorOneMapArt } from "../data/floorOneMapArt.js";
import {
  START_NODE_ID,
  floorOneNavigation,
  getTravelNode,
  getTravelRoute,
} from "../data/worldNavigation.js";

export default function WorldMapView({ location, onTravel }) {
  const currentNode = getTravelNode(location.nodeId) ?? getTravelNode(START_NODE_ID);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [heroNodeId, setHeroNodeId] = useState(currentNode.id);
  const [isTraveling, setIsTraveling] = useState(false);

  const selectedNode = useMemo(() => getTravelNode(selectedNodeId), [selectedNodeId]);
  const heroNode = getTravelNode(heroNodeId) ?? currentNode;
  const route = useMemo(
    () => getTravelRoute(currentNode.id, selectedNode?.id),
    [currentNode.id, selectedNode?.id],
  );

  useEffect(() => {
    setSelectedNodeId(null);
    setHeroNodeId(currentNode.id);
    setIsTraveling(false);
  }, [currentNode.id]);

  function handleNodeTap(nodeId) {
    if (isTraveling) return;
    if (nodeId === currentNode.id) {
      setSelectedNodeId(null);
      return;
    }
    setSelectedNodeId(nodeId);
  }

  function handleTravel() {
    if (!route || !selectedNode || isTraveling) return;

    setIsTraveling(true);
    const steps = route.nodeIds.slice(1);

    function moveStep(index) {
      if (index >= steps.length) {
        onTravel?.(selectedNode.id);
        return;
      }

      setHeroNodeId(steps[index]);
      window.setTimeout(() => moveStep(index + 1), 650);
    }

    moveStep(0);
  }

  return (
    <section className="game-view" aria-labelledby="world-map-title">
      <div className="game-view__heading">
        <div>
          <span className="game-view__eyebrow">Местоположение героя</span>
          <h1 id="world-map-title">{location.worldName}</h1>
        </div>
        <span className="location-badge">
          <span aria-hidden="true">⌖</span>
          {location.areaName}
        </span>
      </div>

      <div className="map-frame map-frame--reference">
        <div
          className="world-map world-map--reference world-map--travel floor-map-art"
          aria-label="Карта первого этажа. Все отмеченные локации доступны для выбора."
        >
          <div className="map-fallback" aria-hidden="true">
            <span className="world-fallback__land" />
          </div>

          <img
            className="map-art-image"
            src={floorOneMapArt}
            alt="Карта первого этажа"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />

          <div className="swamp-replacement" aria-hidden="true">
            <span className="swamp-replacement__icon">♒</span>
            <strong>Болото</strong>
          </div>

          <svg className="travel-network" viewBox="0 0 100 100" preserveAspectRatio="none">
            {floorOneNavigation.edges.map((edge) => {
              const from = getTravelNode(edge.from);
              const to = getTravelNode(edge.to);
              const key = `${edge.from}-${edge.to}`;
              const active = route?.edgeKeys.includes(key);
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

          {floorOneNavigation.nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`map-hotspot ${node.id === currentNode.id ? "is-current" : ""} ${
                node.id === selectedNodeId ? "is-selected" : ""
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => handleNodeTap(node.id)}
              aria-label={`${node.name}${node.id === currentNode.id ? ", текущее местоположение" : ""}`}
              aria-pressed={node.id === selectedNodeId}
              disabled={isTraveling}
            >
              <span className="map-hotspot__ring" aria-hidden="true" />
            </button>
          ))}

          <div
            className={`travel-hero travel-hero--floor ${isTraveling ? "is-traveling" : ""}`}
            style={{ left: `${heroNode.x}%`, top: `${heroNode.y}%` }}
            aria-live="polite"
          >
            <span className="travel-hero__marker" aria-hidden="true">
              ◆
            </span>
            <strong className="travel-hero__label">{isTraveling ? "В пути" : "Вы здесь"}</strong>
          </div>
        </div>
      </div>

      <div className="travel-panel">
        {route && selectedNode ? (
          <div className="travel-panel__route">
            <div>
              <strong>
                {currentNode.name} → {selectedNode.name}
              </strong>
              <span>
                Путь: {route.nodeIds.map((nodeId) => getTravelNode(nodeId)?.name).join(" → ")}
              </span>
              <span>Расстояние: {route.distanceKm.toFixed(1)} км</span>
            </div>
            <button
              type="button"
              className="travel-panel__button"
              onClick={handleTravel}
              disabled={isTraveling}
            >
              {isTraveling ? "Идём..." : "Отправиться"}
            </button>
          </div>
        ) : (
          <p className="travel-panel__hint">
            Нажмите на любую локацию на карте: Стартовый город, Луга, Лес, Болото, Руины, Поселение
            или Подземелье.
          </p>
        )}
      </div>
    </section>
  );
}
