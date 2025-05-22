"use client"

import { SetStateAction, useState } from "react"
import { Search, Filter, AlertTriangle, Heart, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PetDetailsDialog } from "@/components/Lostfoundanimal/pet-details-dialog"
import { mockPets } from "@/lib/mock-data"

export function AnimalList() {
  const [filters, setFilters] = useState({
    status: {
      lost: true,
      found: true,
    },
    petType: "all",
    searchTerm: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPet, setSelectedPet] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filtrer les animaux en fonction des critères
  const filteredPets = mockPets.filter((pet) => {
    // Filtre par terme de recherche
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre par statut
    const matchesStatus = filters.status[pet.status as keyof typeof filters.status]

    // Filtre par type d'animal
    const matchesType = filters.petType === "all" || pet.type === filters.petType

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Recent Reports</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search pets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)} type={undefined}            />
          </div>
          <Button variant="outline" size="icon" className={undefined}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <Card
              key={pet.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#E29578]/10"
              onClick={() => {
                setSelectedPet(pet)
                setIsDetailsOpen(true)
              }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={pet.image || "/placeholder.svg"}
                  alt={pet.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="p-3 pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <CardDescription>{pet.breed}</CardDescription>
                  </div>
                  <Badge
                    className={pet.status === "lost"
                      ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                      : "bg-[#83C5BE]/20 text-[#83C5BE] hover:bg-[#83C5BE]/30"} variant={undefined}                  >
                    {pet.status === "lost" ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Lost
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Found
                      </div>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <p className="line-clamp-2 text-sm text-gray-500">{pet.description}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4 border-t p-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {pet.area}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {pet.date}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <div className="mb-3 rounded-full bg-[#E29578]/10 p-3">
              <Search className="h-6 w-6 text-[#E29578]" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No pets found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pet details dialog */}
      <PetDetailsDialog pet={selectedPet} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </div>
  )
}
