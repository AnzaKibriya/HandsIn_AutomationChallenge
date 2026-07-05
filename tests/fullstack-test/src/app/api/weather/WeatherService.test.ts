import { beforeEach, describe, expect, it } from "@jest/globals";
import { WeatherService, WeatherData, Weather } from "./WeatherService";
import { DefaultWeatherService } from "../../../examined/DefaultWeatherService";

describe("WeatherService Unit Tests", () => {
	let weatherService: WeatherService;

	beforeEach(() => {
		weatherService = new DefaultWeatherService();
	});

	describe("updateWeather", () => {
		it("should add new weather data when no matching entry exists", () => {
			// Get initial count for Germany
			const initialResult = weatherService.getWeather({ country: "Germany" });
			const initialCount = initialResult.length;

			// Add weather data for a new city
			const newWeather: WeatherData = {
				id: "test_new_hamburg_id",
				country: "Germany",
				city: "Hamburg",
				temperature: 18,
				humidity: 80,
				windSpeed: 12.0,
				date: "2025-09-11",
				weather: Weather.RAINY
			};

			weatherService.updateWeather(newWeather);

			// Verify the addition
			const updatedResult = weatherService.getWeather({ country: "Germany" });
			expect(updatedResult).toHaveLength(initialCount + 1);

			const hamburgWeather = weatherService.getWeather({ 
				country: "Germany", 
				city: "Hamburg" 
			});
			expect(hamburgWeather).toHaveLength(1);
			expect(hamburgWeather[0]?.city).toBe("Hamburg");
			expect(hamburgWeather[0]?.temperature).toBe(18);
		});

		it("should add new date entry for existing city", () => {
			// Add weather data for Berlin on a new date
			const newWeather: WeatherData = {
				id: "test_new_berlin_date_id",
				country: "Germany",
				city: "Berlin",
				temperature: 22,
				humidity: 75,
				windSpeed: 10.0,
				date: "2025-09-11",
				weather: Weather.CLOUDY
			};

			weatherService.updateWeather(newWeather);

			// Verify Berlin now has the latest weather from the new date
			const berlinLatest = weatherService.getWeather({ 
				country: "Germany", 
				city: "Berlin" 
			});
			expect(berlinLatest).toHaveLength(1);
			expect(berlinLatest[0]?.date).toBe("2025-09-11");
			expect(berlinLatest[0]?.temperature).toBe(22);

			// Verify we can still get the old weather by specifying the date
			const berlinOld = weatherService.getWeather({ 
				country: "Germany", 
				city: "Berlin",
				date: new Date("2025-07-31")
			});
			expect(berlinOld).toHaveLength(1);
			expect(berlinOld[0]?.date).toBe("2025-07-31");
			expect(berlinOld[0]?.temperature).toBe(19);
		});
	});

	describe("getWeather", () => {
		it("should return empty array for non-existent country", () => {
			const result = weatherService.getWeather({ country: "NonExistentCountry" });
			expect(result).toHaveLength(0);
			expect(result).toEqual([]);
		});

		it("should return empty array for non-existent city", () => {
			const result = weatherService.getWeather({ country: "Germany", city: "NonExistentCity" });
			expect(result).toHaveLength(0);
			expect(result).toEqual([]);
		});

		it("should return empty array for non-existent date", () => {
			const result = weatherService.getWeather({ 
				country: "Germany", 
				date: new Date("2020-01-01") 
			});
			expect(result).toHaveLength(0);
			expect(result).toEqual([]);
		});

		it("should return latest weather for specific city when city specified", () => {
			const result = weatherService.getWeather({ country: "Germany", city: "Berlin" });
			
			expect(result).toHaveLength(1);
			expect(result[0]?.city).toBe("Berlin");
			expect(result[0]?.date).toBe("2025-07-31");
			expect(result[0]?.temperature).toBe(19);
		});

		it("should return weather for all cities on specific date", () => {
			const result = weatherService.getWeather({ 
				country: "Germany", 
				date: new Date("2025-07-31") 
			});
			
			expect(result).toHaveLength(1); // Only Berlin has data for this date
			expect(result[0]?.city).toBe("Berlin");
			expect(result[0]?.date).toBe("2025-07-31");
		});

		it("should return empty array when city and date combination doesn't exist", () => {
			const result = weatherService.getWeather({ 
				country: "Germany", 
				city: "Munich",
				date: new Date("2025-07-31") 
			});
			
			expect(result).toHaveLength(0);
			expect(result).toEqual([]);
		});

		it("should work with different countries", () => {
			const usResult = weatherService.getWeather({ country: "United States" });
			expect(usResult.length).toBeGreaterThan(0);
			expect(usResult.every(item => item.country === "United States")).toBe(true);

			const ukResult = weatherService.getWeather({ country: "United Kingdom" });
			expect(ukResult.length).toBeGreaterThan(0);
			expect(ukResult.every(item => item.country === "United Kingdom")).toBe(true);
		});

		it("should handle date filtering correctly across different countries", () => {
			const result = weatherService.getWeather({ 
				country: "United States", 
				date: new Date("2025-07-31") 
			});
			
			expect(result.length).toBeGreaterThan(0);
			expect(result.every(item => item.country === "United States")).toBe(true);
			expect(result.every(item => item.date === "2025-07-31")).toBe(true);
		});

		it("should return consistent results when called multiple times", () => {
			const result1 = weatherService.getWeather({ country: "Germany" });
			const result2 = weatherService.getWeather({ country: "Germany" });
			
			expect(result1).toEqual(result2);
		});

		it("should handle edge case with same city having multiple dates", () => {
			// Berlin has data for both 2025-07-31 and 2024-02-12
			const berlinLatest = weatherService.getWeather({ country: "Germany", city: "Berlin" });
			expect(berlinLatest).toHaveLength(1);
			expect(berlinLatest[0]?.date).toBe("2025-07-31"); // Should be the more recent one

			const berlinOld = weatherService.getWeather({ 
				country: "Germany", 
				city: "Berlin",
				date: new Date("2024-02-12")
			});
			expect(berlinOld).toHaveLength(1);
			expect(berlinOld[0]?.date).toBe("2024-02-12");
		});
	});
});
