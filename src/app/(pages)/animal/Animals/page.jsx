"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnimalCards() {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
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
        setFilteredAnimals(animalsData);
      } catch (err) {
        console.error("Error fetching animals:", err);
        setError(err.message || "Failed to load animals");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Extract unique animal types for filter dropdown
  const animalTypes = [
    "all",
    ...new Set(animals.map((animal) => animal.type || "Unknown")),
  ];

  // Handle filtering based on search term and selected type
  useEffect(() => {
    let filtered = animals;

    if (searchTerm) {
      filtered = filtered.filter((animal) =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((animal) => animal.type === selectedType);
    }

    setFilteredAnimals(filtered);
  }, [searchTerm, selectedType, animals]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-100">
        <p className="text-stone-600 text-lg">Loading animals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-100">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!filteredAnimals || filteredAnimals.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-100">
        <p className="text-stone-600 text-lg">No animals found</p>
      </div>
    );
  }

  const cards = filteredAnimals.map((animal) => ({
    id: animal.id,
    title: animal.name || "Unnamed Animal",
    src: animal.image || "/default-animal.jpg",
    onClick: () => router.push(`/animal/${animal.id}`),
  }));

  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8 text-center">
          Discover Our Animals
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
              >
                {animalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <FocusCards cards={cards} />
      </div>
    </div>
  );
}
