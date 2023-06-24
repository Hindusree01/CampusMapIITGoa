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
import React, { useState, useEffect, useRef } from "react";



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
            <button className="close-button" onClick={toggleSidebar}>
              <i className="fas fa-times"></i>
            </button>
 
            <br />
            <label>Building Type:</label>
            {buildingTypes.map((value) => (
              <CheckBox
                key={value.type}
                value={value.type}
                checked={selectedBuilding === value.type}
                onChange={handleCheckboxChange}
                iconUrl={value.url}
                whenCreated={(map) => (mapContainerRef.current = map)}
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
                    <p>{building.description}<br/>Click on the surrounding area to get directions</p>
                  </div>
                </Popup>
              </Marker>
            )}
            <CenterMapToPopup building={building} />
            
          </MapContainer>
          <div>
              
              <div ref={mapContainerRef  } id="map">
                </div>
  
                <Direction mapContainer={mapContainerRef} />
              </div>
        </div>
      </div>
    </div>
  );

}

export default App;
