// Poly deployed @ 2026-03-06T14:17:40.827Z - demo.getDailyForecast - https://na1.polyapi.io/canopy/polyui/collections/server-functions/1a18edf5-2861-4a6c-ab9b-d0e565a9987c - 636718c6
import poly, { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo",
    name: "getDailyForecast",
    description: "Get daily weather forecast for a given location.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: false
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
 * @param {{ latitude: number; longitude: number }} eventPayload - The webhook event payload containing the location coordinates.
 * @returns {Promise<DailyForecast>} Daily weather forecast for the given location.
 */
export async function getDailyForecast(
    eventPayload: { latitude: number; longitude: number }
): Promise<DailyForecast> {
    const { latitude, longitude } = eventPayload;

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
