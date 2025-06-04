"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export function ProductFilters({
  selectedCategories = [],
  setSelectedCategories,
  selectedPetTypes = [],
  setSelectedPetTypes,
  priceRange = [0, 99999999999],
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

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoriesChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

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
          className="h-8 text-xs hover:text-[#83C5BE]"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
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
                    <div
                      key={`pet-type-${petType}`}
                      className="flex items-center"
                    >
                      <Checkbox
                        id={`pet-${petType}`}
                        checked={selectedPetTypes.includes(petType)}
                        onCheckedChange={() => handlePetTypeChange(petType)}
                        className="border-[#83C5BE] data-[state=checked]:bg-[#83C5BE]"
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
                    <div
                      key={`category-${category}`}
                      className="flex items-center"
                    >
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoriesChange(category)}
                        className="border-[#83C5BE] data-[state=checked]:bg-[#83C5BE]"
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
                    defaultValue={[0, 99999999999]}
                    max={99999999999}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-6  [&_[role=slider]]:bg-[#83C5BE] [&_[role=slider]]:border-[#83C5BE] [&_[role=range]]:bg-[#83C5BE]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#83C5BE]">
                      ${priceRange[0]}
                    </span>
                    <span className="text-sm text-[#83C5BE]">
                      ${priceRange[1]}
                    </span>
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
            className="border-[#83C5BE] data-[state=checked]:bg-[#83C5BE]"
          />
          <Label htmlFor="in-stock" className="ml-2 text-sm">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  );
}
