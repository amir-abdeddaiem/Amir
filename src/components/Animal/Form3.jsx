"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import Uploadpic from "./Uploadpic";
// Dynamic import to fix HMR issues

export default function Form3({
  formData,
  handleImageUpload,
  previewImage,
  handleChange,
}) {
  return (
    <div className="space-y-4">
      <input type="file" name="" id="" onChange={handleImageUpload} />
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
