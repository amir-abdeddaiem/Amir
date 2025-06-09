// src/app/(pages)/Dashboard/layout.jsx
"use client";
import { useState } from "react";
import AppSidebar from "@/components/admin/Sidebaradmin"; // Adjust path
import Footer from "@/components/footer/Footer";

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div className="flex h-screen bg-[#EDF6F9]">
        <AppSidebar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Footer />
    </>
  );
}
