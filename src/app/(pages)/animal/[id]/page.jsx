"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AnimalProfile from "@/components/Animal/AnimalProfile";
import { Loader } from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import EditProfile from "@/components/Animal/EditProfile"; // Make sure to import your EditProfile component

export default function AnimalProfilePage({ params }) {
  // Unwrap the params promise
  const { id } = use(params);
  const [animal, setAnimal] = useState();
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Added state for dialog
  const router = useRouter();

  // Fetch animal data
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await axios.get(`/api/animal/${id}`);
        setAnimal(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load animal",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Edit handler
  const handleEdit = async (thisanimal) => {
    setIsDialogOpen(true);
  };

  // Save handler
  const handleSavePet = async (updatedAnimal) => {
    try {
      const response = await axios.put(`/api/animal/${id}`, updatedAnimal);
      setAnimal(response.data);
      toast({ title: "Animal updated successfully" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update animal",
        variant: "destructive",
      });
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/animal/${id}`);
      toast({ title: "Animal deleted successfully" });
      router.push("/user");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete animal",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="text-center text-red-500 mt-10">Animal not found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <AnimalProfile
        animal={animal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditProfile
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePet}
        animal={animal}
      />
    </div>
  );
}
