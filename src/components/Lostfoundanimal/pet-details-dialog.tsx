"use client"

import { AlertTriangle, Heart, MapPin, Calendar, Phone, Mail, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PetDetailsDialogProps {
  pet: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetDetailsDialog({ pet, open, onOpenChange }: PetDetailsDialogProps) {
  if (!pet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto p-0 sm:rounded-xl">
        <div className="relative aspect-video w-full overflow-hidden">
          <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div>
              <Badge
                className={pet.status === "lost"
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  : "bg-[#83C5BE]/20 text-[#83C5BE] hover:bg-[#83C5BE]/30"} variant={undefined}              >
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 bg-white/80 backdrop-blur-sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-2xl font-bold text-[#E29578]">{pet.name}</DialogTitle>
          <DialogDescription className={undefined}>
            {pet.breed} • {pet.age} • {pet.gender}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#E29578] data-[state=active]:text-white">
              Details
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#E29578] data-[state=active]:text-white">
              Contact
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-[#E29578]">Description</h4>
              <p className="text-sm text-gray-500">{pet.description}</p>
            </div>

            <Separator className="bg-[#EDF6F9]" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 font-medium text-[#E29578]">Location</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-[#E29578]" />
                  {pet.area}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-[#E29578]">Date</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-[#E29578]" />
                  {pet.date}
                </div>
              </div>
            </div>

            <Separator className="bg-[#EDF6F9]" />

            <div>
              <h4 className="mb-2 font-medium text-[#E29578]">Distinctive Features</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                {pet.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-4 space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-[#E29578]">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-[#E29578]" />
                  {pet.contact.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-[#E29578]" />
                  {pet.contact.email}
                </div>
              </div>
            </div>

            <Separator className="bg-[#EDF6F9]" />

            <div className="rounded-lg bg-[#EDF6F9]/30 p-4">
              <h4 className="mb-2 font-medium text-[#E29578]">Contact Owner</h4>
              <p className="mb-4 text-sm text-gray-500">
                Have you seen this pet? Please contact the owner directly or use the button below.
              </p>
              <Button className="w-full bg-[#E29578] hover:bg-[#E29578]/90" variant={undefined} size={undefined}>I Have Information</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
