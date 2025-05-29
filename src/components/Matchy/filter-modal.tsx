"use client"

import { SetStateAction, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const BREEDS = [
  "Golden Retriever",
  "Labrador",
  "German Shepherd",
  "Beagle",
  "Poodle",
  "Bulldog",
  "Siamese Cat",
  "Maine Coon",
  "Persian Cat",
  "Bengal Cat",
  "Ragdoll",
  "Scottish Fold",
]

const TEMPERAMENTS = [
  "Friendly",
  "Energetic",
  "Calm",
  "Playful",
  "Shy",
  "Independent",
  "Loyal",
  "Curious",
  "Affectionate",
  "Protective",
  "Vocal",
  "Gentle",
]

export default function FilterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedBreed, setSelectedBreed] = useState<string>("")
  const [ageRange, setAgeRange] = useState<number[]>([0, 15])
  const [distance, setDistance] = useState<number[]>([25])
  const [location, setLocation] = useState<string>("")
  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>([])
  const [nearbyOnly, setNearbyOnly] = useState<boolean>(true)

  const handleTemperamentSelect = (temperament: string) => {
    if (selectedTemperaments.includes(temperament)) {
      setSelectedTemperaments(selectedTemperaments.filter((t) => t !== temperament))
    } else {
      setSelectedTemperaments([...selectedTemperaments, temperament])
    }
  }

  const handleReset = () => {
    setSelectedBreed("")
    setAgeRange([0, 15])
    setDistance([25])
    setLocation("")
    setSelectedTemperaments([])
    setNearbyOnly(true)

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#EDF6F9] rounded-2xl p-6 shadow-xl">
        <DialogHeader className="text-center mb-5">
          <DialogTitle className="text-2xl font-extrabold text-[#C9745F]">
            🐾 Filter Pets 🐾
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Breed */}
          <div className="grid gap-2">
            <Label htmlFor="breed" className="text-[#609581] font-semibold">
              Breed 🐶
            </Label>
            <Select
              value={selectedBreed}
              onValueChange={setSelectedBreed}
              className="bg-white rounded-xl border-2 border-[#E0BEB5] shadow-sm"
            >
              <SelectTrigger id="breed" className="px-4 py-2">
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {BREEDS.map((breed) => (
                  <SelectItem
                    key={breed}
                    value={breed}
                    className="text-[#609581] hover:bg-[#E0BEB5]"
                  >
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label className="text-[#609581] font-semibold">
                Age Range 🍼
              </Label>
              <span className="text-sm text-[#C9745F]">
                {ageRange[0]} – {ageRange[1]} yrs
              </span>
            </div>
            <Slider
              defaultValue={ageRange}
              max={15}
              step={1}
              onValueChange={setAgeRange}
              className="py-2" value={undefined} />
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location" className="text-[#609581] font-semibold">
              Location 📍
            </Label>
            <Input
              id="location"
              placeholder="Enter your location"
              value={location}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setLocation(e.target.value)}
              className="bg-white rounded-xl border-2 border-[#E0BEB5] px-4 py-2 shadow-sm" type={undefined} />
          </div>

          {/* Distance */}
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label className="text-[#609581] font-semibold">
                Distance 🚗
              </Label>
              <span className="text-sm text-[#C9745F]">
                {distance[0]} miles
              </span>
            </div>
            <Slider
              defaultValue={distance}
              max={100}
              step={5}
              onValueChange={setDistance}
              className="py-2" value={undefined} />
          </div>

          {/* Temperament */}
          <div className="grid gap-2">
            <Label className="text-[#609581] font-semibold">
              Temperament ❤️‍🔥
            </Label>
            <div className="flex flex-wrap gap-2">
              {TEMPERAMENTS.map((temp) => (
                <Badge
                  key={temp}
                  variant={selectedTemperaments.includes(temp) ? "solid" : "outline"}
                  className={`cursor-pointer ${selectedTemperaments.includes(temp)
                    ? "bg-[#C9745F] text-white shadow-inner"
                    : "border-[#609581] text-[#609581]"
                    }`}
                  onClick={() => handleTemperamentSelect(temp)}
                >
                  {temp}
                  {selectedTemperaments.includes(temp) && (
                    <X className="ml-1 h-4 w-4" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Nearby Only */}
          <div className="flex items-center justify-between pt-2">
            <Label
              htmlFor="nearby-only"
              className="text-[#609581] font-semibold cursor-pointer"
            >
              Nearby only 📡
            </Label>
            <Switch
              id="nearby-only"
              checked={nearbyOnly}
              onCheckedChange={setNearbyOnly}
              className="bg-[#E0BEB5] data-[state=checked]:bg-[#609581] shadow-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-[#FFDDD2] text-[#C9745F] hover:bg-[#E0BEB5] rounded-lg px-6 py-2" size={undefined}          >
            🔄 Reset
          </Button>
          <Button
            onClick={onClose}
            className="bg-[#E29578] hover:bg-[#B86A57] text-white rounded-lg px-6 py-2 shadow-md" variant={undefined} size={undefined}          >
            ✅ Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}
