"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export default function AddAnimalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [animalType, setAnimalType] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Animal added:", { animalType, name, breed, age, description });
    setIsOpen(false);
    // Reset form fields
    setAnimalType("");
    setName("");
    setBreed("");
    setAge("");
    setDescription("");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#E29578] text-white hover:bg-[#E29578]/90 px-8 py-6 text-lg"
      >
        <PlusCircle size={18} />
        Add Animal
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Add a New Animal
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="animalType" className="text-right">
                  Type
                </Label>
                <Select
                  value={animalType}
                  onValueChange={setAnimalType}
                  required
                >
                  <SelectTrigger id="animalType" className="col-span-3">
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="Pig">Pig</SelectItem>
                    <SelectItem value="Rabbit">Rabbit</SelectItem>
                    <SelectItem value="Tortoise">Tortoise</SelectItem>
                    <SelectItem value="Horse">Horse</SelectItem>
                    <SelectItem value="Goat">Goat</SelectItem>
                    <SelectItem value="Cow">Cow</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="breed" className="text-right">
                  Breed
                </Label>
                <Input
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#E29578] hover:bg-[#d88a6d]">
                Add Animal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
