import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./SunChart.css";
import { parseTimeToTimestamp, formatMsToTimeLabel } from "./SunChartHelpers.js"; 


// Register required Chart.js components
ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SunChart({ data, timeFormat }) {
  /**
   * Converts date/time strings into chart-compatible {x, y} points
   * - x: date object at midnight of the given day
   * - y: time of day in milliseconds (parsed)
   */
  const createSeries = (label, key, color) =>
    data
      .map((d) => {
        const ms = parseTimeToTimestamp(d[key]);
        if (ms === null) return null; // skip invalid entries
        return {
          x: new Date(`${d.date}T00:00:00`),
          y: ms,
        };
      })
      .filter(Boolean);

  // Dataset configuration for the line chart
  const chartData = {
    datasets: [
      {
        label: "Sunrise",
        data: createSeries("Sunrise", "sunrise", "sunrise"),
        borderColor: "rgba(253, 184, 19, 0.8)",
        tension: 0.3,
      },
      {
        label: "Golden Hour",
        data: createSeries("Golden Hour", "golden_hour", "golden"),
        borderColor: "rgba(255, 128, 0, 0.8)",
        tension: 0.3,
      },
      {
        label: "Sunset",
        data: createSeries("Sunset", "sunset", "sunset"),
        borderColor: "rgba(215, 38, 61, 0.8)",
        tension: 0.3,
      },
    ],
  };

  // Chart.js configuration object
  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "yyyy-MM-dd",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear",
        min: 0,
        max: 24 * 60 * 60 * 1000, // 24 hours in ms
        ticks: {
          stepSize: 60 * 60 * 1000, // 1 hour
          callback: (val) => formatMsToTimeLabel(val, timeFormat),
        },
        title: {
          display: true,
          text: "Time of Day"
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: () => "", // omit tooltip title
          label: (context) => {
            const label = context.dataset.label;
            const val = context.parsed.y;
            return `${label}: ${formatMsToTimeLabel(val, timeFormat)}`;
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export default SunChart;
