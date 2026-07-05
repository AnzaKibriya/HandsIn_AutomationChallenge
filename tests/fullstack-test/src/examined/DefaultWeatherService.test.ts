import { beforeEach, describe, expect, it } from "@jest/globals";
import { DefaultWeatherService } from "./DefaultWeatherService";

describe("DefaultWeatherService Unit Tests", () => {
	let weatherService: DefaultWeatherService;

	beforeEach(() => {
		weatherService = new DefaultWeatherService();
	});

	describe("getWeather", () => {
		it("should return latest weather for specific city and date", () => {
			// TODO: Implement this test
			//
			// Hints:
			// - Use  weatherService.getWeather({ country: "Germany", city: "Berlin", date: new Date("2025-07-31") });
			// - Verify the result is not empty
			// - Ensure the returned item matches the requested city and date

			throw new Error("Test not implemented");
		});

		it("should return latest weather for all cities when only country specified", () => {
			// TODO: Implement this test
			//
			// Hints:
			// - Use weatherService.getWeather({ country: "United States" })
			// - Verify the result is not empty and has the correct number of entries
			// - Ensure there are no duplicate cities in the result

			throw new Error("Test not implemented");
		});
	});

	describe("updateWeather", () => {
		it("Should handle returning the most recent weather data once it has been updated", () => {
			// TODO: Implement this test
			//
			// Hints:
			// -  Use weatherService.getWeather({ country: "Germany", city: "Berlin", date: new Date("2025-07-31") })
			// -  Use weatherService.updateWeather({
			//				id: "test_update_id",
			//				country: "Germany",
			//				city: "Berlin",
			//				temperature: 25,
			//				humidity: 50,
			//				windSpeed: 5.0,
			//				date: "2025-07-31",
			//				weather: Weather.SUNNY
			//			})
			// - Compare dates as strings in "YYYY-MM-DD" format
		
			throw new Error("Test not implemented");
		});
	});
});
