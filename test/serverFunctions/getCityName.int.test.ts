import { describe, it, expect, vi } from "vitest";
import { getCityName } from "../../src/serverFunctions/getCityName";

vi.mock("polyapi", () => ({
  vari: {
    demo: {
      BIGDATACLOUD_API_BASE_URL: {
        get: vi.fn().mockResolvedValue("https://api.bigdatacloud.net/data/reverse-geocode-client")
      }
    }
  }
}));

describe("getCityName (integration test)", () => {
  it("connects to BigDataCloud API and fetches city and country name", async () => {
    const result = await getCityName(40.7128, -74.006);
    
    expect(result.latitude.toFixed(4)).toBe("40.7128");
    expect(result.longitude.toFixed(4)).toBe("-74.0060");
    expect(result.city).toBeTruthy();
    expect(result.countryName).toBeTruthy();
  },
  20_000); // Timeout of 20 seconds
});
