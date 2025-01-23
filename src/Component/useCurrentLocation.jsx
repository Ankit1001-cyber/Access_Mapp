import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
    };

    const error = () => {
      setError("Unable to retrieve your location.");
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  return { currentLocation, error };
};

export default useCurrentLocation;
