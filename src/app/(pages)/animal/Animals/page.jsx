"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnimalCards() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading animals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!animals || animals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No animals found</p>
      </div>
    );
  }

  const cards = animals.map((animal) => ({
    id: animal.id, // Use the `id` field from the API
    title: animal.name || "Unnamed Animal",
    src: animal.image || "/default-animal.jpg",

    // onClick: () => router.push(`/animal/${animal.id}`),
  }));

  return <FocusCards cards={cards} />;
}
