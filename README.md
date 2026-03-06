# PolyAPI Demo
[![Deploy](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/deploy.yml)
[![Scheduled Integration Tests](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/integration-tests.yml/badge.svg?branch=main)](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/integration-tests.yml)

## Tech stack
- TypeScript
- PolyAPI SDK
- Vitest
- Husky

## Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm

## Installation
```bash
npm install
```

## Available scripts
- `npm test` — run Vitest test suite
- `npm run test:watch` — run tests in watch mode

## What this integration does
This project implements a **daily weather forecast integration** built on the [PolyAPI](polyapi.io) platform. It exposes an HTTP webhook that accepts geographic coordinates and returns an hourly weather forecast for that location.

### Flow
```
POST /webhook  →  validateForecastPayload (security)
                       ↓
               getDailyForecast (service)
                  ↙           ↘
        getCityName        getWeatherData
     (BigDataCloud)        (Open-Meteo)
```
1. A client POSTs `latitude` and `longitude` to the webhook endpoint.
2. The **security function** (`validateForecastPayload`) validates the coordinates before the event is processed.
3. The **service function** (`getDailyForecast`) fetches city information and hourly weather data in parallel.
4. A structured forecast object is returned.

## Example usage
### cURL request
```bash
curl -X POST https://na1.polyapi.io/webhook/devdan/demo/daily-forecast \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 52.52,
    "longitude": 13.41
  }'
```
> Replace the host (`na1.polyapi.io`) and slug (`devdan`) with the values from your own PolyAPI environment if different.

## Example output

The webhook responds with:
```json
{
  "city": "Berlin",
  "country": "Germany",
  "forecast": [
    {
      "time": "2026-03-06T00:00",
      "temperature": 3.8,
      "humidity": 82,
      "rain": 0.0
    },
    {
      "time": "2026-03-06T01:00",
      "temperature": 3.5,
      "humidity": 84,
      "rain": 0.1
    },
    {
      "time": "2026-03-06T02:00",
      "temperature": 3.2,
      "humidity": 85,
      "rain": 0.0
    }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `city` | `string` | City name resolved from coordinates |
| `country` | `string` | Country name resolved from coordinates |
| `forecast[].time` | `string` | ISO 8601 datetime (hourly) |
| `forecast[].temperature` | `number` | Air temperature at 2 m (°C) |
| `forecast[].humidity` | `number` | Relative humidity at 2 m (%) |
| `forecast[].rain` | `number` | Rainfall (mm) |

### Validation errors (400 Bad Request)
Thrown by `validateForecastPayload` when the request body is invalid:

| Condition | Message |
|---|---|
| `latitude` is not a number, or outside `[-90, 90]` | `"Invalid latitude. Expected a number between -90 and 90."` |
| `longitude` is not a number, or outside `[-180, 180]` | `"Invalid longitude. Expected a number between -180 and 180."` |

```json
{
  "message": "Invalid latitude. Expected a number between -90 and 90.",
  "statusCode": 400,
  "statusText": "Bad Request"
}
```

### Upstream errors (502 Bad Gateway)
Thrown when an external API does not respond:

| Source | Message |
|---|---|
| BigDataCloud (city lookup) | `"BigDataCloud API response is missing."` |
| Open-Meteo (weather data) | `"Open-Meteo API response is missing."` |

## License
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
