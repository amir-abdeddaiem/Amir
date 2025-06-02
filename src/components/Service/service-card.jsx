"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart, Clock } from "lucide-react";
import Link from "next/link";

export function ServiceCard({ service }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const cardStyles = {
    background:
      "linear-gradient(135deg, white 0%, rgba(255, 221, 210, 0.3) 100%)",
    border: "none",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered
      ? "translateY(-12px) scale(1.02)"
      : "translateY(0) scale(1)",
  };

  const gradientOverlayStyle = {
    background:
      "linear-gradient(135deg, transparent 0%, rgba(226, 149, 120, 0.05) 100%)",
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.5s ease",
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer"
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={gradientOverlayStyle} />

      <CardContent className="p-0 relative z-10">
        <div className="relative overflow-hidden">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Image gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%, transparent 100%)",
              opacity: isHovered ? 1 : 0,
            }}
          />

          <div className="absolute top-4 left-4">
            <Badge
              className="text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-1.5"
              style={{
                background: "linear-gradient(135deg, #83C5BE 0%, #E29578 100%)",
              }}
            >
              <span className="mr-1">{getServiceEmoji(service.type)}</span>
              {service.type}
            </Badge>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-xl text-gray-800 group-hover:text-[#E29578] transition-colors duration-300 leading-tight">
                {service.name}
              </h3>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(254, 243, 199, 1)" }}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{service.rating}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>

          {/* Separator */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(156, 163, 175, 0.5) 50%, transparent 100%)",
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-[#83C5BE]" />
              <span className="font-medium">{service.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#83C5BE]" />
              <span className="font-bold text-lg text-[#E29578]">
                {service.price}
              </span>
            </div>
          </div>

          <Link href={`/service/reservation/${service.id}`} className="block">
            <Button
              className="w-full text-white transition-all duration-500 group-hover:shadow-xl py-3 text-base font-semibold border-0 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)",
              }}
            >
              <span
                className={`transition-transform duration-300 mr-2 ${
                  isHovered ? "animate-bounce" : ""
                }`}
              >
                🐾
              </span>
              Book Now
              <span
                className="ml-2 transition-opacity duration-300"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                →
              </span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
