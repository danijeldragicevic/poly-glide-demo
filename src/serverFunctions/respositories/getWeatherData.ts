// Poly deployed @ 2026-03-06T14:19:33.445Z - demo.getWeatherData - https://na1.polyapi.io/canopy/polyui/collections/server-functions/60fb7849-6da5-4fa2-aaeb-f790e76b6e8f - 01f7dfcf
import { PolyServerFunction, vari } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
  context: "demo",
  name: "getWeatherData",
  description: "Fetch weather data from Open-Meteo API.",
  visibility: "TENANT",
  logsEnabled: true,
  serverSideAsync: false,
};

// Response returned by this function
export type WeatherData = {
  latitude: number;
  longitude: number;
  data: {
    time: string[];
    temperature: number[];
    humidity: number[];
    rain: number[];
  };
};

/**
 * Fetch weather data from Open-Meteo API.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @returns {Promise<WeatherData>} Weather data for the period of 1 day.
 * @throws Will throw an error if the API call fails.
 *
 */
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  validateInRange(latitude, -90, 90, "latitude");
  validateInRange(longitude, -180, 180, "longitude");

  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "temperature_2m,relative_humidity_2m,rain",
    forecast_days: "1",
  });
  
  const url = await vari.demo.OPEN_METEO_BASE_URL.get();
  
  try {
    const response = await fetch(`${url}?${searchParams.toString()}`);
    if (!response) {
      const error = new Error("Open-Meteo API response is missing.");
      (error as any).status = 502;
      (error as any).statusText = "Bad Gateway";
      throw error;
    }

    const data = await response.json();

    return {
      latitude,
      longitude,
      data: {
        time: Array.from(data.hourly.time),
        temperature: Array.from(data.hourly.temperature_2m),
        humidity: Array.from(data.hourly.relative_humidity_2m),
        rain: Array.from(data.hourly.rain)
      },
    };
  } catch (error) {
    throw error;
  }
}

// Helper function
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
