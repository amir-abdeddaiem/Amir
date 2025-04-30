"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export default function Form4({ formData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Review Your Information</h3>

      <Card>
        <CardContent className="p-4 grid gap-4">
          {formData.image && (
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Pet"
                className="h-32 w-32 rounded-full object-cover border-4 border-[#E29578]"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{formData.name || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <p className="font-medium">{formData.type || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Breed</Label>
              <p className="font-medium">{formData.breed || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Age</Label>
              <p className="font-medium">
                {formData.age ? `${formData.age} years` : "-"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Gender</Label>
              <p className="font-medium">{formData.gender || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Weight</Label>
              <p className="font-medium">
                {formData.weight ? `${formData.weight} kg` : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Health Status</Label>
            <div className="flex flex-wrap gap-2">
              {formData.vaccinated && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  <Check className="h-3 w-3" /> Vaccinated
                </span>
              )}
              {formData.neutered && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  <Check className="h-3 w-3" /> Neutered
                </span>
              )}
              {formData.microchipped && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  <Check className="h-3 w-3" /> Microchipped
                </span>
              )}
            </div>
          </div>

          {formData.description && (
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="whitespace-pre-line">{formData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
