import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";


// ✅ Force map to move when position updates
function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 2 }); // smooth zoom
    }
  }, [position]);

  return null;
}

// ✅ Fix rendering bug
function FixMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, []);

  return null;
}


function MapView({ specialist }) {
  const [position, setPosition] = useState(null);   // 🔥 start as null
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const userPos = [lat, lon];

        setPosition(userPos);

        // 🔥 Fetch doctors
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${specialist}+hospital&limit=5`
        )
          .then((res) => res.json())
          .then((data) => {
            setPlaces(data);
          });
      },
      () => {
        alert("Location access denied");
      }
    );
  }, [specialist]);

  // ⛔ Prevent render until location ready
  if (!position) return <p>📍 Getting your location...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="font-bold mb-2">📍 Nearby {specialist}</h3>

      <MapContainer center={position} zoom={13} style={{ height: "300px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FixMap />
        <FlyToLocation position={position} />

        {/* User Marker */}
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Doctor Markers */}
        {places.map((place, i) => (
          <Marker
            key={i}
            position={[
              parseFloat(place.lat),   // 🔥 FIXED
              parseFloat(place.lon),
            ]}
          >
            <Popup>{place.display_name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;