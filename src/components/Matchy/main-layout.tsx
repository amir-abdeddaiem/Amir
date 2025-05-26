"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "../Navbar/Navbar"
import Footer from "../footer/Footer"
import MessengerSidebar from "./messenger-sidebar"
import { useFilterModal } from "@/app/hooks/use-filter-modal"
import { Button } from "../ui/button"
import { Filter, Heart, PawPrint } from "lucide-react"

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
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Emoji Background Layer */}
          <div className="absolute inset-0 opacity-10">
            {/* Top */}
            <div className="absolute top-4 left-10 text-4xl animate-bounce">🐾</div>
            <div className="absolute top-12 right-16 text-5xl animate-pulse delay-200">🦴</div>

            {/* Upper Middle */}
            <div className="absolute top-1/4 left-1/3 text-6xl animate-bounce delay-300">🐱</div>
            <div className="absolute top-1/3 right-1/5 text-4xl animate-spin-slow">🐶</div>

            {/* Center Sides */}
            <div className="absolute top-1/2 left-1/4 text-5xl animate-pulse delay-300">🐰</div>
            <div className="absolute top-1/2 right-1/9 text-5xl animate-bounce delay-700">🐹</div>

            {/* Bottom Middle */}
            <div className="absolute bottom-1/3 left-1/3 text-4xl animate-bounce">🦜</div>
            <div className="absolute bottom-1/4 right-1/4 text-5xl animate-pulse delay-500">🐾</div>
            <div className="absolute bottom-20 left-1/2 text-4xl animate-spin-slow delay-300">🪺</div>

            {/* Bottom Corners */}
            <div className="absolute bottom-5 left-5 text-5xl animate-bounce delay-700">🐾</div>
            <div className="absolute bottom-8 right-8 text-5xl animate-pulse delay-1000">🐸</div>
          </div>

          {/* Floating Hearts Layer */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-6xl animate-pulse-slow">❤️</div>
            <div className="absolute bottom-20 right-1/2 transform translate-x-1/2 text-5xl animate-bounce delay-500">💖</div>
            <div className="absolute top-1/4 left-1/4 text-4xl animate-float delay-200">💘</div>
            <div className="absolute bottom-1/4 right-1/5 text-5xl animate-float-slow delay-700">💕</div>
            <div className="absolute top-1/3 right-10 text-4xl animate-bounce delay-300">💓</div>
            <div className="absolute bottom-12 left-1/6 text-4xl animate-pulse delay-500">💗</div>
            <div className="absolute top-16 right-1/3 text-5xl animate-float-slow delay-1000">💞</div>
          </div>
        </div>

        <MessengerSidebar
          isOpen={true}
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
        <Button
          variant="default"
          size="default"
          onClick={openFilterModal}
          className="
    fixed right-6 top-1/2 -translate-y-1/2 rounded-full w-16 h-16 p-0
    bg-gradient-to-r from-[#83C5BE] via-[#EDF6F9] to-[#83C5BE]
    bg-[length:200%_200%] animate-gradientShift
    text-white
    shadow-lg shadow-[#83C5BE]/50
    hover:shadow-2xl hover:shadow-[#83C5BE]/80
    transition-all duration-300
    hover:scale-110
    z-40
    flex items-center justify-center
  "
        >
          <div className="relative">
            <PawPrint className="w-7 h-7 animate-pulse drop-shadow-lg" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
        </Button>
      </div>
      <Footer />
    </div>
  )
}