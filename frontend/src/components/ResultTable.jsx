import "./ResultTable.css";
import { parseTimeToTimestamp, formatMsToTimeLabel } from "./SunChartHelpers";

function ResultTable({ data, timeFormat }) {
  const hasInvalidData = data.some(
    (entry) =>
      entry.sunrise === "N/A" ||
      entry.sunset === "N/A" ||
      entry.golden_hour === "N/A"
  );
  return (
    <div className="result-table-container">
      {/* Display warning if any row contains invalid data */}
      {hasInvalidData && (
        <div className="error-message">
          Warning: Some entries contain invalid data and could not be displayed correctly.
        </div>
      )}
      <table className="result-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Sunrise</th>
            <th>Golden Hour</th>
            <th>Sunset</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr key={i} className={
              entry.sunrise === "N/A" || entry.sunset === "N/A" || entry.golden_hour === "N/A"
                ? "error-row"
                : ""
            }>
              <td>{entry.date}</td>
              <td className="sunrise">
                {entry.sunrise === "N/A" || entry.sunrise === null
                  ? "Error: Sunrise not available"
                  : formatMsToTimeLabel(parseTimeToTimestamp(entry.sunrise), timeFormat)}
              </td>
              <td className="golden">
                {entry.golden_hour === "N/A" || entry.golden_hour === null
                  ? "Error: Golden Hour not available"
                  : formatMsToTimeLabel(parseTimeToTimestamp(entry.golden_hour), timeFormat)}
              </td>
              <td className="sunset">
                {entry.sunset === "N/A" || entry.sunset === null
                  ? "Error: Sunset not available"
                  : formatMsToTimeLabel(parseTimeToTimestamp(entry.sunset), timeFormat)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;
