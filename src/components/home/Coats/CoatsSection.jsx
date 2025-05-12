"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const coats = [
  {
    id: 1,
    name: "Winter Coat",
    price: "$29.99",
    image: "/placeholder.svg?height=300&width=300&text=Winter+Coat",
  },
  {
    id: 2,
    name: "Raincoat",
    price: "$24.99",
    image: "/placeholder.svg?height=300&width=300&text=Raincoat",
  },
  {
    id: 3,
    name: "Summer Vest",
    price: "$19.99",
    image: "/placeholder.svg?height=300&width=300&text=Summer+Vest",
  },
  {
    id: 4,
    name: "Party Outfit",
    price: "$34.99",
    image: "/placeholder.svg?height=300&width=300&text=Party+Outfit",
  },
  {
    id: 5,
    name: "Sports Jersey",
    price: "$22.99",
    image: "/placeholder.svg?height=300&width=300&text=Sports+Jersey",
  },
  {
    id: 6,
    name: "Halloween Costume",
    price: "$27.99",
    image: "/placeholder.svg?height=300&width=300&text=Halloween+Costume",
  },
];

export default function CoatsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 768) {
        setVisibleItems(2);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % (coats.length - visibleItems + 1));
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) =>
        (prev - 1 + (coats.length - visibleItems + 1)) %
        (coats.length - visibleItems + 1)
    );
  };

  return (
    <section className="py-16 bg-[#FFDDD2]/20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            Coats for Animals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 max-w-2xl mx-auto text-lg text-gray-600"
          >
            Keep your pets stylish and comfortable with our selection of coats
            and accessories
          </motion.p>
        </div>

        <div className="relative">
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-4 px-4 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-md border-[#83C5BE] text-[#83C5BE] hover:bg-[#83C5BE] hover:text-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-md border-[#83C5BE] text-[#83C5BE] hover:bg-[#83C5BE] hover:text-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-hidden" ref={carouselRef}>
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * (100 / visibleItems)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {coats.map((coat) => (
                <motion.div
                  key={coat.id}
                  className={`w-full sm:w-1/${Math.min(
                    visibleItems,
                    2
                  )} md:w-1/${Math.min(
                    visibleItems,
                    3
                  )} lg:w-1/${visibleItems} p-4 flex-shrink-0`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="relative h-64 w-full">
                      <Image
                        src={coat.image || "/placeholder.svg"}
                        alt={coat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {coat.name}
                      </h3>
                      <p className="text-[#E29578] font-bold">{coat.price}</p>
                      <Button className="mt-4 w-full bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="outline"
            className="border-[#E29578] text-[#E29578] hover:bg-[#E29578] hover:text-white"
          >
            View All Coats
          </Button>
        </div>
      </div>
    </section>
  );
}
