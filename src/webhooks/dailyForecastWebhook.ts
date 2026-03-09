import { PolyWebhook } from "polyapi";

// PolyAPI configuration
export const polyConfig: PolyWebhook = {
    context: "demo",
    name: "dailyForecastWebhook",
    description: "Receives a latitude and longitude and emits an event to trigger the daily weather forecast.",
    visibility: "TENANT",
    method: "POST",
    subpath: "daily-forecast",
    slug: "devdan",
    eventPayloadTypeSchema: {
        type: "object",
        properties: {
            latitude: {
                type: "number",
                description: "Geographic latitude of the location, in decimal degrees (between -90 and 90).",
            },
            longitude: {
                type: "number",
                description: "Geographic longitude of the location, in decimal degrees (between -180 and 180).",
            },
        },
        required: ["latitude", "longitude"],
    },
    responseStatus: 200,
    responsePayload: { message: "Webhook received." },
    responseHeaders: {
        "Content-Type": "application/json",
    },
    xmlParserOptions: {
        enabled: false,
        explicitArray: false,
        trim: false,
        normalizeTags: false,
    },
    securityFunctions: [
        {
            id: "542f57f8-4d2d-43e8-8d82-014a6fe76e25"
        },
        {
            id: "03640129-21e1-4801-828f-f03e09a46619"
        }
    ]
};
