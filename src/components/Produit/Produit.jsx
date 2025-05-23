"use client";
import { useState } from "react";
import { Lens } from "../ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Tooltip } from "../ui/tooltip";

import ProductModal from "@/components/Produit/ProductModal";

export function Produit({ product }) {
  const [hovering, setHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <motion.div
        className="w-full relative rounded-3xl overflow-hidden max-w-xs mx-auto bg-[#83C5BE] p-4 my-5 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={openModal}
      >
        <div className="relative z-10">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-[1.03]">
              <Lens hovering={hovering} setHovering={setHovering}>
                {product?.images?.[1] ? (
                  <Image
                    src={product.images[1]}
                    alt={product?.name || "Product image"}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto aspect-square"
                    onError={(e) => {
                      e.target.src = "/images/noImg.png";
                    }}
                    priority={false}
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src="/images/noImg.png"
                    alt={product?.name || "Product image"}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto aspect-square"
                  />
                )}
              </Lens>

              {/* Quick action buttons overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center gap-2">
                <motion.button
                  className="bg-white text-[#83C5BE] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(e);
                  }}
                >
                  <Heart
                    size={20}
                    fill={isFavorite ? "#FFDDD2" : "transparent"}
                  />
                </motion.button>

                <motion.button
                  className="bg-white text-[#83C5BE] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                >
                  <Eye size={20} />
                </motion.button>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ filter: hovering ? "blur(2px)" : "blur(0px)" }}
            className="py-4 relative z-20"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-[#EDF6F9] text-2xl text-left font-bold line-clamp-1">
                {product?.name}
              </h2>
              <Tooltip
                content={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <button
                  onClick={toggleFavorite}
                  className="text-[#EDF6F9] hover:text-[#FFDDD2] transition-colors"
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    size={24}
                    fill={isFavorite ? "#FFDDD2" : "transparent"}
                    strokeWidth={isFavorite ? 0 : 1.5}
                  />
                </button>
              </Tooltip>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[#EDF6F9] font-bold text-xl">
                  ${product?.price}
                </span>
                {product?.originalPrice && (
                  <span className="text-[#EDF6F9]/70 line-through text-sm">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "px-2 py-1 rounded-md text-sm font-medium",
                  product?.quantity > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {product?.quantity > 0
                  ? `${product.quantity} in stock`
                  : "Out of Stock"}
              </span>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              className="flex-1 bg-[#FFDDD2] text-[#006D77] hover:bg-[#E29578] hover:text-white flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={product?.quantity <= 0}
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>

            <motion.button
              className="bg-transparent text-[#EDF6F9] hover:bg-[#EDF6F9]/10 flex items-center justify-center rounded-lg border border-[#EDF6F9] px-4 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
            >
              Quick View
            </motion.button>
          </div>
        </div>

        {/* Sale badge */}
        {product?.onSale && (
          <div className="absolute top-5 right-5 bg-[#E29578] text-white px-3 py-1 rounded-full text-xs font-bold z-30 shadow-md">
            SALE
          </div>
        )}
      </motion.div>

      <ProductModal product={product} show={showModal} onClose={closeModal} />
      {/* Modal/Popup - Preserved from original */}
    </>
  );
}
