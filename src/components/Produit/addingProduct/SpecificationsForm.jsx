"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Check } from "lucide-react";

export function SpecificationsForm({
  formData,
  setFormData,
  handleSpecificationChange,
  addSpecification,
  removeSpecification,
  setActiveTab,
  isSubmitting,
  handleSubmit,
}) {
  useEffect(() => {
    console.log("SpecificationsForm category:", formData.category);
  }, [formData.category]);

  const isPetCategory = formData.category === "Pets";

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHealthStatusChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      HealthStatus: { ...prev.HealthStatus, [field]: value },
    }));
  };

  const handleFriendlyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      friendly: { ...prev.friendly, [field]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {isPetCategory ? "Animal Details" : "Product Specifications"}
        </h3>
        {!isPetCategory && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecification}
          >
            Add Specification
          </Button>
        )}
      </div>

      {isPetCategory ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Breed*</label>
            <Input
              placeholder="Enter breed"
              value={formData.breed || ""}
              onChange={(e) => handleChange("breed", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Age*</label>
            <Input
              placeholder="Enter age (e.g., 2 years)"
              value={formData.age || ""}
              onChange={(e) => handleChange("age", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender*</label>
            <Select
              value={formData.gender || ""}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Weight</label>
            <Input
              placeholder="Enter weight (e.g., 5 kg)"
              value={formData.weight || ""}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Color</label>
            <Input
              placeholder="Enter color"
              value={formData.Color || ""}
              onChange={(e) => handleChange("Color", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Health Status</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.HealthStatus?.vaccinated || false}
                  onCheckedChange={(checked) =>
                    handleHealthStatusChange("vaccinated", checked)
                  }
                />
                <label>Vaccinated</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.HealthStatus?.neutered || false}
                  onCheckedChange={(checked) =>
                    handleHealthStatusChange("neutered", checked)
                  }
                />
                <label>Neutered</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.HealthStatus?.microchipped || false}
                  onCheckedChange={(checked) =>
                    handleHealthStatusChange("microchipped", checked)
                  }
                />
                <label>Microchipped</label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Friendly With</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.friendly?.children || false}
                  onCheckedChange={(checked) =>
                    handleFriendlyChange("children", checked)
                  }
                />
                <label>Children</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.friendly?.dogs || false}
                  onCheckedChange={(checked) =>
                    handleFriendlyChange("dogs", checked)
                  }
                />
                <label>Dogs</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.friendly?.cats || false}
                  onCheckedChange={(checked) =>
                    handleFriendlyChange("cats", checked)
                  }
                />
                <label>Cats</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.friendly?.animals || false}
                  onCheckedChange={(checked) =>
                    handleFriendlyChange("animals", checked)
                  }
                />
                <label>Other Animals</label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Listing Type*</label>
            <Select
              value={formData.listingType || "sale"}
              onValueChange={(value) => handleChange("listingType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select listing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="adoption">For Adoption</SelectItem>
              </SelectContent>
            </Select>

            {formData.listingType === "sale" && (
              <div className="mt-4">
                <label className="block text-sm font-medium">Price*</label>
                <Input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="Enter price"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        formData.specifications.map((spec, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="grid grid-cols-2 gap-2 flex-grow">
              <Input
                placeholder="Specification name"
                value={spec.key}
                onChange={(e) =>
                  handleSpecificationChange(index, "key", e.target.value)
                }
              />
              <Input
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  handleSpecificationChange(index, "value", e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSpecification(index)}
              disabled={formData.specifications.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setActiveTab("images")}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-[#E29578] hover:bg-[#E29578]/90"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> Publier
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
