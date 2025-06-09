"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
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
import { useUserData } from "@/contexts/UserData";
import MapLocationPicker from "../ui/MapLocationPicker";

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
// const MapLocationPicker = dynamic(
//   () => import("@/components/ui/MapLocationPicker"),
//   { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> }
// );

export default function UpdateProfile() {
  const router = useRouter();
  const { refreshUserData, userData } = useUserData();

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
  const [isFetching, setIsFetching] = useState(true);

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

  // Fetch user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsFetching(true);
        await refreshUserData();
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setIsFetching(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.id) {
      setProfileData(userData as ProfileData);
    }
  }, [userData]);

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
      if (!profileData.id) throw new Error("User ID not found");

      // Basic validation
      if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        throw new Error("Please fill in all required fields");
      }

      const response = await axios.put<ApiResponse>(
        `/api/profile`,
        profileData
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

  // Show loading UI until data is ready
  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

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
              <AvatarFallback className="w-24 h-24">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold text-[#006D77] mt-4">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFormField id="firstName" label="First Name" value={profileData.firstName} onChange={handleChange} required />
              <TextFormField id="lastName" label="Last Name" value={profileData.lastName} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFormField id="email" label="Email" value={profileData.email} onChange={handleChange} type="email" required />
              <TextFormField id="phone" label="Phone" value={profileData.phone} onChange={handleChange} type="tel" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextFormField id="birthDate" label="Birth Date" value={profileData.birthDate} onChange={handleChange} type="date" />
              <div className="space-y-2">
                <Label className="text-lg font-semibold" htmlFor="gender">Gender</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value: Gender) => handleChange("gender", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className={"w-full"}>
                    <SelectItem className={""} value="male">Male</SelectItem>
                    <SelectItem className={""} value="female">Female</SelectItem>
                    <SelectItem className={""} value="other">Other</SelectItem>
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

            <div className="space-y-2 mt-6">
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
