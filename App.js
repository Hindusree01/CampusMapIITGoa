import React, { useState, useEffect} from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import BuildingMarkers from "./BuildingMarker";
import buildingsData from './iitgoaplaces.json';
import CheckBox from "./CheckBox";
import SearchBar from "./SearchBar";
import "leaflet-routing-machine";
import DynamicRouting from './DynamicRouting';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';


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

  const handleCheckboxChange = (event) => {
    setSelectedBuilding(event.target.value);
    setBuilding(''); // Reset the selected building
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

  

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SearchBar onSearch={handleSearch} />
        <br />
        <label>
          <u>
            <i>
              <b>Building Type:</b>
            </i>
          </u>
        </label>
        {buildingTypes.map((value) => (
          <CheckBox
            key={value.type}
            value={value.type}
            checked={selectedBuilding === value.type}
            onChange={handleCheckboxChange}
            iconUrl={value.url}
          />
        ))}
      </div>
      <div className="map-container">
        <MapContainer
          center={[15.42268, 73.98277]}
          zoom={18}
          style={{ height: "100%", width: "100%" }}

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
              })}            >
              <Popup>
                <div>
                  <h3>{building.name}</h3>
                  <p>Click on the surrounding area to get directions</p>
                </div>
              </Popup>
            </Marker>
          )}
           <CenterMapToPopup building={building} />
          <DynamicRouting />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
