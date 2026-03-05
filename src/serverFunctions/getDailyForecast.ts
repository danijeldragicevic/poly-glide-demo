// Poly deployed @ 2026-03-05T08:24:20.703Z - demo.getDailyForecast - https://na1.polyapi.io/canopy/polyui/collections/server-functions/1a18edf5-2861-4a6c-ab9b-d0e565a9987c - 636718c6
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
    time: string[];
    temperature: number[];
    humidity: number[];
    rain: number[];
};

/**
 * Get daily weather forecast for a given location.
 * @param {number} latitude - The geographic latitude of the location to retrieve the daily weather forecast for, in decimal degrees (typically in the range -90 to 90).
 * @param {number} longitude - The geographic longitude of the location to retrieve the daily weather forecast for, in decimal degrees (typically in the range -180 to 180).
 * @returns {Promise<DailyForecast>} 
 */
export async function getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast> {
    const [weatherData, cityInfo] = await Promise.all([
        poly.demo.getWeatherData(latitude, longitude),
        poly.demo.getCityName(latitude, longitude),
    ]);
    return {
        city: cityInfo.city,
        country: cityInfo.countryName,
        time: weatherData.data.time,
        temperature: weatherData.data.temperature,
        humidity: weatherData.data.humidity,
        rain: weatherData.data.rain,
    };
}

// Example usage
// getDailyForecast(140.7128, -74.006)
//     .then((forecast) => console.log("Daily Forecast:", forecast))
//     .catch((error) => console.error("Error fetching daily forecast:", error));