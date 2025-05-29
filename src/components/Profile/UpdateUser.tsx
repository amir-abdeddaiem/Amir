"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useJwt } from "@/hooks/useJwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Types
type Gender = "male" | "female" | "other";

interface LocationData {
  coordinates: [number, number] | null;
  address: string;
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  location: string;
  coordinates?: [number, number] | null;
  bio: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

// Props for form fields
interface FormFieldProps<T extends keyof ProfileData> {
  id: T;
  label: string;
  value: ProfileData[T];
  onChange: (field: T, value: ProfileData[T]) => void;
  required?: boolean;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
}

// Dynamically import MapLocationPicker with SSR disabled
const MapLocationPicker = dynamic(
  () => import("@/components/ui/MapLocationPicker"),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> }
);

export default function UpdateProfile() {
  const router = useRouter();
  const { getToken, getUserId } = useJwt();

  // State
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "-1",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "other",
    location: "",
    coordinates: null,
    bio: "",
  });

  const [locationData, setLocationData] = useState<LocationData>({
    coordinates: null,
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Memoized handler for field changes
  const handleChange = useCallback(<K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Form field component
  const TextFormField = <K extends keyof ProfileData>({
    id,
    label,
    value,
    onChange,
    required = false,
    type = "text",
    className = ""
  }: FormFieldProps<K>) => (
    <div className="space-y-2">
      <Label className="text-lg font-semibold" htmlFor={id}>{label}{required && <span className="text-red-500">*</span>}</Label>
      <Input
        id={id}
        type={type}
        value={value as string}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(id, e.target.value as ProfileData[K])
        }
        required={required}
        className={className}
      />
    </div>
  );

  // Fetch user ID on mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        if (!id) throw new Error("User ID not found");
        setUserId(id);
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };
    fetchUserId();
  }, [getUserId]);

  // Fetch profile data when userId changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse<ProfileData>>("/api/profile");

        if (response.data.error) throw new Error(response.data.error);

        const data = response.data.data;
        if (data) {
          setProfileData(data);
          if (data.coordinates) {
            setLocationData({
              coordinates: data.coordinates,
              address: data.location,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Update location data when it changes
  useEffect(() => {
    if (locationData.address) {
      setProfileData((prev) => ({
        ...prev,
        location: locationData.address,
        coordinates: locationData.coordinates,
      }));
    }
  }, [locationData]);

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      if (!userId) throw new Error("User ID not found");

      // Validate required fields
      if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        throw new Error("Please fill in all required fields");
      }

      const response = await axios.put<ApiResponse>(
        `/api/profile`,
        profileData,
      );

      if (response.data.error) throw new Error(response.data.error);

      alert("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      const error = err as AxiosError<ApiResponse> | Error;
      setError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="w-24 h-24">{profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold text-[#006D77] mt-4">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFormField
                id="firstName"
                label="First Name"
                value={profileData.firstName}
                onChange={handleChange}
                required
              />
              <TextFormField
                id="lastName"
                label="Last Name"
                value={profileData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFormField
                id="email"
                label="Email"
                value={profileData.email}
                onChange={handleChange}
                type="email"
                required
              />
              <TextFormField
                id="phone"
                label="Phone"
                value={profileData.phone}
                onChange={handleChange}
                type="tel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFormField
                id="birthDate"
                label="Birth Date"
                value={profileData.birthDate}
                onChange={handleChange}
                type="date"
              />
              <div className="space-y-2">
                <Label className="text-lg font-semibold" htmlFor="gender">Gender</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value: Gender) => handleChange("gender", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem className="w-full" value="male">Male</SelectItem>
                    <SelectItem className="w-full" value="female">Female</SelectItem>
                    <SelectItem className="w-full" value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold" htmlFor="location">Location</Label>
              <div className="border rounded-lg p-2 h-64">
                <MapLocationPicker
                  onLocationSelect={setLocationData}
                  initialPosition={profileData.coordinates || [36.8065, 10.1815]}
                />
              </div>
              <Input
                type="text"
                id="location"
                value={profileData.location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("location", e.target.value)
                }
                className="mt-2"
              />
            </div>

            <div className="space-y-2 mt-25">
              <Label className="text-lg font-semibold" htmlFor="bio">About you</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange("bio", e.target.value)
                }
                className="min-h-[120px]"
                placeholder="Tell us about yourself..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4 justify-center">
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="bg-[#006D77] hover:bg-[#005D66] text-white"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="lg"
                type="submit"
                disabled={isLoading}
                className="bg-[#006D77] hover:bg-[#005D66] text-white"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
