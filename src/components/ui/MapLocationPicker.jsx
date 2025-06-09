"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
if (typeof window !== "undefined") {
  const L = require("leaflet");
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents),
  { ssr: false }
);

// Map click handler component
const MapClickHandler = ({ setPosition, setAddress }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const newPosition = [lat, lng];
      setPosition(newPosition);

      // Try to get address for the clicked location
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
        .then((response) => response.json())
        .then((data) => {
          const address =
            data.display_name ||
            `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddress(address);
        })
        .catch(() => {
          setAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        });
    },
  });

  return null;
};

// Marker component to show the selected location
const LocationMarker = ({ position }) => {
  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>Your selected location</Popup>
    </Marker>
  );
};

const MapComponent = ({ initialPosition, zoom = 13, onLocationSelect }) => {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState("");
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update parent when position or address changes
  useEffect(() => {
    if (position && onLocationSelect) {
      onLocationSelect({
        coordinates: position,
        address:
          address ||
          `Location: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
      });
    }
  }, [position, address, onLocationSelect]);

  // Handle geolocation
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition = [latitude, longitude];
        setPosition(newPosition);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        )
          .then((response) => response.json())
          .then((data) => {
            const address =
              data.display_name ||
              `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setAddress(address);
          })
          .catch(() => {
            setAddress(
              `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            );
          });

        if (mapRef.current) {
          mapRef.current.flyTo(newPosition, 15, {
            animate: true,
            duration: 1,
          });
        }
      },
      (error) => {
        let errorMessage = "Unable to get your location. ";
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage += "Location permission denied.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage += "Location information unavailable.";
            break;
          case 3: // TIMEOUT
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Unknown error occurred.";
        }
        alert(
          errorMessage +
            " You can select a location manually by clicking on the map."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [mapRef, setPosition, setAddress]);

  if (!isClient) {
    return (
      <div className="h-64 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Select your location</h3>
        <button
          type="button"
          onClick={handleLocateMe}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          Use my location
        </button>
      </div>

      <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
        {isClient && (
          <MapContainer
            center={position}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler
              setPosition={setPosition}
              setAddress={setAddress}
            />
            <LocationMarker position={position} />
          </MapContainer>
        )}
      </div>

      {position && (
        <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded border border-gray-100">
          <div className="font-medium">Selected location:</div>
          <div className="text-xs text-gray-500 mt-1">
            Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </div>
          {address && <div className="mt-1 text-sm">{address}</div>}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Click on the map to select your location
      </p>
    </div>
  );
};

export default function MapLocationPicker({
  onLocationSelect,
  initialPosition = [36.8065, 10.1815],
  zoom = 13,
}) {
  return (
    <MapComponent
      initialPosition={initialPosition}
      zoom={zoom}
      onLocationSelect={onLocationSelect}
    />
  );
}
