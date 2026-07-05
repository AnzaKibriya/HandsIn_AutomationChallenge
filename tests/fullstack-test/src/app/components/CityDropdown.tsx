import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { getCitiesForCountry } from "../api/weather/weather-data";

interface CityDropdownProps {
	value: string;
	onChange: (city: string) => void;
	country: string;
	disabled?: boolean;
	showClearButton?: boolean;
	onClear?: () => void;
	className?: string;
}

export default function CityDropdown({ 
	value, 
	onChange, 
	country,
	disabled = false,
	showClearButton = true,
	onClear,
	className = "" 
}: CityDropdownProps) {
	const [cities, setCities] = useState<string[]>([]);

	useEffect(() => {
		if (country) {
			// Load cities for the selected country
			const availableCities = getCitiesForCountry(country);
			// Remove duplicates and sort
			const uniqueCities = Array.from(new Set(availableCities)).sort();
			setCities(uniqueCities);
		} else {
			setCities([]);
		}
	}, [country]);


	return (
		<Dropdown
			label="City"
			value={value}
			onChange={onChange}
			options={cities}
			placeholder={country ? "Select a city" : "Select a country first"}
			disabled={disabled || !country}
			showClearButton={showClearButton}
			onClear={onClear}
			className={className}
			id="city-dropdown"
		/>
	);
}
