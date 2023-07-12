import React from 'react';
import { FeatureGroup, Polyline } from 'react-leaflet';

const Boundary = () => {
  // Array of coordinates representing the boundary of the college grounds
  const boundaryCoordinates = [
    // Coordinates for the first building
    [
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
    ],
    // Coordinates for the second building
    [
      [15.42199,73.97833],
      [15.42174,73.97833],
      [15.42174,73.97854],
      [15.42199,73.97854],
      [15.42199,73.97833]
    ],
    [
      [15.42223,73.97888],
      [15.42224,73.97910],
      [15.42210,73.97914],//15.42207,73.97914
      [15.42208,73.97890],
      [15.42223,73.97888]
    ],
    [
      [15.42281,73.97879],
      [15.42266,73.97881],
      [15.42252,73.97881],
      [15.42252,73.97835],
      [15.42279,73.97832],
      [15.42281,73.97879],
    ],
    [
      [15.42271,73.97963],
      [15.42246,73.97963],
      [15.42245,73.97984],
      [15.42245,73.97988],
      [15.42246,73.98017],
      [15.42271,73.98016],
      [15.42271,73.97963],
    ]
  ];

  // Style object for the boundary
  const boundaryStyle = {
    color: 'red',
    weight: 0.9
  };

  return (
    <FeatureGroup>
      {boundaryCoordinates.map((buildingCoordinates, index) => (
        <Polyline
          key={index}
          positions={buildingCoordinates}
          pathOptions={boundaryStyle}
        />
      ))}
    </FeatureGroup>
  );
};

export default Boundary;
