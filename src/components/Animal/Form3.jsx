"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";

// Dynamic import to fix HMR issues
const Upload = dynamic(() => import("lucide-react").then((mod) => mod.Upload), {
  ssr: false,
});

export default function Form3({
  formData,
  handleImageChange,
  previewImage,
  handleChange,
}) {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <div className="flex items-center gap-4">
          <label htmlFor="picture" className="cursor-pointer">
            <Button variant="outline" type="button">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
          {previewImage && (
            <div className="h-16 w-16 rounded-md overflow-hidden border">
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

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
