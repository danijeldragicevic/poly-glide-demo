export function validateForecastPayload(event: { body: { latitude?: unknown; longitude?: unknown }}): Promise<boolean> { 
    const { latitude, longitude } = event.body;

    if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
        return Promise.reject({
            message: "Invalid latitude. Expected a number between -90 and 90.",
            status: 400,
            statusText: "Bad Request",
        });
    }

    if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
        return Promise.reject({
            message: "Invalid longitude. Expected a number between -180 and 180.",
            status: 400,
            statusText: "Bad Request",
        });
    }
    
    return Promise.resolve(true);
}

// Example usage
// validateForecastPayload({ body: { latitude: 40.7128, longitude: -74.0060 } })
//     .then(() => console.log("Payload is valid."))
//     .catch((error) => console.error("Payload validation failed:", error));