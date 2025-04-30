"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Form1({ formData, handleChange }) {
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
        <Select
          value={formData.type}
          onValueChange={(value) => handleChange("type", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select animal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="bird">Bird</SelectItem>
            <SelectItem value="rabbit">Rabbit</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
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
          min="0"
        />
      </div>
    </div>
  );
}
