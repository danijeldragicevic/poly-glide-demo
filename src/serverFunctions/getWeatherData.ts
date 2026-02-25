// Poly deployed @ 2026-02-25T08:47:09.085Z - demo.getWeatherData - https://na1.polyapi.io/canopy/polyui/collections/server-functions/60fb7849-6da5-4fa2-aaeb-f790e76b6e8f - 01f7dfcf
import { PolyServerFunction } from "polyapi";
import { fetchWeatherApi } from "openmeteo";

export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "getWeatherData",
    description: "Fetch weather data from Open-Meteo API.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: true
}

export type WeatherData = {
    latitude: number;
    longitude: number;
    data: {
        temperature: number[];
        humidity: number[];
        rain: number[];
    }
}

/**
 * Fetch weather data from Open-Meteo API.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @returns {Promise<WeatherData>} Weather data response.
 * @throws Will throw an error if the API call fails.
 * 
*/
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    const params = {
        latitude,
        longitude,
        hourly: ['temperature_2m', 'relative_humidity_2m', 'rain'],
        forecast_days: 1,
    }

    const url = 'https://api.open-meteo.com/v1/forecast';
    const retries = 3;
    
    try {
        const responses = await fetchWeatherApi(url, params, retries);
        const response = responses[0];
        const hourly = response.hourly();

        if (!hourly) {
            throw new Error("Hourly data is missing in the API response");
        }

        const temperature = hourly.variables(0)?.valuesArray() ?? [];
        const humidity = hourly.variables(1)?.valuesArray() ?? [];
        const rain = hourly.variables(2)?.valuesArray() ?? [];

        return {
            latitude: response.latitude(),
            longitude: response.longitude(),
            data: {
                temperature: Array.from(temperature),
                humidity: Array.from(humidity),
                rain: Array.from(rain)
            }
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
} 
