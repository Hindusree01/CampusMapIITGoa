import React, { useState, useEffect } from 'react';
import placesData from './iitgoaplaces.json';

const SearchBar = (props) => {
  const [place, setPlace] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(placesData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSearch(place);
    setPlace('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      >
        <option value="">Select a place...</option>
        {places.map((place) => (
          <option key={place.name} value={place.name}>
            {place.name}
          </option>
        ))}
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
