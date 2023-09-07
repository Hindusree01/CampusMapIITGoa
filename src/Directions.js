import React, { useState, useEffect, useRef } from "react";
import placesData from "./iitgoaplaces.json";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";
import "leaflet-control-geocoder";

const Directions = ({ mapContainer, ToLocation = "" }) => {
  const [fromLocation, setFromLocation] = useState("Current Location");
  const [toLocation, setToLocation] = useState(ToLocation);
  const [missingInputs, setMissingInputs] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [routeControl, setRouteControl] = useState(null);
  const map = mapContainer.current;
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = mapContainer?.leafletElement;
  }, [mapContainer]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowToSuggestions(false);
        setShowFromSuggestions(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".input-group") &&
        !event.target.closest(".suggestions-list")
      ) {
        setShowToSuggestions(false);
        setShowFromSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setToLocation(ToLocation);
  }, [ToLocation]);

  const handleFromChange = (event) => {
    setFromLocation(event.target.value);
    setShowToSuggestions(false);
    setShowFromSuggestions(true);
    setMissingInputs(false);
  };

  const handleToChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setToLocation("");
      setShowToSuggestions(true);
    } else {
      setToLocation(value);
      setShowToSuggestions(true);
    }
    setShowFromSuggestions(false);
    setMissingInputs(false);
  };

  const getCoordinates = (location) => {
    return new Promise((resolve, reject) => {
      const foundPlace = placesData.find(
        (place) => place.name.toLowerCase() === location.toLowerCase()
      );
      if (foundPlace) {
        resolve(L.latLng(foundPlace.pathFindingLocation.lat, foundPlace.pathFindingLocation.long));
      } else {
        reject("Location not found");
      }
    });
  };

  const getSuggestions = (input) => {
    const inputValue = input.trim().toLowerCase();
    if (inputValue === "") {
      return placesData;
    } else {
      return placesData.filter((place) =>
        place.name.toLowerCase().startsWith(inputValue)
      );
    }
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

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(
              L.latLng(position.coords.latitude, position.coords.longitude)
            );
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

      if (fromLocation === "Current Location") {
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
            fitSelectedRoutes: true,
            showAlternatives: false,
            createMarker: function (i, wp) {
              return L.marker(wp.latLng, {
                draggable: true,
                icon: L.icon({
                  iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  tooltipAnchor: [16, -28],
                  shadowSize: [41, 41],
                }),
              })
            },
          });

          setRouteControl(routingControl);
          routingControl.addTo(map);
          mapContainer.current.removeControl(routeControl);
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

  return (
    <div>
      <div className="input-group">
        <label htmlFor="source">Source</label>
        <input
          className={`${missingInputs && !fromLocation ? "missing-input" : ""}`}
          type="text"
          id="source"
          autoComplete="off"
          value={fromLocation}
          placeholder="Source"
          onChange={handleFromChange}
          onClick={() => setShowFromSuggestions(true)}
        />
        {showFromSuggestions && (
          <ul className="suggestions-list">
            <li onClick={() => handleSuggestionClickFrom("Current Location")}>
              Current Location
            </li>
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
        <label htmlFor="destination">Destination</label>
        <input
          className={`${missingInputs && !toLocation ? "missing-input" : ""}`}
          type="text"
          id="destination"
          autoComplete="off"
          value={toLocation}
          placeholder="Destination"
          onChange={handleToChange}
          onClick={() => setShowToSuggestions(true)}
        />
        {showToSuggestions && (
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
