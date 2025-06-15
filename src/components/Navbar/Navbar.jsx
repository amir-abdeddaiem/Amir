"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BtnNot } from "../Notification/BtnNot";
import Signin from "../auth/Signin";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState(1);

  const goRegister = () => {
    router.push("/register");
  };

  // Navigation icons data
  const navIcons = [
    { id: 1, path: "/marcket_place", alt: "Marcket Place" },
    { id: 2, path: "/matchy", alt: "Matchy" },
    { id: 3, path: "/service", alt: "Services" },
    { id: 4, path: "/FoundLostPets", alt: "Lost Found" },
  ];

  // SVG icons with #E29578 color
  const renderIcon = (id) => {
    const iconColor = "#E29578";
    const iconSize = 40; // 40px for 10x10 viewBox
    
    switch(id) {
      case 1: // Marketplace
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <path d="M3 10H21L19 21H5L3 10Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10V6C16 4.89543 15.1046 4 14 4H10C8.89543 4 8 4.89543 8 6V10" stroke={iconColor} strokeWidth="2"/>
          </svg>
        );
      case 2: // Matchy
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <path d="M17 21L12 16L7 21M7 3L12 8L17 3" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12L16 7L21 2M3 12L8 7L3 2" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 3: // Services
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 4: // Lost Found
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12L15 15M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EDF6F9] shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#E29578]">
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
              AC
            </span>
          </div>
          <span className="hidden font-bold text-[#E29578] sm:inline-block">
            Animal's Club
          </span>
        </Link>

        {/* Center Navigation Icons */}
        <div className="hidden md:flex items-center gap-6">
          {navIcons.map((icon) => (
            <Link 
              href={icon.path} 
              key={icon.id}
              onClick={() => setActiveIcon(icon.id)}
              className="p-1" // Added padding for better click area
            >
              <div className="relative group flex flex-col items-center">
                <div className={`transition-all duration-200 ${
                  activeIcon === icon.id 
                    ? "opacity-100 scale-110"   
                    : "opacity-70 group-hover:opacity-100 group-hover:scale-110"
                }`}>
                  {renderIcon(icon.id)}
                </div>
                <span 
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full transition-all duration-200 ${
                    activeIcon === icon.id 
                      ? "w-4 bg-[#E29578]" 
                      : "bg-[#83C5BE] group-hover:w-4"
                  }`}
                ></span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-[#E29578] hover:bg-[#E29578]/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke={iconColor}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <BtnNot />
          <Signin />
          <Button
            onClick={goRegister}
            className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90"
          >
            Register
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EDF6F9] border-t border-[#83C5BE]/20">
          <div className="container mx-auto px-4 py-3 flex justify-center gap-8">
            {navIcons.map((icon) => (
              <Link 
                href={icon.path} 
                key={icon.id}
                onClick={() => {
                  setActiveIcon(icon.id);
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center"
              >
                <div className={`transition-all ${
                  activeIcon === icon.id ? "opacity-100" : "opacity-70"
                }`}>
                  {renderIcon(icon.id)}
                </div>
                <span 
                  className={`text-xs mt-1 ${
                    activeIcon === icon.id ? "text-[#E29578]" : "text-[#83C5BE]"
                  }`}
                >
                  {icon.alt}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}