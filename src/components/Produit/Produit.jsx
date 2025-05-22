"use client";
import { useState } from "react";
import { Lens } from "../ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Test from "../Test/Test";

export function Produit({ product }) {
  const [hovering, setHovering] = useState(false);

  console.log(product);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden max-w-xs mx-auto bg-[#83C5BE] p-4 my-5">
      <div className="relative z-10">
        {/* Replace this part with your new animated card */}

        <div className="relative group">
          {/* Example: Animated Card (customize this) */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105">
            <Link href={`/marcket_place/${product?._id}`}>
              <Lens hovering={hovering} setHovering={setHovering}>
                {product?.images ? (
                  <Image
                    src={product?.images[1]}
                    alt={product?.name || "Product image"}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto"
                    onError={(e) => {
                      e.target.src = "/images/noImg.png";
                    }}
                  />
                ) : (
                  <Image
                    src="/images/noImg.png"
                    alt={product?.name || "Product image"}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto"
                  />
                )}
              </Lens>
              {/* Optional: Add overlay/animations */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Keep the original product details section */}
        <motion.div
          animate={{ filter: hovering ? "blur(2px)" : "blur(0px)" }}
          className="py-4 relative z-20"
        >
          <h2 className="text-[#EDF6F9] text-2xl text-left font-bold">
            {product?.name}
          </h2>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-[#EDF6F9] font-bold">${product?.price}</span>
            <span
              className={cn(
                "px-2 py-1 rounded-md",
                product?.quantity > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </motion.div>
        <div className="flex flex- gap-4">
          <Test product={product} />
          <button className="bg-[#fffff] text-white flex rounded-lg border border-[#83C5BE] ">
            Favoriser
          </button>
        </div>
      </div>
    </div>
  );
}
