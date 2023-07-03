import React, { useState, useEffect, useRef } from 'react';
import placesData from './iitgoaplaces.json';
import './App.css';

const SearchBar = (props) => {
  const [place, setPlace] = useState('');
  const [places, setPlaces] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);


  useEffect(() => {
    setPlaces(placesData);

    const handleEscKeyPress = (e) => {
      if (e.key === 'Escape') {
        setSuggestions([]);
      }
    };

    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
  
    

    document.addEventListener('keydown', handleEscKeyPress);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPlace(value);

    const inputValue = value.trim().toLowerCase();
    if (inputValue === "") {
      setSuggestions(placesData);
    } else {
      const filteredPlaces = places.filter((place) =>
        place.name.toLowerCase().includes(inputValue)
      );
      setSuggestions(filteredPlaces);
    }
  };

  const handleInputClick = () => {
    const inputValue = place.trim().toLowerCase();
    if (inputValue === "") {
      setSuggestions(placesData);
    }
  };

  const handleSearchClear = () => {
    setPlace('');
    setSuggestions([]);
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
        <div className='input-container'>
          <input
            className='text-input'
            type="text"
            value={place}
            onChange={handleInputChange}
            placeholder="Search"
            onClick={handleInputClick}
            style={{ fontSize: '16px', padding: '5px' }}
          />
          {place && (
            <i
              className="fa fa-times-circle search-clear-icon"
              onClick={handleSearchClear}
            />
          )}
        </div>
        <button
          className="custom-button"
          type="submit"
        >
          <i className="fa fa-search" aria-hidden="true"></i> {/* Replace with your desired icon */}
        </button>
        

        {suggestions.length > 0 && (
          <ul className="suggestions-list" ref={suggestionsRef}>
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

     
    </div>
  );
};

export default SearchBar;
