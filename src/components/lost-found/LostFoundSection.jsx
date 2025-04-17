"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const lostAnimals = [
  {
    id: 1,
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    location: "Central Park",
    date: "2023-06-15",
    image: "/placeholder.svg?height=300&width=300&text=Max",
  },
  {
    id: 2,
    name: "Luna",
    type: "Cat",
    breed: "Siamese",
    location: "Downtown",
    date: "2023-06-18",
    image: "/placeholder.svg?height=300&width=300&text=Luna",
  },
  {
    id: 3,
    name: "Rocky",
    type: "Dog",
    breed: "German Shepherd",
    location: "Riverside",
    date: "2023-06-20",
    image: "/placeholder.svg?height=300&width=300&text=Rocky",
  },
];

const foundAnimals = [
  {
    id: 1,
    type: "Cat",
    breed: "Tabby",
    location: "Main Street",
    date: "2023-06-16",
    image: "/placeholder.svg?height=300&width=300&text=Tabby+Cat",
  },
  {
    id: 2,
    type: "Dog",
    breed: "Poodle",
    location: "City Park",
    date: "2023-06-19",
    image: "/placeholder.svg?height=300&width=300&text=Poodle",
  },
  {
    id: 3,
    type: "Rabbit",
    breed: "Holland Lop",
    location: "Garden District",
    date: "2023-06-21",
    image: "/placeholder.svg?height=300&width=300&text=Rabbit",
  },
];

export default function LostFoundSection() {
  return (
    <section className="py-16 bg-[#EDF6F9]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Lost & Found Animals
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Help reunite pets with their owners or find the owner of a pet
            you've found
          </p>
        </motion.div>

        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="lost" className="text-lg py-3">
              Lost Animals
            </TabsTrigger>
            <TabsTrigger value="found" className="text-lg py-3">
              Found Animals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lost" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lostAnimals.map((animal) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl overflow-hidden shadow-md"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={animal.image || "/placeholder.svg"}
                      alt={animal.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Lost
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {animal.name}
                    </h3>
                    <p className="text-gray-600">
                      {animal.breed} ({animal.type})
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {animal.location}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(animal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button className="mt-4 w-full bg-[#E29578] text-white hover:bg-[#E29578]/90">
                      I've Seen This Pet
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="border-[#E29578] text-[#E29578] hover:bg-[#E29578] hover:text-white"
              >
                Report Lost Pet
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="found" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {foundAnimals.map((animal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl overflow-hidden shadow-md"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={animal.image || "/placeholder.svg"}
                      alt={`Found ${animal.type}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Found
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Found {animal.type}
                    </h3>
                    <p className="text-gray-600">{animal.breed}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {animal.location}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(animal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button className="mt-4 w-full bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90">
                      This Might Be My Pet
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="border-[#83C5BE] text-[#83C5BE] hover:bg-[#83C5BE] hover:text-white"
              >
                Report Found Pet
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
