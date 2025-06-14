"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapLocationPicker with SSR disabled
const MapLocationPicker = dynamic(
  () => import("@/components/ui/MapLocationPicker"),
  { ssr: false }
);
export default function RegularUserStep2({
  formData,
  handleChange,
  handleSubmit,
  prevStep,
  setFormData,
}) {
  const router = useRouter();
  const [locationData, setLocationData] = useState({
    coordinates: null,
    address: "",
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!locationData.coordinates) {
      alert("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the provided handleSubmit and wait for it to complete
      const success = await handleSubmit(e);

      // Only navigate if the submission was successful
      if (success) {
        router.push("/user");
      }
    } catch (error) {
      // Handle any errors that might occur during submission
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Location</Label>
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
            <Label>Gender</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="h-4 w-4 border-gray-300 text-[#E29578] focus:ring-[#E29578]"
                />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="h-4 w-4 border-gray-300 text-[#E29578] focus:ring-[#E29578]"
                />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="h-4 w-4 border-gray-300 text-[#E29578] focus:ring-[#E29578]"
                />
                <Label htmlFor="other">Other</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 rounded border-gray-300 text-[#E29578] focus:ring-[#E29578]"
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-[#E29578] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#E29578] hover:underline"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#E29578] hover:bg-[#d88a6d]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
