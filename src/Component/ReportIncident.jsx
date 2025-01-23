import React, { useState } from "react";
import axios from "axios";
import styles from "../Styles/reportIncident.module.css";

const ReportIncident = ({ onIncidentReported }) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await axios.post("/api/incidents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onIncidentReported(response.data);
      setDescription("");
      setLocation("");
      setImages([]);
    } catch (error) {
      alert("Failed to report incident.");
    }
  };

  return (
    <div className={styles.reportContainer}>
      <form onSubmit={handleSubmit}>
        <h2>Report Incident</h2>
        <textarea
          placeholder="Describe the incident"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*"
        />
        <br />
        <center>
          <button type="submit">Report</button>
        </center>
      </form>
    </div>
  );
};

export default ReportIncident;
