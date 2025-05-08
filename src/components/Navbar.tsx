"use client";

import { Search, Bell, Sun, Moon, User, ChevronDown, Menu, PawPrint } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggler/Theme";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className={`
      sticky top-0 z-50
      ${"dark:bg-gray-900 bg-white"} 
      ${"dark:text-white text-gray-800"} 
      border-b ${"dark:border-gray-700 border-gray-200"}
      shadow-sm
      backdrop-blur-sm bg-opacity-90
      transition-colors duration-300
    `}>
      <div className="flex items-center justify-between p-4">
        {/* **Left Side (Logo & Mobile Menu)** */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button (Hidden on Desktop) */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold hidden sm:inline">Animals club</span>
          </Link>
        </div>

        {/* **Center (Search Bar)** */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search pets, appointments..."
              className={`
                w-full py-2 pl-10 pr-4 rounded-lg 
                ${"dark:bg-gray-800  bg-gray-100"} 
                focus:outline-none focus:ring-2 ${"dark:focus:ring-blue-500 focus:ring-blue-300"}
                transition-all duration-200
              `}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        {/* **Right Side (Icons & Profile)** */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <button
            className={`
              p-2 rounded-lg relative 
              ${"dark:hover:bg-gray-800 hover:bg-gray-100"} 
              transition-colors
            `}
          >
            <Bell className="h-5 w-5" />
            <span className={`
              absolute top-1 right-1 
              h-2 w-2 rounded-full 
              ${"dark:bg-red-500 bg-red-400"}
            `}></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`
                flex items-center gap-2 p-2 rounded-lg 
                ${"dark:hover:bg-gray-800 hover:bg-gray-100"} 
                transition-colors
              `}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className={`
                absolute right-0 mt-2 w-48 
                ${"dark:bg-gray-800 bg-white"} 
                rounded-lg shadow-lg 
                border ${"dark:border-gray-700 border-gray-200"}
                py-1 z-50
              `}>
                <Link
                  href="/profile"
                  className={`
                    block px-4 py-2 text-sm 
                    ${"dark:hover:bg-gray-700 hover:bg-gray-100"} 
                    transition-colors
                  `}
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className={`
                    block px-4 py-2 text-sm 
                    ${"dark:hover:bg-gray-700 hover:bg-gray-100"} 
                    transition-colors
                  `}
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/logout"
                  className={`
                    block px-4 py-2 text-sm 
                    ${"dark:hover:bg-gray-700 hover:bg-gray-100"} 
                    transition-colors
                  `}
                  onClick={() => setIsProfileOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
