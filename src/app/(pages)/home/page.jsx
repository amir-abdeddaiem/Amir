import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import CoatsSection from "@/components/Coats/CoatsSection";

// import ServicesSection from "@/components/servicess/ServicesSection";
import LostFoundSection from "@/components/lost-found/LostFoundSection";
import EventsSection from "@/components/Eventy/EventSection";
import PartnersSection from "@/components/partners/PartnersSection";
import Footer from "@/components/footer/Footer";
import PawBackground from "@/components/background/PawBackground";
// import DogHeadMenu from "@/components/DogHeadMenu/DogHeadMenu";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#EDF6F9] ">
      <PawBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <CoatsSection />
        {/* <ServicesSection /> */}
        <LostFoundSection />
        <EventsSection />
        <PartnersSection />
      </main>
      <Footer />
      <Suspense fallback={null}>{/* <DogHeadMenu /> */}</Suspense>
    </div>
  );
}
