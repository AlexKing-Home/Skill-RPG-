import assert from "node:assert/strict";
import test from "node:test";
import { dedicatedLocationRegistry, getDedicatedLocation } from "../src/data/locationRegistry.js";
import { floorOneNavigation, getTravelRoute, START_NODE_ID } from "../src/data/worldNavigation.js";

const unfinishedNodeIds = [];
const completedNodeIds = ["forest", "ruins", "settlement", "dungeon"];

test("only unfinished map destinations stay in the placeholder registry", () => {
  assert.deepEqual(Object.keys(dedicatedLocationRegistry), unfinishedNodeIds);
});

test("completed dedicated locations do not silently fall back to placeholders", () => {
  for (const nodeId of completedNodeIds) assert.equal(getDedicatedLocation(nodeId), null);
});

test("completed forest remains reachable through the current travel graph", () => {
  const node = floorOneNavigation.nodes.find((item) => item.id === "forest");
  const route = getTravelRoute(START_NODE_ID, "forest");

  assert.ok(node, "forest must exist on the world map");
  assert.ok(route, "forest must remain reachable");
  assert.equal(route.to, "forest");
});

test("unknown nodes do not silently reuse another dedicated location", () => {
  assert.equal(getDedicatedLocation("unknown-location"), null);
});
