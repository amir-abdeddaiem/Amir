"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Store, Phone, Mail, MapPin, Edit } from "lucide-react";
import { toast } from "sonner";
import { useUserData } from "@/contexts/UserData";

// Glassmorphism effect component
const GlassCard = ({ children, className }) => (
  <div
    className={`backdrop-blur-lg bg-white/10 border border-white/30 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl ${className}`}
  >
    {children}
  </div>
);

export default function ServiceProviderProfile() {
  const router = useRouter();
  const [serviceProvider, setServiceProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useUserData();

  useEffect(() => {
    fetchServiceProvider();
  }, [userData]);

  const fetchServiceProvider = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/provider", {
        userData,
      });

      if (response.data.success) {
        setServiceProvider(response.data.data);
      } else {
        throw new Error(
          response.data.error || "Failed to fetch provider data."
        );
      }
    } catch (err) {
      console.error("Error fetching provider data:", err);
      setError(err.message || "Failed to load service provider data.");
    } finally {
      setIsLoading(false);
    }
  };

  const provider = serviceProvider || {
    boutiqueImage: "/default-boutique.png",
    businessName: userData?.businessName || "Not provided",
    description: userData?.description || "No description provided",
    website: userData?.website || "Not provided",
    location: userData?.location || "Not provided",
    services: userData?.services || "Not provided",
    avatar: userData?.avatar || "/default-avatar.png",
    firstName: userData?.firstName || "Unknown",
    lastName: userData?.lastName || "Owner",
    phone: userData?.phone || "Not provided",
    email: userData?.email || "Not provided",
  };

  const handleEditClick = () => {
    router.push("/provider/edit");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F0F7FA] to-[#FFE8E2]">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#E29578]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F0F7FA] to-[#FFE8E2]">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium text-[#E29578]">{error}</p>
          <Button
            variant="outline"
            size="lg"
            className="border-[#E29578] text-[#006D77] hover:bg-[#E29578]/10 hover:text-[#006D77] transition-colors"
            onClick={fetchServiceProvider}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#EDF6F9] to-[#FFDDD2]">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-12"
          >
            {/* Boutique Image Section */}
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-lg"
              >
                <h2 className="text-center text-4xl font-bold mt-6 text-[#006D77] tracking-tight">
                  {provider.businessName}
                </h2>

                <img
                  src={provider.boutiqueImage}
                  alt="Boutique"
                  className="w-full h-96 object-cover rounded-3xl border-4 border-[#E29578]/40 shadow-xl"
                />
                <div />
              </motion.div>
            </div>
            {/* Edit Profile Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleEditClick}
                className="group relative backdrop-blur-lg bg-[#006D77]/80 hover:bg-[#006D77] text-white font-medium px-6 py-3 rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#E29578]/0 via-[#E29578]/20 to-[#E29578]/0 group-hover:via-[#E29578]/40 transition-all duration-500" />
                <motion.span
                  className="flex items-center gap-2 relative z-10"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </motion.span>
              </Button>
            </motion.div>
            {/* Parallel Service Details and Description/Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Services and Website */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-[#E29578]/20"
              >
                <h3 className="text-2xl font-semibold text-[#006D77] mb-6 flex items-center">
                  <Store className="mr-3 h-6 w-6 text-[#E29578]" /> Service
                  Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-[#83C5BE] tracking-wide">
                      Services
                    </p>
                    <p className="w-full px-3 py-2 text-cyan-900 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all">
                      {provider.services}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#83C5BE] tracking-wide">
                      Website
                    </p>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#006D77] text-base hover:text-[#E29578] transition-colors"
                    >
                      {provider.website}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Right: Description and Location */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-[#E29578]/20"
              >
                <h3 className="text-2xl font-semibold text-[#006D77] mb-6 flex items-center">
                  <MapPin className="mr-3 h-6 w-6 text-[#E29578]" /> About
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-[#83C5BE] font-medium">
                      Location
                    </p>
                    <p className="text-[#006D77]">
                      {provider?.location || "Not provided"}
                    </p>
                    <p className="text-[#006D77] text-base">
                      {provider.adress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#83C5BE] tracking-wide">
                      Description
                    </p>
                    <p className="w-full px-3 py-2 text-cyan-900 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all">
                      {provider.description}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {provider.description
                        ? `${provider.description.length}/250 caractères`
                        : "Optionnel"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Owner Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-[#E29578]/20 min-h-[200px] flex flex-col md:flex-row items-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="w-28 h-28 border-4 border-[#E29578]/40 shadow-md">
                  <AvatarImage
                    className="object-cover"
                    src={provider.avatar}
                    alt="Owner"
                  />
                  <AvatarFallback className="text-2xl font-bold text-[#006D77]">
                    {provider.firstName[0]}
                    {provider.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#006D77] tracking-tight">
                  {provider.firstName} {provider.lastName}
                </h3>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-3">
                  <div className="flex items-center text-[#83C5BE] gap-2">
                    <Phone className="w-5 h-5" />
                    <p className="text-base">{provider.phone}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-[#83C5BE] gap-4">
                <Mail className="w-5 h-5" />
                <p className="text-base">{provider.email}</p>
              </div>
              <Button
                onClick={() =>
                  toast.info("Contact functionality not implemented yet")
                }
                className="mt-6 bg-[#E29578] hover:bg-[#E29578]/90 text-white font-medium px-8 py-2 rounded-full transition-all duration-300"
              >
                Contact Owner
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
