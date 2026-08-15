import { useEffect, useMemo, useState } from "react";
import { worldMapArt } from "../data/assets.js";
import {
  START_NODE_ID,
  floorOneNavigation,
  getTravelNode,
  getTravelRoute,
} from "../data/worldNavigation.js";

export default function WorldMapView({ location, onTravel }) {
  const currentNode = getTravelNode(location.nodeId) ?? getTravelNode(START_NODE_ID);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isTraveling, setIsTraveling] = useState(false);

  const selectedNode = useMemo(() => getTravelNode(selectedNodeId), [selectedNodeId]);
  const route = useMemo(
    () => getTravelRoute(currentNode.id, selectedNode?.id),
    [currentNode.id, selectedNode?.id],
  );

  useEffect(() => {
    setSelectedNodeId(null);
    setIsTraveling(false);
  }, [currentNode.id]);

  const heroNode = isTraveling && selectedNode ? selectedNode : currentNode;

  function handleNodeTap(nodeId) {
    if (isTraveling) return;
    if (nodeId === currentNode.id) {
      setSelectedNodeId(null);
      return;
    }
    if (getTravelRoute(currentNode.id, nodeId)) {
      setSelectedNodeId(nodeId);
    }
  }

  function handleTravel() {
    if (!route || !selectedNode || isTraveling) return;

    setIsTraveling(true);
    window.setTimeout(() => {
      onTravel?.(selectedNode.id);
    }, route.travelMs);
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
          className="world-map world-map--reference world-map--travel map-art-shell"
          aria-label="Карта первого этажа. Нажмите на доступную точку, чтобы выбрать маршрут."
        >
          <div className="map-fallback" aria-hidden="true">
            <span className="world-fallback__land" />
          </div>

          <img
            className="map-art-image"
            src={worldMapArt}
            alt=""
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.style.display = "none";
            }}
          />

          <svg className="travel-network" viewBox="0 0 100 100" preserveAspectRatio="none">
            {floorOneNavigation.edges.map((edge) => {
              const from = getTravelNode(edge.from);
              const to = getTravelNode(edge.to);
              const active =
                route &&
                ((route.from === edge.from && route.to === edge.to) ||
                  (route.from === edge.to && route.to === edge.from));

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  className={`travel-network__edge ${active ? "is-active" : ""}`}
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
              className={`travel-node ${node.id === currentNode.id ? "is-current" : ""} ${
                node.id === selectedNodeId ? "is-selected" : ""
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => handleNodeTap(node.id)}
              aria-pressed={node.id === selectedNodeId}
            >
              <span className="travel-node__name">{node.name}</span>
            </button>
          ))}

          <div
            className={`travel-hero ${isTraveling ? "is-traveling" : ""}`}
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
            Нажмите на точку «Поле», чтобы построить первый маршрут из стартового города.
          </p>
        )}
      </div>
    </section>
  );
}
