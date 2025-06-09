import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function MarketLayout({ children }) {
  return (
    <>
      <div className="flex h-screen bg-[#EDF6F9]">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Footer />
    </>
  );
}
