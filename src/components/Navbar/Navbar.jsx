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
    const iconSize = 40; // 40px for 10x10 viewBox
    
    switch(id) {
      case 1: // Marketplace
        return (
          <img src={"/nav/x1.svg"} alt="Marketplace" width={iconSize} height={iconSize} />
        );
      case 2: // Matchy
        return (
          <img src={"/nav/x2.svg"} alt="Matchy" width={iconSize} height={iconSize} />
        );
      
      case 3: // Services
        return (
          <img src={"/nav/x3.svg"} alt="Services" width={iconSize} height={iconSize} />
        );
         
    
      case 4: // Lost Found
        return (
          <img src={"/nav/x4.svg"} alt="Lost Found" width={iconSize} height={iconSize} />
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
            stroke={'E29578'}
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