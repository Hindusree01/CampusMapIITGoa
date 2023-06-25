import React, { useState, useEffect, useRef } from "react";
import placesData from "./iitgoaplaces.json";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";
import "leaflet-control-geocoder";


const Directions = ({ mapContainer }) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [missingInputs, setMissingInputs] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [routeControl, setRouteControl] = useState(null);
  const [useUserLocation, setUseUserLocation] = useState(false);
  const map = mapContainer.current
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = mapContainer?.leafletElement;
  }, [mapContainer]);

  useEffect(() => {
    if (!mapRef.current) {
      return; // Map container not available yet
    }

    if (routeControl) {
      mapRef.current.addControl(routeControl);
    }

    return () => {
      if (routeControl) {
        mapRef.current.removeControl(routeControl);
      }
    };
  }, [routeControl]);

  const handleFromChange = (event) => {
    setFromLocation(event.target.value);
    setShowToSuggestions(false);
    setShowFromSuggestions(true);
    setMissingInputs(false);
    setUseUserLocation(false);
  };

  const handleToChange = (event) => {
    setToLocation(event.target.value);
    setShowToSuggestions(true);
    setShowFromSuggestions(false);
    setMissingInputs(false);
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
    setUseUserLocation(false);
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(L.latLng(position.coords.latitude, position.coords.longitude));
          },
          (error) => {
            reject("Failed to get user's location");
          }
        );
      } else {
        reject("Geolocation not supported");
      }
    });
  };
  const handleGetDirection = async () => {
    if (toLocation) {
      setMissingInputs(false);
      let startLatLng;

      if (useUserLocation) {
        try {
          startLatLng = await getUserLocation();
        } catch (error) {
          console.log("Error getting user location:", error);
          setMissingInputs(true);
          return;
        }
      } else {
        if (!fromLocation) {
          setMissingInputs(true);
          return;
        }
        startLatLng = await getCoordinates(fromLocation);
      }

      const endLatLng = await getCoordinates(toLocation);

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
            fitSelectedRoutes: false,
            showAlternatives: false,
            createMarker: function (i, wp) {
              return L.marker(wp.latLng, {
                draggable: true,
                icon: L.icon({
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  tooltipAnchor: [16, -28],
                  shadowSize: [41, 41],
                }),
              }).bindPopup('<div class="custom-popup"></div>'); 
            },
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



  useEffect(() => {
    console.log("the routecontrol is", routeControl);
  }, [routeControl]);

  const CurrentLocatoionHandler = () => {
    setUseUserLocation(true);
    setFromLocation("Current Location");

  }

  return (
    <div>
      
      <div className="input-group">
        <label htmlFor="from">From</label>
        <br />
        <input
          className={`${missingInputs && !fromLocation ? "missing-input" : ""}`}
          type="text"
          id="from"
          autoComplete="off"
          value={fromLocation}
          placeholder="From"
          onChange={handleFromChange}
        />
        <button onClick={CurrentLocatoionHandler}>Current Location</button>
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
        <br />
        <input
          className={`${missingInputs && !toLocation ? "missing-input" : ""}`}
          type="text"
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

      {missingInputs && <p className="error">Please fill in both input fields.</p>}

      <button onClick={handleGetDirection}>Get Directions</button>
    </div>
  );
};

export default Directions;