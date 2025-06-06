"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Camera, X, Badge } from "lucide-react";
import Image from "next/image";

export function ImageUploadForm({
  previewImages,
  handleImageUpload,
  removeImage,
  setActiveTab,
}) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop images here, or click to select files
          </p>
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center px-4 py-2 bg-[#83C5BE] text-white rounded-md cursor-pointer hover:bg-[#83C5BE]/90 transition-colors"
          >
            <Camera className="mr-2 h-4 w-4" />
            Select Images
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {previewImages.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                  <Image
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
                {index === 0 && (
                  <Badge className="absolute bottom-1 left-1 bg-[#83C5BE] text-white">
                    Main
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setActiveTab("details")}>
          Back
        </Button>
        <Button
          className={"bg-[#E29578] hover:bg-[#E29578]/90"}
          onClick={() => setActiveTab("specifications")}
        >
          Next: Specifications
        </Button>
      </div>
    </div>
  );
}
