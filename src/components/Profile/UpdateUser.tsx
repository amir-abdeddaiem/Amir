"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
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

type Gender = 'male' | 'female' | 'other';

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  location: string;
  bio: string;
}

interface ApiResponse {
  data?: ProfileData;
  error?: string;
}

export default function UpdateProfile({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    id: params.id,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "other",
    location: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>(`/api/profile/${params.id}`);
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }

        if (response.data.data) {
          setProfileData(response.data.data);
        }
      } catch (err) {
        const error = err as AxiosError<ApiResponse>;
        setError(error.response?.data?.error || "Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  const handleChange = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsLoading(true);
      const response = await axios.put<ApiResponse>(`/api/profile/${params.id}`, profileData);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      router.push("/profile");
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#006D77]">Update Profile</h1>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="">First Name</Label>
          <Input
            id="firstName"
            type="text"
            className=""
            value={profileData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">²
          <Label htmlFor="lastName" className="">Last Name</Label>
          <Input
          type="text"
            className=""
            id="lastName"
            value={profileData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label  className = ""htmlFor="email">Email</Label>
          <Input
          type="text"
            className=""
            id="email"
            
            value={profileData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label  className = "" htmlFor="phone">Phone</Label>
          <Input
          className=""
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label  className = "" htmlFor="birthDate">Birth Date</Label>
          <Input
          className=""
            id="birthDate"
            type="date"
            value={profileData.birthDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('birthDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender" className="">Gender</Label>
          <Select 
            value={profileData.gender} 
            onValueChange={(value: Gender) => handleChange('gender', value)}
            required
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="male" className="">Male</SelectItem>
              <SelectItem value="female" className="">Female</SelectItem>
              <SelectItem value="other" className="">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label  className = ""htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          className=""
          value={profileData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="">About you</Label>
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('bio', e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="btn-class" // Replace with appropriate class
          size="md" // Replace with appropriate size
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="btn-class" // Replace with appropriate class
          variant="primary" // Replace with appropriate variant
          size="md" // Replace with appropriate size
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}