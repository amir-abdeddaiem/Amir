import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const teamMembers = [
  {
    name: "Jane Doe",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=200&width=200&text=Jane",
  },
  {
    name: "John Smith",
    role: "CTO",
    image: "/placeholder.svg?height=200&width=200&text=John",
  },
  {
    name: "Alice Johnson",
    role: "Head of Veterinary Services",
    image: "/placeholder.svg?height=200&width=200&text=Alice",
  },
  {
    name: "Bob Williams",
    role: "Community Manager",
    image: "/placeholder.svg?height=200&width=200&text=Bob",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          About Animal's Club
        </h1>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At Animal's Club, our mission is to create a comprehensive digital
            ecosystem for pet owners, connecting them with specialized centers,
            veterinarians, and fellow animal lovers. We strive to improve the
            lives of pets and their owners through community, education, and
            accessible services.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.name}>
                <CardHeader>
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle>{member.name}</CardTitle>
                  <p>{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-lg mb-4">
            Founded in 2023, Animal's Club grew from a simple idea: to create a
            one-stop digital platform for all pet-related needs. What started as
            a small community of passionate pet owners has grown into a
            comprehensive ecosystem, serving thousands of animals and their
            human companions.
          </p>
          <p className="text-lg">
            Today, we continue to innovate and expand our services, always with
            the well-being of animals at the heart of everything we do. Join us
            in our mission to make the world a better place for pets and the
            people who love them.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
