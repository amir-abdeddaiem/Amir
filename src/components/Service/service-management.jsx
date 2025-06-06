"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// interface Service {
//   _id: string
//   name: string
//   type: string
//   description: string
//   price: {
//     min: number
//     max: number
//     currency: string
//   }
//   duration: number
//   location: {
//     address: string
//     city: string
//   }
//   images: string[]
//   rating: number
//   reviewCount: number
//   isActive: boolean
//   availability: {
//     dayOfWeek: number
//     timeSlots: string[]
//   }[]
// }

export function ServiceManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/provider/services");
      setServices(response.data.data);
    } catch (error) {
      toast({
        title: "Error fetching services",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId, isActive) => {
    try {
      await axios.put(`/api/services/${serviceId}`, { isActive });
      setServices((prev) =>
        prev.map((service) =>
          service._id === serviceId ? { ...service, isActive } : service
        )
      );
      toast({
        title: `Service ${isActive ? "activated" : "deactivated"}`,
        description: `Your service is now ${
          isActive ? "visible" : "hidden"
        } to customers.`,
      });
    } catch (error) {
      toast({
        title: "Error updating service",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`/api/services/${serviceId}`);
      setServices((prev) =>
        prev.filter((service) => service._id !== serviceId)
      );
      toast({
        title: "Service deleted",
        description: "Your service has been permanently removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting service",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
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
      case "Boarding":
        return "🏨";
      case "Walking":
        return "🚶";
      default:
        return "🐾";
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No services yet
        </h3>
        <p className="text-gray-600">
          Create your first service to start accepting bookings!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card
          key={service._id}
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, white 0%, rgba(255, 221, 210, 0.3) 100%)",
            opacity: service.isActive ? 1 : 0.7,
          }}
        >
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getServiceEmoji(service.type)}
                </span>
                <Badge
                  className="text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #83C5BE 0%, #E29578 100%)",
                  }}
                >
                  {service.type}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={service.isActive}
                  onCheckedChange={(checked) =>
                    toggleServiceStatus(service._id, checked)
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Service
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteService(service._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                {service.name}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-2">
                {service.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {service.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">({service.reviewCount})</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}min</span>
                </div>
              </div>

              {/* Location & Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{service.location.city}</span>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    ${service.price.min} - ${service.price.max}
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Available {service.availability.length} days/week</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {service.availability.slice(0, 3).map((avail) => (
                    <Badge
                      key={avail.dayOfWeek}
                      variant="outline"
                      className="text-xs"
                    >
                      {
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          avail.dayOfWeek
                        ]
                      }
                    </Badge>
                  ))}
                  {service.availability.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.availability.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
