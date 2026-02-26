import { describe, it, expect } from "vitest";
import { getWeatherData } from "../../src/serverFunctions/getWeatherData";

describe("getWeatherData (integration test)", () => {
  it("connects to Open-Meteo API and fetches weather data", async () => {
    // Call the function with valid latitude and longitude
    const result = await getWeatherData(44.00299, 18.010437);
    const receivedLatitude = result.latitude.toFixed(5);
    const receivedLongitude = result.longitude.toFixed(5);
    
    // Assert that the result has the expected structure and values
    expect(receivedLatitude).toBe("44.00299");
    expect(receivedLongitude).toBe("18.01044");
    expect(result.data).toHaveProperty("temperature");
    expect(result.data).toHaveProperty("humidity");
    expect(result.data).toHaveProperty("rain");
  },
  20_000); // Set a timeout of 20 seconds
});
