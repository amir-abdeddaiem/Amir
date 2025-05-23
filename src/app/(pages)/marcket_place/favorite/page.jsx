"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import ProductCard from "@/components/product-card";
import EmptyState from "@/components/empty-state";

export default function FavoritesPage() {
  const { items } = useFavorites();

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted-foreground">Products you've saved for later</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-10 w-10 text-muted-foreground" />}
          title="No favorites yet"
          description="Items you favorite will appear here. Start browsing to find products you love!"
          actionLabel="Browse Products"
          actionHref="/"
        />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
