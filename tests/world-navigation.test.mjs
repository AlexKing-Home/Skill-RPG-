import assert from "node:assert/strict";
import test from "node:test";
import {
  START_NODE_ID,
  floorOneNavigation,
  getTravelNode,
  getTravelRoute,
  locationFromNode,
} from "../src/data/worldNavigation.js";

test("first floor exposes every clickable map location", () => {
  assert.equal(floorOneNavigation.name, "Этаж 1");
  assert.deepEqual(
    floorOneNavigation.nodes.map((node) => node.name),
    ["Стартовый город", "Луга", "Лес", "Болото", "Руины", "Поселение", "Подземелье"],
  );
});

test("legacy field saves migrate to meadows", () => {
  assert.equal(getTravelNode("field")?.id, "meadows");
  assert.equal(locationFromNode("field").areaName, "Луга");
});

test("route finder builds multi-location paths", () => {
  const route = getTravelRoute(START_NODE_ID, "dungeon");

  assert.ok(route);
  assert.equal(route.from, START_NODE_ID);
  assert.equal(route.to, "dungeon");
  assert.equal(route.nodeIds[0], START_NODE_ID);
  assert.equal(route.nodeIds.at(-1), "dungeon");
  assert.ok(route.nodeIds.length >= 3);
  assert.ok(route.distanceKm > 0);
});

test("every floor location can be reached from the start city", () => {
  for (const node of floorOneNavigation.nodes) {
    if (node.id === START_NODE_ID) continue;
    assert.ok(getTravelRoute(START_NODE_ID, node.id), `${node.name} must be reachable`);
  }
});
