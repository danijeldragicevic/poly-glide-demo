// Poly deployed @ 2026-03-05T10:00:19.505Z - demo.getDailyForecast - https://na1.polyapi.io/canopy/polyui/collections/server-functions/1a18edf5-2861-4a6c-ab9b-d0e565a9987c - 636718c6
import poly, { PolyServerFunction, OobPolyapiSnippets } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "getDailyForecast",
    description: "Get daily weather forecast for a given location.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: true
};

// Response returned by this function
export type DailyForecast = {
    city: string;
    country: string;
    forecast: Array<{
        time: string;
        temperature: number;
        humidity: number;
        rain: number;
    }>;
};

/**
 * Get daily weather forecast for a given location.
 * @param {number} latitude - The geographic latitude of the location to retrieve the daily weather forecast for, in decimal degrees (typically in the range -90 to 90).
 * @param {number} longitude - The geographic longitude of the location to retrieve the daily weather forecast for, in decimal degrees (typically in the range -180 to 180).
 * @returns {Promise<DailyForecast>} Daily weather forecast for the given location.
 */
export async function getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast> {
    // Fetch weather data and city information in parallel
    const [weatherData, cityInfo] = await Promise.all([
        poly.demo.getWeatherData(latitude, longitude),
        poly.demo.getCityName(latitude, longitude),
    ]);
    
    return {
        city: cityInfo.city,
        country: cityInfo.countryName,
        forecast: weatherData.data.time.map((time, index) => ({
            time,
            temperature: weatherData.data.temperature[index],
            humidity: weatherData.data.humidity[index],
            rain: weatherData.data.rain[index],
        })),
    };
}

// Example usage
getDailyForecast(40.7128, -74.006)
    .then((forecast) => console.log("Daily Forecast:", forecast))
    .catch((error) => console.error(error));