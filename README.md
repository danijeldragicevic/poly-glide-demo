# PolyAPI Demo
[![Deploy](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/deploy.yml)
[![Health check](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/health-check.yml/badge.svg?branch=main)](https://github.com/danijeldragicevic/poly-glide-demo/actions/workflows/health-check.yml)

This project implements a **daily weather forecast integration** built on the [PolyAPI](https://polyapi.io/) platform. It exposes an HTTP webhook that accepts geographic coordinates and returns an hourly weather forecast for that location.

## Data flow
```
POST /webhook  →  validateWebhookApiKey (server function)
                       ↓
               validateWebhookPayload (server function)
                       ↓
               getDailyForecast (server function)
                  ↙           ↘
        getCityName        getWeatherData
      (client function)   (client function)
       (BigDataCloud)        (Open-Meteo)
```
1. A client POSTs `latitude` and `longitude` to the webhook endpoint with an `x-api-key` header.
2. The **security function** (`validateWebhookApiKey`) validates the API key from the request headers before anything else.
3. The **security function** (`validateWebhookPayload`) validates the coordinates before the event is processed.
4. The **service function** (`getDailyForecast`) fetches city information and hourly weather data in parallel.
5. A structured forecast object is returned.

## Tech stack
- TypeScript
- PolyAPI SDK
- Vitest
- Husky

## Getting started
### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/danijeldragicevic/poly-glide-demo.git
   cd poly-glide-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Run all test
   ```bash
   npm test
   ```

## Example usage
There is a public webhook registered at this endpoint:
```bash
curl -X POST 'https://f9d5a80d.na1.polyapi.io/webhooks/devdan/daily-forecast' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: your-api-key-here' \
  --body '{
    "latitude": 40.7143,
    "longitude": -74.0060
}'
```
> Replace the host (`f9d5a80d.na1.polyapi.io`) and slug (`devdan`) with the values from your own PolyAPI environment if different. Replace `your-api-key-here` with your actual API key.

The webhook responds with:
```json
{
    "city": "New York City",
    "country": "United States of America (the)",
    "forecast": [
        {
            "time": "2026-03-09T00:00",
            "temperature": 16.4,
            "humidity": 46,
            "rain": 0
        },
        {
            "time": "2026-03-09T01:00",
            "temperature": 15.5,
            "humidity": 40,
            "rain": 0
        }
    ]
}
```

## Authentication errors
Thrown by `validateWebhookApiKey` when the `x-api-key` header is missing or invalid:
```json
{
    "statusCode": 500,
    "message": "API key is missing from the request headers."
}
```

```json
{
    "statusCode": 500,
    "message": "Invalid API key provided."
}
```

## Validation errors
Thrown by `validateWebhookPayload` when the request body is invalid:
```json
{
    "statusCode": 500,
    "message": "Invalid latitude. Expected a number between -90 and 90."
}
```

## License
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
