import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "validateWebhookPayload",
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
export function validateWebhookPayload(eventPayload: { latitude?: unknown; longitude?: unknown }): Promise<boolean> { 
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
