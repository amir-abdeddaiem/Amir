"use client";
import { useState, useEffect } from "react";
import { useUserData } from "@/contexts/UserData";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Produit } from "@/components/Produit/Produit"; // Adjust path to your Produit component
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FavoritePage() {
  const { userData } = useUserData();
  const userId = userData?.id;
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) {
        setLoading(false);
        setError("Please log in to view favorites");
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/favoriteproduct?userId=${userId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError(
          error.response?.data?.error || "Failed to fetch favorite products"
        );
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, router]);

  const handleFavoriteChange = (productId, isFavorited) => {
    if (!isFavorited) {
      setProducts((prev) =>
        prev.filter((fav) => fav.product._id !== productId)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#83C5BE]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-[#EDF6F9]">
          No Favorite Products
        </h2>
        <p className="text-[#EDF6F9]/70 mt-2">
          Add products to your favorites to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#EDF6F9] mb-6">
        My Favorite Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((favorite) => (
          <Produit
            key={favorite._id}
            product={favorite.product}
            isFavorite={true}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  );
}
