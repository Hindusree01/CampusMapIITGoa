import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import BuildingMarkers from './BuildingMarker';
import buildingsData from './iitgoaplaces.json';
import CheckBox from './CheckBox';
import SearchBar from './SearchBar';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Boundary from './Boundary';
import Directions from './Directions';

function App() {
  const buildings = buildingsData;
  const [building, setBuilding] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation, setSidebarAnimation] = useState('');
  const mapContainerRef = useRef(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [toLocation, setToLocation] = useState('');
  const [showDirection, setShowDirection] = useState(false);


  const checkboxHeadingMappings = {
    Campus: ['Offices','Buildings', 'Library', 'Workshop', 'Classrooms', 'Labs','Faculty Cabins'],
    Security: ['Security Office'],
    Amenities: ['Hostel', 'Dining', 'Recreation', 'Wellness', 'Canteen', 'Temple'],
    Parking:['Parking']
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
      const { type } = buildingTypes.find((bt) => bt.type === buildingType) || {};

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
    const [centered, setCentered] = useState(false);
  
    useEffect(() => {
      if (building && !centered) {
        map.flyTo([building.latitude, building.longitude], 18, {
          duration: 1,
        });
        setCentered(true);
      }
    }, [map, building, centered]);
  
    return null;
  };
  

  const toggleSidebar = () => {
    if (sidebarVisible) {
      setSidebarAnimation('slide-out');
      setTimeout(() => {
        setSidebarVisible(false);
        setSidebarAnimation('');
      }, 300);
    } else {
      setSidebarAnimation('slide-in');
      setTimeout(() => {
        setSidebarVisible(true);
      }, 0);
    }
  };
  const destinationHandler = () => {
    setToLocation(building.name);
    setSidebarVisible(true);
    setShowDirection(true);
    setBuilding("");
  }
  const destinationHandlerTwo =(buildingName)=>{
    setToLocation(buildingName);
    setSidebarVisible(true);
    setShowDirection(true);
  }
  const handleClickonDirection = () => {
    setShowDirection(!showDirection);
  }

  return (
    <div className={`app-container ${sidebarVisible ? '-visible' : ''}`}>
      {sidebarVisible && (
        <div className={`sidebar-container ${sidebarAnimation}`}>
          <div className="logo-container">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Indian_Institute_of_Technology_Goa_Logo.svg/640px-Indian_Institute_of_Technology_Goa_Logo.svg.png"
              alt="Logo"
            />
          </div>
          <button className="close-button" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>

          <button className="direction-button" onClick={handleClickonDirection} >
            <i className="fas fa-directions"></i>
          </button>

          
          <div>
            {showDirection &&
              (<Directions mapContainer={mapContainerRef} ToLocation={toLocation} />)
            }
            <br/>
          </div>
          <div className="checkbox-container">
            {Object.keys(checkboxHeadingMappings).map((heading) => (
              <div className="checkbox-heading" key={heading}>
                {heading}:
                {renderCheckboxesForHeading(heading)}
              </div>
            ))}
          </div>

        </div>
      )}

      <div className="map-container">
        <div className="map-top-bar">
          <button className="custom-bars" type="button" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="reset-container">
            <button className="reset-button" onClick={handleReset}>
              <i className="fas fa-undo"></i>
            </button>
          </div>
          <SearchBar onSearch={handleSearch} mapContainerRef={mapContainerRef} ToLocation={toLocation} />
        </div>
        <MapContainer
          center={[15.42268, 73.98277]}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapContainerRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Boundary />
          <BuildingMarkers buildings={filteredBuildings} destination={destinationHandlerTwo} />
          {building && (
            <Marker
              position={[building.latitude, building.longitude]}
              icon={L.icon({
                iconUrl:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCl-oZcmFAnJbhYudu62S3WdbjliPk8mwhOw&usqp=CAU',
                iconSize: [25, 25],
              })}
            >
              <Popup>
                <div>
                  <h3>{building.name}</h3>
                  <button onClick={destinationHandler}>Add as Destination</button>
                </div>
              </Popup>
            </Marker>
          )}
          <CenterMapToPopup building={building} />
          
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
