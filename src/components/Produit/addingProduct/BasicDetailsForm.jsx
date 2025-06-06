"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DollarSign } from "lucide-react";

const categories = [
  "Food",
  "Toys",
  "Accessories",
  "Housing",
  "Furniture",
  "Essentials",
  "Pets",
];
const petTypes = [
  "Dog",
  "Cat",
  "Bird",
  "Fish",
  "Small Pet",
  "Reptile",
  "Other",
];

export function BasicDetailsForm({ formData, handleChange, setActiveTab }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name*</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">
            Price ($){formData.listingType === "adoption" ? "" : "*"}
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              className="pl-10"
              required={formData.listingType !== "adoption"}
              disabled={formData.listingType === "adoption"}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity*</Label>
          <Input
            id="quantity"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            placeholder="1"
            type="number"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe your product"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category*</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="petType">Pet Type*</Label>
          <Select
            value={formData.petType}
            onValueChange={(value) => handleChange("petType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pet type" />
            </SelectTrigger>
            <SelectContent>
              {petTypes.map((petType) => (
                <SelectItem key={petType} value={petType}>
                  {petType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleChange("featured", checked)}
        />
        <Label htmlFor="featured">Mark as featured product</Label>
      </div>

      <div>
        <Label htmlFor="localisation">Localisation</Label>
        <Input
          id="localisation"
          value={formData.localisation || ""}
          onChange={(e) => handleChange("localisation", e.target.value)}
          placeholder="Enter product location"
        />
      </div>

      <Separator className="my-4" />

      <div className="flex justify-end mt-6">
        <Button
          className="bg-[#E29578] hover:bg-[#E29578]/90"
          onClick={() => setActiveTab("images")}
        >
          Next: Add Images
        </Button>
      </div>
    </div>
  );
}
