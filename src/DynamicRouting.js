import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

function DynamicRouting() {
  const map = useMap();
  const [waypoints, setWaypoints] = useState([]);
  const [control, setControl] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    function onMapClick(e) {
      const latLng = L.latLng(e.latlng.lat, e.latlng.lng);
      setWaypoints([currentLocation, latLng]);
    
      // Create a custom icon
      const customIcon = L.icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNPEDK7qLpybdsZtJ4Fc6ifgNdGzG3vO48g&usqp=CAU",
        iconSize: [25, 25], // specify the size of the icon
       
      });
    
      // Add a marker with the custom icon to the map
      L.marker(latLng, { icon: customIcon }).addTo(map);
    }

    map.on("click", onMapClick);

    return () => {
      map.off("click", onMapClick);
      if (control) {
        control.getPlan().setWaypoints([]);
        map.removeControl(control);
      }
    };
  }, [map, control, currentLocation]);

  useEffect(() => {
    // Get the user's current position using the Geolocation API
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const userLatLng = L.latLng(latitude, longitude);
      setCurrentLocation(userLatLng);
    });
  }, []);

  useEffect(() => {
    if (waypoints.length > 1) {
      if (control) {
        control.getPlan().setWaypoints(waypoints);
      } else {
        const routingControl = L.Routing.control({
          waypoints: waypoints,
          lineOptions: {
            styles: [
              {
                color: "blue",
                opacity: 0.6,
                weight: 4,
              },
            ],
          },
          addWaypoints: false,
          draggableWaypoints: true,
          fitSelectedRoutes: false,
          showAlternatives: false,
        }).addTo(map);

        setControl(routingControl);
      }
    }
  }, [map, waypoints, control]);

  return null;
}

export default DynamicRouting;