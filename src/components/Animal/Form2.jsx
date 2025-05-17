"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function Form2({
  formData,
  handleChange,
  handleFriendlyChange,
}) {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label>Gender</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => handleChange("gender", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          value={formData.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
          placeholder="Enter weight"
          min="0"
          step="0.1"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label>Health Status</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vaccinated"
              checked={formData.vaccinated}
              onCheckedChange={(checked) => handleChange("vaccinated", checked)}
            />
            <Label htmlFor="vaccinated">Vaccinated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="neutered"
              checked={formData.neutered}
              onCheckedChange={(checked) => handleChange("neutered", checked)}
            />
            <Label htmlFor="neutered">Neutered</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="microchipped"
              checked={formData.microchipped}
              onCheckedChange={(checked) =>
                handleChange("microchipped", checked)
              }
            />
            <Label htmlFor="microchipped">Microchipped</Label>
          </div>
        </div>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label>Friendly With</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="children"
              checked={formData.friendly.children}
              onCheckedChange={(checked) =>
                handleFriendlyChange("children", checked)
              }
            />
            <Label htmlFor="children">Children</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dogs"
              checked={formData.friendly.dogs}
              onCheckedChange={(checked) =>
                handleFriendlyChange("dogs", checked)
              }
            />
            <Label htmlFor="dogs">Dogs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cats"
              checked={formData.friendly.cats}
              onCheckedChange={(checked) =>
                handleFriendlyChange("cats", checked)
              }
            />
            <Label htmlFor="cats">Cats</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other"
              checked={formData.friendly.other}
              onCheckedChange={(checked) =>
                handleFriendlyChange("other", checked)
              }
            />
            <Label htmlFor="other">Animals</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
