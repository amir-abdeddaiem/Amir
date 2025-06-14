"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
const animals = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Rabbit", value: "rabbit" },
  { label: "Horse", value: "horse" },
  { label: "Hamster", value: "hamster" },
  { label: "Guinea Pig", value: "guinea_pig" },
  { label: "Ferret", value: "ferret" },
  { label: "Turtle", value: "turtle" },
  { label: "Snake", value: "snake" },
  { label: "Lizard", value: "lizard" },
  { label: "Frog", value: "frog" },
  { label: "Fish", value: "fish" },
  { label: "Parrot", value: "parrot" },
  { label: "Canary", value: "canary" },
  { label: "Pigeon", value: "pigeon" },
  { label: "Chicken", value: "chicken" },
  { label: "Duck", value: "duck" },
  { label: "Goat", value: "goat" },
  { label: "Sheep", value: "sheep" },
  { label: "Cow", value: "cow" },
  { label: "Pig", value: "pig" },
  { label: "Donkey", value: "donkey" },
  { label: "Camel", value: "camel" },
  { label: "Monkey", value: "monkey" },
  { label: "Chinchilla", value: "chinchilla" },
  { label: "Hedgehog", value: "hedgehog" },
  { label: "Other", value: "other" },
];
export default function Form1({ formData, handleChange }) {
  const [search, setSearch] = useState("");

  const filteredAnimals = animals.filter((animal) =>
    animal.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter pet's name"
          required
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="type">Type</Label>
        <Command>
          <CommandInput
            placeholder="Type to search animal..."
            value={search}
            onValueChange={setSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredAnimals.length > 0) {
                const firstAnimal = filteredAnimals[0];
                handleChange("type", firstAnimal.value); // ✅ use handleChange instead of onChange
                setSearch(firstAnimal.label); // show label
                e.preventDefault();
              }
            }}
          />
          {search.length > 0 && filteredAnimals.length > 0 && (
            <CommandList>
              {filteredAnimals.map((animal) => (
                <CommandItem
                  key={animal.value}
                  value={animal.value}
                  onSelect={() => {
                    handleChange("type", animal.value); // ✅ use handleChange here too
                    setSearch(animal.label);
                  }}
                >
                  {animal.label}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="breed">Breed</Label>
        <Input
          id="breed"
          value={formData.breed}
          onChange={(e) => handleChange("breed", e.target.value)}
          placeholder="Enter breed"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => handleChange("age", e.target.value)}
          placeholder="Enter age in years"
          min="1"
        />
      </div>
    </div>
  );
}
