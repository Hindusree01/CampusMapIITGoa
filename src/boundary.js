import React from 'react';
import { FeatureGroup, Polyline } from 'react-leaflet';

const Boundary = () => {
  // Array of coordinates representing the boundary of the college grounds
  const boundaryCoordinates = [
    [15.42288, 73.98202],
    [15.42297, 73.98208],
    [15.42305, 73.98212],
    [15.42318, 73.98215],
    [15.42320, 73.98298],
    [15.42334, 73.98308],
    [15.42330, 73.98344],
    [15.42296, 73.98360],
    [15.42285, 73.98357],
    [15.42253, 73.98335],
    [15.42202, 73.98297],
    [15.42195, 73.98289],
    [15.42188, 73.98220],
    [15.42192, 73.98214],
    [15.42288, 73.98202]
  ];

  // Style object for the boundary
  const boundaryStyle = {
    color: 'red',
    weight: 0.5
  };

  return (
    <FeatureGroup>
      <Polyline positions={boundaryCoordinates} pathOptions={boundaryStyle} />
    </FeatureGroup>
  );
};

export default Boundary;
