import React, { useState } from 'react';
import axios from 'axios';
import './SearchForm.css';

function SearchForm({ setData }) {
  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  
  // Default end date: today + 3 days
  const defaultEndDate = new Date(today);
  defaultEndDate.setDate(defaultEndDate.getDate() + 3);
  const endStr = defaultEndDate.toISOString().split("T")[0];

  // Form state
  const [location, setLocation] = useState("");
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(endStr);

  // Handle form submission and API request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date range
    if (start && end && new Date(end) < new Date(start)) {
      alert("The end date must not be earlier than the start date.");
      return;
    }

    const params = { location };
    if (start) params.start = start;
    if (end) params.end = end;

    try {
        // Send GET request to backend API
        const response = await axios.get("/api/sun", {
            params: { location, start, end }
          });
        console.log("Received data:", response.data);
        setData(response.data);
    } catch (error) {
        console.error("API-Error:", error);
        alert("Error. Please check Location and Date.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={location}
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        max={end}
        required
      />
      <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        min={start}
        required
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;