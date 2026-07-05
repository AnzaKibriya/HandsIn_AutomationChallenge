import { Weather, WeatherService } from "./WeatherService";
import { DefaultWeatherService } from "../../../examined/DefaultWeatherService";
import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";

const weatherService: WeatherService = new DefaultWeatherService();

/**
 * GET /api/weather
 *
 * Query parameters:
 * - country: string (required) - The country name
 * - city: string (optional) - Specific city name
 * - date: string (optional) - Date in YYYY-MM-DD format
 *
 * Returns:
 * - If no city provided: all weather data for the country
 * - If no date provided: latest weather report
 * - If both provided: specific city weather for date
 */
export async function GET(request: NextRequest) {
	const date = request.nextUrl.searchParams.get("date") ?? undefined;
	const city = request.nextUrl.searchParams.get("city") ?? undefined;
	const country = request.nextUrl.searchParams.get("country") ?? undefined;

	const WeatherQuerySchema = z.object({
		country: z.string().min(1, "Country is required"),
		city: z.string().min(1, "City is required").optional(),
		date: z.coerce.date().optional(),
	});

	const parseResult = WeatherQuerySchema.safeParse({ date, city, country });

	if (!parseResult.success) {
		return NextResponse.json({ error: "Invalid request", details: parseResult.error.issues }, { status: 400 });
	}

	return NextResponse.json(weatherService.getWeather(parseResult.data));
}

/**
 * POST /api/weather
 *
 * Request body: WeatherData object
 * Updates weather for a specific date and location
 */
export async function POST(request: NextRequest) {
	const WeatherDataSchema = z.object({
		country: z.string().min(1, "Country is required"),
		city: z.string().min(1, "City is required"),
		temperature: z.number(),
		humidity: z.number(),
		windSpeed: z.number(),
		date: z.string(),
		weather: z.enum(Weather),
	});

	try {
		const body = await request.json();
		const parseResult = WeatherDataSchema.safeParse(body);
		if (!parseResult.success) {
			return NextResponse.json({ error: "Invalid request body", details: parseResult.error.issues }, { status: 400 });
		}
		
		// Add ID if not provided
		const weatherData = { 
			id: crypto.randomUUID(), 
			...parseResult.data 
		};
		
		weatherService.updateWeather(weatherData);
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: "Invalid request body or server error" }, { status: 400 });
	}
}
