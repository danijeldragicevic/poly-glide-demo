// Poly deployed @ 2026-03-02T16:14:33.142Z - demo.getWeatherData - https://na1.polyapi.io/canopy/polyui/collections/server-functions/60fb7849-6da5-4fa2-aaeb-f790e76b6e8f - 01f7dfcf
import { PolyServerFunction, vari } from "polyapi";

class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }

  toJSON() {
    return {
      status: this.status,
      statusText: this.statusText,
      message: this.message,
    };
  }
}

export const polyConfig: PolyServerFunction = {
  context: "demo",
  name: "getWeatherData",
  description: "Fetch weather data from Open-Meteo API.",
  visibility: "TENANT",
  logsEnabled: true,
  serverSideAsync: false,
};

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
      throw new ApiError(
        503,
        "Service Unavailable",
        "Failed to fetch weather data from Open-Meteo API."
      );
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
    console.error("Error fetching weather data:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      "Internal Server Error",
      "An error occurred while fetching weather data."
    );
  }
}

function validateInRange(
  value: number,
  min: number,
  max: number,
  fieldName: "latitude" | "longitude"
): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new ApiError(
      400,
      "Bad Request",
      `Invalid ${fieldName}. Expected a number between ${min} and ${max}.`
    );
  }
}
