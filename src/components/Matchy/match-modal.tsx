"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti";

type Pet = {
  id: string
  name: string
  age: number
  breed: string
  image: string
  bio: string
  temperament: string[]
}

export default function MatchModal({
  isOpen,
  onClose,
  pet,
}: {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
}) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && pet) {
      setShowConfetti(true)

      // Trigger confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#FE3C72", "#00D88B", "#00BFFF"],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#FE3C72", "#00D88B", "#00BFFF"],
        })
      }, 250)

      return () => {
        clearInterval(interval)
      }
    }
  }, [isOpen, pet])

  if (!pet) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-pink-50 to-blue-50">
        {/* Add DialogTitle with visually hidden text */}
        <DialogTitle className="sr-only">Match Notification</DialogTitle>
        <DialogDescription className="sr-only">
          You have matched with a pet that also liked your profile
        </DialogDescription>

        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold text-[#FE3C72] mb-2">It&apos;s a Paw-fect Match!</h2>
            <p className="text-gray-600">You and {pet.name} have liked each other</p>
          </motion.div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg"
            >
              <img src="/placeholder.svg?height=128&width=128" alt="Your pet" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-[#FE3C72]"
            >
              ❤️
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg"
            >
              <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button className="bg-[#00D88B] hover:bg-[#00D88B]/90 text-white" variant={undefined} size={undefined}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chatting
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
