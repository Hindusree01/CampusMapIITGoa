import React, { useState, useEffect } from 'react';
import placesData from './iitgoaplaces.json';
import './App.css';
import Direction from "./Directions";

const SearchBar = (props) => {
  const [place, setPlace] = useState('');
  const [places, setPlaces] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setPlaces(placesData);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPlace(value);

    // Filter the places based on input value
    const filteredPlaces = places.filter((place) =>
      place.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredPlaces);
  };

  const handleSuggestionClick = (suggestion) => {
    setPlace(suggestion.name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSearch(place);
    setPlace('');
  };
  


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className='text-input'
          type="text"
          value={place}
          onChange={handleInputChange}
          placeholder="Search"
          style={{ fontSize: '16px', padding: '5px' }}
        />
        <button
          className="custom-button"
          type="submit"
        >
          <i className="fa fa-search" aria-hidden="true"></i> {/* Replace with your desired icon */}
        </button>
        <div className="direction-button-container">
          <button className="direction-button" >
            <i className="fas fa-directions"></i>
          </button>
        </div>
      
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.name}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>


      <div className='direction-bar'>
        <div ref={props.mapContainerRef} id="map"></div>
        <Direction mapContainer={props.mapContainerRef} />
      </div>

    </div>
  );
};

export default SearchBar;
