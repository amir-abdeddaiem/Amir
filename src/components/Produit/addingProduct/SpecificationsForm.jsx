"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check } from "lucide-react";

export function SpecificationsForm({
  formData,
  handleSpecChange,
  addSpecification,
  removeSpecification,
  setActiveTab,
  isSubmitting,
  handleSubmit,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Specifications</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpecification}
        >
          Add Specification
        </Button>
      </div>

      {formData.specifications.map((spec, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="grid grid-cols-2 gap-2 flex-grow">
            <Input
              placeholder="Specification name"
              value={spec.key}
              onChange={(e) => handleSpecChange(index, "key", e.target.value)}
            />
            <Input
              placeholder="Value"
              value={spec.value}
              onChange={(e) => handleSpecChange(index, "value", e.target.value)}
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
      ))}

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
              <Check className="mr-2 h-4 w-4" /> Add Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
