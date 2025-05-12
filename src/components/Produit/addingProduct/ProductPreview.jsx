"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Camera, ShoppingCart } from "lucide-react";
import Image from "next/image";

export function ProductPreview({ previewImages, formData }) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-64 w-full bg-gray-100">
        {previewImages.length > 0 ? (
          <Image
            src={previewImages[0] || "/placeholder.svg"}
            alt={formData.name || "Product preview"}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Camera className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">No image uploaded</p>
          </div>
        )}
        {formData.featured && (
          <Badge className="absolute top-2 left-2 bg-[#E29578] text-white">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">
            {formData.name || "Product Name"}
          </h3>
          <span className="font-bold text-[#E29578]">
            ${Number(formData.price || 0).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {formData.description || "Product description will appear here"}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {formData.category && (
            <Badge variant="outline" className="text-xs">
              {formData.category}
            </Badge>
          )}
          {formData.petType && (
            <Badge variant="outline" className="text-xs">
              {formData.petType}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
