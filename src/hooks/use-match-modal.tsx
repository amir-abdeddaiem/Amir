"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import  MatchModal from "../../components/Matchy/match-modal"

type Pet = {
  id: string
  name: string
  age: number
  breed: string
  image: string
  bio: string
  temperament: string[]
}

type MatchModalContextType = {
  openMatchModal: (pet: Pet) => void
  closeMatchModal: () => void
}

const MatchModalContext = createContext<MatchModalContextType | undefined>(undefined)

export function MatchModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null)

  const openMatchModal = (pet: Pet) => {
    setMatchedPet(pet)
    setIsOpen(true)
  }

  const closeMatchModal = () => setIsOpen(false)

  return (
    <MatchModalContext.Provider value={{ openMatchModal, closeMatchModal }}>
      {children}
      <MatchModal isOpen={isOpen} onClose={closeMatchModal} pet={matchedPet} />
    </MatchModalContext.Provider>
  )
}

export function useMatchModal() {
  const context = useContext(MatchModalContext)
  if (context === undefined) {
    throw new Error("useMatchModal must be used within a MatchModalProvider")
  }
  return context
}
