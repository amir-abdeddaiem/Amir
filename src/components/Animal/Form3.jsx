"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import Uploadpic from "./Uploadpic";
import { Camera, Upload, X } from "lucide-react";
// Dynamic import to fix HMR issues

export default function Form3({
  formData,
  handleImageUpload,
  previewImage,
  handleChange,
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

      <div>
        <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
            <img
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              src={previewImage || "/placeholder.svg"}
              alt={`Product image`}
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
        </div>
      </div>

      {/* <Uploadpic
        handleImageChange={handleImageUpload}
        previewImage={previewImage}
      /> */}

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Tell us about your pet..."
          rows={4}
        />
      </div>
    </div>
  );
}
