import assert from "node:assert/strict";
import test from "node:test";
import { dedicatedLocationRegistry, getDedicatedLocation } from "../src/data/locationRegistry.js";
import { floorOneNavigation, getTravelRoute, START_NODE_ID } from "../src/data/worldNavigation.js";

const unfinishedNodeIds = ["forest"];
const completedNodeIds = ["ruins", "settlement", "dungeon"];

test("only unfinished map destinations stay in the placeholder registry", () => {
  assert.deepEqual(Object.keys(dedicatedLocationRegistry), unfinishedNodeIds);

  for (const nodeId of unfinishedNodeIds) {
    const node = floorOneNavigation.nodes.find((item) => item.id === nodeId);
    const location = getDedicatedLocation(nodeId);

    assert.ok(node, `${nodeId} must exist on the world map`);
    assert.ok(location, `${nodeId} must have a placeholder location`);
    assert.equal(location.id, nodeId);
    assert.equal(location.title, node.name);
  }
});

test("completed dedicated locations do not silently fall back to placeholders", () => {
  for (const nodeId of completedNodeIds) assert.equal(getDedicatedLocation(nodeId), null);
});

test("unfinished locations remain reachable through the current travel graph", () => {
  for (const nodeId of unfinishedNodeIds) {
    const route = getTravelRoute(START_NODE_ID, nodeId);
    assert.ok(route, `${nodeId} must remain reachable`);
    assert.equal(route.to, nodeId);
  }
});

test("unknown nodes do not silently reuse another dedicated location", () => {
  assert.equal(getDedicatedLocation("unknown-location"), null);
});
