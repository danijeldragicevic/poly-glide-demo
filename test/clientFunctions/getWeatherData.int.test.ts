import { describe, it, expect, vi } from "vitest";
import { getWeatherData } from "../../src/clientFunctions/getWeatherData";

vi.mock("polyapi", () => ({
  vari: {
    demo: {
      OPEN_METEO_BASE_URL: {
        get: vi.fn().mockResolvedValue("https://api.open-meteo.com/v1/forecast")
      }
    }
  }
}));

describe("getWeatherData (integration test)", () => {
  it("connects to Open-Meteo API and fetches weather data", async () => {
    const result = await getWeatherData(40.7143, -74.0060);
    const receivedLatitude = result.latitude.toFixed(4);
    const receivedLongitude = result.longitude.toFixed(4);
    
    expect(receivedLatitude).toBe("40.7143");
    expect(receivedLongitude).toBe("-74.0060");
    expect(result.data).toHaveProperty("time");
    expect(result.data).toHaveProperty("temperature");
    expect(result.data).toHaveProperty("humidity");
    expect(result.data).toHaveProperty("rain");
  },
  20_000); // Timeout of 20 seconds
});
