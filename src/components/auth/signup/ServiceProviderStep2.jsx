"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapLocationPicker with SSR disabled
const MapLocationPicker = dynamic(
  () => import("@/components/ui/MapLocationPicker"),
  { ssr: false }
);

export default function ServiceProviderStep2({
  formData,
  handleChange,
  nextStep,
  prevStep,
  setFormData,
}) {
  const [locationData, setLocationData] = useState({
    coordinates: formData.coordinates || null,
    address: formData.location || "",
  });

  useEffect(() => {
    if (locationData.address) {
      setFormData((prev) => ({
        ...prev,
        location: locationData.address,
        coordinates: locationData.coordinates,
      }));
    }
  }, [locationData, setFormData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!locationData.coordinates) {
            alert("Please select a business location on the map");
            return;
          }
          nextStep();
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Business Location</Label>
            <div className="border rounded-lg p-2">
              <MapLocationPicker
                onLocationSelect={setLocationData}
                initialPosition={formData.coordinates || [36.8065, 10.1815]} // Default to Tunisia
              />
            </div>
            <Input
              type="hidden"
              id="location"
              name="location"
              value={formData.location || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a business type</option>
              <option value="veterinarian">Veterinarian</option>
              <option value="trainer">Pet Trainer</option>
              <option value="groomer">Groomer</option>
              <option value="shelter">Animal Shelter</option>
              <option value="daycare">Pet Daycare</option>
              <option value="shop">Pet Shop</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">
              Certifications/Qualifications
            </Label>
            <Textarea
              id="certifications"
              name="certifications"
              placeholder="List your professional certifications and qualifications"
              value={formData.certifications}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://"
              value={formData.website}
              onChange={handleChange}
            />
          </div> */}

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" className="bg-[#E29578] hover:bg-[#d88a6d]">
              Continue
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
