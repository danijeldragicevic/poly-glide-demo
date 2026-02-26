// Poly deployed @ 2026-02-26T13:43:50.549Z - demo.getCityName - https://na1.polyapi.io/canopy/polyui/collections/server-functions/a506681a-de0c-42ce-8aa1-bcc7e4458c71 - e7a6abcf
import { PolyServerFunction } from "polyapi";

export const polyConfig: PolyServerFunction = {
  context: "demo",
  name: "getCityName",
  description: "Get city name from latitude and longitude.",
  visibility: "TENANT",
  logsEnabled: true,
  serverSideAsync: false,
};

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
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude. Expected a number between -90 and 90.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude. Expected a number between -180 and 180.");
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    localityLanguage: "en",
  });

  const url = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  try {
    const resposne = await fetch(`${url}?${params.toString()}`);
    if (!resposne.ok) {
      throw new Error(`BigDataCloud API error: ${resposne.status} ${resposne.statusText}`);
    }

    const data = await resposne.json();

    console.log("Successfully fetched city data from BigDataCloud API.");

    return {
      latitude,
      longitude,
      city: data.city || "Unknown",
      countryName: data.countryName || "Unknown",
    };
    
  } catch (error) {
    console.error("Error fetching city data:", error);
    throw error;
  }
}
