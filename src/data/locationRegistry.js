export const dedicatedLocationRegistry = {};

export function getDedicatedLocation(nodeId) {
  return dedicatedLocationRegistry[nodeId] ?? null;
}
