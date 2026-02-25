// Poly deployed @ 2026-02-25T12:13:33.788Z - demo.getWeatherData - https://na1.polyapi.io/canopy/polyui/collections/server-functions/60fb7849-6da5-4fa2-aaeb-f790e76b6e8f - 01f7dfcf
import { PolyServerFunction } from "polyapi";
import { fetchWeatherApi } from "openmeteo";

const TEMPERATURE_INDEX = 0;
const HUMIDITY_INDEX = 1;
const RAIN_INDEX = 2;

// Configuration for the Poly server function
export const polyConfig: PolyServerFunction = {
  context: "demo",
  name: "getWeatherData",
  description: "Fetch weather data from Open-Meteo API.",
  visibility: "TENANT",
  logsEnabled: true,
  serverSideAsync: false,
};

// Define the structure of the weather data response
export type WeatherData = {
  latitude: number;
  longitude: number;
  data: {
    temperature: number[];
    humidity: number[];
    rain: number[];
  };
};

/**
 * Fetch weather data from Open-Meteo API.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @returns {Promise<WeatherData>} Weather data response.
 * @throws Will throw an error if the API call fails.
 *
 */
export async function getWeatherData(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude. Expected a number between -90 and 90.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude. Expected a number between -180 and 180.");
  }

  const params = {
    latitude,
    longitude,
    hourly: ["temperature_2m", "relative_humidity_2m", "rain"],
    forecast_days: 1,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const retries = 3;

  try {
    const responses = await fetchWeatherApi(url, params, retries);
    if (!responses || responses.length === 0) {
      throw new Error("Open-Meteo API returned an empty response.");
    }

    const response = responses[0];
    if (!response) {
      throw new Error("Open-Meteo API response is missing.");
    }

    const hourly = response.hourly();
    if (!hourly) {
      throw new Error("Hourly data is missing in the API response");
    }

    const temperature = hourly.variables(TEMPERATURE_INDEX)?.valuesArray() ?? [];
    const humidity = hourly.variables(HUMIDITY_INDEX)?.valuesArray() ?? [];
    const rain = hourly.variables(RAIN_INDEX)?.valuesArray() ?? [];

    return {
      latitude: response.latitude(),
      longitude: response.longitude(),
      data: {
        temperature: Array.from(temperature),
        humidity: Array.from(humidity),
        rain: Array.from(rain)
      },
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
