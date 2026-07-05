import { Weather, WeatherData } from "./WeatherService";

/**
 * Sample weather data for testing purposes
 * This data serves as a mock database for the weather application
 */
export const SAMPLE_WEATHER_DATA: WeatherData[] = [
  // United States
  {
    id: "us_ny_2025_07_31",
    country: "United States",
    city: "New York",
    temperature: 22,
    humidity: 65,
    windSpeed: 8.5,
    date: "2025-07-31",
    weather: Weather.CLOUDY
  },
  {
    id: "us_la_2025_07_31",
    country: "United States",
    city: "Los Angeles",
    temperature: 28,
    humidity: 45,
    windSpeed: 6.2,
    date: "2025-07-31",
    weather: Weather.SUNNY
  },
  {
    id: "us_seattle_2025_07_31",
    country: "United States",
    city: "Seattle",
    temperature: 18,
    humidity: 85,
    windSpeed: 12.3,
    date: "2025-07-31",
    weather: Weather.RAINY
  },
  
  // United Kingdom
  {
    id: "uk_london_2025_07_31",
    country: "United Kingdom",
    city: "London",
    temperature: 16,
    humidity: 78,
    windSpeed: 9.8,
    date: "2025-07-31",
    weather: Weather.CLOUDY
  },
  {
    id: "uk_manchester_2025_07_31",
    country: "United Kingdom",
    city: "Manchester",
    temperature: 14,
    humidity: 92,
    windSpeed: 15.4,
    date: "2025-07-31",
    weather: Weather.RAINY
  },
  
  // Canada
  {
    id: "ca_toronto_2025_07_31",
    country: "Canada",
    city: "Toronto",
    temperature: 20,
    humidity: 55,
    windSpeed: 7.1,
    date: "2025-07-31",
    weather: Weather.SUNNY
  },
  {
    id: "ca_vancouver_2025_07_31",
    country: "Canada",
    city: "Vancouver",
    temperature: 17,
    humidity: 80,
    windSpeed: 10.2,
    date: "2025-07-31",
    weather: Weather.RAINY
  },
  {
    id: "ca_montreal_2025_07_31",
    country: "Canada",
    city: "Montreal",
    temperature: -5,
    humidity: 70,
    windSpeed: 11.8,
    date: "2025-07-31",
    weather: Weather.SNOW
  },
  
  // Germany
  {
    id: "de_berlin_2025_07_31",
    country: "Germany",
    city: "Berlin",
    temperature: 19,
    humidity: 62,
    windSpeed: 8.9,
    date: "2025-07-31",
    weather: Weather.CLOUDY
  },
  {
    id: "de_berlin_2024_02_12",
    country: "Germany",
    city: "Berlin",
    temperature: 19,
    humidity: 62,
    windSpeed: 8.9,
    date: "2024-02-12",
    weather: Weather.CLOUDY
  },
  {
    id: "de_munich_2025_08_31",
    country: "Germany",
    city: "Munich",
    temperature: 24,
    humidity: 48,
    windSpeed: 5.6,
    date: "2025-08-31",
    weather: Weather.SUNNY
  },
  
  // France
  {
    id: "fr_paris_2025_07_31",
    country: "France",
    city: "Paris",
    temperature: 21,
    humidity: 58,
    windSpeed: 7.8,
    date: "2025-07-31",
    weather: Weather.CLOUDY
  },
  {
    id: "fr_nice_2025_07_31",
    country: "France",
    city: "Nice",
    temperature: 27,
    humidity: 52,
    windSpeed: 4.3,
    date: "2025-07-31",
    weather: Weather.SUNNY
  },
  
  // Japan
  {
    id: "jp_tokyo_2025_07_31",
    country: "Japan",
    city: "Tokyo",
    temperature: 30,
    humidity: 75,
    windSpeed: 6.7,
    date: "2025-07-31",
    weather: Weather.SUNNY
  },
  {
    id: "jp_osaka_2025_07_31",
    country: "Japan",
    city: "Osaka",
    temperature: 26,
    humidity: 88,
    windSpeed: 13.2,
    date: "2025-07-31",
    weather: Weather.RAINY
  },
  
  // Australia
  {
    id: "au_sydney_2025_07_31",
    country: "Australia",
    city: "Sydney",
    temperature: 15,
    humidity: 65,
    windSpeed: 14.5,
    date: "2025-07-31",
    weather: Weather.CLOUDY
  },
  {
    id: "au_melbourne_2025_07_31",
    country: "Australia",
    city: "Melbourne",
    temperature: 12,
    humidity: 82,
    windSpeed: 18.9,
    date: "2025-07-31",
    weather: Weather.HAIL
  },
  
  // Brazil
  {
    id: "br_saopaulo_2025_07_31",
    country: "Brazil",
    city: "São Paulo",
    temperature: 23,
    humidity: 72,
    windSpeed: 9.1,
    date: "2025-07-31",
    weather: Weather.RAINY
  },
  {
    id: "br_rio_2025_07_31",
    country: "Brazil",
    city: "Rio de Janeiro",
    temperature: 29,
    humidity: 68,
    windSpeed: 8.2,
    date: "2025-07-31",
    weather: Weather.SUNNY
  },
  
  // India
  {
    id: "in_mumbai_2025_07_31",
    country: "India",
    city: "Mumbai",
    temperature: 32,
    humidity: 85,
    windSpeed: 12.4,
    date: "2025-07-31",
    weather: Weather.CLOUDY
  },
  {
    id: "in_delhi_2025_07_31",
    country: "India",
    city: "New Delhi",
    temperature: 38,
    humidity: 35,
    windSpeed: 4.8,
    date: "2025-07-31",
    weather: Weather.SUNNY
  },
  
  // Norway
  {
    id: "no_oslo_2025_07_31",
    country: "Norway",
    city: "Oslo",
    temperature: 8,
    humidity: 88,
    windSpeed: 16.7,
    date: "2025-07-31",
    weather: Weather.SNOW
  },
  {
    id: "no_bergen_2025_07_31",
    country: "Norway",
    city: "Bergen",
    temperature: 6,
    humidity: 95,
    windSpeed: 22.1,
    date: "2025-07-31",
    weather: Weather.HAIL
  }
];

/**
 * Helper function to get weather data by country
 */
export function getWeatherByCountry(country: string): WeatherData[] {
  return SAMPLE_WEATHER_DATA.filter(
    data => data.country.toLowerCase() === country.toLowerCase()
  );
}

/**
 * Helper function to get weather data by city
 */
export function getWeatherByCity(city: string): WeatherData | undefined {
  return SAMPLE_WEATHER_DATA.find(
    data => data.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Helper function to get all available countries
 */
export function getAvailableCountries(): string[] {
  return Array.from(new Set(SAMPLE_WEATHER_DATA.map(data => data.country)));
}

/**
 * Helper function to get all cities for a specific country
 */
export function getCitiesForCountry(country: string): string[] {
  return SAMPLE_WEATHER_DATA
    .filter(data => data.country.toLowerCase() === country.toLowerCase())
    .map(data => data.city);
}
