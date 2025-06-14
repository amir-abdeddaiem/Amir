"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProviderCalendar } from "@/components/Service/provider-calendar";
import EnhancedCard from "@/components/Service/enhanced-card";
import {
  ArrowLeft,
  Settings,
  Star,
  MapPin,
  Users,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProviderDashboard() {
  const params = useParams();
  const { toast } = useToast();
  const serviceId = params.id; // Type as string since params.id is a string
  const [service, setService] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the IUser interface

  useEffect(() => {
    const fetchservice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/service/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Provider not found"
              : "Error fetching provider"
          );
        }
        const providerData = await response.json();

        // Map API response to the expected service structure
        const mappedService = {
          id: providerData._id,
          name:
            providerData.businessName ||
            `${providerData.firstName} ${providerData.lastName}`,
          type: providerData.businessType || "Unknown",
          description: providerData.description || "No description available",
          image:
            providerData.boutiqueImage ||
            providerData.avatar ||
            "/placeholder.svg",
          rating: 4.5, // Placeholder: API does not provide rating
          distance: providerData.location || "Unknown location",
          price: "$50", // Placeholder: API does not provide price
          availability: providerData.availability || {}, // Adjust if availability is elsewhere
        };

        setService(mappedService);
        setAvailability(mappedService.availability || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchProvider();
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedCard className="text-center max-w-md mx-4" gradient>
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading...</h2>
          <p className="text-gray-500 mb-6">Fetching provider details...</p>
        </EnhancedCard>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedCard className="text-center max-w-md mx-4" gradient>
          <div className="text-6xl mb-6">😿</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            {error || "Service not found"}
          </h2>
          <p className="text-gray-500 mb-6">
            The service you're looking for doesn't exist or there was an error.
          </p>
          <Link href="/">
            <Button
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)",
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </EnhancedCard>
      </div>
    );
  }

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);

    // Simulate API call to save changes
    setTimeout(() => {
      toast({
        title: "Calendar updated! 🎉",
        description: "Your availability has been successfully saved.",
      });
    }, 500);
  };

  const getServiceEmoji = (type) => {
    switch (type) {
      case "Veterinary":
        return "🏥";
      case "Grooming":
        return "✂️";
      case "Training":
        return "🎾";
      case "Pet Sitting":
        return "🏠";
      default:
        return "🐾";
    }
  };

  const totalSlots = Object.values(availability).reduce(
    (total, slots) => total + slots.length,
    0
  );
  const totalDays = Object.keys(availability).length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-8 p-6 rounded-2xl shadow-lg border-0"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="lg"
                className="hover:bg-[#83C5BE]/10 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Button>
            </Link>
            <Separator
              orientation="vertical"
              className="h-8"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #d1d5db, transparent)",
              }}
            />
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #83C5BE 0%, #E29578 100%)",
                }}
              >
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Provider Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your service availability
                </p>
              </div>
            </div>
          </div>
          <Badge
            className="text-white px-4 py-2"
            style={{
              background: "linear-gradient(135deg, #83C5BE 0%, #E29578 100%)",
            }}
          >
            {getServiceEmoji(service.type)} {service.type}
          </Badge>
        </div>

        {/* Service Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <EnhancedCard gradient>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(131, 197, 190, 0.2) 0%, rgba(131, 197, 190, 0.1) 100%)",
                }}
              >
                <Star className="w-6 h-6 text-[#83C5BE]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {service.rating}
              </h3>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </EnhancedCard>

          <EnhancedCard gradient>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(226, 149, 120, 0.2) 0%, rgba(226, 149, 120, 0.1) 100%)",
                }}
              >
                <Calendar className="w-6 h-6 text-[#E29578]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{totalDays}</h3>
              <p className="text-sm text-gray-600">Available Days</p>
            </div>
          </EnhancedCard>

          <EnhancedCard gradient>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(131, 197, 190, 0.2) 0%, rgba(226, 149, 120, 0.1) 100%)",
                }}
              >
                <Clock className="w-6 h-6 text-[#83C5BE]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{totalSlots}</h3>
              <p className="text-sm text-gray-600">Time Slots</p>
            </div>
          </EnhancedCard>

          <EnhancedCard gradient>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(226, 149, 120, 0.2) 0%, rgba(131, 197, 190, 0.1) 100%)",
                }}
              >
                <TrendingUp className="w-6 h-6 text-[#E29578]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {service.price}
              </h3>
              <p className="text-sm text-gray-600">Service Price</p>
            </div>
          </EnhancedCard>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <EnhancedCard className="lg:col-span-1" gradient>
            <div className="text-center">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {service.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#83C5BE]" />
                  <span className="text-gray-600">{service.distance}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[#E29578]" />
                  <span className="text-gray-600">Pet Care Provider</span>
                </div>
              </div>
            </div>
          </EnhancedCard>

          <div className="lg:col-span-3">
            <EnhancedCard title="Manage Your Calendar" icon="📅" gradient>
              <ProviderCalendar
                availability={availability}
                onAvailabilityChange={handleAvailabilityChange}
                serviceName={service.name}
              />
            </EnhancedCard>
          </div>
        </div>

        {/* Quick Tips */}
        <EnhancedCard title="Quick Tips" icon="💡" gradient>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-4 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(131, 197, 190, 0.1) 0%, rgba(131, 197, 190, 0.05) 100%)",
              }}
            >
              <h4 className="font-semibold text-gray-800 mb-2">
                📅 Calendar Management
              </h4>
              <p className="text-sm text-gray-600">
                Click on any date to add or remove time slots. Use "Quick Fill"
                to add standard business hours.
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(226, 149, 120, 0.1) 0%, rgba(226, 149, 120, 0.05) 100%)",
              }}
            >
              <h4 className="font-semibold text-gray-800 mb-2">
                ⏰ Time Slots
              </h4>
              <p className="text-sm text-gray-600">
                Add specific time slots for each day. Customers can only book
                during your available times.
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(131, 197, 190, 0.1) 0%, rgba(226, 149, 120, 0.05) 100%)",
              }}
            >
              <h4 className="font-semibold text-gray-800 mb-2">
                💾 Save Changes
              </h4>
              <p className="text-sm text-gray-600">
                Don't forget to save your changes! Your availability will be
                updated for all customers.
              </p>
            </div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
}
