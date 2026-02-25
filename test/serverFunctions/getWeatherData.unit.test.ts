import { describe, it, expect, vi } from "vitest";
import { fetchWeatherApi } from "openmeteo";
import { getWeatherData } from "../../src/serverFunctions/getWeatherData";

vi.mock("openmeteo", () => ({
  fetchWeatherApi: vi.fn(),
}));

describe("getWeatherData (unit)", () => {
  it("should fetch and map weather data correctly", async () => {
    // Define mock response data
    const mockData = {
      latitude: () => 40.7128,
      longitude: () => -74.006,
      hourly: () => ({
        variables: (index: number) => {
          const dataByIndex = [
            { valuesArray: () => [12.3, 13.1] }, // temperature
            { valuesArray: () => [70, 68] }, // humidity
            { valuesArray: () => [0.1, 0.0] }, // rain
          ];
          return dataByIndex[index];
        },
      }),
    };

    // Mock the fetchWeatherApi to return the mock data
    vi.mocked(fetchWeatherApi).mockResolvedValue([mockData] as any);

    // Call the function with valid latitude and longitude
    const result = await getWeatherData(40.7128, -74.006);

    // Assert that the result matches the expected structure and values
    expect(result.latitude).toBe(40.7128);
    expect(result.longitude).toBe(-74.006);
    expect(result.data.temperature).toEqual([12.3, 13.1]);
    expect(result.data.humidity).toEqual([70, 68]);
    expect(result.data.rain).toEqual([0.1, 0.0]);
  });
});

// it("should throw an error for invalid latitude", async () => {});

// it("should throw an error for invalid longitude", async () => {});

// it("should throw an error if API returns empty response", async () => {});

// it("should throw an error if API response is missing", async () => {});

// it("should throw an error if hourly data is missing in API response", async () => {});
