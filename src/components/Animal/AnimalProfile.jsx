"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {URL} from "@/hooks/url"
import QRCode from "qrcode"
import {
  Edit,
  Trash2,
  Calendar,
  Weight,
  Palette,
  User,
  Stethoscope,
  Heart,
  Baby,
  Dog,
  Cat,
  PawPrint,
  Venus,
  Mars,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import DeleteAnimal from "./DeleteAnimal";

export default function AnimalProfile({ animal, onEdit, onDelete }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete();
  };


  const [qrCodeUrl, setQrCodeUrl] = useState('/user');


  const generateQRCode = async (id) => {
    try {
      const url = await QRCode.toDataURL(`${URL}/animal/${id}`);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };


  // Gender icon mapping
  const genderIcon = {
    male: <Mars className="h-4 w-4 mr-2 text-blue-500" />,
    female: <Venus className="h-4 w-4 mr-2 text-pink-500" />,
    other: <User className="h-4 w-4 mr-2 text-purple-500" />,
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Content - Single Column Layout */}
        <div className="space-y-6">
          {/* Animal Profile Header */}
          <Card className="bg-white border-[#83C5BE]/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:w-1/3">
                  <div className="relative w-full">
                    <img
                      src={animal.image || "/placeholder.svg"}
                      alt={animal.name}
                      className="w-full h-auto max-w-xs rounded-lg border-4 border-[#83C5BE]"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#FFDDD2] text-[#1F2937]">
                      {animal.type.charAt(0).toUpperCase() +
                        animal.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4 w-full">
                    <Button
                      onClick={onEdit}
                      className="flex-1 bg-[#E29578] hover:bg-[#E29578]/90 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  <div className="col-span-2 text-center py-1 justify-center flex">

                    <img src={qrCodeUrl} className="w-25 h-25" alt="" onError={() => { generateQRCode(animal._id) }} />
                  </div>
                </div>

                <div className="md:w-2/3">

                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {animal.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">{animal.breed}</p>

                  {animal.description && (
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {animal.description}
                    </p>
                  )}


                  {/* Basic Info Grid */}
                  <div onLoad={() => { generateQRCode(animal._id) }} className="grid grid-cols-2 gap-4 mb-6">


                    <div className="text-center p-3 bg-[#FFDDD2]/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#E29578] mx-auto mb-1" />
                      <div className="text-sm text-gray-600">Age</div>
                      <div className="font-semibold">
                        {animal.age} {animal.age === 1 ? "year" : "years"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-[#FFDDD2]/50 rounded-lg">

                      {genderIcon[animal.gender]}
                      <div className="text-sm text-gray-600">Gender</div>
                      <div className="font-semibold capitalize">
                        {animal.gender}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-[#FFDDD2]/50 rounded-lg">
                      <Palette className="w-5 h-5 text-[#E29578] mx-auto mb-1" />
                      <div className="text-sm text-gray-600">Color</div>
                      <div className="font-semibold">
                        {animal.color || "N/A"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-[#FFDDD2]/50 rounded-lg">
                      <Weight className="w-5 h-5 text-[#E29578] mx-auto mb-1" />
                      <div className="text-sm text-gray-600">Weight</div>
                      <div className="font-semibold">
                        {animal.weight || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Health Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {animal.HealthStatus?.vaccinated && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ Vaccinated
                      </Badge>
                    )}
                    {animal.HealthStatus?.neutered && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        ✓ Neutered/Spayed
                      </Badge>
                    )}
                    {animal.HealthStatus?.microchipped && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        ✓ Microchipped
                      </Badge>
                    )}
                    {animal.inmatch && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Looking for Match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className="bg-white border-[#83C5BE]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E29578]">
                <Stethoscope className="w-5 h-5" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Health Status</div>
                <Badge
                  className={`${animal.healthStatus === "Excellent"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : animal.healthStatus === "Good"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : animal.healthStatus === "Fair"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                >
                  {animal.healthStatus || "Good"}
                </Badge>
              </div>

              {animal.HealthStatus?.lastVetVisit && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Last Vet Visit
                    </div>
                    <div className="font-medium">
                      {new Date(
                        animal.HealthStatus.lastVetVisit
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </>
              )}

              {animal.HealthStatus?.specialNeeds && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Special Needs
                    </div>
                    <div className="text-gray-700">
                      {animal.HealthStatus.specialNeeds}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Compatibility */}
          <Card className="bg-white border-[#83C5BE]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E29578]">
                <Heart className="w-5 h-5" />
                Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Baby className="w-4 h-4 mr-2" />
                    <span>Children</span>
                  </div>
                  <Badge
                    variant={animal.friendly?.children ? "default" : "outline"}
                    className={
                      animal.friendly?.children
                        ? "bg-green-100 text-green-800 border-green-200"
                        : ""
                    }
                  >
                    {animal.friendly?.children ? "Yes" : "No"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Dog className="w-4 h-4 mr-2" />
                    <span>Dogs</span>
                  </div>
                  <Badge
                    variant={animal.friendly?.dogs ? "default" : "outline"}
                    className={
                      animal.friendly?.dogs
                        ? "bg-green-100 text-green-800 border-green-200"
                        : ""
                    }
                  >
                    {animal.friendly?.dogs ? "Yes" : "No"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cat className="w-4 h-4 mr-2" />
                    <span>Cats</span>
                  </div>
                  <Badge
                    variant={animal.friendly?.cats ? "default" : "outline"}
                    className={
                      animal.friendly?.cats
                        ? "bg-green-100 text-green-800 border-green-200"
                        : ""
                    }
                  >
                    {animal.friendly?.cats ? "Yes" : "No"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PawPrint className="w-4 h-4 mr-2" />
                    <span>Other Animals</span>
                  </div>
                  <Badge
                    variant={animal.friendly?.animals ? "default" : "outline"}
                    className={
                      animal.friendly?.animals
                        ? "bg-green-100 text-green-800 border-green-200"
                        : ""
                    }
                  >
                    {animal.friendly?.animals ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          {animal.owner && (
            <Card className="bg-white border-[#83C5BE]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E29578]">
                  <User className="w-5 h-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#83C5BE]">
                    <img
                      src={animal.owner.image || "/placeholder-user.svg"}
                      alt={animal.owner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{animal.owner.name}</h3>
                    <p className="text-sm text-gray-500">
                      Caring for {animal.name} since{" "}
                      {new Date(animal.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-[#83C5BE]"
                        asChild
                      >
                        <Link href={`/user/${animal.owner.id}`}>
                          View Owner Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DeleteAnimal
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDelete}
          animalName={animal.name}
          isDeleting={false}
        />
      </div>
    </div>
  );
}
