import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const { register, handleSubmit, reset } = useForm();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

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
      }
    );
  };

  const fetchIncidents = async () => {
    try {
      const res = await axios.get("http://localhost:3500/incidents");
      setIncidents(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addIncident = async (data) => {
    try {
      const incidentData = { ...data, id: uuidv4(), incident_url: downloadURL };
      await axios.post("http://localhost:3500/incidents", incidentData, {
        headers: { "Content-Type": "application/json" },
      });
      setIncidents([...incidents, incidentData]);
      reset();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const deleteIncident = async (id) => {
    try {
      await axios.delete("http://localhost:3500/incidents/${id}");
      setIncidents(incidents.filter((incident) => incident.id !== id));
    } catch (error) {
      console.error("Error deleting incident:", error);
    }
  };

  const updateIncident = async (id) => {
    try {
      const updatedData = { severity: "Updated Severity", description: "Updated description" };
      const res = await axios.put("http://localhost:3500/incidents/${id}", updatedData, {
        headers: { "Content-Type": "application/json" }
      });

      setIncidents(
        incidents.map((incident) =>
          incident.id === id ? { ...incident, ...updatedData } : incident
        )
      );
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };


  return (
    <div>
      <div style={{ overflow: "scroll", height: "700px", display: "flex", flexDirection: "column" }}>
        {incidents.map((incident) => (
          <div key={incident.id} style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
            <p>Time Date: {incident.time_date}</p>
            <p>Building: {incident.building}</p>
            <p>Primary Category: {incident.primary_category}</p>
            <p>Incident Category: {incident.incident_category}</p>
            <p>Severity: {incident.severity}</p>
            <p>Description: {incident.description}</p>
            {incident.incident_url && <img src={incident.incident_url} height="200px" width="200px" alt="Incident" />}
            <button onClick={() => deleteIncident(incident.id)}>Delete</button>
            <button onClick={() => updateIncident(incident.id)}>Update</button>
          </div>
        ))}
      </div>
      
      <p>Upload Progress: {progress}%</p>
      {downloadURL && (
        <p>
          File URL: <a href={downloadURL} target="_blank" rel="noopener noreferrer">{downloadURL}</a>
        </p>
      )}
    </div>
  );
};

export default App;
