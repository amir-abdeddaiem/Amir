"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Searchbar from "@/components/Searchbar/Searchbar";
import LeftPopup from "../Searchbar/LeftPopup";
import RightPopup from "../Searchbar/RightPopup";
import { BtnNot } from "../Notification/BtnNot";
import Signup from "../auth/Signup";
import Signin from "../auth/Signin";
import { ThemeToggle } from "@/components/ThemeToggler/Theme";

export default function Navbar() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const goRegister = () => {
    router.push("/register"); // Naviguer vers la page /about
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

        {/* Searchbar */}
        <div>
          {/* <Searchbar className="relative w-full max-w-xl transition-all ease-in-out" /> */}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <BtnNot />
          <ThemeToggle className="mr-2" />
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-[#E29578]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button> */}
          {/* <Button
            variant="outline"
            className="hidden border-[#83C5BE] text-[#83C5BE] hover:bg-[#83C5BE] hover:text-white sm:inline-flex"
          >
            Sign In
          </Button> */}
          <Signin />

          <Button
            onClick={goRegister}
            className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90"
          >
            Register
          </Button>
        </div>
      </div>

      {/* Popups */}
      {isDialogOpen && (
        <>
          <LeftPopup onClose={() => setIsDialogOpen(false)} />
          <RightPopup onClose={() => setIsDialogOpen(false)} />
        </>
      )}
    </header>
  );
}
