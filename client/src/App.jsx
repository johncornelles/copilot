import React, { useState } from "react";
import axios from "axios";
import { storage } from "./firebase.js"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; 

const App = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [incidents, setIncidents] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        console.log("File available at", url);
      }
    );
  };

  const test = async () => {
    try {
      const res = await axios.get("http://localhost:3500/incidents");
      console.log(res.data);
      setIncidents(res.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const post = async () => {
    try {
      let data = {
        "id": uuidv4(),
        "time_date": "2025-03-29 08:30",
        "building": "Building A",
        "primary_category": "Fire",
        "incident_category": "Electrical Fire",
        "secondary_category": "Short Circuit",
        "severity": "High",
        "incident_level": "Level 3",
        "probability": "Likely",
        "description": "Smoke detected in server room.",
        "incident_url": downloadURL
      };

      const res = await axios.post("http://localhost:3500/incidents", data, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Response:", res.data);
      setIncidents(res.data)
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
      <div style={{ overflow: "scroll", height: "700px", display:"flex", flexDirection:"column" } }>
      {
        incidents && incidents.map((incident, index) => (
          <div key={index}>
            <p ></p>
            <p>Time Date: {incident.time_date}</p>
            <p>Building: {incident.building}</p>
            <p>Primary Category: {incident.primary_category}</p>
            <p>Incident Category: {incident.incident_category}</p>
            <p>Secondary Category: {incident.secondary_category}</p>
            <p>Severity: {incident.severity}</p>
            <p>Incident Level: {incident.incident_level}</p>
            <p>Probability: {incident.probability}</p>
            <p>Description: {incident.description}</p>
            <img src={incident.incident_url} height="400px" width="400px" />
          </div>
        ))
      }
      </div>
      <button onClick={test}>test</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>Upload Progress: {progress}%</p>
      {downloadURL && (
        <p>
          File URL: <a href={downloadURL} target="_blank" rel="noopener noreferrer">{downloadURL}</a>
        </p>
      )}
      <button onClick={post}>post</button>
    </div>
  );
};

export default App;
