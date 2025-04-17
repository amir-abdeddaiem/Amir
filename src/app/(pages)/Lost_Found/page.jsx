import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import LostFoundSection from "@/components/lost-found/LostFoundSection";
import { Button } from "@/components/ui/button";

export default function LostFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Lost & Found Animals
        </h1>
        <div className="mb-8 flex justify-center space-x-4">
          <Button variant="outline">Report Lost Pet</Button>
          <Button variant="outline">Report Found Pet</Button>
        </div>
        <LostFoundSection />
      </main>
      <Footer />
    </div>
  );
}
