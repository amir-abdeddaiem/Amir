"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, PawPrint } from "lucide-react";
import AddAnimalPopup from "@/components/AddAnimalPopup/AddAnimalPopup";
import Signin from "@/components/auth/Signin";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    bio: "Pet lover and proud owner of two dogs.",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Updated profile:", profile);
  };

  const profileManagement = (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows={4}
              />
            </div>
            <Signin />
            {/* <Button type="submit" className="bg-[#E29578] hover:bg-[#d88a6d]">
              Update Profile
            </Button> */}
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const animalManagement = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Animals</CardTitle>
        <AddAnimalPopup />
      </CardHeader>
      <CardContent>
        {/* Add list of user's animals here */}
        <p>Your animals will be displayed here.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger
              value="profile"
              className="flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="animals"
              className="flex items-center justify-center"
            >
              <PawPrint className="w-5 h-5 mr-2" />
              My Animals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">{profileManagement}</TabsContent>
          <TabsContent value="animals">{animalManagement}</TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
