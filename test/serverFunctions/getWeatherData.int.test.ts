import { describe, it, expect, vi } from "vitest";
import { getWeatherData } from "../../src/serverFunctions/getWeatherData";

vi.mock("polyapi", () => ({
  vari: {
    demo: {
      OPEN_METEO_BASE_URL: {
        get: vi.fn().mockResolvedValue("https://api.open-meteo.com/v1/forecast"), // Need to use real API URL for integration test
      },
    },
  },
}));

describe("getWeatherData (integration test)", () => {
  it("connects to Open-Meteo API and fetches weather data", async () => {
    const result = await getWeatherData(44.00299, 18.010437);
    const receivedLatitude = result.latitude.toFixed(5);
    const receivedLongitude = result.longitude.toFixed(5);
    
    expect(receivedLatitude).toBe("44.00299");
    expect(receivedLongitude).toBe("18.01044");
    expect(result.data).toHaveProperty("temperature");
    expect(result.data).toHaveProperty("humidity");
    expect(result.data).toHaveProperty("rain");
  },
  20_000); // Timeout of 20 seconds
});
