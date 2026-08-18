import assert from "node:assert/strict";
import test from "node:test";
import { dedicatedLocationRegistry, getDedicatedLocation } from "../src/data/locationRegistry.js";
import { floorOneNavigation, getTravelRoute, START_NODE_ID } from "../src/data/worldNavigation.js";

const dedicatedNodeIds = ["forest", "ruins", "settlement", "dungeon"];

test("every unfinished map destination has its own dedicated location entry", () => {
  assert.deepEqual(Object.keys(dedicatedLocationRegistry), dedicatedNodeIds);

  for (const nodeId of dedicatedNodeIds) {
    const node = floorOneNavigation.nodes.find((item) => item.id === nodeId);
    const location = getDedicatedLocation(nodeId);

    assert.ok(node, `${nodeId} must exist on the world map`);
    assert.ok(location, `${nodeId} must have a dedicated location`);
    assert.equal(location.id, nodeId);
    assert.equal(location.title, node.name);
  }
});

test("dedicated locations remain reachable through the current travel graph", () => {
  for (const nodeId of dedicatedNodeIds) {
    const route = getTravelRoute(START_NODE_ID, nodeId);
    assert.ok(route, `${nodeId} must remain reachable`);
    assert.equal(route.to, nodeId);
  }
});

test("unknown nodes do not silently reuse another dedicated location", () => {
  assert.equal(getDedicatedLocation("unknown-location"), null);
});
