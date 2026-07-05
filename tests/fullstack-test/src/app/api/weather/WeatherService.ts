export interface WeatherData {
	id: string;
	country: string;
	city: string;
	temperature: number;
	humidity: number;
	windSpeed: number;
	date: string;
	weather: Weather;
}

export interface WeatherQuery {
	country: string;
	city?: string;
	date?: Date;
}

export enum Weather {
	SUNNY = "SUNNY",
	RAINY = "RAINY",
	CLOUDY = "CLOUDY",
	HAIL = "HAIL",
	SNOW = "SNOW",
}

export interface WeatherService {
	updateWeather(weather: WeatherData): void;
	getWeather(query: WeatherQuery): WeatherData[];
}
