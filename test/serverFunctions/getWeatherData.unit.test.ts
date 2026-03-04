import { afterEach, describe, expect, it, vi } from "vitest";
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

describe("getWeatherData (unit tests)", () => {
  it("should fetch and map weather data correctly", async () => {
    const mockResponse = {
      latitude: 40.7128,
      longitude: -74.006,
      hourly: {
        time: ["2026-03-03T00:00", "2026-03-03T01:00"],
        temperature_2m: [12.3, 13.1],
        relative_humidity_2m: [70, 68],
        rain: [0.1, 0.0]
      }
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as unknown as Response);
    
    const result = await getWeatherData(40.7128, -74.006);

    expect(result.latitude).toBe(40.7128);
    expect(result.longitude).toBe(-74.006);
    expect(result.data.time).toEqual(["2026-03-03T00:00", "2026-03-03T01:00"]);
    expect(result.data.temperature).toEqual([12.3, 13.1]);
    expect(result.data.humidity).toEqual([70, 68]);
    expect(result.data.rain).toEqual([0.1, 0.0]);
  });

  it("should throw an error for invalid latitude", async () => {
    await expect(getWeatherData(100, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      statusText: "Bad Request",
      message: "Invalid latitude. Expected a number between -90 and 90.",
    });
  });

  it("should throw an error for invalid longitude", async () => {
    await expect(getWeatherData(40.7128, -190)).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      statusText: "Bad Request",
      message: "Invalid longitude. Expected a number between -180 and 180.",
    });
  });

  it("should throw an error when API response is missing", async () => {
    global.fetch = vi.fn().mockResolvedValue(null as any);

    await expect(getWeatherData(40.7128, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 503,
      statusText: "Service Unavailable",
      message: "Failed to fetch weather data from Open-Meteo API.",
    });
  });

  it("should throw an error when API call fails", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

    await expect(getWeatherData(40.7128, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      statusText: "Internal Server Error",
      message: "An error occurred while fetching weather data.",
    });
  });
});
