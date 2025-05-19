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
  const [availableForDating, setAvailableForDating] = useState<boolean>(true)
  const [availableForBreeding, setAvailableForBreeding] = useState<boolean>(false)

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
    setAvailableForDating(true)
    setAvailableForBreeding(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Filter Pets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="breed" className={undefined}>Breed</Label>
            <Select value={selectedBreed} onValueChange={setSelectedBreed}>
              <SelectTrigger id="breed" className={undefined}>
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="any" className={undefined}>Any breed</SelectItem>
                {BREEDS.map((breed) => (
                  <SelectItem key={breed} value={breed} className={undefined}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label className={undefined}>Age Range</Label>
              <span className="text-sm text-gray-500">
                {ageRange[0]} - {ageRange[1]} years
              </span>
            </div>
            <Slider defaultValue={ageRange} max={15} step={1} onValueChange={setAgeRange} className="py-4" value={undefined} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location" className={undefined}>Location</Label>
            <Input
              id="location"
              placeholder="Enter your location"
              value={location}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setLocation(e.target.value)} className={undefined} type={undefined}            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label className={undefined}>Distance</Label>
              <span className="text-sm text-gray-500">{distance[0]} miles</span>
            </div>
            <Slider defaultValue={distance} max={100} step={5} onValueChange={setDistance} className="py-4" value={undefined} />
          </div>

          <div className="grid gap-2">
            <Label className={undefined}>Temperament</Label>
            <div className="flex flex-wrap gap-2">
              {TEMPERAMENTS.map((temperament) => (
                <Badge
                  key={temperament}
                  variant={selectedTemperaments.includes(temperament) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTemperamentSelect(temperament)}
                >
                  {temperament}
                  {selectedTemperaments.includes(temperament) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="nearby-only" className="cursor-pointer">
                Nearby only
              </Label>
              <Switch id="nearby-only" checked={nearbyOnly} onCheckedChange={setNearbyOnly} className={undefined} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dating" className="cursor-pointer">
                Available for dating
              </Label>
              <Switch id="dating" checked={availableForDating} onCheckedChange={setAvailableForDating} className={undefined} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="breeding" className="cursor-pointer">
                Available for breeding
              </Label>
              <Switch id="breeding" checked={availableForBreeding} onCheckedChange={setAvailableForBreeding} className={undefined} />
            </div>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={handleReset} className={undefined} size={undefined}>
            Reset
          </Button>
          <Button onClick={onClose} className={undefined} variant={undefined} size={undefined}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
