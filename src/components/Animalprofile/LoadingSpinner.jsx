import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E29578] border-t-transparent"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
