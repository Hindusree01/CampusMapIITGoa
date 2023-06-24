import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import BuildingMarkers from "./BuildingMarker";
import buildingsData from './iitgoaplaces.json';
import CheckBox from "./CheckBox";
import SearchBar from "./SearchBar";
import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import Direction from "./Directions";
import '@fortawesome/fontawesome-free/css/all.min.css';



const buildingTypes = [
  { type: "Office", url: "https://www.freeiconspng.com/thumbs/office-icon/office-icon--insharepics-11.png" },
  { type: "Classroom", url: "https://cdn-icons-png.flaticon.com/512/185/185578.png" },
  { type: "Ground", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr8ujkX0fQQsKgF8yc8SOEhJdADH0dQUYzeA&usqp=CAU" },
  { type: "Gym", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaTVrtdfW9JzqRHQ-p_gg0QlZeyiEiAcFfvA&usqp=CAU" },
  { type: "Hostel", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL7DJ87FTOMYy5625HjLikY7UMNRksMwqNbQ&usqp=CAU" },
  { type: "Hospital", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm2aOqhaEWXy9PPvUJsKncsphLDINn_DJDAg&usqp=CAU" },
  { type: "SecurityOffice", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpRcGwraKxLbXkn9xjb36e8jN5uXp1euU2cg&usqp=CAU" },
  { type: "Library", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxFmAZXUburEpbQ64t9Xc_ZqFwvAsNKkGpkA&usqp=CAU" },
  { type: "Workshop", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNda2zhD8AeoGbCSwtf-Gzy5lYAGs1itXb-A&usqp=CAU" },
  { type: "HostelMess", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS66g_41IcDqXFidRy5mmYGGR8xbv5t3E8cxA&usqp=CAU" },
  { type: "Temple", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYhxZblpKwQGC-JWylxuapLegk0K_KvnQx8Q&usqp=CAU" },
  { type: "Canteen", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIUMEVLuUQMvb5eaBW3GzE_swwyoD6y7UbvQ&usqp=CAU" },
  { type: "Parking", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw0BHGi6uM4MzVL4MxNSXbiMDw2iQTOmVxrw&usqp=CAU" },
];

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const buildings = buildingsData;
  const [building, setBuilding] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation, setSidebarAnimation] = useState("");
  const mapContainerRef = useRef(null);

  const handleCheckboxChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedBuilding((prevSelectedBuilding) => {
      // Toggle the selected building if it's already selected
      if (prevSelectedBuilding === selectedValue) {
        return '';
      }
      // Otherwise, set the newly selected building
      return selectedValue;
    });
  };


  const handleSearch = (location) => {
    const Building = buildings.find((building) => building.name === location);
    setBuilding(Building);
    setSelectedBuilding(''); // Reset the selected building type


  };

  const filteredBuildings = buildings.filter((building) => {
    return building.type === selectedBuilding;
  });
  const CenterMapToPopup = ({ building }) => {
    const map = useMap();
    useEffect(() => {
      if (building) {
        map.flyTo([building.latitude, building.longitude], 18, {
          duration: 1,
        });
      }
    }, [map, building]);

    return null;
  };
  const toggleSidebar = () => {
    if (sidebarVisible) {
      setSidebarAnimation("slide-out");
      setTimeout(() => {
        setSidebarVisible(false);
        setSidebarAnimation("");
      }, 300);
    } else {
      setSidebarAnimation("slide-in");
      setTimeout(() => {
        setSidebarVisible(true);
      }, 0);
    }
  };




  return (
    <div>
      <div style={{ backgroundColor: "rgb(230, 173, 173)", paddingLeft: "10px" }}>Indian Institute Of Technology Goa</div>
      <div className={`app-container ${sidebarVisible ? '-visible' : ''}`}>

        {sidebarVisible && (
          <div className={`sidebar-container ${sidebarAnimation}`}>
            <div className="logo-container">
              <img src="data:image/png;base64,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" alt="Logo" />
            </div>
            <button className="close-button" onClick={toggleSidebar}>
              <i className="fas fa-times"></i>
            </button>
            <div>
              <div ref={mapContainerRef} id="map"></div>
              <Direction mapContainer={mapContainerRef} />
            </div>            <br />
            <label>
              Building Type:
            </label>
            {buildingTypes.map((value) => (
              <CheckBox
                key={value.type}
                value={value.type}
                checked={selectedBuilding === value.type}
                onChange={handleCheckboxChange}
                iconUrl={value.url}
                whenCreated={(mapInstance) => {
                  mapContainerRef.current = mapInstance;
                }}

              />
            ))}
          </div>)}

        <div className="map-container">
          <div className="map-top-bar">
            <button className="custom-bars" type="button" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <SearchBar onSearch={handleSearch} />
          </div>
          <MapContainer
            center={[15.42268, 73.98277]}
            zoom={18}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            ref={mapContainerRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <BuildingMarkers buildings={filteredBuildings} />
            {building && (
              <Marker
                position={[building.latitude, building.longitude]}
                icon={L.icon({
                  iconUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCl-oZcmFAnJbhYudu62S3WdbjliPk8mwhOw&usqp=CAU",
                  iconSize: [25, 25]
                })}>
                <Popup>
                  <div>
                    <h3>{building.name}</h3>
                    <p>Click on the surrounding area to get directions</p>
                  </div>
                </Popup>
              </Marker>
            )}
            <CenterMapToPopup building={building} />

          </MapContainer>
        </div>
      </div>
    </div>
  );

}

export default App;
