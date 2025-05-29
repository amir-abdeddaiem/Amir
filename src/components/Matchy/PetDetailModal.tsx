"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar } from "lucide-react"
import Image from "next/image"

interface Pet {
  id: string
  name: string
  age: number
  breed: string
  image: string
  bio: string
  temperament: string[]
  location?: string
}

interface PetDetailModalProps {
  pet: Pet
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

export function PetDetailModal({ pet, open, onOpenChange, onClose }: PetDetailModalProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-[#EDF6F9] rounded-2xl shadow-2xl p-0">
        <DialogHeader className="relative">

          <DialogTitle className="pt-8 pb-4 text-2xl font-extrabold text-[#E29578] text-center">
            {pet.name}’s Profile
          </DialogTitle>
        </DialogHeader>

        {/* Pet Image */}
        <div className="relative h-80 overflow-hidden">
          <Image
            src={pet.image || "/images/noImg.png"}
            alt={`${pet.name}'s photo`}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
            <h2 className="text-xl font-bold  drop-shadow">{pet.name}</h2>
          </div>
        </div>

        {/* Pet Info */}
        <div className="p-6 space-y-5">
          {/* Age & Location */}
          <div className="flex flex-wrap justify-between text-[#609581]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{pet.age} yrs</span>
            </div>
            {pet.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{pet.location}</span>
              </div>
            )}
          </div>

          {/* Breed */}
          <div>
            <h4 className="font-semibold text-[#83C5BE] mb-1">Breed</h4>
            <p className="text-[#333]">{pet.breed}</p>
          </div>

          {/* Temperament */}
          <div>
            <h4 className="font-semibold text-[#83C5BE] mb-2">Temperament</h4>
            <div className="flex flex-wrap gap-2">
              {pet.temperament.map((trait) => (
                <Badge
                  key={trait}
                  variant="solid"
                  className="bg-[#83C5BE] text-white text-sm shadow"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="font-semibold text-[#83C5BE] mb-1">About {pet.name}</h4>
            <p className="text-[#555] leading-relaxed">{pet.bio}</p>
          </div>

          {/* Contact Owner Button */}
          <div className="pt-6 border-t border-[#FFDDD2]">
            <Button
              className="w-full bg-[#E29578] hover:bg-[#C9745F] text-white rounded-lg py-3 shadow-lg"
              variant="secondary"
              size="lg"
            >
              ........
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}
