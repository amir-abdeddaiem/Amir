import Footer from "@/components/footer/Footer";
import { AnimalList } from "@/components/Lostfoundanimal/animal-list";
import { FilterSidebar } from "@/components/Lostfoundanimal/filter-sidebar";
import { MapSection } from "@/components/Lostfoundanimal/map-section";
import Navbar from "@/components/Navbar/Navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AIPetMatcher } from "@/components/Lostfoundanimal/ai-pet-matcher";
export default function FoundLostPets() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#EDF6F9]">
        {/* <SidebarProvider> */}
        {/* <FilterSidebar /> */}
        {/* <SidebarInset> */}
        <main className="flex flex-col gap-6 p-4 md:p-6 pt-20">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#E29578] md:text-3xl">
              Lost & Found Pets
            </h1>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-500 md:inline">
                Help reunite pets with their owners
              </span>
            </div>
          </div>

          <MapSection />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <AIPetMatcher />
            <div className="lg:col-span-2">
              <AnimalList />
            </div>
          </div>
        </main>
        {/* </SidebarInset>
        </SidebarProvider> */}
        <Footer />
      </div>
    </>
  );
}
