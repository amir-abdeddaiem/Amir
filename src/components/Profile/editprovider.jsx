"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Store, MapPin, Phone, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useUserData } from "@/contexts/UserData";

export default function EditProviderProfile() {
  const router = useRouter();
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [boutiqueImagePreview, setBoutiqueImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    description: "",
    website: "",
    location: "",
    services: "",
    boutiqueImage: "",
    avatar: "",
  });

  useEffect(() => {
    fetchProviderData();
  }, [userData]);

  const fetchProviderData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/provider", userData);
      if (response.data.success) {
        setFormData({
          firstName: response.data.data.firstName || "",
          lastName: response.data.data.lastName || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          businessName: response.data.data.businessName || "",
          description: response.data.data.description || "",
          website: response.data.data.website || "",
          location: response.data.data.location || "",
          services: response.data.data.services || "",
          boutiqueImage: response.data.data.boutiqueImage || "",
          avatar: response.data.data.avatar || "",
        });
        setAvatarPreview(response.data.data.avatar || null);
        setBoutiqueImagePreview(response.data.data.boutiqueImage || null);
      } else {
        throw new Error(response.data.error || "Failed to fetch provider data");
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
      setError("Failed to load provider data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBoutiqueImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBoutiqueImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, boutiqueImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        throw new Error("Please fill in all required fields");
      }

      const response = await axios.put("/api/provider", formData, {
        headers: { "x-user-id": userData._id },
      });
      if (response.data.success) {
        setSuccess(true);
        toast.success("Profile updated successfully");
        setTimeout(() => {
          router.push("/provider");
        }, 2000);
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating provider profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-[#83C5BE] p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarImage src={avatarPreview || formData.avatar} />
                    <AvatarFallback className="bg-white text-emerald-600 text-xl font-bold">
                      {formData.firstName.charAt(0)}
                      {formData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Edit Provider Profile</h1>
                  <p className="text-emerald-100">
                    Update your service provider information
                  </p>
                  <Badge className="mt-2 bg-white text-emerald-600">
                    Service Provider
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <User className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </motion.section>

                <Separator />

                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <Store className="w-5 h-5 Stu-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Business Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="businessName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="text-sm font-medium text-gray-700"
                      >
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-700 flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label
                      htmlFor="services"
                      className="text-sm font-medium text-gray-700"
                    >
                      Services
                    </Label>
                    <Textarea
                      id="services"
                      name="services"
                      value={formData.services}
                      onChange={handleInputChange}
                      className="min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="List your services..."
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[120px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Describe your business..."
                      maxLength={250}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.description.length}/250 characters
                    </p>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label className="text-sm font-medium text-gray-700">
                      Boutique Image
                    </Label>
                    <div className="relative">
                      <img
                        src={
                          boutiqueImagePreview ||
                          formData.boutiqueImage ||
                          "/default-boutique.png"
                        }
                        alt="Boutique"
                        className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                      />
                      <label
                        htmlFor="boutique-image-upload"
                        className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-15 h-15 text-emerald-600" />

                        <input
                          id="boutique-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleBoutiqueImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </motion.section>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg"
                  >
                    Profile updated successfully! Redirecting to profile...
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-4 pt-6 justify-center"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/provider")}
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="px-8 bg-[#83C5BE] hover:bg-[#83C5BE]/90"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
