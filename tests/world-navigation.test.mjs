import assert from "node:assert/strict";
import test from "node:test";
import {
  CITY_NODE_ID,
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

test("hero starts on the swamp, not in the start city", () => {
  assert.equal(START_NODE_ID, "swamp");
  assert.equal(locationFromNode(START_NODE_ID).areaName, "Болото");
  assert.equal(getTravelNode(CITY_NODE_ID)?.name, "Стартовый город");
});

test("every visible map node has a generous responsive tap area", () => {
  for (const node of floorOneNavigation.nodes) {
    assert.ok(node.hitbox, `${node.name} must define a hitbox`);
    assert.ok(node.hitbox.width >= 20, `${node.name} tap width must be at least 20%`);
    assert.ok(node.hitbox.height >= 17, `${node.name} tap height must be at least 17%`);
  }
});

test("swamp can travel to the start city", () => {
  const route = getTravelRoute(START_NODE_ID, CITY_NODE_ID);

  assert.ok(route);
  assert.equal(route.from, START_NODE_ID);
  assert.equal(route.to, CITY_NODE_ID);
  assert.equal(route.nodeIds[0], START_NODE_ID);
  assert.equal(route.nodeIds.at(-1), CITY_NODE_ID);
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
  assert.ok(route.nodeIds.length >= 2);
  assert.ok(route.distanceKm > 0);
});

test("every floor location can be reached from the swamp start", () => {
  for (const node of floorOneNavigation.nodes) {
    if (node.id === START_NODE_ID) continue;
    assert.ok(getTravelRoute(START_NODE_ID, node.id), `${node.name} must be reachable`);
  }
});
