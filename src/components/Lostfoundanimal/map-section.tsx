"use client"

import { useState } from "react"
import { Search, AlertTriangle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PetDetailsDialog } from "@/components/Lostfoundanimal/pet-details-dialog"
import { mockPets } from "@/lib/mock-data"

export function MapSection() {
  const [selectedPet, setSelectedPet] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="flex items-center justify-between bg-[#E29578]/10 p-3">
            <h2 className="text-lg font-semibold">Pet Location Map</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-full max-w-[200px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input placeholder="Search location..." className="pl-8" type={undefined} />
              </div>
              <Button variant="outline" size="sm" className={undefined}>
                Report Found
              </Button>
            </div>
          </div>

          <div className="map-container bg-[#EDF6F9]/30 relative">
            {/* Map background with grid lines */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover opacity-20"></div>

            {/* Map overlay with streets */}
            <div className="absolute inset-0">
              <div className="absolute left-[10%] right-[10%] top-[30%] h-1 bg-gray-300"></div>
              <div className="absolute bottom-[20%] left-[20%] top-[20%] w-1 bg-gray-300"></div>
              <div className="absolute bottom-[40%] left-[50%] top-[10%] w-1 bg-gray-300"></div>
              <div className="absolute left-[30%] right-[20%] top-[60%] h-1 bg-gray-300"></div>
              <div className="absolute left-[70%] right-[10%] top-[50%] h-1 bg-gray-300"></div>
            </div>

            {/* Map labels */}
            <div className="absolute left-[15%] top-[25%] rounded bg-white/80 px-1 py-0.5 text-xs text-gray-600">
              Downtown
            </div>
            <div className="absolute left-[60%] top-[45%] rounded bg-white/80 px-1 py-0.5 text-xs text-gray-600">
              Riverside
            </div>
            <div className="absolute left-[35%] top-[65%] rounded bg-white/80 px-1 py-0.5 text-xs text-gray-600">
              Oakwood
            </div>

            {/* Map pins */}
            {mockPets.map((pet) => (
              <div
                key={pet.id}
                className={`map-pin ${pet.status === "lost" ? "map-pin-lost" : "map-pin-found"}`}
                style={{
                  left: `${pet.location.x}%`,
                  top: `${pet.location.y}%`,
                }}
                onClick={() => {
                  setSelectedPet(pet)
                  setIsDetailsOpen(true)
                }}
              >
                {pet.status === "lost" ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 p-1">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#83C5BE]/20 p-1">
                    <Heart className="h-5 w-5 text-[#83C5BE]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-[#E29578]/10 p-3">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Lost Pets</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-[#83C5BE]" />
              <span className="text-sm">Found Pets</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Pet details dialog */}
      <PetDetailsDialog pet={selectedPet} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </Card>
  )
}
