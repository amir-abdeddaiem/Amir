"use client";

import { useState, useMemo } from "react";
import { SearchFilter } from "@/components/Service/search-filter";
import { ServiceCard } from "@/components/Service/service-card";
import AnimatedBackground from "@/components/Service/animated-background";
import { services } from "@/lib/mock-data";
import { Sparkles, Heart, Star } from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "All" || service.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  return (
    <AnimatedBackground className="min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#83C5BE] via-[#E29578] to-[#83C5BE]">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="animate-bounce mb-6">
            <span className="text-8xl drop-shadow-lg">🐾</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-lg">
            Find Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Pet Care
            </span>
          </h1>

          <p className="text-xl md:text-3xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Book trusted services for your furry friends with just a few clicks
          </p>

          <div className="flex justify-center items-center gap-6 text-5xl mb-8">
            <span className="animate-bounce delay-100">🐕</span>
            <Heart className="w-8 h-8 text-white animate-pulse" />
            <span className="animate-bounce delay-200">🐈</span>
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse delay-500" />
            <span className="animate-bounce delay-300">🐰</span>
            <Star className="w-8 h-8 text-white animate-pulse delay-700" />
            <span className="animate-bounce delay-400">🐦</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              ✨ No registration required
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              🚀 Instant booking
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              💝 Trusted providers
            </div>
          </div>
        </div>
      </div>

      {/* Search and Services */}
      <div className="container mx-auto px-4 py-16">
        <SearchFilter
          onSearch={setSearchTerm}
          onFilter={setSelectedType}
          selectedType={selectedType}
        />

        {/* Enhanced Results Count */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-[#83C5BE]/20">
            <Sparkles className="w-5 h-5 text-[#E29578]" />
            <p className="text-gray-700 font-medium">
              Found{" "}
              <span className="font-bold text-2xl text-[#E29578]">
                {filteredServices.length}
              </span>{" "}
              amazing services for your pet
            </p>
            <span className="text-xl">🎉</span>
          </div>
        </div>

        {/* Enhanced Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-[#83C5BE]/20">
              <div className="text-8xl mb-6">😿</div>
              <h3 className="text-3xl font-bold text-gray-700 mb-4">
                No services found
              </h3>
              <p className="text-gray-500 text-lg">
                Try adjusting your search or filters to find the perfect service
                for your pet
              </p>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}
