import React from "react";
import { Marker, Popup } from "react-leaflet";
import {Icon} from "leaflet";

// Define the icons for different building types
const icons = {
    Classrooms: new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/185/185578.png",
        iconSize: [17, 17]
    }),
    Offices: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6LF6HpQq9hX08HiSsUPEp2HyxXakcOYCssQ&usqp=CAU",
        iconSize: [12, 12]
    }),
    Buildings: new Icon({
        iconUrl: "https://static.vecteezy.com/system/resources/thumbnails/005/720/273/small/office-building-icon-two-point-perspective-buildings-illustration-isolated-on-white-background-free-vector.jpg",
        iconSize: [17, 17]
    }),
    'Faculty Cabins': new Icon({
        iconUrl: "https://thumbs.dreamstime.com/b/black-line-icon-faculty-bureau-division-black-line-icon-faculty-conference-academy-bureau-division-167849240.jpg",
        iconSize: [10, 10]
    }),
    Labs: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbBUKCYyJXo4YGKtfQgpTfjmSM0fRDzp5olQ&usqp=CAU",
        iconSize: [10, 10]
    }),
    Recreation: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl0U1Vq_SMn4hgIgjZqwogboSQbNZUX3DY-w&usqp=CAU",
        iconSize: [17, 17]
    }),
    Hostel: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGVC6e4Eqj0wlbNHUndGZTEZXqrwjspOeM7A&usqp=CAU",
        iconSize: [17, 17]
    }),
    Wellness: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm2aOqhaEWXy9PPvUJsKncsphLDINn_DJDAg&usqp=CAU",
        iconSize: [17, 17]
    }),
    'Security Office': new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpRcGwraKxLbXkn9xjb36e8jN5uXp1euU2cg&usqp=CAU",
        iconSize: [17, 17]
    }),
    Library: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxFmAZXUburEpbQ64t9Xc_ZqFwvAsNKkGpkA&usqp=CAU",
        iconSize: [17, 17]
    }),
    Workshop: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNda2zhD8AeoGbCSwtf-Gzy5lYAGs1itXb-A&usqp=CAU",
        iconSize: [17, 17]
    }),
    Dining: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS66g_41IcDqXFidRy5mmYGGR8xbv5t3E8cxA&usqp=CAU",
        iconSize: [17, 17]
    }),
    Temple: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYhxZblpKwQGC-JWylxuapLegk0K_KvnQx8Q&usqp=CAU",
        iconSize: [17, 17]
    }),
    Canteen: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIUMEVLuUQMvb5eaBW3GzE_swwyoD6y7UbvQ&usqp=CAU",
        iconSize: [17, 17]
    }),
    Parking: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw0BHGi6uM4MzVL4MxNSXbiMDw2iQTOmVxrw&usqp=CAU",
        iconSize: [17, 17]
    })
    
};

function BuildingMarkers({ buildings, destination }) {
    return (
        <>
            {buildings.map((building, index) => {
                // Determine the icon based on the building type
                const icon = icons[building.type];

                return (
                    <Marker
                        position={[building.latitude, building.longitude]}
                        icon={icon}
                        key={index}
                    >
                        <Popup>
                            <div>
                                <h3>{building.name}</h3>
                                {building.capacity && <p>Capacity: {building.capacity}</p>}
                                {building.floor && <p>Floors: {building.floor}</p>}
                                <button onClick={() => destination(building.name)}>Add as Destination</button>

                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default BuildingMarkers;
