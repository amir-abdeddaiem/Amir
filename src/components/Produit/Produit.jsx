"use client";
import { useState, useEffect } from "react";
import { Lens } from "../ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Eye, Trash2, Pencil } from "lucide-react";
import { Tooltip } from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductModal from "@/components/Produit/ProductModal";
import { useUserData } from "@/contexts/UserData";

export function Produit({
  product,
  isFavorite: initialIsFavorite = false,
  onFavoriteChange,
}) {
  const { userData } = useUserData();
  const userId = userData?.id;
  const [hovering, setHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const isOwner = userId === product.user._id;

  // Fetch initial favorite status when component mounts (if not provided)
  useEffect(() => {
    if (initialIsFavorite) {
      setIsFavorite(true);
      return;
    }

    const fetchFavoriteStatus = async () => {
      if (!userId || !product?._id) return;
      try {
        const response = await fetch(`/api/favoriteproduct?userId=${userId}`);
        if (response.ok) {
          const favorites = await response.json();
          const isProductFavorite = favorites.some(
            (fav) => fav.product._id === product._id
          );
          setIsFavorite(isProductFavorite);
        } else {
          console.error("Failed to fetch favorites:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [userId, product?._id, initialIsFavorite]);

  const toggleFavorite = async (e) => {
    e?.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add favorites");
      router.push("/login");
      return;
    }

    try {
      if (isFavorite) {
        // Remove favorite
        const response = await fetch("/api/favoriteproduct", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId: product._id,
          }),
        });

        if (response.ok) {
          setIsFavorite(false);
          toast.success("Removed from favorites");
          if (onFavoriteChange) onFavoriteChange(product._id, false);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to remove favorite");
        }
      } else {
        // Add favorite
        const response = await fetch("/api/favoriteproduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId: product._id,
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
          toast.success("Added to favorites");
          if (onFavoriteChange) onFavoriteChange(product._id, true);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to add favorite");
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating favorite");
      console.error("Toggle favorite error:", error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmed) return;

      const response = await fetch(`/api/myproduct?id=${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/marcket_place/mymarket/edit?id=${product._id}`);
  };

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
                {product?.images?.[0] ? (
                  <Image
                    src={product.images[0]}
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

              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    <Tooltip content="Edit product">
                      <button
                        onClick={handleEdit}
                        className="text-[#EDF6F9] hover:text-yellow-300 transition-colors"
                        aria-label="Edit product"
                      >
                        <Pencil size={20} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete product">
                      <button
                        onClick={handleDelete}
                        className="text-[#EDF6F9] hover:text-red-500 transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip
                    content={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <button
                      onClick={toggleFavorite}
                      className="text-[#EDF6F9] hover:text-[#FFDDD2] transition-colors"
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={24}
                        fill={isFavorite ? "#FFDDD2" : "transparent"}
                        strokeWidth={isFavorite ? 0 : 1.5}
                      />
                    </button>
                  </Tooltip>
                )}
              </div>
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

        {product?.onSale && (
          <div className="absolute top-5 right-5 bg-[#E29578] text-white px-3 py-1 rounded-full text-xs font-bold z-30 shadow-md">
            SALE
          </div>
        )}
      </motion.div>

      <ProductModal
        product={product}
        show={showModal}
        onClose={closeModal}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
    </>
  );
}
