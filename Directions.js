import React, { useState, useEffect } from "react";
import placesData from "./iitgoaplaces.json";
import "leaflet/dist/leaflet.css";
import L, { map } from "leaflet";
import "./App.css";
//import { getMap } from "react-leaflet";


const Directions = ({ mapContainer }) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [missingInputs, setMissingInputs] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [routeControl, setRouteControl] = useState(null);
  //const [waypoints, setWaypoints] = useState([]);
  const map = mapContainer.current

  useEffect(() => {
    
    if (!mapContainer.current || !mapContainer.current.leafletElement) {
      return; // Map container or leafletElement not available yet
    }
  
    if (routeControl) {
      mapContainer.current.leafletElement.addControl(routeControl);
    }
  
    return () => {
      if (routeControl) {
        mapContainer.current.leafletElement.removeControl(routeControl);
      }
    };
  }, [mapContainer, routeControl]);

  const handleFromChange = (event) => {
    setFromLocation(event.target.value);
    setShowToSuggestions(false);
    setShowFromSuggestions(true);
    setMissingInputs(false)
  };

  const handleToChange = (event) => {
    setToLocation(event.target.value);
    setShowToSuggestions(true);
    setShowFromSuggestions(false);
    setMissingInputs(false)
  };

  
  const getCoordinates = (location) => {
    return new Promise((resolve, reject) => {
      const foundPlace = placesData.find(
        (place) => place.name.toLowerCase() === location.toLowerCase()
      );
      if (foundPlace) {
        resolve(L.latLng(foundPlace.latitude, foundPlace.longitude));
      } else {
        reject("Location not found");
      }
    });
  };

  const getSuggestions = (input) => {
    const inputValue = input.trim().toLowerCase();
    return placesData.filter((place) =>
      place.name.toLowerCase().startsWith(inputValue)
    );
  };

  const handleSuggestionClickTo = (placeName) => {
    setToLocation(placeName);
    setShowToSuggestions(false);
    setShowFromSuggestions(false);
  };

  const handleSuggestionClickFrom = (placeName) => {
    setFromLocation(placeName);
    setShowToSuggestions(false);
    setShowFromSuggestions(false);
  };


  const handleGetDirection = () => {
    
    if (toLocation && fromLocation) {
      setMissingInputs(false);
      const startLatLng = getCoordinates(fromLocation);
      const endLatLng = getCoordinates(toLocation);
      console.log("The start coordinates are", startLatLng);
      console.log("The end coordinates are", endLatLng);
      Promise.all([startLatLng, endLatLng])
        .then(([start, end]) => {
          const routingControl = L.Routing.control({
            waypoints: [start, end],
            lineOptions: {
              styles: [
                {
                  color: "blue",
                  opacity: 0.6,
                  weight: 4,
                },
              ],
            },
            addWaypoints: true,
            draggableWaypoints: true,
            fitSelectedRoutes: true,
            showAlternatives: false,
          });
          
          setRouteControl(routingControl);
          routingControl.addTo(map);
        })
        .catch((error) => {
          console.log("Error getting coordinates:", error);
        });
    } else {
      setMissingInputs(true);
    }
  };
  
  // useEffect to log routeControl whenever it changes
  useEffect(() => {
    console.log("the routecontrol is",routeControl);
  }, [routeControl]);

  return (
    <div>
      <div className="input-group">
        <label htmlFor="from">From</label>
        <input
          className={`${missingInputs && !fromLocation ? "missing-input" : ""}`} type="text"
          id="from"
          autoComplete="off"
          value={fromLocation}
          placeholder="From"
          onChange={handleFromChange}
        />
        {showFromSuggestions && getSuggestions(fromLocation).length > 0 && (
          <ul className="suggestions-list">
            {getSuggestions(fromLocation).map((place) => (
              <li
                key={place.name}
                onClick={() => handleSuggestionClickFrom(place.name)}
              >
                {place.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="to">To</label>
        <input
          className={`${missingInputs && !toLocation ? "missing-input" : ""}`} type="text"
          id="to"
          autoComplete="off"
          value={toLocation}
          placeholder="To"
          onChange={handleToChange}
        />
        {showToSuggestions && getSuggestions(toLocation).length > 0 && (
          <ul className="suggestions-list">
            {getSuggestions(toLocation).map((place) => (
              <li
                key={place.name}
                onClick={() => handleSuggestionClickTo(place.name)}
              >
                {place.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {missingInputs && (
        <p className="error">Please fill in both input fields.</p>
      )}

      <button onClick={handleGetDirection}>Get Directions</button>
    </div>
  );
};

export default Directions;
