"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, X } from "lucide-react";
import { useUserData } from "@/contexts/UserData";

const StarRating = ({ average }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5 && star === fullStars + 1;
        const isFullStar = star <= fullStars;
        const isEmptyStar = star > fullStars && !hasHalfStar;

        return (
          <div
            key={star}
            className="relative"
            style={{ width: 18, height: 18 }}
          >
            <Star size={18} className="text-gray-300 absolute top-0 left-0" />
            {isFullStar && (
              <Star
                size={18}
                className="text-yellow-400 fill-yellow-400 absolute top-0 left-0"
              />
            )}
            {hasHalfStar && (
              <>
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: 9 }}
                >
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div
                  className="absolute top-0 left-[9px] overflow-hidden"
                  style={{ width: 9 }}
                >
                  <Star size={18} className="text-gray-300" />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function WishlistPage() {
  const { userData } = useUserData();

  // Sample wishlist data - replace with your actual data fetching logic
  const [wishlist, setWishlist] = React.useState([
    {
      _id: "1",
      name: "Premium Pet Bed",
      price: 70,
      image: "/images/pet-bed-1.jpg",
      averageRating: 4.3,
      reviewCount: 12,
      inStock: true,
    },
    {
      _id: "2",
      name: "Luxury Cat Tree",
      price: 120,
      image: "/images/cat-tree.jpg",
      averageRating: 3.7,
      reviewCount: 8,
      inStock: true,
    },
    {
      _id: "3",
      name: "Automatic Feeder",
      price: 55,
      image: "/images/feeder.jpg",
      averageRating: 4.8,
      reviewCount: 15,
      inStock: false,
    },
  ]);

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((item) => item._id !== productId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#006D77] mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Your wishlist is empty
          </h3>
          <p className="mt-1 text-gray-500">Start adding items you love!</p>
          <Button className="mt-4 bg-[#E29578] hover:bg-[#d37a61]">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <Card
              key={product._id}
              className="bg-[#EDF6F9] border-[#83C5BE] overflow-hidden"
            >
              <CardHeader className="p-0 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-lg"
                >
                  <X size={18} />
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-[#006D77]">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1">
                  <StarRating average={product.averageRating} />
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.averageRating.toFixed(1)} sur{" "}
                    {product.reviewCount} avis)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      product.inStock ? "text-[#006D77]" : "text-red-500"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="text-xl font-bold text-[#E29578]">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 p-4 bg-[#EDF6F9] border-t border-[#83C5BE]/30">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  <Heart className="fill-[#E29578] text-[#E29578]" />
                  Remove
                </Button>
                <Button
                  className="flex-1 gap-2 bg-[#E29578] hover:bg-[#d37a61]"
                  disabled={!product.inStock}
                >
                  <ShoppingCart />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
