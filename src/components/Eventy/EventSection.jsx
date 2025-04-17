"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

const events = [
  {
    id: 1,
    title: "Free Vaccination Day",
    description:
      "Get your pets vaccinated for free at our annual vaccination event.",
    date: "2023-07-15",
    location: "Central Pet Clinic",
    image: "/placeholder.svg?height=400&width=600&text=Vaccination+Event",
  },
  {
    id: 2,
    title: "Pet Adoption Fair",
    description:
      "Find your new best friend at our adoption fair featuring pets from local shelters.",
    date: "2023-07-22",
    location: "City Park",
    image: "/placeholder.svg?height=400&width=600&text=Adoption+Fair",
  },
  {
    id: 3,
    title: "Pet Training Workshop",
    description:
      "Learn essential training techniques from professional trainers.",
    date: "2023-07-29",
    location: "Community Center",
    image: "/placeholder.svg?height=400&width=600&text=Training+Workshop",
  },
];

export default function EventsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Public Events
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Join our community events and activities for pets and their owners
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {event.title}
                </h3>
                <p className="mb-4 text-gray-600">{event.description}</p>
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4 text-[#E29578]" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2 h-4 w-4 text-[#E29578]" />
                    {event.location}
                  </div>
                </div>
                <Button className="w-full bg-[#E29578] text-white hover:bg-[#E29578]/90">
                  Register Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button
            variant="outline"
            className="border-[#83C5BE] text-[#83C5BE] hover:bg-[#83C5BE] hover:text-white"
          >
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
