// Poly deployed @ 2026-02-24T11:33:41.586Z - demo.helloWorld - https://na1.polyapi.io/canopy/polyui/collections/server-functions/24d9bcbe-203c-443a-910b-4c2481fe1482 - 212c91c5
import type { PolyServerFunction } from "polyapi";

export const polyConfig: PolyServerFunction = {
  context: "demo",
  name: "helloWorld",
  description: "Return a friendly greeting.",
  visibility: "PUBLIC",
};

/**
 * Return a friendly greeting.
 * @returns {string} Greeting text.
 */
export function helloWorld(): string {
  return "Hello from Poly.";
}
