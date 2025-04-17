"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 0,
  lng: 0,
};

export default function LocationFilter({
  isOpen,
  onClose,
  location,
  setLocation,
}) {
  const [mapCenter, setMapCenter] = useState(center);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    // Here you would typically geocode the location and update the map center
    // For this example, we'll just set a random location
    setMapCenter({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLocationSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button type="submit">Set Location</Button>
        </form>
        <div className="mt-4 rounded-lg overflow-hidden">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={10}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>
      </DialogContent>
    </Dialog>
  );
}
