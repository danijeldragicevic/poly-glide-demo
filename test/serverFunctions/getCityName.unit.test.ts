import { describe, it, expect, vi } from "vitest";
import { getCityName } from "../../src/serverFunctions/getCityName";

vi.mock("polyapi", () => ({
  vari: {
    demo: {
      BIGDATACLOUD_API_BASE_URL: {
        get: vi
          .fn()
          .mockResolvedValue(
            "https://api.bigdatacloud.net/data/reverse-geocode-client",
          ),
      },
    },
  },
}));

describe("getCityName (unit tests)", () => {
  it("should fetch city name and country name correctly", async () => {
    const mockResponse = {
      city: "New York",
      countryName: "United States",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getCityName(40.7128, -74.006);
    expect(result).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
      city: "New York",
      countryName: "United States",
    });
  });

  it("should throw an error for invalid latitude", async () => {
    await expect(getCityName(100, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      statusText: "Bad Request",
      message: "Invalid latitude. Expected a number between -90 and 90.",
    });
  });

  it("should throw an error for invalid longitude", async () => {
    await expect(getCityName(40.7128, -190)).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      statusText: "Bad Request",
      message: "Invalid longitude. Expected a number between -180 and 180.",
    });
  });

  it("should throw an error when API response is missing", async () => {
    global.fetch = vi.fn().mockResolvedValue(null as any);
    
    await expect(getCityName(40.7128, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      statusText: "Internal Server Error",
      message: "BigDataCloud API response is missing.",
    });
  });

  it("should throw an error when API call fails", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));
    
    await expect(getCityName(40.7128, -74.006)).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      statusText: "Internal Server Error",
      message: "An error occurred while fetching city data.",
    });
  });
});
