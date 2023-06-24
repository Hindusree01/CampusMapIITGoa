import React, { useState, useEffect } from 'react';
import placesData from './iitgoaplaces.json';
import './App.css';

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
        style={{ fontSize: '16px', padding: '5px'}}
      >
        <i className="fa fa-search" aria-hidden="true"></i> {/* Replace with your desired icon */}
      </button>

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
  );
};

export default SearchBar;
