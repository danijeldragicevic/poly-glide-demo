import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDailyForecast } from "../../src/serverFunctions/getDailyForecast";

const { getWeatherDataMock, getCityNameMock } = vi.hoisted(() => ({
	getWeatherDataMock: vi.fn(),
	getCityNameMock: vi.fn(),
}));

vi.mock("polyapi", () => ({
	default: {
		demo: {
			getWeatherData: getWeatherDataMock,
			getCityName: getCityNameMock,
		},
	},
}));

describe("getDailyForecast (unit tests)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return assembled daily forecast for the given coordinates", async () => {
		getWeatherDataMock.mockResolvedValue({
			data: {
				time: ["2026-03-04T00:00", "2026-03-04T01:00"],
				temperature: [11.2, 10.8],
				humidity: [76, 79],
				rain: [0, 0.2],
			},
		});

		getCityNameMock.mockResolvedValue({
			city: "New York",
			countryName: "United States",
		});

		const result = await getDailyForecast(40.7128, -74.006);

		expect(getWeatherDataMock).toHaveBeenCalledWith(40.7128, -74.006);
		expect(getCityNameMock).toHaveBeenCalledWith(40.7128, -74.006);
		expect(result).toEqual({
			city: "New York",
			country: "United States",
			time: ["2026-03-04T00:00", "2026-03-04T01:00"],
			temperature: [11.2, 10.8],
			humidity: [76, 79],
			rain: [0, 0.2],
		});
	});
});

