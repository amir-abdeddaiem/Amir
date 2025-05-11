"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const categories = [
  "Food",
  "Toys",
  "Accessories",
  "Housing",
  "Furniture",
  "Essentials",
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

export function ProductFilters({
  selectedCategories = [],
  setSelectedCategories,
  selectedPetTypes = [],
  setSelectedPetTypes,
  priceRange = [0, 100],
  setPriceRange,
  showInStock = false,
  setShowInStock,
  onClearFilters,
}) {
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    petTypes: true,
    price: true,
  });

  // Toggle filter sections
  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle pet type selection
  const handlePetTypeChange = (petType) => {
    setSelectedPetTypes((prev) =>
      prev.includes(petType)
        ? prev.filter((p) => p !== petType)
        : [...prev, petType]
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#E29578]">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleFilterSection("categories")}
          >
            <h3 className="font-medium">Categories</h3>
            {expandedFilters.categories ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <AnimatePresence>
            {expandedFilters.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Pet Types */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleFilterSection("petTypes")}
          >
            <h3 className="font-medium">Pet Type</h3>
            {expandedFilters.petTypes ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <AnimatePresence>
            {expandedFilters.petTypes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {petTypes.map((petType) => (
                    <div key={petType} className="flex items-center">
                      <Checkbox
                        id={`pet-${petType}`}
                        checked={selectedPetTypes.includes(petType)}
                        onCheckedChange={() => handlePetTypeChange(petType)}
                      />
                      <Label
                        htmlFor={`pet-${petType}`}
                        className="ml-2 text-sm"
                      >
                        {petType}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleFilterSection("price")}
          >
            <h3 className="font-medium">Price Range</h3>
            {expandedFilters.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <AnimatePresence>
            {expandedFilters.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 px-2">
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Availability */}
        <div className="flex items-center">
          <Checkbox
            id="in-stock"
            checked={showInStock}
            onCheckedChange={setShowInStock}
          />
          <Label htmlFor="in-stock" className="ml-2 text-sm">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  );
}
