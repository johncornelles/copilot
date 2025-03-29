import React from 'react';
import axios from 'axios'; // Fixed typo

const App = () => {
const test = async () => {
    try {
      const res = await axios.get("http://localhost:3500/incidents");
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const post = async () => {
    try {
      let data = {
        "time_date": "2025-03-29 08:30",
        "building": "Building A",
        "primary_category": "Fire",
        "incident_category": "Electrical Fire",
        "secondary_category": "Short Circuit",
        "severity": "High",
        "incident_level": "Level 3",
        "probability": "Likely",
        "description": "Smoke detected in server room."
      };

      const res = await axios.post("http://localhost:3500/incidents", data, {
        headers: { "Content-Type": "application/json" } 
      });

      console.log("Response:", res.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
      <button onClick={test}>test</button>

      <button onClick={post}>post</button>
    </div>
  );
};

export default App;
