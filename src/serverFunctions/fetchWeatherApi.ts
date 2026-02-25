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

        console.log("Weather API Response:", {
            latitude: response.latitude(),
            longitude: response.longitude(),
            data: response.hourly()
        });

        return {
            latitude: response.latitude(),
            longitude: response.longitude(),
            data: {
                temperature: [1, 2, 3],
                humidity: [4, 5, 6],
                rain: [7, 8, 9]
            }
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw new Error("Failed to fetch weather data");
    }
} 