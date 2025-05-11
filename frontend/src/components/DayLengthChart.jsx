import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { parseTimeToTimestamp, formatMsToTimeLabel } from "./SunChartHelpers";
import "./SunChart.css";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DayLengthChart({ data, timeFormat }) {
 
    /**
   * Filter out entries that have invalid or incomplete time values.
   * Ensures that only entries with valid sunrise/sunset and sunset > sunrise are plotted.
   */
  const validEntries = data.filter((d) => {
    const sunrise = parseTimeToTimestamp(d.sunrise);
    const sunset = parseTimeToTimestamp(d.sunset);
    return sunrise !== null && sunset !== null && sunset > sunrise;
  });

  // Prepare dataset for Chart.js (Floating Bar from sunrise to sunset)
  const chartData = {
    labels: validEntries.map((d) => d.date),
    datasets: [
      {
        label: "Daylight",
        data: validEntries.map((d) => {
          const sunrise = parseTimeToTimestamp(d.sunrise);
          const sunset = parseTimeToTimestamp(d.sunset);
          return [sunrise, sunset]; // floating bar
        }),
        backgroundColor: "rgba(100, 149, 237, 0.6)",
        borderColor: "rgba(100, 149, 237, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options including time formatting and tooltip customization
  const options = {
    responsive: true,
    indexAxis: "x",
    scales: {
      y: {
        min: parseTimeToTimestamp("00:00:00"),
        max: parseTimeToTimestamp("23:59:59"),
        ticks: {
          stepSize: 60 * 60 * 1000, // 1 hour
          callback: (val) => formatMsToTimeLabel(val, timeFormat),
        },
        title: {
          display: true,
          text: "Time of Day",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const [start, end] = context.raw;
            const duration = end - start;
            return `Sunrise: ${formatMsToTimeLabel(start, timeFormat)} | Sunset: ${formatMsToTimeLabel(end, timeFormat)} | Length: ${formatMsToTimeLabel(duration, timeFormat)}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default DayLengthChart;
