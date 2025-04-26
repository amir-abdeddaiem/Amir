"use client";

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




interface ProfileFormProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    location: string;
    bio: string;
    avatar: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    location: string;
    bio: string;
    avatar: string;
  }>>;
  onSave: () => void;
}

export default function UpdateUser({ 
  profileData, 
  setProfileData, 
  onSave 
}: ProfileFormProps) {
  
  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  




  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#006D77] font-medium">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={profileData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
            className="border-[#83C5BE] focus:border-[#006D77] bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#006D77] font-medium">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={profileData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
            className="border-[#83C5BE] focus:border-[#006D77] bg-white"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#006D77] font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={profileData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
            className="border-[#83C5BE] focus:border-[#006D77] bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#006D77] font-medium">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={profileData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
            className="border-[#83C5BE] focus:border-[#006D77] bg-white"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-[#006D77] font-medium">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={profileData.birthDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('birthDate', e.target.value)}
            className="border-[#83C5BE] focus:border-[#006D77] bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-[#006D77] font-medium">Gender</Label>
          <Select 
            value={profileData.gender} 
            onValueChange={(value: string) => handleChange('gender', value)}
          >
            <SelectTrigger className="border-[#83C5BE] focus:border-[#006D77] bg-white">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#83C5BE]">
              <SelectItem value="male" className="text-black">Male</SelectItem>
              <SelectItem value="female" className="text-black">Female</SelectItem>
              <SelectItem value="other" className="text-black">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-[#006D77] font-medium">Location</Label>
        <Input
          id="location"
          type="text"
          placeholder="Enter your location"
          value={profileData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
          className="border-[#83C5BE] focus:border-[#006D77] bg-white"
        />
      </div>

      {/* Bio Section */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-[#006D77] font-medium">About you</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself"
          className="min-h-[120px] resize-none border-[#83C5BE] focus:border-[#006D77] bg-white"
          value={profileData.bio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('bio', e.target.value)}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-[#83C5BE]">
        <Button
          type="button"
          variant="outline"
          size="default"
          className="border-[#83C5BE] text-[#006D77] hover:bg-[#83C5BE]/10"
        >
          Cancel
        <Button
          type="button"
          variant="default"
          onClick={onSave}
          size="default"
          className="bg-[#E29578] text-white hover:bg-[#E29578]/90"
        >
          Save Changes
        </Button>
        </Button>
      </div>
    </motion.div>
  );
}