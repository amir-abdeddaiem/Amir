"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Produit } from "@/components/Produit/Produit";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/myproduct");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const generateProductKey = (product, index) => {
    if (product.id) return `product-${product.id}`;
    if (product.name && product.category) {
      return `product-${product.name}-${product.category}`.replace(/\s+/g, "-");
    }
    return `product-fallback-${index}`;
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006D77]"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.length > 0 ? (
                products.map((product, index) => (
                  <motion.div
                    key={generateProductKey(product, index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Produit product={product} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-12 col-span-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    No products found
                  </h2>
                  <p className="text-muted-foreground">
                    You haven't listed any products yet.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
