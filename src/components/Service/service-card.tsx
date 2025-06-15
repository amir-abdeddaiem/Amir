"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart, Clock, Mail, Phone, Globe, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IconCertificate } from "@tabler/icons-react";

interface ServiceCardProps {
  service: {
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
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getServiceEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      "Veterinary": "🏥",
      "Grooming": "✂️",
      "Training": "🎾",
      "Pet Sitting": "🏠",
      "Boarding": "🏡",
      "Walking": "🚶‍♂️",
      "Daycare": "🌞",
      "Pet Taxi": "🚕",
      "Nutrition": "🍎",
      "Behavioral": "🧠"
    };
    return emojiMap[type] || "🐾";
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const dob = new Date(birthDate);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cardStyles = {
    background: "linear-gradient(135deg, white 0%, rgba(255, 221, 210, 0.3) 100%)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
  };

  const gradientOverlayStyle = {
    background: "linear-gradient(135deg, transparent 0%, rgba(226, 149, 120, 0.05) 100%)",
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer h-full flex flex-col"
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={gradientOverlayStyle} />

      <CardContent className="p-0 relative z-10 flex flex-col flex-grow">
        <div className="relative overflow-hidden flex-grow-0">
          <div className="w-full h-56 relative">
            <Image
              src={service.boutiqueImage || "/placeholder.svg"}
              alt={service.businessName}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>

          {/* Image gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%, transparent 100%)",
              opacity: isHovered ? 1 : 0.7,
            }}
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge variant="secondary" className="shadow-md hover:shadow-lg transition-all duration-200">

              <span className="mr-1">{getServiceEmoji(service.businessType)}</span>
              {service.businessType}
            </Badge>

            {service.certifications && (
              <Badge variant="secondary" className="shadow-md hover:shadow-lg transition-all duration-200">
                <IconCertificate className="w-3 h-3 mr-1" />
                Certified
              </Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-grow">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-xl text-gray-800 group-hover:text-[#E29578] transition-colors duration-300 leading-tight">
                {service.businessName || `${service.firstName} ${service.lastName}`}
              </h3>
              {service.accType === "business" && (
                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Business
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {service.description}
            </p>

            {service.services && service.services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {service.services.slice(0, 3).map((serviceItem, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {serviceItem}
                  </Badge>
                ))}
                {service.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{service.services.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Separator */}
          <div
            className="h-px my-2"
            style={{
              background: "linear-gradient(to right, transparent 0%, rgba(156, 163, 175, 0.3) 50%, transparent 100%)",
            }}
          />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-[#83C5BE] flex-shrink-0" />
              <span className="truncate">{service.location}</span>
            </div>

            {service.birthDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#83C5BE] flex-shrink-0" />
                <span>{calculateAge(service.birthDate)} years experience</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-[#83C5BE] flex-shrink-0" />
              <span>Member since {formatDate(service.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {service.website && (
              <a
                href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4 text-[#83C5BE]" />
              </a>
            )}
            {service.email && (
              <a
                href={`mailto:${service.email}`}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-4 h-4 text-[#83C5BE]" />
              </a>
            )}
            {service.phone && (
              <a
                href={`tel:${service.phone.replace(/\D/g, '')}`}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-4 h-4 text-[#83C5BE]" />
              </a>
            )}
          </div>

          <Link href={`/service/provider/${service._id}`} passHref>
            <button
              className="w-full text-white transition-all duration-300 group-hover:shadow-lg py-3 text-base font-semibold border-0 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)",
              }}
            >
              <span
                className={`transition-transform duration-300 mr-2 ${
                  isHovered ? "animate-bounce" : ""
                }`}
              >
                🐾
              </span>
              View Details
              <span
                className="ml-2 transition-opacity duration-300"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                →
              </span>
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}