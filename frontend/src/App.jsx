import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultTable from './components/ResultTable';
import SunChart from './components/SunChart';
import DayLengthChart from './components/DayLengthChart';
import './App.css';

function App() {
  // State to hold the fetched sunrise/sunset data
  const [sunData, setSunData] = useState([]);
  // State to control selected time format (24h or 12h)
  const [timeFormat, setTimeFormat] = useState("24h");

  return (
    <div>
      <h1>Sunrise & Sunset Viewer</h1>
      {/* Input form to search for location and date range */}
      <SearchForm setData={(data) => {
        setSunData(data);
      }} />
      {/* Show results only if data has been fetched */}
      {sunData.length > 0 && (
        <>
        <div className="layout">
          {/* Table displaying sunrise/sunset times */}
          <div className="table-container">
            <ResultTable data={sunData} timeFormat={timeFormat}/>
          </div>
          {/* Line chart showing sunrise/sunset progression */}
          <div className="chart-container">
            <SunChart data={sunData} timeFormat={timeFormat} />
          </div>
          {/* Chart showing the length of each day */}
          <div className="daylengthchart-container">
            <DayLengthChart data={sunData} timeFormat="24h" />
          </div>
        </div>
      </>
      )}

      {/* Dropdown to switch between 24h and 12h display formats */}
      <div className="format-select">
        <label>
          Time format:&nbsp;
          <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
            <option value="24h">24h format</option>
            <option value="12h">12h format</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default App;