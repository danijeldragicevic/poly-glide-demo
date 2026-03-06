// Poly deployed @ 2026-03-06T10:41:32.139Z - demo.validateForecastPayload - https://na1.polyapi.io/canopy/polyui/collections/server-functions/542f57f8-4d2d-43e8-8d82-014a6fe76e25 - 44f4f17e
import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "validateForecastPayload",
    description: "Validates the payload for the daily forecast webhook.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: false,
};

/**
 * Validates the payload for the daily forecast webhook.
 * @param {{ latitude?: unknown; longitude?: unknown }} event - Webhook request payload object containing the fields to validate.
 * @returns {Promise<boolean>}
 */
export function validateForecastPayload(event: { latitude?: unknown; longitude?: unknown }): Promise<boolean> {
    const { latitude, longitude } = event;

    if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
        const error = new Error(`Invalid latitude. Expected a number between -90 and 90.`);
        (error as any).status = 400;
        (error as any).statusText = "Bad Request";
        throw error;
    }

    if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
        const error = new Error(`Invalid longitude. Expected a number between -180 and 180.`);
        (error as any).status = 400;
        (error as any).statusText = "Bad Request";
        throw error;
    }

    return Promise.resolve(true);
}

// Example usage
validateForecastPayload({ latitude: null, longitude: -74.006 })
    .then(() => console.log("Payload is valid."))
    .catch((error) => console.error("Payload validation failed:", error));
