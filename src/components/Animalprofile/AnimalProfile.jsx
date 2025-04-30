"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/navigation";
import { mockAnimalData } from "./mockData";
import ViewProfile from "./ViewProfile";
import EditProfileForm from "./EditProfileForm";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import LoadingSpinner from "./LoadingSpinner";

export default function AnimalProfile({ params }) {
  const router = useRouter();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    description: "",
    vaccinated: false,
    neutered: false,
    microchipped: false,
    friendly: {
      children: false,
      dogs: false,
      cats: false,
      other: false,
    },
    image: null,
  });

  // Fetch animal data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnimal(mockAnimalData);
        setFormData({
          name: mockAnimalData.name,
          type: mockAnimalData.type,
          breed: mockAnimalData.breed,
          age: mockAnimalData.age,
          gender: mockAnimalData.gender,
          weight: mockAnimalData.weight,
          description: mockAnimalData.description,
          vaccinated: mockAnimalData.vaccinated,
          neutered: mockAnimalData.neutered,
          microchipped: mockAnimalData.microchipped,
          friendly: { ...mockAnimalData.friendly },
          image: mockAnimalData.image,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animal data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle friendly checkboxes
  const handleFriendlyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      friendly: {
        ...prev.friendly,
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submitted:", formData);

    setAnimal({
      ...animal,
      ...formData,
    });

    setIsSubmitting(false);
    setEditMode(false);
  };

  // Handle delete
  const handleDelete = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Animal deleted:", animal.id);
    router.push("/");
  };

  // Start editing
  const startEditing = () => {
    setEditMode(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditMode(false);
    setFormData({
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      gender: animal.gender,
      weight: animal.weight,
      description: animal.description,
      vaccinated: animal.vaccinated,
      neutered: animal.neutered,
      microchipped: animal.microchipped,
      friendly: { ...animal.friendly },
      image: animal.image,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {editMode
                ? `Editing ${animal.name}'s Profile`
                : `${animal.name}'s Profile`}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {editMode
                ? "Update your pet's information below"
                : "View and manage your pet's information"}
            </p>
          </div>

          {editMode ? (
            <EditProfileForm
              formData={formData}
              handleChange={handleChange}
              handleFriendlyChange={handleFriendlyChange}
              handleSubmit={handleSubmit}
              cancelEditing={cancelEditing}
              isSubmitting={isSubmitting}
              animal={animal}
            />
          ) : (
            <ViewProfile
              animal={animal}
              startEditing={startEditing}
              setDeleteDialogOpen={setDeleteDialogOpen}
            />
          )}
        </div>
      </main>

      <DeleteConfirmationDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleDelete={handleDelete}
        isSubmitting={isSubmitting}
        animal={animal}
      />

      <Footer />
    </div>
  );
}
