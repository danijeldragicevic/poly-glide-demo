import { beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
    process.env.POLY_INSTANCE_URL = "https://na1.polyapi.io";
    process.env.POLY_API_KEY = "test-api-key";
});

import { createDailyForecastTrigger } from "../../src/triggers/dailyForecastTrigger";
import triggerConfig from "../../src/triggers/dailyForecastTrigger.config.json";

const MOCK_WEBHOOK = {
    id: "webhook-id-123",
    name: triggerConfig.source.webhookName,
    context: triggerConfig.source.webhookContext,
};

const MOCK_SERVER_FUNCTION = {
    id: "server-function-id-456",
    name: triggerConfig.destination.serverFunctionName,
    context: triggerConfig.destination.serverFunctionContext,
};

const MOCK_CREATED_TRIGGER = {
    id: "new-trigger-id-789",
    name: triggerConfig.name,
    waitForResponse: triggerConfig.waitForResponse,
    enabled: triggerConfig.enabled,
};

const MOCK_EXISTING_TRIGGER = {
    id: "existing-trigger-id-101",
    name: triggerConfig.name,
    waitForResponse: false,
    enabled: false,
};

const MOCK_UPDATED_TRIGGER = {
    ...MOCK_EXISTING_TRIGGER,
    waitForResponse: triggerConfig.waitForResponse,
    enabled: triggerConfig.enabled,
};

function mockFetchSequence(...responses: object[]) {
    let callIndex = 0;
    vi.stubGlobal("fetch", vi.fn(async () => {
        const body = responses[callIndex++];
        return {
            ok: true,
            json: async () => body,
        };
    }));
}

describe("createDailyForecastTrigger (unit tests)", () => {
    beforeEach(() => {
        vi.unstubAllGlobals();
    });

    it("should POST and create the trigger when it does not exist yet", async () => {
        // GET /webhooks → GET /functions/server → GET /triggers → POST /triggers
        mockFetchSequence(
            [MOCK_WEBHOOK],
            [MOCK_SERVER_FUNCTION],
            [],                  // no existing triggers
            MOCK_CREATED_TRIGGER,
        );

        const result = await createDailyForecastTrigger();

        const fetchMock = vi.mocked(fetch);
        expect(fetchMock).toHaveBeenCalledTimes(4);

        // Verify the POST call used the resolved IDs from the webhook and server function
        const postCall = fetchMock.mock.calls[3];
        const postBody = JSON.parse(postCall[1]!.body as string);
        expect(postBody.name).toBe(triggerConfig.name);
        expect(postBody.source.webhookHandleId).toBe(MOCK_WEBHOOK.id);
        expect(postBody.destination.serverFunctionId).toBe(MOCK_SERVER_FUNCTION.id);
        expect(postBody.waitForResponse).toBe(triggerConfig.waitForResponse);
        expect(postBody.enabled).toBe(triggerConfig.enabled);

        expect(result.id).toBe(MOCK_CREATED_TRIGGER.id);
    });

    it("should PATCH the trigger when it already exists", async () => {
        // GET /webhooks → GET /functions/server → GET /triggers → PATCH /triggers/:id
        mockFetchSequence(
            [MOCK_WEBHOOK],
            [MOCK_SERVER_FUNCTION],
            [MOCK_EXISTING_TRIGGER],
            MOCK_UPDATED_TRIGGER,
        );

        const result = await createDailyForecastTrigger();

        const fetchMock = vi.mocked(fetch);
        expect(fetchMock).toHaveBeenCalledTimes(4);

        // Verify PATCH was called on the correct trigger ID
        const patchCall = fetchMock.mock.calls[3];
        expect(patchCall[0]).toContain(MOCK_EXISTING_TRIGGER.id);
        expect(patchCall[1]!.method).toBe("PATCH");

        const patchBody = JSON.parse(patchCall[1]!.body as string);
        expect(patchBody.name).toBe(triggerConfig.name);
        expect(patchBody.waitForResponse).toBe(triggerConfig.waitForResponse);
        expect(patchBody.enabled).toBe(triggerConfig.enabled);
        // source/destination must NOT be sent in a PATCH
        expect(patchBody).not.toHaveProperty("source");
        expect(patchBody).not.toHaveProperty("destination");

        expect(result.id).toBe(MOCK_EXISTING_TRIGGER.id);
    });

    it("should throw if the webhook is not found", async () => {
        mockFetchSequence(
            [],  // empty webhook list
        );

        await expect(createDailyForecastTrigger()).rejects.toThrow(
            `Webhook '${triggerConfig.source.webhookContext}.${triggerConfig.source.webhookName}' not found`,
        );
    });

    it("should throw if the server function is not found", async () => {
        mockFetchSequence(
            [MOCK_WEBHOOK],
            [],  // empty server function list
        );

        await expect(createDailyForecastTrigger()).rejects.toThrow(
            `Server function '${triggerConfig.destination.serverFunctionContext}.${triggerConfig.destination.serverFunctionName}' not found`,
        );
    });

    it("should throw if the POST request fails", async () => {
        vi.stubGlobal("fetch", vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => [MOCK_WEBHOOK] })
            .mockResolvedValueOnce({ ok: true, json: async () => [MOCK_SERVER_FUNCTION] })
            .mockResolvedValueOnce({ ok: true, json: async () => [] })
            .mockResolvedValueOnce({ ok: false, status: 400, statusText: "Bad Request", text: async () => "Invalid payload" }),
        );

        await expect(createDailyForecastTrigger()).rejects.toThrow("POST /triggers failed: 400 Bad Request");
    });

    it("should throw if the PATCH request fails", async () => {
        vi.stubGlobal("fetch", vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => [MOCK_WEBHOOK] })
            .mockResolvedValueOnce({ ok: true, json: async () => [MOCK_SERVER_FUNCTION] })
            .mockResolvedValueOnce({ ok: true, json: async () => [MOCK_EXISTING_TRIGGER] })
            .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Internal Server Error", text: async () => "Server error" }),
        );

        await expect(createDailyForecastTrigger()).rejects.toThrow(`PATCH /triggers/${MOCK_EXISTING_TRIGGER.id} failed: 500 Internal Server Error`);
    });
});
