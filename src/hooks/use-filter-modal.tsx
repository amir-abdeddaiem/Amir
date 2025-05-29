"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import FilterModal from "../../components/Matchy/filter-modal"

type FilterModalContextType = {
  openFilterModal: () => void
  closeFilterModal: () => void
}

const FilterModalContext = createContext<FilterModalContextType | undefined>(undefined)

export function FilterModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  const openFilterModal = () => setIsOpen(true)
  const closeFilterModal = () => setIsOpen(false)

  return (
    <FilterModalContext.Provider value={{ openFilterModal, closeFilterModal }}>
      {children}
      <FilterModal isOpen={isOpen} onClose={closeFilterModal} />
    </FilterModalContext.Provider>
  )
}

export function useFilterModal() {
  const context = useContext(FilterModalContext)
  if (context === undefined) {
    throw new Error("useFilterModal must be used within a FilterModalProvider")
  }
  return context
}
