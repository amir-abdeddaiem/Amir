"use client"

import { useState } from "react"
import { ChevronLeft, MessageCircle, Heart, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Match = {
  id: string
  name: string
  image: string
  lastMessage?: string
  unread?: boolean
  animalType?: "dog" | "cat" | "rabbit" | "bird"
}

const MATCHES: Match[] = [
  {
    id: "1",
    name: "Buddy",
    image: "/dog-avatar.png",
    lastMessage: "Woof woof! 🐶",
    unread: true,
    animalType: "dog"
  },
  {
    id: "2",
    name: "Luna",
    image: "/cat-avatar.png",
    lastMessage: "Meow... 😻",
    animalType: "cat"
  },
  {
    id: "3",
    name: "Max",
    image: "/dog-avatar2.png",
    lastMessage: "Bark bark! 🦴",
    animalType: "dog"
  },
  {
    id: "4",
    name: "Daisy",
    image: "/rabbit-avatar.png",
    animalType: "rabbit"
  },
]

const LIKES: Match[] = [
  {
    id: "5",
    name: "Charlie",
    image: "/dog-avatar3.png",
    animalType: "dog"
  },
  {
    id: "6",
    name: "Bella",
    image: "/bird-avatar.png",
    animalType: "bird"
  },
]

export default function MessengerSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState("matches")

  const handleLogoClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={cn(
      "h-full border-r bg-[#EDF6F9] transition-all duration-300 ease-in-out shadow-lg",
      isOpen ? "w-80" : "w-20"
    )}>
      

      {isOpen ? (
        <div className="w-full">
          <div className="flex border-b border-[#83C5BE]">
            <button
              onClick={() => setActiveTab("matches")}
              className={cn(
                "flex-1 py-3 text-center font-medium transition-colors",
                activeTab === "matches" 
                  ? "text-[#E29578] border-b-2 border-[#E29578] bg-[#FFDDD2]"
                  : "text-[#83C5BE] hover:bg-[#FFDDD2]"
              )}
            >
              Matches
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={cn(
                "flex-1 py-3 text-center font-medium transition-colors",
                activeTab === "likes"
                  ? "text-[#E29578] border-b-2 border-[#E29578] bg-[#FFDDD2]"
                  : "text-[#83C5BE] hover:bg-[#FFDDD2]"
              )}
            >
              Likes You
            </button>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-120px)] bg-[#EDF6F9]">
            {activeTab === "matches" && (
              <div className="space-y-2 p-3">
                {MATCHES.map((match) => (
                  <MatchItem key={match.id} match={match} />
                ))}
              </div>
            )}
            {activeTab === "likes" && (
              <div className="space-y-2 p-3">
                {LIKES.map((match) => (
                  <MatchItem key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-4 bg-[#EDF6F9]">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full transition-all hover:bg-[#FFDDD2]",
              activeTab === "matches" && "bg-[#FFDDD2] text-[#E29578]"
            )}
            onClick={() => setActiveTab("matches")}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full transition-all hover:bg-[#FFDDD2]",
              activeTab === "likes" && "bg-[#FFDDD2] text-[#E29578]"
            )}
            onClick={() => setActiveTab("likes")}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

function MatchItem({ match }: { match: Match }) {
  const getAnimalEmoji = (type?: string) => {
    switch(type) {
      case "dog": return "🐕";
      case "cat": return "🐈";
      case "rabbit": return "🐇";
      case "bird": return "🐦";
      default: return "🐾";
    }
  }

  return (
    <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-[#FFDDD2] hover:shadow-md border border-transparent hover:border-[#83C5BE]">
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-[#E29578]">
          <img src={match.image} alt={match.name} className="object-cover" />
        </Avatar>
        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 text-xs">
          {getAnimalEmoji(match.animalType)}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium text-[#006D77]">{match.name}</p>
          {match.unread && (
            <span className="h-2.5 w-2.5 rounded-full bg-[#E29578] animate-pulse"></span>
          )}
        </div>
        {match.lastMessage && (
          <p className="truncate text-sm text-[#83C5BE]">
            {match.lastMessage}
          </p>
        )}
      </div>
    </button>
  )
}