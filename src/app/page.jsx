import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/home/hero/HeroSection";
import CoatsSection from "@/components/home/Coats/CoatsSection";

import ServicesSection from "@/components/home/servicess/ServicesSection";
import LostFoundSection from "@/components/home/lost-found/LostFoundSection";
import EventsSection from "@/components/home/Eventy/EventSection";
import PartnersSection from "@/components/home/partners/PartnersSection";
import Footer from "@/components/footer/Footer";
// import PawBackground from "@/components/background/PawBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#EDF6F9] ">
      {/* <PawBackground /> */}
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <CoatsSection />
        <ServicesSection />
        <LostFoundSection />
        <EventsSection />
        <PartnersSection />
      </main>
      <Footer />
      <Suspense fallback={null}></Suspense>
    </div>
  );
}
