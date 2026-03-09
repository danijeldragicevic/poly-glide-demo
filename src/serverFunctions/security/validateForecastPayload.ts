// Poly deployed @ 2026-03-06T14:19:37.752Z - demo.validateForecastPayload - https://na1.polyapi.io/canopy/polyui/collections/server-functions/542f57f8-4d2d-43e8-8d82-014a6fe76e25 - 44f4f17e
import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "validateForecastPayload",
    description: "Validates the payload for the daily forecast webhook.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: false
};

/**
 * Validates the payload for the daily forecast webhook.
 * @param {{ latitude?: unknown; longitude?: unknown }} eventPayload - Webhook request payload object containing the fields to validate.
 * @returns {Promise<boolean>} 
 */
export function validateForecastPayload(eventPayload: { latitude?: unknown; longitude?: unknown }): Promise<boolean> { 
    const { latitude, longitude } = eventPayload;

    if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
        return Promise.reject({
            message: "Invalid latitude. Expected a number between -90 and 90.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    }

    if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
        return Promise.reject({
            message: "Invalid longitude. Expected a number between -180 and 180.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    }
    
    return Promise.resolve(true);
}
