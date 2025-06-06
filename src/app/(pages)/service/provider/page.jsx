"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedCard from "@/components/Service/enhanced-card";
// import div from "@/components/animated-background";
import { FadeInContainer } from "@/components/Service/animations";
import { AddServiceModal } from "@/components/Service/add-service-modal";
import { ServiceManagement } from "@/components/Service/service-management";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Plus,
  Edit,
  Save,
  Camera,
  Building,
  Award,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useUserData } from "@/contexts/UserData";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function ProviderProfile() {
  const { userData, loading, refreshUserData } = useUserData();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    certifications: "",
    avatar: "",
  });

  const [stats, setStats] = useState({
    totalServices: 0,
    totalReservations: 0,
    averageRating: 0,
    monthlyEarnings: 0,
  });

  useEffect(() => {
    if (userData) {
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        businessName: userData.businessName || "",
        businessType: userData.businessType || "",
        description: userData.description || "",
        website: userData.website || "",
        certifications: userData.certifications || "",
        avatar: userData.avatar || "",
      });
    }
  }, [userData]);

  useEffect(() => {
    fetchProviderStats();
  }, []);

  const fetchProviderStats = async () => {
    try {
      const response = await axios.get("/api/provider/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await axios.put("/api/profile", profileData);
      await refreshUserData();
      setIsEditing(false);
      toast({
        title: "Profile updated! 🎉",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E29578]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <FadeInContainer>
          <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#83C5BE] to-[#E29578] p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#83C5BE] to-[#E29578] flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-[#E29578] hover:bg-[#E29578]/90"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {profileData.businessName ||
                    `${profileData.firstName} ${profileData.lastName}`}
                </h1>
                <p className="text-lg text-gray-600">
                  {profileData.businessType}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {stats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <Badge className="bg-[#83C5BE] text-white">
                    {stats.totalServices} Services
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#E29578] to-[#83C5BE] text-white"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-[#83C5BE] to-[#E29578] text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </FadeInContainer>

        {/* Stats Cards */}
        <FadeInContainer delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <EnhancedCard gradient>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#83C5BE]/20 to-[#83C5BE]/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-[#83C5BE]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalServices}
                </h3>
                <p className="text-sm text-gray-600">Active Services</p>
              </div>
            </EnhancedCard>

            <EnhancedCard gradient>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#E29578]/20 to-[#E29578]/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#E29578]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalReservations}
                </h3>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </EnhancedCard>

            <EnhancedCard gradient>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-400/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.averageRating.toFixed(1)}
                </h3>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </EnhancedCard>

            <EnhancedCard gradient>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  ${stats.monthlyEarnings}
                </h3>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </EnhancedCard>
          </div>
        </FadeInContainer>

        {/* Main Content */}
        <FadeInContainer delay={200}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger value="profile" className="rounded-lg">
                Profile Information
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-lg">
                My Services
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EnhancedCard title="Personal Information" icon="👤" gradient>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          First Name
                        </label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          disabled={!isEditing}
                          className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Last Name
                        </label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          disabled={!isEditing}
                          className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <Input
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      <Input
                        value={profileData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="City, State"
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                      />
                    </div>
                  </div>
                </EnhancedCard>

                <EnhancedCard title="Business Information" icon="🏢" gradient>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Business Name
                      </label>
                      <Input
                        value={profileData.businessName}
                        onChange={(e) =>
                          handleInputChange("businessName", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Your business name"
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Business Type
                      </label>
                      <Input
                        value={profileData.businessType}
                        onChange={(e) =>
                          handleInputChange("businessType", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="e.g., Veterinary Clinic, Pet Grooming"
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </label>
                      <Input
                        value={profileData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Certifications
                      </label>
                      <Textarea
                        value={profileData.certifications}
                        onChange={(e) =>
                          handleInputChange("certifications", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="List your certifications, licenses, and qualifications"
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578] min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Description
                      </label>
                      <Textarea
                        value={profileData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Tell customers about your business and experience"
                        className="border-2 border-[#83C5BE]/20 focus:border-[#E29578] min-h-[120px]"
                      />
                    </div>
                  </div>
                </EnhancedCard>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      My Services
                    </h2>
                    <p className="text-gray-600">
                      Manage your service offerings
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowAddService(true)}
                    className="bg-gradient-to-r from-[#E29578] to-[#83C5BE] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </div>

                <ServiceManagement />
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EnhancedCard title="Revenue Overview" icon="💰" gradient>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <h3 className="text-3xl font-bold text-green-600">
                        ${stats.monthlyEarnings}
                      </h3>
                      <p className="text-green-700">This Month</p>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      Revenue analytics coming soon...
                    </div>
                  </div>
                </EnhancedCard>

                <EnhancedCard title="Booking Trends" icon="📈" gradient>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <h3 className="text-3xl font-bold text-blue-600">
                        {stats.totalReservations}
                      </h3>
                      <p className="text-blue-700">Total Bookings</p>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      Booking analytics coming soon...
                    </div>
                  </div>
                </EnhancedCard>
              </div>
            </TabsContent>
          </Tabs>
        </FadeInContainer>

        {/* Add Service Modal */}
        <AddServiceModal
          isOpen={showAddService}
          onClose={() => setShowAddService(false)}
          onServiceAdded={() => {
            setShowAddService(false);
            fetchProviderStats();
          }}
        />
      </div>
    </div>
  );
}
