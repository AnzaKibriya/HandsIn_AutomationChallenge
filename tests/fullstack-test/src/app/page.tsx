"use client";

import { useState, useEffect, useCallback } from "react";
import { WeatherData, Weather } from "./api/weather/WeatherService";
import AddWeatherDataForm from "../examined/AddWeatherDataForm";
import { CityDropdown, CountryDropdown } from "./components";

export default function WeatherPage() {
	// Display/Search state
	const [weatherData, setWeatherData] = useState<WeatherData[] | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [searchCountry, setSearchCountry] = useState<string>("United Kingdom");
	const [searchCity, setSearchCity] = useState<string>("London");
	const [searchDate, setSearchDate] = useState<Date | null>(null);

	// Edit mode state
	const [editingWeather, setEditingWeather] = useState<WeatherData | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	const getWeatherDescription = (weather: Weather): string => {
		switch (weather) {
			case Weather.SUNNY:
				return "Sunny";
			case Weather.CLOUDY:
				return "Cloudy";
			case Weather.RAINY:
				return "Rainy";
			case Weather.SNOW:
				return "Snow";
			case Weather.HAIL:
				return "Hail";
			default:
				return "Unknown";
		}
	};

	const fetchWeatherData = useCallback(async () => {
		setLoading(true);
		setError(undefined);

		try {
			const response = await fetch(
				`/api/weather?${new URLSearchParams({
					country: searchCountry,
					...(searchDate ? { date: searchDate?.toISOString() } : {}),
					...(!searchCity ? {} : { city: searchCity }),
				}).toString()}`,
				{ method: "GET" },
			);

			if (!response.ok) {
				throw new Error("Weather data not found");
			}

			const data: WeatherData[] = await response.json();
			setWeatherData(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, [searchCountry, searchCity, searchDate]);

	useEffect(() => {
		fetchWeatherData();
	}, []);

	const handleEdit = (weather: WeatherData) => {
		setEditingWeather(weather);
		setIsEditing(true);
	};

	const handleAddNew = () => {
		setEditingWeather(null);
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditingWeather(null);
	};

	const handleFormSuccess = async () => {
		// Refresh the weather data
		await fetchWeatherData();
		// Close the form
		setIsEditing(false);
		setEditingWeather(null);
	};

	const handleFormError = (errorMessage: string) => {
		setError(errorMessage);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-400 via-purple-500 to-green-600 p-8">
			<div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">Weather App</h1>

				{/* Search/Filter Section */}
				{!isEditing && (
					<div className="mb-6 space-y-4 border-b pb-6">
						<h2 className="text-xl font-semibold mb-4">Search Weather</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<CountryDropdown
								value={searchCountry}
								onChange={(newCountry) => {
									setSearchCountry(newCountry);
									if (newCountry !== searchCountry) {
										setSearchCity("");
									}
								}}
								disabled={loading}
							/>
							
							<CityDropdown
								value={searchCity}
								onChange={setSearchCity}
								country={searchCountry}
								disabled={loading}
								showClearButton={true}
								onClear={() => setSearchCity("")}
							/>

							<div className="space-y-2">
								<label htmlFor="date-input" className="block text-sm font-medium text-gray-700">Date</label>
								<div className="flex gap-2">
									<input
										id="date-input"
										type="date"
										value={searchDate?.toISOString().split("T")[0] || ""}
										onChange={(e) => setSearchDate(new Date(e.target.value))}
										placeholder="Enter date"
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<button
										type="button"
										onClick={() => setSearchDate(null)}
										className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
									>
										Clear
									</button>
								</div>
							</div>
						</div>
						
						<div className="flex gap-4">
							<button
								type="button"
								onClick={fetchWeatherData}
								disabled={loading || !searchCountry}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
							>
								{loading ? "Loading..." : "Search Weather"}
							</button>
							<button
								type="button"
								onClick={handleAddNew}
								className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
							>
								Add New Weather
							</button>
						</div>
					</div>
				)}

				{/* Edit Form Section */}
				{isEditing && (
					<div className="mb-6 border-b pb-6">
						<AddWeatherDataForm
							editingWeather={editingWeather}
							onCancel={handleCancelEdit}
							onSuccess={handleFormSuccess}
							onError={handleFormError}
						/>
					</div>
				)}

				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				{/* Weather Data Display */}
				{!isEditing && weatherData && weatherData.length > 0 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold mb-4">Weather Results</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{weatherData.map((weather) => (
								<div key={weather.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold">{weather.city}</h3>
										<span className="text-sm text-gray-500">{weather.country}</span>
									</div>
									<div className="text-2xl font-bold text-blue-600 mb-2">{weather.temperature}°C</div>
									<div className="text-gray-600 mb-1">{getWeatherDescription(weather.weather)}</div>
									<div className="text-sm text-gray-500 mb-3">{new Date(weather.date).toLocaleDateString()}</div>
									<div className="text-sm text-gray-600 mb-3">
										<div>Humidity: {weather.humidity}%</div>
										<div>Wind: {weather.windSpeed} km/h</div>
									</div>
									<button
										type="button"
										onClick={() => handleEdit(weather)}
										className="w-full px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
									>
										Edit
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* No data message */}
				{!isEditing && weatherData && weatherData.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						<p>No weather data found for the selected criteria.</p>
						<button
							type="button"
							onClick={handleAddNew}
							className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
						>
							Add Weather Data
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
