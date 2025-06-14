"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUserData } from "@/contexts/UserData";
import { PawPrint } from "lucide-react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AnimalsPage() {
  const { userData, loading: userLoading, error: userError } = useUserData();
  const [animals, setAnimals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get("/api/animal");
        if (!response.data) {
          throw new Error("No data received from API");
        }
        const animalsData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setAnimals(animalsData);
      } catch (err) {
        console.error("Error fetching animals:", err);
        setError(err.message || "Failed to load animals");
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const handleEditAnimal = (animalId, updatedData) => {
    setAnimals((prevAnimals) =>
      prevAnimals.map((animal) =>
        animal._id === animalId ? { ...animal, ...updatedData } : animal
      )
    );
  };

  const handleDeleteAnimal = (animalId) => {
    setAnimals((prevAnimals) =>
      prevAnimals.filter((animal) => animal._id !== animalId)
    );
  };

  if (userLoading || isLoading) {
    return (
      <div className="p-6 bg-[#EDF6F9] min-h-screen">
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="flex items-center gap-4 p-4 border-[#006D77]"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-9 w-[80px]" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (userError || error) {
    return (
      <div className="p-6 bg-[#EDF6F9] min-h-screen">
        <p className="text-[#E29578] text-lg">Error: {userError || error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#EDF6F9] min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#006D77]">
              {userData?.firstName
                ? `Welcome, ${userData.firstName}!`
                : "Animals"}
            </h1>
            <p className="text-[#006D77]/70 mt-2 text-lg">
              Manage your animals here.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              className="bg-[#E29578] hover:bg-[#D17A60] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              aria-label="Add new animal"
            >
              Add New Animal
            </Button>
          </div>
        </div>

        {/* Navigation Tab */}
        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-1 bg-[#FFDDD2] rounded-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#FFDDD2] data-[state=active]:text-[#006D77] text-[#FFDDD2]"
            >
              Animals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="space-y-4">
              {animals.length > 0 ? (
                animals.map((animal, index) => (
                  <AnimalCard
                    key={index}
                    animal={animal}
                    onEdit={handleEditAnimal}
                    onDelete={handleDeleteAnimal}
                  />
                ))
              ) : (
                <p className="text-center text-[#006D77]/70">
                  No animals found.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const AnimalCard = ({ animal, onEdit, onDelete }) => {
  const animalName = animal.name || "Unnamed Animal";
  const avatarFallback = (animal.name || "A")[0];
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: animal.name || "",
    breed: animal.breed || "",
    image: animal.image || "",
    description: animal.description || "",
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name) {
      toast.error("Animal name is required");
      return;
    }
    try {
      const payload = { ...editForm };
      await axios.patch(`/api/animal/${animal._id}`, payload);
      onEdit(animal._id, payload);
      setIsEditOpen(false);
      toast.success("Animal updated successfully");
    } catch (err) {
      console.error("Error updating animal:", err);
      toast.error(err.response?.data?.message || "Failed to update animal");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/animal/${animal._id}`);
      onDelete(animal._id);
      setIsDeleteOpen(false);
      toast.success("Animal deleted successfully");
    } catch (err) {
      console.error("Error deleting animal:", err);
      toast.error(err.response?.data?.message || "Failed to delete animal");
    }
  };

  return (
    <>
      <Card className="flex items-center gap-4 p-4 border-[#006D77] bg-white">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={animal.image || "/default-animal.jpg"}
            alt={`${animalName} avatar`}
          />
          <AvatarFallback className="bg-[#FFDDD2] text-[#006D77] font-medium">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-[#006D77]">{animalName}</h3>
          <p className="text-sm text-[#006D77]/80">{animal.breed || "N/A"}</p>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90">
              Animal
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90"
                aria-label={`View details of ${animalName}`}
              >
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#EDF6F9] max-h-[80vh] overflow-y-auto">
              <VisuallyHidden>
                <DialogTitle>{animalName || "Animal Details"}</DialogTitle>
              </VisuallyHidden>
              <Card className="border-[#006D77] bg-white">
                <CardHeader>
                  <CardTitle className="text-[#006D77]">{animalName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[#006D77]">
                  <p>Breed: {animal.breed || "N/A"}</p>
                  <p>
                    Avatar:
                    {animal.image ? (
                      <a
                        href={animal.image}
                        target="_blank"
                        className="underline"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p>Description: {animal.description || "N/A"}</p>
                  <p>
                    Created:{" "}
                    {animal.createdAt
                      ? new Date(animal.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80">
                      Close
                    </Button>
                  </DialogClose>
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80"
                aria-label={`Edit ${animalName}`}
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#EDF6F9] max-h-[80vh] overflow-y-auto">
              <VisuallyHidden>
                <DialogTitle>Edit Animal</DialogTitle>
              </VisuallyHidden>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#006D77]">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="breed" className="text-[#006D77]">
                    Breed
                  </Label>
                  <Input
                    id="breed"
                    value={editForm.breed}
                    onChange={(e) =>
                      setEditForm({ ...editForm, breed: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar" className="text-[#006D77]">
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) =>
                      setEditForm({ ...editForm, avatar: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-[#006D77]">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-[#E29578] text-white hover:bg-[#D17A60]"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#E29578] text-white hover:bg-[#D17A60]"
                aria-label={`Delete ${animalName}`}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#EDF6F9]">
              <VisuallyHidden>
                <DialogTitle>Confirm Delete</DialogTitle>
              </VisuallyHidden>
              <div className="space-y-4">
                <p className="text-[#006D77]">
                  Are you sure you want to delete {animalName}?
                </p>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDelete}
                    className="bg-[#E29578] text-white hover:bg-[#D17A60]"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
};
