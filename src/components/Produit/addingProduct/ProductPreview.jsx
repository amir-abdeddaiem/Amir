"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";
import Image from "next/image";

export function ProductPreview({ previewImages, formData }) {
  const isPetCategory = formData.category === "Pets";
  const hasSpecs =
    !isPetCategory &&
    formData.specifications?.some((spec) => spec.key && spec.value);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full bg-gray-100">
        {previewImages.length > 0 ? (
          <Image
            src={previewImages[0]}
            alt={formData.name || "Product Preview"}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Camera className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">No image uploaded</p>
          </div>
        )}
        {formData.featured && (
          <Badge className="absolute top-2 left-2 bg-[#E29578] text-white">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">
            {formData.name || "Product Name"}
          </h3>
          <span className="font-bold text-[#E29578]">
            {formData.listingType === "adoption"
              ? "For Adoption"
              : `$${Number(formData.price || 0).toFixed(2)}`}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          {formData.description || "No description provided"}
        </p>

        <div className="flex flex-wrap gap-1">
          {formData.category && (
            <Badge variant="outline" className="text-xs">
              Category: {formData.category}
            </Badge>
          )}
          {formData.petType && (
            <Badge variant="outline" className="text-xs">
              Pet Type: {formData.petType}
            </Badge>
          )}
          {formData.quantity && (
            <Badge variant="outline" className="text-xs">
              Quantity: {formData.quantity}
            </Badge>
          )}
          {formData.localisation && (
            <Badge variant="outline" className="text-xs">
              Location: {formData.localisation}
            </Badge>
          )}
        </div>

        {isPetCategory && (
          <div className="pt-2 border-t mt-2 space-y-1">
            <h4 className="font-medium text-sm">Animal Details</h4>
            <p className="text-xs text-gray-600">
              Breed: {formData.breed || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Age: {formData.age || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Gender: {formData.gender || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Weight: {formData.weight || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Color: {formData.Color || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Vaccinated: {formData.HealthStatus?.vaccinated ? "Yes" : "No"}
            </p>
            <p className="text-xs text-gray-600">
              Neutered: {formData.HealthStatus?.neutered ? "Yes" : "No"}
            </p>
            <p className="text-xs text-gray-600">
              Microchipped: {formData.HealthStatus?.microchipped ? "Yes" : "No"}
            </p>
          </div>
        )}

        {hasSpecs && (
          <div className="pt-2 border-t mt-2 space-y-1">
            <h4 className="font-medium text-sm">Specifications</h4>
            {formData.specifications.map(
              (spec, idx) =>
                spec.key &&
                spec.value && (
                  <p key={idx} className="text-xs text-gray-600">
                    {spec.key}: {spec.value}
                  </p>
                )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
