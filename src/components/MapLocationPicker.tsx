// components/MapLocationPicker.tsx

import React, { useState, useEffect } from 'react'; // useEffect bhi import kiya
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ CORRECTED: Custom marker icon banane ka sahi tareeka
// Apni 'location.png' file ko `public/assets/location.png` mein rakho.
// Fir uska path yahan `/assets/location.png` hoga (root-relative).
const customMarkerIcon = L.icon({
  iconUrl: '/assets/location.png',       // Root-relative path to your image in public/assets/
  iconRetinaUrl: '/assets/location.png', // Higher DPI displays ke liye (same path)
  iconSize: [38, 38],                    // Icon ki size set karein (adjust as needed)
  iconAnchor: [19, 38],                  // Icon ka anchor point (bottom-center of image)
  popupAnchor: [0, -38],                 // Popup ka anchor point (icon ke top par)
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // Shadow URL wahi rakha gaya hai
  shadowSize: [38, 38],                  // Shadow size adjust karein
  shadowAnchor: [19, 38],                // Shadow anchor adjust karein
});


// Component ke props ka interface
interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  // Callback function jo selected location details return karegi
  onLocationSelect?: (lat: number, lng: number, address: string) => void; // onLocationSelect add kiya tha
}

const MapLocationPicker: React.FC<MapPickerProps> = ({
  initialLat = 23.237560, // Default: Gandhinagar, Gujarat ka latitude
  initialLng = 72.647781, // Default: Gandhinagar, Gujarat ka longitude
  initialZoom = 12, // Default zoom level
  onLocationSelect, // Destructure the callback
}) => {
  const [position, setPosition] = useState<L.LatLngTuple | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // ✅ NEW: Jab component mount ho ya initialLat/initialLng change ho, tab initial position set karein
  // Isse map load hote hi marker correct initial location par aa jayega
  useEffect(() => {
    if (initialLat !== undefined && initialLng !== undefined) { 
      setPosition([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);


  const MapEventsHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        console.log(`--- Clicked on location ---`);
        console.log(`Latitude: ${lat}`);
        console.log(`Longitude: ${lng}`);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
          .then(response => response.json())
          .then(data => {
            const fetchedAddress = data.display_name || "Address nahi mila";
            setAddress(fetchedAddress);
            console.log(`Address: ${fetchedAddress}`);
            
            // onLocationSelect callback ko call karein
            if (onLocationSelect) {
              onLocationSelect(lat, lng, fetchedAddress);
            }
          })
          .catch(error => {
            console.error("Error while fetching address:", error);
            setAddress("Error in address fetching.");
            // Error hone par bhi coordinates return karein
            if (onLocationSelect) {
              onLocationSelect(lat, lng, "Error in address fetching.");
            }
          });
      },
    });
    return null;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '350px', // Tumhari previous height
        borderRadius: '25px', // Tumhari previous border radius
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Inter, sans-serif',
        border: '2px solid #B5ADF0', // Tumhari previous border
      }}
    >
      <MapContainer 
        center={position || [initialLat, initialLng]} // Agar position set nahi hai, toh initial use karein
        zoom={initialZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler />

        {position && (
          // ✅ UPDATED: Marker ke icon prop mein customMarkerIcon pass kiya gaya hai
          <Marker position={position} icon={customMarkerIcon}>
            <Popup>
              <b>Selected Location:</b><br/>
              Latitude: {position[0].toFixed(6)}<br/>
              Longitude: {position[1].toFixed(6)}<br/>
              {address && `Address: ${address}`}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapLocationPicker;