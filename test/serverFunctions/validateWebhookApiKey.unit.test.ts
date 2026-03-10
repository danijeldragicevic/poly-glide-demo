import { describe, it, expect, vi } from "vitest";
import { validateWebhookApiKey } from "../../src/serverFunctions/validateWebhookApiKey";

vi.mock("polyapi", () => ({
    vari: {
        demo: {
            DAILY_FORECAST_API_KEY: {
                get: vi.fn().mockResolvedValue("test-api-key"),
            },
        },
    },
}));

describe("validateWebhookApiKey (unit tests)", () => {
    it("should return true when the correct API key is provided", async () => {
        await expect(validateWebhookApiKey({}, { "x-api-key": "test-api-key" })).resolves.toBe(true);
    });

    it("should reject with 401 when x-api-key header is missing", async () => {
        await expect(validateWebhookApiKey({}, {})).rejects.toMatchObject({
            message: "API key is missing from the request headers.",
            statusCode: 401,
            statusText: "Unauthorized",
        });
    });

    it("should reject with 403 when an incorrect API key is provided", async () => {
        await expect(validateWebhookApiKey({}, { "x-api-key": "wrong-key" })).rejects.toMatchObject({
            message: "Invalid API key provided.",
            statusCode: 403,
            statusText: "Forbidden",
        });
    });
});
