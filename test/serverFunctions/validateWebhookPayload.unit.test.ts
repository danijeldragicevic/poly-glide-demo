import { describe, it, expect } from "vitest";
import { validateWebhookPayload } from "../../src/serverFunctions/validateWebhookPayload";

describe("validateWebhookPayload (unit tests)", () => {
    it("should return true for a valid payload", async () => {
        await expect(validateWebhookPayload({ latitude: 40.7143, longitude: -74.0060 })).resolves.toBe(true);
    });

    it("should return true for boundary latitude values", async () => {
        await expect(validateWebhookPayload({ latitude: -90, longitude: 0 })).resolves.toBe(true);
        await expect(validateWebhookPayload({ latitude: 90, longitude: 0 })).resolves.toBe(true);
    });

    it("should return true for boundary longitude values", async () => {
        await expect(validateWebhookPayload({ latitude: 0, longitude: -180 })).resolves.toBe(true);
        await expect(validateWebhookPayload({ latitude: 0, longitude: 180 })).resolves.toBe(true);
    });

    it("should reject when latitude is missing", async () => {
        await expect(validateWebhookPayload({ longitude: -74.0060 })).rejects.toMatchObject({
            message: "Invalid latitude. Expected a number between -90 and 90.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when longitude is missing", async () => {
        await expect(validateWebhookPayload({ latitude: 40.7143 })).rejects.toMatchObject({
            message: "Invalid longitude. Expected a number between -180 and 180.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when latitude is out of range", async () => {
        await expect(validateWebhookPayload({ latitude: 91, longitude: 0 })).rejects.toMatchObject({
            message: "Invalid latitude. Expected a number between -90 and 90.",
            statusCode: 400,
            statusText: "Bad Request",
        });
        await expect(validateWebhookPayload({ latitude: -91, longitude: 0 })).rejects.toMatchObject({
            message: "Invalid latitude. Expected a number between -90 and 90.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when longitude is out of range", async () => {
        await expect(validateWebhookPayload({ latitude: 0, longitude: 181 })).rejects.toMatchObject({
            message: "Invalid longitude. Expected a number between -180 and 180.",
            statusCode: 400,
            statusText: "Bad Request",
        });
        await expect(validateWebhookPayload({ latitude: 0, longitude: -181 })).rejects.toMatchObject({
            message: "Invalid longitude. Expected a number between -180 and 180.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when latitude is not a number", async () => {
        await expect(validateWebhookPayload({ latitude: "40.7143", longitude: -74.0060 })).rejects.toMatchObject({
            message: "Invalid latitude. Expected a number between -90 and 90.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when longitude is not a number", async () => {
        await expect(validateWebhookPayload({ latitude: 40.7143, longitude: "-74.0060" })).rejects.toMatchObject({
            message: "Invalid longitude. Expected a number between -180 and 180.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });
});
