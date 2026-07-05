"use client";

import { useState, useEffect } from "react";
import { WeatherData, Weather } from "../app/api/weather/WeatherService";
import { CityDropdown, CountryDropdown } from "../app/components";

interface AddWeatherDataFormProps {
	editingWeather: WeatherData | null;
	onCancel: () => void;
	onSuccess: () => void;
	onError: (error: string) => void;
}

export default function AddWeatherDataForm({ 
	editingWeather, 
	onCancel, 
	onSuccess, 
	onError 
}: AddWeatherDataFormProps) {
	// Form state
	const [formCountry, setFormCountry] = useState<string>("Germany");
	const [formCity, setFormCity] = useState<string>("Berlin");
	const [formDate, setFormDate] = useState<string>("2025-07-31");
	const [formTemperature, setFormTemperature] = useState<number>(22);
	const [formHumidity, setFormHumidity] = useState<number>(65);
	const [formWindSpeed, setFormWindSpeed] = useState<number>(8.5);
	const [formWeather, setFormWeather] = useState<Weather>(Weather.CLOUDY);
	const [formLoading, setFormLoading] = useState(false);
	const [formSuccess, setFormSuccess] = useState(false);

	// Update form state when editingWeather changes
	useEffect(() => {
		if (editingWeather) {
			setFormCountry(editingWeather.country);
			setFormCity(editingWeather.city);
			setFormDate(editingWeather.date);
			setFormTemperature(editingWeather.temperature);
			setFormHumidity(editingWeather.humidity);
			setFormWindSpeed(editingWeather.windSpeed);
			setFormWeather(editingWeather.weather);
		} else {
			// Reset to default values for adding new weather
			setFormCountry("Germany");
			setFormCity("Berlin");
			setFormDate("2025-07-31");
			setFormTemperature(22);
			setFormHumidity(65);
			setFormWindSpeed(8.5);
			setFormWeather(Weather.CLOUDY);
		}
		setFormSuccess(false);
	}, [editingWeather]);

	const handleSubmitForm = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormLoading(true);
		setFormSuccess(false);

		// TODO: Implement form submission
		// Requirements:
		// 1. Send POST request to /api/weather endpoint
		// 2. Handle the response properly (success/error)
		// 3. Show user feedback with setFormSuccess or onError
		
		try {
			const weatherData = {
			    country: formCountry,
			    city: formCity, 
			    date: formDate,
			    temperature: formTemperature,
			    humidity: formHumidity,
			    windSpeed: formWindSpeed,
			    weather: formWeather,
			};


			setTimeout(() => onSuccess(), 1000);

			throw new Error("Form submission not implemented");
		} catch (err) {
			onError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setFormLoading(false);
		}
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">
					{editingWeather ? "Edit Weather Data" : "Add New Weather Data"}
				</h2>
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
				>
					Cancel
				</button>
			</div>

			<form onSubmit={handleSubmitForm} className="space-y-6">
				{/* Location Selection */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CountryDropdown
						value={formCountry}
						onChange={(newCountry) => {
							setFormCountry(newCountry);
							if (newCountry !== formCountry) {
								setFormCity("");
							}
						}}
						disabled={formLoading}
					/>
					
					<CityDropdown
						value={formCity}
						onChange={setFormCity}
						country={formCountry}
						disabled={formLoading}
						showClearButton={false}
					/>
				</div>

				{/* Date and Weather Type */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="form-date" className="block text-sm font-medium text-gray-700 mb-2">
							Date *
						</label>
						<input
							type="date"
							id="form-date"
							value={formDate}
							onChange={(e) => setFormDate(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="form-weather" className="block text-sm font-medium text-gray-700 mb-2">
							Weather Type *
						</label>
						<select
							id="form-weather"
							value={formWeather}
							onChange={(e) => setFormWeather(e.target.value as Weather)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value={Weather.SUNNY}>SUNNY</option>
							<option value={Weather.RAINY}>RAINY</option>
							<option value={Weather.CLOUDY}>CLOUDY</option>
							<option value={Weather.HAIL}>HAIL</option>
							<option value={Weather.SNOW}>SNOW</option>
						</select>
					</div>
				</div>

				{/* Temperature, Humidity, and Wind Speed */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label htmlFor="form-temperature" className="block text-sm font-medium text-gray-700 mb-2">
							Temperature (°C) *
						</label>
						<input
							type="number"
							id="form-temperature"
							value={formTemperature}
							onChange={(e) => setFormTemperature(Number(e.target.value))}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="form-humidity" className="block text-sm font-medium text-gray-700 mb-2">
							Humidity (%) *
						</label>
						<input
							type="number"
							id="form-humidity"
							min="0"
							max="100"
							value={formHumidity}
							onChange={(e) => setFormHumidity(Number(e.target.value))}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="form-windspeed" className="block text-sm font-medium text-gray-700 mb-2">
							Wind Speed (km/h) *
						</label>
						<input
							type="number"
							id="form-windspeed"
							step="0.1"
							min="0"
							value={formWindSpeed}
							onChange={(e) => setFormWindSpeed(Number(e.target.value))}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex gap-4">
					<button
						type="submit"
						disabled={formLoading}
						className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
					>
						{formLoading ? "Saving..." : (editingWeather ? "Update Weather" : "Add Weather")}
					</button>
				</div>

				{formSuccess && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
						Weather data {editingWeather ? "updated" : "added"} successfully!
					</div>
				)}
			</form>
		</div>
	);
}
