"use client";
import React, { useState } from "react";
import { SidebarMenu } from "@/components/Produit/SidebarMenu";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function MarketLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-[#EDF6F9]">
        <SidebarMenu open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Footer />
    </>
  );
}
