// Poly deployed @ 2026-03-02T12:07:44.898Z - demo.getDailyForecast - https://na1.polyapi.io/canopy/polyui/collections/client-functions/364ca169-2650-4a96-b10f-1f39e2aebb2b - 138d8fb9
import poly, { PolyClientFunction } from "polyapi";

export const polyConfig: PolyClientFunction = {
    context: "demo",
    name: "getDailyForecast",
    description: "Get daily weather forecast for a given location.",
    visibility: "TENANT",
};

export type DailyForecast = {
    city: string;
    country: string;
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
    const weatherData = await poly.demo.getWeatherData(latitude, longitude);
    const cityInfo = await poly.demo.getCityName(latitude, longitude);

    return {
        city: cityInfo.city,
        country: cityInfo.countryName,
        temperature: weatherData.data.temperature,
        humidity: weatherData.data.humidity,
        rain: weatherData.data.rain,
    };
}
