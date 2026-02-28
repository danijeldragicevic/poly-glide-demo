import { describe, it, expect, vi } from "vitest";
import { fetchWeatherApi } from "openmeteo";
import { getWeatherData } from "../../src/serverFunctions/getWeatherData";


vi.mock("polyapi", () => ({
  vari: {
    demo: {
      OPEN_METEO_BASE_URL: {
        get: vi.fn().mockResolvedValue("https://dev.open-meteo.com/v1/forecast"),
      },
    },
  },
}));

vi.mock("openmeteo", () => ({
  fetchWeatherApi: vi.fn(),
}));

describe("getWeatherData (unit tests)", () => {
  it("should fetch and map weather data correctly", async () => {
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

    vi.mocked(fetchWeatherApi).mockResolvedValue([mockData] as any);

    const result = await getWeatherData(40.7128, -74.006);

    expect(result.latitude).toBe(40.7128);
    expect(result.longitude).toBe(-74.006);
    expect(result.data.temperature).toEqual([12.3, 13.1]);
    expect(result.data.humidity).toEqual([70, 68]);
    expect(result.data.rain).toEqual([0.1, 0.0]);
  });

  it("should throw an error for invalid latitude", async () => {
    await expect(getWeatherData(100, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      statusText: "Bad Request",
      message: "Invalid latitude. Expected a number between -90 and 90."
    });
  });

  it("should throw an error for invalid longitude", async () => {
    await expect(getWeatherData(40.7128, -190)).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      statusText: "Bad Request",
      message: "Invalid longitude. Expected a number between -180 and 180."
    });
  });

  it("should throw an error if API returns empty response", async () => {
    vi.mocked(fetchWeatherApi).mockResolvedValue([] as any);
    await expect(getWeatherData(40.7128, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      statusText: "Internal Server Error",
      message: "Open-Meteo API response is missing.",
    });
  });

  it("should throw an error if hourly data is missing in API response", async () => {
    const mockData = {
      latitude: () => 40.7128,
      longitude: () => -74.006,
      hourly: () => null
    };

    vi.mocked(fetchWeatherApi).mockResolvedValue([mockData] as any);

    await expect(getWeatherData(40.7128, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      statusText: "Internal Server Error",
      message: "Hourly data is missing in the API response.",
    });
  });
});
