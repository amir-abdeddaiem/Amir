"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Search, MessageCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    title: "Marketplace",
    description:
      "Buy and sell pet-related items from trusted sellers in our community.",
    icon: ShoppingBag,
    color: "#E29578",
    delay: 0,
  },
  {
    id: 2,
    title: "Lost/Found Animals",
    description:
      "Report lost pets or help reunite found animals with their owners.",
    icon: Search,
    color: "#83C5BE",
    delay: 0.2,
  },
  {
    id: 3,
    title: "Community Discussion",
    description:
      "Connect with other pet owners, share experiences, and get advice.",
    icon: MessageCircle,
    color: "#FFDDD2",
    delay: 0.4,
  },
  {
    id: 4,
    title: "Chatbot",
    description:
      "Get instant answers to common pet care questions from our AI assistant.",
    icon: Bot,
    color: "#EDF6F9",
    delay: 0.6,
  },
];

export default function ServicesSection() {
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
            Our Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Everything you need to care for your pets in one place
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: service.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <service.icon
                  className="h-6 w-6"
                  style={{ color: service.color }}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {service.title}
              </h3>
              <p className="mb-4 text-gray-600">{service.description}</p>
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:border-[#83C5BE] hover:bg-[#83C5BE] hover:text-white"
              >
                Learn More
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
