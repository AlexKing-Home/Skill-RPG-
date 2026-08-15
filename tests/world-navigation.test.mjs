import assert from "node:assert/strict";
import test from "node:test";
import {
  START_NODE_ID,
  floorOneNavigation,
  getTravelNode,
  getTravelRoute,
  locationFromNode,
} from "../src/data/worldNavigation.js";

test("first floor starts with city and field", () => {
  assert.equal(floorOneNavigation.name, "Этаж 1");
  assert.equal(getTravelNode(START_NODE_ID)?.name, "Стартовый город");
  assert.equal(getTravelNode("field")?.name, "Поле");
});

test("city and field are connected in both directions", () => {
  const outward = getTravelRoute(START_NODE_ID, "field");
  const returnRoute = getTravelRoute("field", START_NODE_ID);

  assert.ok(outward);
  assert.ok(returnRoute);
  assert.equal(outward.distanceKm, 1.2);
  assert.equal(returnRoute.distanceKm, 1.2);
  assert.equal(outward.to, "field");
  assert.equal(returnRoute.to, START_NODE_ID);
});

test("travel location is converted to persistent character location", () => {
  const field = locationFromNode("field");

  assert.deepEqual(field, {
    worldName: "Этаж 1",
    areaName: "Поле",
    nodeId: "field",
    x: 63,
    y: 39,
  });
});
