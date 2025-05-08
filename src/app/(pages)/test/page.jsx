"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/navigation";
import AddAnimal from "@/components/animal/AddAnimal";
import AnimalProfile from "@/components/animal/AnimalProfile";

// Mock data for the animal profile
const mockAnimalData = {
  id: "1",
  name: "Max",
  type: "dog",
  breed: "Golden Retriever",
  age: "3",
  gender: "male",
  weight: "32",
  description:
    "Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He's great with children and other dogs, and enjoys swimming whenever he gets the chance.",
  vaccinated: true,
  neutered: true,
  microchipped: false,
  friendly: {
    children: true,
    dogs: true,
    cats: false,
    other: true,
  },
  image: "/placeholder.svg?height=400&width=400&text=Max",
  owner: {
    id: "user1",
    name: "Jane Doe",
    image: "/placeholder.svg?height=100&width=100&text=JD",
  },
  createdAt: "2023-01-15",
};

export default function Animal({ params }) {
  const router = useRouter();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch animal data
  useEffect(() => {
    // In a real app, you would fetch the animal data from your API
    // For this example, we'll use the mock data
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnimal(mockAnimalData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animal data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send the formData to your backend here
      console.log("Form submitted:", formData);

      // Update the animal data with the form data
      setAnimal({
        ...animal,
        ...formData,
      });

      setIsSubmitting(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send a delete request to your backend here
      console.log("Animal deleted:", animal.id);

      // Navigate back to the user profile or home page
      router.push("/");
    } catch (error) {
      console.error("Error deleting animal:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDF6F9]">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E29578] border-t-transparent"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
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
            <AddAnimal
              initialData={animal}
              onSubmit={handleSubmit}
              onCancel={() => setEditMode(false)}
              isSubmitting={isSubmitting}
              submitButtonText="Save Changes"
              cancelButtonText="Cancel"
            />
          ) : (
            <AnimalProfile
              animal={animal}
              onEdit={() => setEditMode(true)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
