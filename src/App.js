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
import '@fortawesome/fontawesome-free/css/all.min.css';
import Boundary from './boundary';



function App() {
  const buildings = buildingsData;
  const [building, setBuilding] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation, setSidebarAnimation] = useState("");
  const mapContainerRef = useRef(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [toLocation, setToLocation] = useState("");

  const checkboxHeadingMappings = {
    "Campus": ["Office", "Library", "Workshop", "Classroom"],
    "Security": ["SecurityOffice"],
    "Amenities": ["Hostel", "HostelMess", "Ground", "Gym", "Hospital", "Canteen", "Temple"],

  };


  const handleCheckboxChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (prevSelectedCheckboxes.includes(selectedValue)) {
        return prevSelectedCheckboxes.filter((checkbox) => checkbox !== selectedValue);
      } else {
        return [...prevSelectedCheckboxes, selectedValue];
      }
    });
  };
  
  

  const handleReset = () => {
    window.location.reload();
  };
  
  const renderCheckboxesForHeading = (heading) => {
    const buildingTypes = checkboxHeadingMappings[heading];
  
    if (!buildingTypes) return null;
  
    return buildingTypes.map((buildingType) => {
      const {type} = buildingTypes.find((bt) => bt.type === buildingType) || {};
  
      return (
        <div key={type}>
          <CheckBox
           value={buildingType}
           checked={selectedCheckboxes.includes(buildingType)}
           onChange={handleCheckboxChange}
          />
         
        </div>
      );
    });
  };
  
  
  

  const handleSearch = (location) => {
    const Building = buildings.find((building) => building.name === location);
    setBuilding(Building);


  };

  const filteredBuildings = buildings.filter((building) => {
    return selectedCheckboxes.includes(building.type);
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


    <div className={`app-container ${sidebarVisible ? '-visible' : ''}`}>

      {sidebarVisible && (
        <div className={`sidebar-container ${sidebarAnimation}`}>
          <div className="logo-container">
            <img src="data:image/png;base64,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" alt="Logo" />
          </div>
          <button className="close-button" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
          <br />
          <div className="checkbox-container">
            {Object.keys(checkboxHeadingMappings).map((heading) => (
              <div className="checkbox-heading" key={heading}>
                {heading}:
                {renderCheckboxesForHeading(heading)}
              </div>
            ))}
          </div>
        
        </div>

      )
      }

      <div className="map-container">

        <div className="map-top-bar">
          <button className="custom-bars" type="button" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="reset-container">
            <button className="reset-button" onClick={handleReset} >

              <i className="fas fa-undo" ></i>
            </button>
          </div>

          <SearchBar onSearch={handleSearch} mapContainerRef={mapContainerRef} ToLocation={toLocation}/>

        </div>
        <MapContainer
          center={[15.42268, 73.98277]}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapContainerRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Boundary/>
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
                 <button onClick={() => setToLocation(building.name) }>set as Destination</button>
                </div>
              </Popup>
            </Marker>
          )}
          <CenterMapToPopup building={building} />
          
        </MapContainer>


      </div>
      

    
    </div>
  )
}



export default App;