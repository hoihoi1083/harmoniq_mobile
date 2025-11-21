// components/DonutChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data }) => {
	const chartData = {
		labels: data.map((item) => item.label),
		datasets: [
			{
				data: data.map((item) => item.value),
				backgroundColor: [
					"rgb(211,65,94)",
					"rgb(39,87,161)",
					"rgb(224,206,107)",
				],
				hoverBackgroundColor: [
					"rgb(211,65,94)",
					"rgb(39,87,161)",
					"rgb(224,206,107)",
				],
			},
		],
	};

	const options = {
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: { enabled: true }, // Explicitly enable tooltips
		},
		hover: { mode: "nearest", intersect: true }, // Optional: improve hover
	};

	return (
		<div style={{ position: "relative", width: 200, height: 200 }}>
			<Doughnut data={chartData} options={options} />
		</div>
	);
};

export default DonutChart;
