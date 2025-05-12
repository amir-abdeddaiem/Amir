"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";

const partners = [
  {
    id: 1,
    name: "Pet Clinic",
    logo: "/placeholder.svg?height=100&width=200&text=Pet+Clinic",
  },
  {
    id: 2,
    name: "Animal Shelter",
    logo: "/placeholder.svg?height=100&width=200&text=Animal+Shelter",
  },
  {
    id: 3,
    name: "Pet Food Co.",
    logo: "/placeholder.svg?height=100&width=200&text=Pet+Food+Co.",
  },
  {
    id: 4,
    name: "Vet Services",
    logo: "/placeholder.svg?height=100&width=200&text=Vet+Services",
  },
  {
    id: 5,
    name: "Pet Toys Inc.",
    logo: "/placeholder.svg?height=100&width=200&text=Pet+Toys+Inc.",
  },
  {
    id: 6,
    name: "Animal Rescue",
    logo: "/placeholder.svg?height=100&width=200&text=Animal+Rescue",
  },
];

export default function PartnersSection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="py-16 bg-[#FFDDD2]/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Partners
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            We work with the best clinics, shelters, and pet service providers
          </p>
        </motion.div>

        <div
          ref={ref}
          className="flex flex-wrap justify-center items-center gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.1,
                  },
                },
              }}
              initial="hidden"
              animate={controls}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-16 w-40">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
