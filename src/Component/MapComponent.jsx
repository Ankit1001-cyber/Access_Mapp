import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import useCurrentLocation from "./useCurrentLocation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../Styles/mapComponent.module.css";

// Ensure the leaflet icons are correctly referenced
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const createCustomIcon = (color) => {
  return L.divIcon({
    className: "leaflet-div-icon",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid #ffffff;"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const sampleIcons = {
  ramp: createCustomIcon("green"),
  elevator: createCustomIcon("purple"),
  wheelchair: createCustomIcon("blue"),
  escalator: createCustomIcon("red"),
};

const MapComponent = () => {
  const { currentLocation, error } = useCurrentLocation();
  const [markers, setMarkers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [markerType, setMarkerType] = useState("ramp");

  useEffect(() => {
    axios
      .get("/api/locations")
      .then((response) => setMarkers(response.data))
      .catch((error) => console.error("Error fetching markers:", error));

    axios
      .get("/api/incidents")
      .then((response) => setIncidents(response.data))
      .catch((error) => console.error("Error fetching incidents:", error));
  }, []);

  const addMarker = (e) => {
    const newMarker = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      type: markerType,
      description: `${
        markerType.charAt(0).toUpperCase() + markerType.slice(1)
      } available`,
    };

    axios
      .post("/api/locations", newMarker)
      .then((response) => {
        setMarkers([...markers, { ...newMarker, id: response.data.id }]);
      })
      .catch((error) => console.error("Error adding marker:", error));
  };

  const removeMarker = (id) => {
    axios
      .delete(`/api/locations/${id}`)
      .then(() => {
        setMarkers(markers.filter((marker) => marker.id !== id));
      })
      .catch((error) => console.error("Error removing marker:", error));
  };

  const voteIncident = (incidentId, vote) => {
    axios
      .post(`/api/incidents/vote/${incidentId}`, { vote })
      .then((response) => {
        setIncidents(
          incidents.map((incident) =>
            incident.id === incidentId
              ? { ...incident, votes: response.data.votes }
              : incident
          )
        );
      })
      .catch((error) => console.error("Error voting on incident:", error));
  };
  //  sample records
  const generateSampleMarkers = (location) => {
    const sampleMarkers = [
      {
        id: "sample1",
        latitude: location[0] + 0.001,
        longitude: location[1],
        type: "ramp",
        description: "Ramp available",
      },
      {
        id: "sample2",
        latitude: location[0] - 0.001,
        longitude: location[1],
        type: "elevator",
        description: "Elevator available",
      },
      {
        id: "sample3",
        latitude: location[0],
        longitude: location[1] + 0.001,
        type: "wheelchair",
        description: "Wheelchair accessible",
      },
      {
        id: "sample4",
        latitude: location[0],
        longitude: location[1] - 0.001,
        type: "escalator",
        description: "Escalator available",
      },
    ];
    return sampleMarkers;
  };

  const sampleMarkers = currentLocation
    ? generateSampleMarkers([currentLocation.lat, currentLocation.lng])
    : [];

  return (
    <MapContainer
      center={currentLocation || [51.505, -0.09]}
      zoom={13}
      className={styles.mapContainer}
      whenCreated={(map) => {
        map.on("click", addMarker);
        if (currentLocation) {
          map.setView(currentLocation, 13);
        }
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {currentLocation && (
        <Marker position={currentLocation} icon={customIcon}>
          <Popup>You are here!</Popup>
        </Marker>
      )}

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={customIcon}
        >
          <Popup>
            {marker.description}
            <br />
            <button onClick={() => removeMarker(marker.id)}>Remove</button>
          </Popup>
        </Marker>
      ))}

      {sampleMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={sampleIcons[marker.type]}
        >
          <Popup>{marker.description}</Popup>
        </Marker>
      ))}

      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={customIcon}
        >
          <Popup>
            {incident.description}
            <br />
            <button onClick={() => voteIncident(incident.id, "true")}>
              Vote True
            </button>
            <button onClick={() => voteIncident(incident.id, "false")}>
              Vote False
            </button>
            <br />
            Votes: {incident.votes.true} True, {incident.votes.false} False
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
