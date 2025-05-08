"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Calendar,
  Weight,
  Heart,
  AlertTriangle,
} from "lucide-react";
import DeleteAnimal from "./DeleteAnimal";

export default function AnimalProfile({ animal, onEdit, onDelete }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Image and basic info */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={animal.image || "/placeholder.svg"}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">
                {animal.name}
              </h2>
              <div className="flex justify-center space-x-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-[#FFDDD2] text-[#E29578] border-[#E29578]"
                >
                  {animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-[#FFDDD2] text-[#E29578] border-[#E29578]"
                >
                  {animal.breed}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#83C5BE]" />
                  <span>
                    {animal.age}{" "}
                    {Number.parseInt(animal.age) === 1 ? "year" : "years"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Weight className="h-4 w-4 mr-2 text-[#83C5BE]" />
                  <span>{animal.weight} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex space-x-2">
            <Button onClick={onEdit} className="flex-1">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right column - Tabs with details */}
        <div className="md:w-2/3">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {animal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{animal.description}</p>
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Friendly With
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            animal.friendly.children
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Children</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            animal.friendly.dogs
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Dogs</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            animal.friendly.cats
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Cats</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            animal.friendly.other
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Other Animals</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {animal.vaccinated ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Vaccinated
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Not Vaccinated
                        </Badge>
                      )}

                      {animal.neutered ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Neutered/Spayed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Not Neutered/Spayed
                        </Badge>
                      )}

                      {animal.microchipped ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Microchipped
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Not Microchipped
                        </Badge>
                      )}
                    </div>

                    {!animal.vaccinated && (
                      <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          This pet is not vaccinated. We recommend getting
                          vaccinations to protect your pet's health.
                        </p>
                      </div>
                    )}

                    {!animal.microchipped && (
                      <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <Heart className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-blue-800">
                          Consider microchipping your pet to help identify them
                          if they ever get lost.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="owner" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={animal.owner.image || "/placeholder.svg"}
                        alt={animal.owner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{animal.owner.name}</h3>
                      <p className="text-sm text-gray-500">
                        Owner since {new Date(animal.createdAt).toDateString()}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-[#E29578]"
                        asChild
                      >
                        <a href={`/user/${animal.owner.id}`}>View Profile</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <DeleteAnimal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        animalName={animal.name}
        isDeleting={false}
      />
    </div>
  );
}
