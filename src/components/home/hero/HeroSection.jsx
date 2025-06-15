"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect,useState } from "react";
import axios from "axios";

// import AddAnimal from "../Animal/Addanimal";";

export default function HeroSection() {
  const [data, setData] = useState("/hams.jpg");
  
  const router = useRouter();
  const addanimal = () => {
    router.push("../../../../add-animal"); // Naviguer vers la page /about
  };

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src={data || "/images/default-pet.jpg"} // Fallback image if data is not available
              alt="Happy pet"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#E29578]">
              Meet Luna, our pet of the month!
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-[#E29578]">Animal's Club</span>
              <span className="block">Your Pet's Second Home</span>
            </h1>
            <p className="max-w-md text-lg text-gray-600">
              Connect with other pet owners, find services, and access
              everything your furry friend needs in one place.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                onClick={addanimal}
                className="bg-[#E29578] text-white hover:bg-[#E29578]/90 px-8 py-6 text-lg"
              >
                Add Animal
              </Button>
              {/* <AddAnimal /> */}
              <Button
                variant="outline"
                className="border-[#83C5BE] text-[#83C5BE] hover:bg-[#83C5BE] hover:text-white px-8 py-6 text-lg"
              >
                Explore Services
              </Button>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
