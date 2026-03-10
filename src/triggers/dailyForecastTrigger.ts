import poly from "polyapi";

const INSTANCE_URL = process.env.POLY_API_BASE_URL_PROD!;
const API_KEY = process.env.POLY_API_KEY_PROD!;

const WEBHOOK_CONTEXT = "demo";
const WEBHOOK_NAME = "dailyForecastWebhook";

const SERVER_FUNCTION_CONTEXT = "demo";
const SERVER_FUNCTION_NAME = "getDailyForecast";

const TRIGGER_NAME = "demo.dailyForecastTrigger";

export async function createDailyForecastTrigger() {
    // Resolve webhook ID by context + name
    const webhooksResponse = await poly.OOB.polyapi.webhooks.list(INSTANCE_URL, API_KEY);
    const webhook = webhooksResponse.data.find(
        (w) => w.context === WEBHOOK_CONTEXT && w.name === WEBHOOK_NAME,
    );
    if (!webhook) {
        throw new Error(
            `Webhook '${WEBHOOK_CONTEXT}.${WEBHOOK_NAME}' not found. Deploy the webhook first.`,
        );
    }

    // Resolve server function ID by context + name
    const serverFunctionsResponse = await poly.OOB.polyapi.v2.serverFunctions.list(
        INSTANCE_URL,
        API_KEY,
        undefined,
        `${SERVER_FUNCTION_CONTEXT}.${SERVER_FUNCTION_NAME}`,
    );
    const serverFunction = serverFunctionsResponse.data.results.find(
        (sf) => sf.context === SERVER_FUNCTION_CONTEXT && sf.name === SERVER_FUNCTION_NAME,
    );
    if (!serverFunction) {
        throw new Error(
            `Server function '${SERVER_FUNCTION_CONTEXT}.${SERVER_FUNCTION_NAME}' not found. Deploy the server function first.`,
        );
    }

    // Check if the trigger already exists (idempotent)
    const triggersResponse = await poly.OOB.polyapi.v2.triggers.list(
        INSTANCE_URL,
        API_KEY,
        TRIGGER_NAME,
    );
    const existingTrigger = triggersResponse.data.results.find((t) => t.name === TRIGGER_NAME);
    if (existingTrigger) {
        console.log(`Trigger '${TRIGGER_NAME}' already exists (id: ${existingTrigger.id}). Skipping creation.`);
        return existingTrigger;
    }

    // Create the trigger
    const createResponse = await poly.OOB.polyapi.v2.triggers.create(INSTANCE_URL, API_KEY, {
        name: TRIGGER_NAME,
        webhookHandleId: webhook.id,
        serverFunctionId: serverFunction.id,
        waitForResponse: false,
        enabled: true,
    });
    console.log(`Trigger '${TRIGGER_NAME}' created successfully (id: ${createResponse.data.id}).`);
    return createResponse.data;
}

// Runs automatically when this file is executed directly (e.g. ts-node or npm run setup:trigger)
createDailyForecastTrigger().catch((error) => {
    console.error("Failed to create trigger:", error.message ?? error);
    process.exit(1);
});
