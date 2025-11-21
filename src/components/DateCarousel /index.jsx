import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

export const years = Array.from({ length: 100 }, (_, i) =>
	(2025 - i).toString()
);
export const months = Array.from({ length: 12 }, (_, i) =>
	(i + 1).toString().padStart(2, "0")
);
export const days = Array.from({ length: 31 }, (_, i) =>
	(i + 1).toString().padStart(2, "0")
);
export const hours = Array.from({ length: 24 }, (_, i) =>
	i.toString().padStart(2, "0")
);

export default function MyPicker(props) {
	const { tHour, onChange, customYears } = props; // Add customYears prop

	// Use custom years if provided, otherwise use default years
	const yearsToUse = customYears || years;

	const selections = {
		years: yearsToUse, // Use the appropriate years array
		months,
		days,
		hours,
	};

	const [pickerValue, setPickerValue] = useState({
		years: "1996",
		months: "04",
		days: "15",
		hours: "12",
	});
	useEffect(() => {
		if (props.value) {
			setPickerValue({
				years: props.value[0],
				months: props.value[1],
				days: props.value[2],
				hours: props.value[3],
			});
		}
	}, [props.value]);

	const onValueChange = (value) => {
		//setPickerValue(value);
		if (onChange) {
			onChange([value.years, value.months, value.days, value.hours]);
		}
	};
	const getOption = (option, key) => {
		switch (key) {
			case "years":
				return option + "年";
			case "months":
				return option + "月";
			case "days":
				return option + "日";
			case "hours":
				return option + tHour;
		}
	};

	return (
		<Picker value={pickerValue} onChange={onValueChange}>
			{Object.keys(selections).map((item) => (
				<Picker.Column key={item} name={item}>
					{selections[item].map((option) => (
						<Picker.Item key={option} value={option}>
							{getOption(option, item)}
						</Picker.Item>
					))}
				</Picker.Column>
			))}
		</Picker>
	);
}
