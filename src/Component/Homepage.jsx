import React, { useState, useEffect } from "react";
import axios from "axios";
import map from "./map.jpg"
import styles from "../Styles/homePage.module.css";

const HomePage = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/incidents")
      .then((response) => setIncidents(response.data))
      .catch((error) => console.error("Error fetching incidents:", error));
  }, []);

  return (
    <div className={styles.homeContainer}>
      <h2>Reported Incidents</h2>
      <div className={styles.incidentsGrid}>
        {incidents
          .filter((incident) => incident.votes.true > 5)
          .map((incident) => (
            <div key={incident.id} className={styles.incidentCard}>
              <h3>{incident.description}</h3>
              <p>Location: {incident.location}</p>
              <div className={styles.images}>
                {incident.images.map((image, index) => (
                  <img
                    key={index}
                    src={`/${image.path}`}
                    alt={`Incident ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Sample Card  */}
      <div className={styles.sampleIncidentCard}>
        <h3>Sample Incident</h3>
        <div className={styles.images}>
          <img
            src={map}
            alt="Sample Incident"
          />
        </div>
        <p>Location: Sample Location</p>
      </div>

      {/* Contact Us Section */}
      <div className={styles.contactUs}>
        <h2>Contact Us</h2>
        <p>If you have any questions or need assistance, feel free to contact us:</p>
        <p>Email: ankit.d.vishwakarma@gmail.com</p>
        <p>Phone: +91 12345 67890</p>
        <p>Address: 123 Access Map Street, City, Country</p>
      </div>
    </div>
  );
};

export default HomePage;
