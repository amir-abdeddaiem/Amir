"use client"

import { useState, useRef, useEffect } from "react"
import { X, Heart, Star, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMatchModal } from "@/app/hooks/use-match-modal"
import { motion, PanInfo, useAnimation } from "framer-motion"

type Pet = {
  id: string
  name: string
  age: number
  breed: string
  image: string
  bio: string
  temperament: string[]
}

const PETS: Pet[] = [
  {
    id: "1",
    name: "Max",
    age: 3,
    breed: "Golden Retriever",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=500&auto=format",
    bio: "Loves playing fetch and swimming in lakes",
    temperament: ["Friendly", "Energetic", "Loyal"],
  },
  {
    id: "2",
    name: "Luna",
    age: 2,
    breed: "Siamese Cat",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=500&auto=format",
    bio: "Enjoys sunbathing and chasing laser pointers",
    temperament: ["Independent", "Curious", "Vocal"],
  },
  {
    id: "3",
    name: "Buddy",
    age: 4,
    breed: "Beagle",
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=500&auto=format",
    bio: "Expert at finding hidden treats and stealing socks",
    temperament: ["Playful", "Curious", "Food-motivated"],
  },
  {
    id: "4",
    name: "Bella",
    age: 1,
    breed: "Maine Coon",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=500&auto=format",
    bio: "Queen of the house, loves to be brushed",
    temperament: ["Gentle", "Affectionate", "Fluffy"],
  },
]

export default function SwipeInterface() {
  // Force a complete reset of the component state
  const [allPets] = useState<Pet[]>([...PETS])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedPets, setSwipedPets] = useState<Pet[]>([])
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const controlsRef = useRef<Record<string, any>>({})
  const { openMatchModal } = useMatchModal()

  // Debug logging
  useEffect(() => {
    console.log("Current index:", currentIndex)
    console.log("Current pet:", allPets[currentIndex])
    console.log("All pets:", allPets)
  }, [currentIndex, allPets])

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const velocity = info.velocity.x
    const currentPet = allPets[currentIndex]

    if (info.offset.x > threshold || velocity > 800) {
      await controlsRef.current[currentPet.id]?.start({ x: "100%", opacity: 0, transition: { duration: 0.5 } })
      handleSwipe("right", currentPet)
    } else if (info.offset.x < -threshold || velocity < -800) {
      await controlsRef.current[currentPet.id]?.start({ x: "-100%", opacity: 0, transition: { duration: 0.5 } })
      handleSwipe("left", currentPet)
    } else if (info.offset.y < -threshold || velocity < -800) {
      await controlsRef.current[currentPet.id]?.start({ y: "-100%", opacity: 0, transition: { duration: 0.5 } })
      handleSwipe("up", currentPet)
    } else {
      controlsRef.current[currentPet.id]?.start({ x: 0, y: 0, opacity: 1, transition: { duration: 0.5 } })
    }
  }

  const handleSwipe = (direction: string, pet: Pet) => {
    setSwipeDirection(direction)
    setSwipedPets((prev) => [pet, ...prev])
    setCurrentIndex((prev) => prev + 1)

    if (direction === "right" && Math.random() > 0.5) {
      setTimeout(() => {
        openMatchModal(pet)
      }, 500)
    }
  }

  const swipe = (direction: string) => {
    if (currentIndex >= allPets.length) return
    const pet = allPets[currentIndex]
    handleSwipe(direction, pet)
  }

  const rewind = () => {
    if (swipedPets.length === 0) return
    
    const lastPet = swipedPets[0]
    setSwipedPets((prev) => prev.slice(1))
    setCurrentIndex((prev) => prev - 1)
  }

  // Get the current pet safely
  const currentPet = currentIndex < allPets.length ? allPets[currentIndex] : null

  return (
    <div className="flex flex-col items-center justify-between h-full max-w-md mx-auto">
      <div className="relative w-full h-[70vh] flex items-center justify-center">
        {currentPet && (
          <motion.div
            key={`pet-${currentPet.id}-${currentIndex}`}
            ref={(ref) => {
              if (ref) {
                controlsRef.current[currentPet.id] = ref
              }
            }}
            drag={true}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${currentPet.image})` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold">
                    {currentPet.name}, {currentPet.age}
                  </h2>
                  <p className="text-lg opacity-90">{currentPet.breed}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentPet.temperament.map((tag) => (
                  <Badge key={tag} className="bg-white/20 hover:bg-white/30 text-white" variant={undefined}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-lg opacity-90">{currentPet.bio}</p>
            </div>
          </motion.div>
        )}
        
        {(!currentPet) && (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <h3 className="text-2xl font-semibold mb-2">No more pets!</h3>
    <p className="text-gray-500 mb-4">You've gone through all available pets in your area.</p>
    <Button 
              onClick={() => {
                setCurrentIndex(0)
                setSwipedPets([])
              } }
              className="bg-[#FE3C72] hover:bg-[#FE3C72]/90 text-white shadow-md transition-all" variant={undefined} size={undefined}    >
      Refresh
    </Button>
  </div>
)}
      </div>

      <div className="flex items-center justify-center gap-8 py-6">
  <Button
    variant="outline"
    size="icon"
    className="h-16 w-16 rounded-full border-2 border-[#FFD166] hover:border-[#FFD166]/80 bg-white shadow-lg hover:scale-110 transition-all duration-200 animate-float"
    onClick={() => swipe("left")}
    disabled={!currentPet}
    style={{ animationDelay: '0.1s' }}
  >
    <X className="h-8 w-8 text-[#FFD166]" />
  </Button>
  
  <Button
    variant="outline"
    size="icon"
    className="h-14 w-14 rounded-full border-2 border-[#06D6A0] hover:border-[#06D6A0]/80 bg-white shadow-lg hover:scale-110 transition-all duration-200 animate-float"
    onClick={rewind}
    disabled={swipedPets.length === 0}
    style={{ animationDelay: '0.2s' }}
  >
    <RotateCcw className="h-6 w-6 text-[#06D6A0]" />
  </Button>
  
  <Button
    variant="outline"
    size="icon"
    className="h-16 w-16 rounded-full border-2 border-[#118AB2] hover:border-[#118AB2]/80 bg-white shadow-lg hover:scale-110 transition-all duration-200 animate-float"
    onClick={() => swipe("up")}
    disabled={!currentPet}
    style={{ animationDelay: '0.3s' }}
  >
    <Star className="h-8 w-8 text-[#118AB2]" />
  </Button>
  
  <Button
    variant="outline"
    size="icon"
    className="h-16 w-16 rounded-full border-2 border-[#EF476F] hover:border-[#EF476F]/80 bg-white shadow-lg hover:scale-110 transition-all duration-200 animate-float"
    onClick={() => swipe("right")}
    disabled={!currentPet}
    style={{ animationDelay: '0.4s' }}
  >
    <Heart className="h-8 w-8 text-[#EF476F]" />
  </Button>
</div>
    </div>
  )
}

