// Poly deployed @ 2026-02-27T16:20:21.735Z - demo.getCityName - https://na1.polyapi.io/canopy/polyui/collections/server-functions/a506681a-de0c-42ce-8aa1-bcc7e4458c71 - e7a6abcf
import { PolyServerFunction, vari } from "polyapi";
import { ApiError } from "../snippets/ApiError"

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
    throw new ApiError(
      400, 
      "Bad Request", 
      "Invalid latitude. Expected a number between -90 and 90."
    );
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new ApiError(
      400, 
      "Bad Request", 
      "Invalid longitude. Expected a number between -180 and 180."
    );
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    localityLanguage: "en",
  });

  const url = await vari.demo.BIGDATACLOUD_API_BASE_URL.get();

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response) {
      throw new ApiError(
        500,
        "Internal Server Error",
        "BigDataCloud API response is missing."
      );
    }

    if (!response.ok) {
      throw new ApiError(
        response.status || 500,
        response.statusText || "Internal Server Error",
        `BigDataCloud API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log("Successfully fetched city data from BigDataCloud API.");

    return {
      latitude,
      longitude,
      city: data.city || "Unknown",
      countryName: data.countryName || "Unknown",
    };
    
  } catch (error) {
    console.error("Error fetching city data:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      "Internal Server Error",
      "An error occurred while fetching city data."
    );
  }
}
