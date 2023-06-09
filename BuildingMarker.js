import React from "react";
import { Marker, Popup } from "react-leaflet";
import {Icon} from "leaflet";

// Define the icons for different building types
const icons = {
    Classroom: new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/185/185578.png",
        iconSize: [25, 25]
    }),
    Office: new Icon({
        iconUrl: "https://www.freeiconspng.com/thumbs/office-icon/office-icon--insharepics-11.png",
        iconSize: [25, 25]
    }),
    Ground: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr8ujkX0fQQsKgF8yc8SOEhJdADH0dQUYzeA&usqp=CAU",
        iconSize: [25, 25]
    }),
    Gym: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaTVrtdfW9JzqRHQ-p_gg0QlZeyiEiAcFfvA&usqp=CAU",
        iconSize: [25, 25]
    }),
    Hostel: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL7DJ87FTOMYy5625HjLikY7UMNRksMwqNbQ&usqp=CAU",
        iconSize: [25, 25]
    }),
    Hospital: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm2aOqhaEWXy9PPvUJsKncsphLDINn_DJDAg&usqp=CAU",
        iconSize: [25, 25]
    }),
    SecurityOffice: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpRcGwraKxLbXkn9xjb36e8jN5uXp1euU2cg&usqp=CAU",
        iconSize: [25, 25]
    }),
    Library: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxFmAZXUburEpbQ64t9Xc_ZqFwvAsNKkGpkA&usqp=CAU",
        iconSize: [25, 25]
    }),
    Workshop: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNda2zhD8AeoGbCSwtf-Gzy5lYAGs1itXb-A&usqp=CAU",
        iconSize: [25, 25]
    }),
    HostelMess: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS66g_41IcDqXFidRy5mmYGGR8xbv5t3E8cxA&usqp=CAU",
        iconSize: [25, 25]
    }),
    Temple: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYhxZblpKwQGC-JWylxuapLegk0K_KvnQx8Q&usqp=CAU",
        iconSize: [25, 25]
    }),
    Canteen: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIUMEVLuUQMvb5eaBW3GzE_swwyoD6y7UbvQ&usqp=CAU",
        iconSize: [25, 25]
    }),
    Parking: new Icon({
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw0BHGi6uM4MzVL4MxNSXbiMDw2iQTOmVxrw&usqp=CAU",
        iconSize: [25, 25]
    })
    
};

function BuildingMarkers({ buildings }) {
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
                                <p>Capacity: {building.capacity}</p>
                                <p>Floors: {building.floor}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default BuildingMarkers;
