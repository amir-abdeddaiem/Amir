"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRefresh } from "@/contexts/RefreshContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  X,
  StarIcon,
  MapPin,
  PawPrint,
  ChevronDown,
} from "lucide-react";
import { ReviewPopup } from "@/components/Produit/review/ReviewPopup";
import { motion, AnimatePresence } from "framer-motion";
import { useUserData } from "@/contexts/UserData";
import { toast } from "sonner";
import { Console } from "console";

export default function ProductModal({
  product: initialProduct,
  show,
  onClose,
  isFavorite,
  toggleFavorite,
}) {
  const { userData } = useUserData();
  const [product, setProduct] = useState(initialProduct);
  const { refreshKey, triggerRefresh } = useRefresh();
  const [reviews, setReviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = userData?.id || null;

  const isOwner = user === product.user;
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setError(null);
    }
  }, [initialProduct]);

  useEffect(() => {
    async function fetchProductDetails() {
      if (!product?._id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/myproduct?id=${product._id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductDetails();
  }, [product?._id]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        console.log("Fetching reviews for product:", product._id);
        const response = await fetch(`/api/review?productId=${product._id}`, {
          credentials: "include",
        });
        console.log("Review fetch status:", response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error("Failed to fetch reviews:", response.status, text);
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched reviews:", data);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Review fetch error:", err);
        toast.error("Failed to load reviews");
        setReviews([]);
      }
    }
    if (product._id) {
      fetchReviews();
    }
  }, [refreshKey, product._id]);

  useEffect(() => {
    console.log("Product data:", product);
  }, [product]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  if (!show) return null;
  if (isLoading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006D77] border-t-transparent"></div>
          <p className="text-[#006D77] font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4">
          <div className="text-red-500 text-4xl">⚠️</div>
          <p className="text-gray-700 font-medium">Error: {error}</p>
          <Button
            onClick={() => setError(null)}
            className="bg-[#006D77] hover:bg-[#E29578] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  if (!product)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4">
          <div className="text-gray-400 text-4xl">📦</div>
          <p className="text-gray-700 font-medium">No product data available</p>
        </div>
      </div>
    );

  const averageRating =
    reviews.length > 0
      ? parseFloat(
          (
            reviews.reduce((sum, review) => sum + review.stars, 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={18}
            className="text-yellow-400 fill-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={18} className="text-gray-300" />
            <Star
              size={18}
              className="absolute top-0 left-0 text-yellow-400 fill-yellow-400"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={18} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        key={refreshKey}
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <div className="flex items-center justify-center p-0">
          <motion.div
            className="relative w-full max-w-6xl bg-[#f8fafc] rounded-none md:rounded-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
            style={{ maxHeight: "740px" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-lg hover:scale-110"
              onClick={onClose}
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="flex flex-col md:flex-row gap-0 flex-1 overflow-hidden">
              <div className="relative w-full md:w-1/2 bg-white p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg bg-gray-50">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={
                          product.images[currentImageIndex] ||
                          "/images/noImg.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    {product.images.length > 1 && (
                      <>
                        <motion.button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronLeft className="text-[#006D77]" size={24} />
                        </motion.button>
                        <motion.button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronRight className="text-[#006D77]" size={24} />
                        </motion.button>
                      </>
                    )}

                    <motion.button
                      onClick={toggleFavorite}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        size={24}
                        className={
                          isFavorite
                            ? "text-[#E29578] fill-[#E29578]"
                            : "text-gray-600"
                        }
                      />
                    </motion.button>
                  </div>

                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {product.images.map((img, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md border-2 object-cover transition-all ${
                            currentImageIndex === index
                              ? "border-[#E29578] scale-105"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}

                  <motion.div
                    className="flex items-center justify-between bg-gradient-to-r from-[#FFDDD2] to-[#f8c9b8] p-3 rounded-lg shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#006D77]">
                        {product.quantity > 0 ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                            In Stock ({product.quantity} available)
                          </>
                        ) : (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                            Out of Stock
                          </>
                        )}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-[#E29578]">
                      ${product.price?.toFixed(2)}
                    </span>
                  </motion.div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#83C5BE]/20 text-[#006D77]">
                      <PawPrint size={12} className="mr-1" />
                      {product.petType}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#83C5BE]/20 text-[#006D77]">
                      <MapPin size={12} className="mr-1" />
                      {product.localisation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-hidden">
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-2">
                    {renderStars(averageRating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({reviews.length} reviews) • {averageRating}/5
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="border border-gray-100 rounded-lg">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left bg-white rounded-t-lg"
                      onClick={() => toggleAccordion("details")}
                    >
                      <h2 className="text-lg font-semibold text-[#006D77]">
                        Product Details
                      </h2>
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform ${
                          activeAccordion === "details" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeAccordion === "details" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-b-lg"
                      >
                        {product.category === "pets" ? (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Breed:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.breed || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Age:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.age || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Gender:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.gender || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Weight:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.weight || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Color:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.Color || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Vaccinated:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.HealthStatus?.vaccinated
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Neutered:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.HealthStatus?.neutered ? "Yes" : "No"}
                              </span>
                            </div>
                            <div className="text-sm flex items-start">
                              <span className="font-medium text-gray-600 min-w-[120px]">
                                Microchipped:
                              </span>{" "}
                              <span className="text-gray-800">
                                {product.HealthStatus?.microchipped
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {product.specifications?.length > 0 ? (
                              product.specifications.map((spec, i) => (
                                <div
                                  key={i}
                                  className="text-sm flex items-start"
                                >
                                  <span className="font-medium text-gray-600 min-w-[120px]">
                                    {spec.key || "Unknown"}:
                                  </span>{" "}
                                  <span className="text-gray-800">
                                    {spec.value || "N/A"}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No specifications available
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="border border-gray-100 rounded-lg">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left bg-white rounded-t-lg"
                      onClick={() => toggleAccordion("seller")}
                    >
                      <h2 className="text-lg font-semibold text-[#006D77]">
                        Seller Information
                      </h2>
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform ${
                          activeAccordion === "seller" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeAccordion === "seller" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-b-lg"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#83C5BE] flex items-center justify-center text-white font-medium">
                            {product.user?.firstName?.[0] || "?"}
                            {product.user?.lastName?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-medium">
                              {product.user?.firstName || "Unknown"}{" "}
                              {product.user?.lastName || ""}
                            </p>
                            <p className="text-xs text-gray-500">
                              Verified Seller
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          {product.user?.phone ? (
                            <motion.a
                              href={`tel:${product.user.phone}`}
                              className="flex items-center gap-2 text-[#006D77] hover:text-[#E29578] p-2 rounded-lg hover:bg-[#FFDDD2]/30 transition-colors"
                              whileHover={{ x: 2 }}
                            >
                              <Phone size={16} />
                              {product.user.phone}
                            </motion.a>
                          ) : (
                            <p className="text-gray-500">
                              Phone number not available
                            </p>
                          )}
                          {product.user?.email ? (
                            <motion.a
                              href={`mailto:${product.user.email}`}
                              className="flex items-center gap-2 text-[#006D77] hover:text-[#E29578] p-2 rounded-lg hover:bg-[#FFDDD2]/30 transition-colors"
                              whileHover={{ x: 2 }}
                            >
                              <Mail size={16} />
                              {product.user.email}
                            </motion.a>
                          ) : (
                            <p className="text-gray-500">Email not available</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="border border-gray-100 rounded-lg">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left bg-white rounded-t-lg"
                      onClick={() => toggleAccordion("reviews")}
                    >
                      <h2 className="text-lg font-semibold text-[#006D77]">
                        Customer Reviews
                      </h2>
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform ${
                          activeAccordion === "reviews" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeAccordion === "reviews" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-b-lg"
                      >
                        <div className="space-y-4 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFDDD2] scrollbar-track-gray-100">
                          {reviews.length > 0 ? (
                            reviews.map((review) => (
                              <motion.div
                                key={review._id}
                                className="bg-[#EDF6F9] p-3 rounded-lg"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-[#006D77]">
                                    {review.user?.firstName}{" "}
                                    {review.user?.lastName}
                                  </span>
                                  <span className="flex items-center gap-1 text-[#E29578]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <StarIcon
                                        key={star}
                                        size={16}
                                        className={
                                          star <= review.stars
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        }
                                      />
                                    ))}
                                  </span>
                                </div>
                                {review.photo && (
                                  <div className="mb-2">
                                    <img
                                      src={review.photo}
                                      alt="Review photo"
                                      className="w-32 h-32 object-cover rounded-md"
                                      onError={(e) => {
                                        console.log(
                                          "Failed to load review image:",
                                          review.photo
                                        );
                                        e.target.src = "/images/noImg.png";
                                      }}
                                    />
                                  </div>
                                )}
                                <p className="text-sm text-gray-700">
                                  {review.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              No reviews yet. Be the first to review!
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center pt-4">
                          {isOwner ? (
                            <ReviewPopup productId={product._id} />
                          ) : (
                            <Button
                              variant="outline"
                              disabled
                              className="cursor-not-allowed opacity-70"
                            >
                              {"You can't review your own product"}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 bg-gradient-to-r from-[#EDF6F9] to-[#d8eef3] p-4 border-t border-[#83C5BE]/30">
              <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2 h-12 border-[#83C5BE] text-[#006D77] hover:bg-white hover:border-[#E29578] hover:text-[#E29578]"
                  onClick={toggleFavorite}
                >
                  <Heart
                    className={
                      isFavorite ? "fill-[#E29578] text-[#E29578]" : ""
                    }
                  />
                  {isFavorite ? "Saved to Wishlist" : "Save to Wishlist"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
