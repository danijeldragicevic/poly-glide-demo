const POLY_INSTANCE_URL = process.env.POLY_INSTANCE_URL?.replace(/\/$/, "");
const POLY_API_KEY = process.env.POLY_API_KEY;

if (!POLY_INSTANCE_URL) throw new Error("Missing required environment variable: POLY_INSTANCE_URL");
if (!POLY_API_KEY) throw new Error("Missing required environment variable: POLY_API_KEY");

const WEBHOOK_CONTEXT = "demo";
const WEBHOOK_NAME = "dailyForecastWebhook";

const SERVER_FUNCTION_CONTEXT = "demo";
const SERVER_FUNCTION_NAME = "getDailyForecast";

const TRIGGER_NAME = "dailyForecastTrigger";

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function buildHeaders() {
    return {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${POLY_API_KEY}`,
        "x-poly-api-version": "1",
    };
}

async function getJson(path: string) {
    const response = await fetch(`${POLY_INSTANCE_URL}${path}`, {
        headers: buildHeaders(),
    });
    if (!response.ok) {
        throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function postJson(path: string, body: object) {
    const response = await fetch(`${POLY_INSTANCE_URL}${path}`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`POST ${path} failed: ${response.status} ${response.statusText} — ${text}`);
    }
    return response.json();
}

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

async function findWebhook() {
    const webhooks = await getJson("/webhooks");
    const webhook = webhooks.find(
        (w: any) => w.context === WEBHOOK_CONTEXT && w.name === WEBHOOK_NAME,
    );
    if (!webhook) {
        throw new Error(`Webhook '${WEBHOOK_CONTEXT}.${WEBHOOK_NAME}' not found. Deploy the webhook first.`);
    }
    return webhook;
}

async function findServerFunction() {
    const serverFunctions = await getJson("/functions/server");
    const serverFunction = serverFunctions.find(
        (sf: any) => sf.context === SERVER_FUNCTION_CONTEXT && sf.name === SERVER_FUNCTION_NAME,
    );
    if (!serverFunction) {
        throw new Error(`Server function '${SERVER_FUNCTION_CONTEXT}.${SERVER_FUNCTION_NAME}' not found. Deploy the server function first.`);
    }
    return serverFunction;
}

async function findExistingTrigger() {
    const triggers = await getJson("/triggers");
    return triggers.find((t: any) => t.name === TRIGGER_NAME) ?? null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function createDailyForecastTrigger() {
    const webhook = await findWebhook();
    const serverFunction = await findServerFunction();

    const existingTrigger = await findExistingTrigger();
    if (existingTrigger) {
        console.log(`Trigger '${TRIGGER_NAME}' already exists (id: ${existingTrigger.id}). Skipping creation.`);
        return existingTrigger;
    }

    const createdTrigger = await postJson("/triggers", {
        name: TRIGGER_NAME,
        source: {
            webhookHandleId: webhook.id,
        },
        destination: {
            serverFunctionId: serverFunction.id,
        },
        waitForResponse: false,
        enabled: true,
    });
    console.log(`Trigger '${TRIGGER_NAME}' created successfully (id: ${createdTrigger.id}).`);
    return createdTrigger;
}

// Runs automatically when this file is executed directly (e.g. ts-node or npm run setup:trigger)
createDailyForecastTrigger().catch((error: Error) => {
    console.error("Failed to create trigger:", error.message ?? error);
    process.exit(1);
});
