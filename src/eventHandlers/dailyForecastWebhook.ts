import poly, { PolyWebhook } from "polyapi";

// const functionPath = poly.demo.validateForecastPayload.name;

const { functions } = require("../.poly/lib/server/functions.js");
const validateForecastPayload_Id = functions.find(([path]: [string]) => path === "demo.validateForecastPayload")?.[1];


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
            id: validateForecastPayload_Id
        },
    ],
};
