import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { getAvailableCountries } from "../api/weather/weather-data";

interface CountryDropdownProps {
	value: string;
	onChange: (country: string) => void;
	disabled?: boolean;
	className?: string;
}

export default function CountryDropdown({ 
	value, 
	onChange, 
	disabled = false, 
	className = "" 
}: CountryDropdownProps) {
	const [countries, setCountries] = useState<string[]>([]);

	useEffect(() => {
		// Load available countries from the weather data
		const availableCountries = getAvailableCountries();
		setCountries(availableCountries.sort());
	}, []);

	return (
		<Dropdown
			label="Country"
			value={value}
			onChange={onChange}
			options={countries}
			placeholder="Select a country"
			disabled={disabled}
			className={className}
			id="country-dropdown"
		/>
	);
}
