import React from "react";
import { PawPrintIcon as Paw } from "lucide-react";
import Link from "next/link";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#EDF6F9] to-[#e6f1f5] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Paw print background pattern - subtle */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('/paw-pattern.svg')", // Assuming you have this SVG
          backgroundSize: "150px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="flex items-center text-[#003049] hover:text-[#E29578] transition-colors duration-300"
        >
          <Paw size={28} className="mr-2 text-[#E29578]" />
          <span className="font-semibold text-xl">Animal's Club</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Render the children (Signin or Signup component) */}
        {children}
      </div>

      <footer className="absolute bottom-4 text-center text-gray-500 text-sm z-10">
        © {new Date().getFullYear()} Animal's Club. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
