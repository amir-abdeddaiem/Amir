"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function EditPetDialog({ isOpen, onClose, onSave, animal }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    color: "",
    weight: "",
    description: "",
    vaccinated: false,
    neutered: false,
    microchipped: false,
    healthStatus: "",
    lastVetVisit: "",
    favoriteActivities: "",
    specialNeeds: "",
    image: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (animal) {
      setFormData({
        ...animal,
        favoriteActivities: animal.favoriteActivities?.join(", ") || "",
        age: animal.age?.toString() || "",
        image: animal.image || "",
      });
      setPreviewImage(animal.image || "");
    }
  }, [animal, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const animalToSave = {
      ...formData,
      age: Number.parseInt(formData.age),
      favoriteActivities: formData.favoriteActivities
        .split(",")
        .map((activity) => activity.trim())
        .filter(Boolean),
      image: previewImage || "/placeholder.svg?height=200&width=200",
      id: animal.id,
    };
    onSave(animalToSave);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#EDF6F9" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#83C5BE]">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Pet preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#FFDDD2] flex items-center justify-center">
                  <span className="text-4xl">🐶</span>
                </div>
              )}
            </div>
            <Label htmlFor="image" className="cursor-pointer text-[#E29578]">
              Change Photo
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#E29578]">
                Pet Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-[#FFDDD2] border-[#83C5BE]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[#E29578]">
                🐕 Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-[#FFDDD2] border-[#83C5BE]">
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent className="bg-[#FFDDD2] border-[#83C5BE]">
                  <SelectItem value="Dog"> Dog</SelectItem>
                  <SelectItem value="Cat"> Cat</SelectItem>
                  <SelectItem value="Bird"> Bird</SelectItem>
                  <SelectItem value="Fish">Fish</SelectItem>
                  <SelectItem value="Rabbit">Rabbit</SelectItem>
                  <SelectItem value="Other"> Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed" className="text-[#E29578]">
                Breed
              </Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
                className="bg-[#FFDDD2] border-[#83C5BE]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-[#E29578]">
                Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="bg-[#FFDDD2] border-[#83C5BE]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-[#E29578]">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger className="bg-[#FFDDD2] border-[#83C5BE]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#FFDDD2] border-[#83C5BE]">
                  <SelectItem value="Male"> Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="color" className="text-[#E29578]">
                🎨 Color
              </Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="bg-[#FFDDD2] border-[#83C5BE]"
                required
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-[#E29578]">
                Weight
              </Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                placeholder="e.g., 5 kg"
                className="bg-[#FFDDD2] border-[#83C5BE]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#E29578]">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-[#FFDDD2] border-[#83C5BE]"
              rows={3}
              required
            />
          </div>
          <div>
            <Label htmlFor="healthStatus" className="text-[#E29578]">
              Health Status
            </Label>
          </div>
          <div className="grid grid-cols-3 gap-4 py-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vaccinated"
                checked={formData.vaccinated}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, vaccinated: checked })
                }
                className="border-[#E29578] data-[state=checked]:bg-[#E29578]"
              />
              <Label htmlFor="vaccinated" className="text-[#E29578]">
                Vaccinated
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="neutered"
                checked={formData.neutered}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, neutered: checked })
                }
                className="border-[#E29578] data-[state=checked]:bg-[#E29578]"
              />
              <Label htmlFor="neutered" className="text-[#E29578]">
                Neutered/Spayed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="microchipped"
                checked={formData.microchipped}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, microchipped: checked })
                }
                className="border-[#E29578] data-[state=checked]:bg-[#E29578]"
              />
              <Label htmlFor="microchipped" className="text-[#E29578]">
                Microchipped
              </Label>
            </div>
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthStatus" className="text-[#E29578]">
                 Health Status
              </Label>
              <Select
                value={formData.healthStatus}
                onValueChange={(value) =>
                  setFormData({ ...formData, healthStatus: value })
                }
              >
                <SelectTrigger className="bg-[#FFDDD2] border-[#83C5BE]">
                  <SelectValue placeholder="Select health status" />
                </SelectTrigger>
                <SelectContent className="bg-[#FFDDD2] border-[#83C5BE]">
                  <SelectItem value="Vaccinated">Vaccinated</SelectItem>
                  <SelectItem value="Neutered">Neutered</SelectItem>
                  <SelectItem value="Microchipped">Microchipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastVetVisit" className="text-[#E29578]">
                🏥 Last Vet Visit
              </Label>
              <Input
                id="lastVetVisit"
                type="date"
                value={formData.lastVetVisit}
                onChange={(e) =>
                  setFormData({ ...formData, lastVetVisit: e.target.value })
                }
                className="bg-[#FFDDD2] border-[#83C5BE]"
              />
            </div>
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="favoriteActivities" className="text-[#E29578]">
              🎾 Favorite Activities (comma-separated)
            </Label>
            <Input
              id="favoriteActivities"
              value={formData.favoriteActivities}
              onChange={(e) =>
                setFormData({ ...formData, favoriteActivities: e.target.value })
              }
              className="bg-[#FFDDD2] border-[#83C5BE]"
              placeholder="e.g., Playing fetch, Swimming, Napping"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialNeeds" className="text-[#E29578]">
              ♿ Special Needs
            </Label>
            <Textarea
              id="specialNeeds"
              value={formData.specialNeeds}
              onChange={(e) =>
                setFormData({ ...formData, specialNeeds: e.target.value })
              }
              className="bg-[#FFDDD2] border-[#83C5BE]"
              rows={2}
              placeholder="Any special care requirements..."
            />
          </div> */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#E29578] text-[#E29578] hover:bg-[#E29578]/10"
            >
              ❌ Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E29578] hover:bg-[#E29578]/90 text-white"
            >
              💾 Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
