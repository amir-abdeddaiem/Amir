"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { SearchFilter } from "@/components/Service/search-filter";
import { ServiceCard } from "@/components/Service/service-card";
import { AnimatedBackground } from "@/components/Service/animated-background";
import { Sparkles, Heart, Star } from "lucide-react";

interface Service {
  _id: string;
  accType: string;
  birthDate: string | null;
  boutiqueImage: string;
  businessName: string;
  businessType: string;
  certifications: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  description: string;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
  location: string;
  phone: string;
  services: string[];
  website: string;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/services", {
          params: {
            type: selectedType === "All" ? null : selectedType,
            search: searchTerm || null,
            // Add other filters as needed
          },
        });

        console.log(response.data)

        if (response.data.success) {
          setServices(response.data.data);
        } else {
          setError(response.data.error || "Failed to fetch services");
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to prevent too many API calls
    const debounceTimer = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedType]);

  return (
    <AnimatedBackground className="min-h-screen">
      {/* Hero Section (unchanged) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#83C5BE] via-[#E29578] to-[#83C5BE]">
        {/* ... your existing hero section code ... */}
      </div>

      {/* Search and Services */}
      <div className="container mx-auto px-4 py-16">
        <SearchFilter
          onSearch={setSearchTerm}
          onFilter={setSelectedType}
          selectedType={selectedType}
        />

        {loading ? (
          <div className="text-center py-20">Loading services...</div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-[#83C5BE]/20">
              <div className="text-8xl mb-6">⚠️</div>
              <h3 className="text-3xl font-bold text-gray-700 mb-4">Error</h3>
              <p className="text-gray-500 text-lg">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-[#83C5BE]/20">
                <Sparkles className="w-5 h-5 text-[#E29578]" />
                <p className="text-gray-700 font-medium">
                  Found{" "}
                  <span className="font-bold text-2xl text-[#E29578]">
                    {services.length}
                  </span>{" "}
                  amazing services for your pet
                </p>
                <span className="text-xl">🎉</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            {services.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-[#83C5BE]/20">
                  <div className="text-8xl mb-6">😿</div>
                  <h3 className="text-3xl font-bold text-gray-700 mb-4">
                    No services found
                  </h3>
                  <p className="text-gray-500 text-lg">
                    Try adjusting your search or filters to find the perfect
                    service for your pet
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedBackground>
  );
}