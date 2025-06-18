"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BtnNot } from "../Notification/BtnNot";
import Signin from "../auth/Signin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, ChevronDown, Cat, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useUserData } from "@/contexts/UserData";
import Signout from "../Signout/Signout";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const { userData } = useUserData();

  // Navigation data including all possible links
  const navigationData = [
    { id: 1, path: "/marcket_place", name: "Market Place", alt: "Market Place" },
    { id: 2, path: "/matchy", name: "Matchy", alt: "Matchy" },
    { id: 3, path: "/service", name: "Services", alt: "Services" },
    { id: 4, path: "/FoundLostPets", name: "Lost Found", alt: "Lost Found" },
    { id: 5, path: "/animal/add-animal", name: "Add Animal", alt: "Add Animal" },
    { id: 6, path: "/user", name: "Profile", alt: "Profile" },
    { id: 7, path: "/service/provider", name: "Manage Service", alt: "Manage Service" },
  ];

  // Navigation icons for the main nav
  const navIcons = navigationData.slice(0, 4);

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    const results = navigationData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.alt.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const goRegister = () => {
    router.push("/register");
  };

  // SVG icons with proper sizing
  const renderIcon = (id) => {
    switch (id) {
      case 1: // Marketplace
        return (
          <img src={"/nav/x1.svg"} alt="Marketplace" className="w-8 h-8 md:w-10 md:h-10" />
        );
      case 2: // Matchy
        return (
          <img src={"/nav/x2.svg"} alt="Matchy" className="w-8 h-8 md:w-10 md:h-10" />
        );
      case 3: // Services
        return (
          <img src={"/nav/x3.svg"} alt="Services" className="w-8 h-8 md:w-10 md:h-10" />
        );
      case 4: // Lost Found
        return (
          <img src={"/nav/x4.svg"} alt="Lost Found" className="w-8 h-8 md:w-10 md:h-10" />
        );
      default:
        return null;
    }
  };

  return (
    <header key={userData?.email || ''} className="sticky top-0 z-50 w-full bg-[#EDF6F9] shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
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

        {/* Center Navigation Icons - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navIcons.map((icon) => (
            <Link
              href={icon.path}
              key={icon.id}
              onClick={() => setActiveIcon(icon.id)}
              className="p-1"
            >
              <div className="relative group flex flex-col items-center">
                <div className={`transition-all duration-200 ${activeIcon === icon.id
                  ? "opacity-100 scale-110"
                  : "opacity-70 group-hover:opacity-100 group-hover:scale-110"
                  }`}>
                  {renderIcon(icon.id)}
                </div>
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full transition-all duration-200 ${activeIcon === icon.id
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
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#E29578"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                className="rounded-full border border-[#83C5BE] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#83C5BE] bg-white w-32 lg:w-40"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full text-[#E29578] hover:bg-transparent"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg z-50 border border-[#83C5BE]/20">
                <div className="py-1">
                  {searchResults.map((result) => (
                    <Link
                      href={result.path}
                      key={result.id}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#83C5BE]/10"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                    >
                      {result.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!userData ? (
            <div className="flex items-center space-x-2">
              {/* <BtnNot /> */}
              <Signin />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={goRegister}
                  className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90 transition-all duration-200 shadow-md hover:shadow-lg text-sm px-3 py-1"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    className="flex items-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={userData.avatar} className="h-9 w-9 rounded-full bg-gradient-to-br from-[#E29578] to-[#FFDDD2] flex items-center justify-center text-white font-bold text-lg shadow-md" />
                    <div className="ml-2 hidden lg:flex flex-col items-start">
                      <span className="text-[#E29578] font-semibold text-sm">
                        {userData?.name || "Profile"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {userData?.email || ""}
                      </span>
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-[#E29578]" />
                  </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-md border border-[#E29578]/20">
                  <DropdownMenuItem className="focus:bg-[#FFDDD2]/50">
                    <Link href="/user" className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4 text-[#E29578]" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-[#FFDDD2]/50">
                    <Link href="/service/provider" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Manage service</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-[#FFDDD2]/50">
                    <Link href="/animal/add-animal" className="w-full flex items-center">
                      <Cat className="mr-2 h-4 w-4" />
                      <span>Add Animal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("userData");
                        window.location.href = "/signin";
                      }
                    }}
                    className="focus:bg-[#FFDDD2]/50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <Signout />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Right Side Actions */}
        <div className="md:hidden flex items-center space-x-2">
          {!userData ? (
            <>
              <Signin mobile />
              <BtnNot mobile />
            </>
          ) : (
            <>
              <BtnNot mobile />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1">
                    <img src={userData.avatar} className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E29578] to-[#FFDDD2] flex items-center justify-center text-white font-bold text-lg shadow-md" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white/90 backdrop-blur-md border border-[#E29578]/20 mr-2">
                  <DropdownMenuItem className="focus:bg-[#FFDDD2]/50 text-sm">
                    <Link href="/user" className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4 text-[#E29578]" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("userData");
                        window.location.href = "/signin";
                      }
                    }}
                    className="focus:bg-[#FFDDD2]/50 text-sm"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <Signout />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EDF6F9] border-t border-[#83C5BE]/20">
          <div className="container mx-auto px-4 py-3">
            {/* Mobile Search */}
            <div className="relative mb-4" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full rounded-full border border-[#83C5BE] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#83C5BE] bg-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full text-[#E29578] hover:bg-transparent"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg z-50 border border-[#83C5BE]/20">
                  <div className="py-1">
                    {searchResults.map((result) => (
                      <Link
                        href={result.path}
                        key={result.id}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#83C5BE]/10"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchResults(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {result.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Icons */}
            <div className="grid grid-cols-4 gap-4">
              {navIcons.map((icon) => (
                <Link
                  href={icon.path}
                  key={icon.id}
                  onClick={() => {
                    setActiveIcon(icon.id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-[#83C5BE]/10"
                >
                  <div className={`transition-all ${activeIcon === icon.id ? "opacity-100" : "opacity-70"}`}>
                    {renderIcon(icon.id)}
                  </div>
                  <span
                    className={`text-xs mt-2 ${activeIcon === icon.id ? "text-[#E29578] font-medium" : "text-[#83C5BE]"}`}
                  >
                    {icon.alt}
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            {!userData && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={goRegister}
                  className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90 w-full py-2"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}