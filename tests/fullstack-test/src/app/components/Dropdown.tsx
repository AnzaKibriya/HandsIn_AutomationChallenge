interface DropdownProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: string[];
	placeholder?: string;
	disabled?: boolean;
	showClearButton?: boolean;
	onClear?: () => void;
	className?: string;
	id?: string;
}

export default function Dropdown({
	label,
	value,
	onChange,
	options,
	placeholder = "Select an option",
	disabled = false,
	showClearButton = false,
	onClear,
	className = "",
	id,
}: DropdownProps) {
	const selectId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className={`space-y-2 ${className}`}>
			<label htmlFor={selectId} className="block text-sm font-medium text-gray-700">{label}</label>
			<div className="flex gap-2">
				<select
					id={selectId}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
				>
					<option value="">{placeholder}</option>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
				{showClearButton && onClear && (
					<button
						type="button"
						onClick={onClear}
						disabled={disabled}
						className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						Clear
					</button>
				)}
			</div>
		</div>
	);
}
