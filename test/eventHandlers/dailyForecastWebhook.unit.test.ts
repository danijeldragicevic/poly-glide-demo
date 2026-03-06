import { describe, it, expect } from "vitest";
import { polyConfig } from "../../src/eventHandlers/dailyForecastWebhook";

describe("dailyForecastWebhook (unit tests)", () => {
    it("should have the correct polyConfig identity", () => {
        expect(polyConfig.context).toBe("demo");
        expect(polyConfig.name).toBe("dailyForecastWebhook");
        expect(polyConfig.method).toBe("POST");
        expect(polyConfig.visibility).toBe("TENANT");
    });

    it("should define an eventPayloadTypeSchema (not eventPayload)", () => {
        expect(polyConfig).not.toHaveProperty("eventPayload");
        expect(polyConfig.eventPayloadTypeSchema).toBeDefined();
    });

    it("should require latitude and longitude in the event payload schema", () => {
        const schema = polyConfig.eventPayloadTypeSchema as Record<string, any>;
        expect(schema.type).toBe("object");
        expect(schema.required).toContain("latitude");
        expect(schema.required).toContain("longitude");
        expect(schema.properties.latitude.type).toBe("number");
        expect(schema.properties.longitude.type).toBe("number");
    });

    it("should return a 200 response with a JSON content-type", () => {
        expect(polyConfig.responseStatus).toBe(200);
        expect(polyConfig.responseHeaders["Content-Type"]).toBe("application/json");
        expect(polyConfig.responsePayload).toBeDefined();
    });
});
