import { Produit } from "@/components/Produit/Produit";
import React from "react";

function page() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-amber-300"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-orange-300"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-yellow-300"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-amber-400"></div>
      </div>
    </>
  );
}

export default page;
