// Poly deployed @ 2026-03-06T14:17:36.655Z - demo.getCityName - https://na1.polyapi.io/canopy/polyui/collections/server-functions/9a9664b6-e5fc-4feb-bc70-4e62cdb74eae - 2fdbe207
import { PolyServerFunction, vari } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
  context: "demo",
  name: "getCityName",  
  description: "Get city name from latitude and longitude.",
  visibility: "TENANT",
  logsEnabled: true,
  serverSideAsync: false,
};

// Response returned by this function
export type CityData = {
    latitude: number;
    longitude: number;
    city: string;
    countryName: string;
};

/**
 * Get city name from latitude and longitude.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @returns {Promise<CityData>} City data including city name and country name.
 * @throws Will throw an error if the API call fails or if the input is invalid.
 */
export async function getCityName(latitude: number, longitude: number): Promise<CityData> {
  validateInRange(latitude, -90, 90, "latitude");
  validateInRange(longitude, -180, 180, "longitude");

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    localityLanguage: "en",
  });

  const url = await vari.demo.BIGDATACLOUD_API_BASE_URL.get();

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response) {
      const error = new Error("BigDataCloud API response is missing.");
      (error as any).status = 502;
      (error as any).statusText = "Bad Gateway";
      throw error;
    }

    const data = await response.json();

    return {
      latitude,
      longitude,
      city: data.city || "Unknown",
      countryName: data.countryName || "Unknown",
    };
    
  } catch (error) {
    throw error;
  }
}

// Helper validation function
function validateInRange(
  value: number,
  min: number,
  max: number,
  fieldName: "latitude" | "longitude"
): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    const error = new Error(`Invalid ${fieldName}. Expected a number between ${min} and ${max}.`);
    (error as any).status = 400;
    (error as any).statusText = "Bad Request";
    throw error;
  }
}
