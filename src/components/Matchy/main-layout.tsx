"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "../Navbar/Navbar"
import Footer from "../footer/Footer"
import MessengerSidebar from "./messenger-sidebar"
import { useFilterModal } from "@/app/hooks/use-filter-modal"
import { Button } from "../ui/button"
import { SlidersHorizontal } from "lucide-react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const { openFilterModal } = useFilterModal()

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkIfDesktop()
    window.addEventListener("resize", checkIfDesktop)

    return () => {
      window.removeEventListener("resize", checkIfDesktop)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <div className="flex flex-1 overflow-hidden">
        <MessengerSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openFilterModal} 
          className="text-gray-600 hover:text-gray-900"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>
      <Footer />
    </div>
  )
}