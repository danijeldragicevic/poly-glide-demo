// Poly deployed @ 2026-03-09T12:12:34.066Z - demo.validateWebhookApiKey - https://na1.polyapi.io/canopy/polyui/collections/server-functions/03640129-21e1-4801-828f-f03e09a46619 - 30626f30
import { PolyServerFunction, vari } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "validateWebhookApiKey",
    description: "Validates the API key provided in the webhook request headers.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: false
};

/**
 * Validates the API key provided in the webhook request headers.
 * @param {{}} eventPayload - The webhook request body/payload associated with the inbound event. Included for context and signature parity with other webhook validators, though API-key validation is performed using the headers.
 * @param {{ [key: string]: string }} eventHeaders - A key/value map of HTTP request headers from the inbound webhook call. Must include the `x-api-key` header, which is validated against the expected tenant API key; missing `x-api-key` results in 401 Unauthorized and an invalid key results in 403 Forbidden.
 * @returns {Promise<boolean>} 
 */
export async function validateWebhookApiKey(eventPayload: {}, eventHeaders: { [key: string]: string }): Promise<boolean> {
    const expectedApiKey = await vari.demo.DAILY_FORECAST_API_KEY.get()
    const apiKey = eventHeaders["x-api-key"];

    console.log("Validating API key:", { apiKey, expectedApiKey });

    if (!apiKey) {
        return Promise.reject({
            message: "API key is missing from the request headers.",
            statusCode: 401,
            statusText: "Unauthorized",
        });
    }

    if (apiKey !== expectedApiKey) {
        return Promise.reject({
            message: "Invalid API key provided.",
            statusCode: 403,
            statusText: "Forbidden",
        });
    }

    return Promise.resolve(true);
}
