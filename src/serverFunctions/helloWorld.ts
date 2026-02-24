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
