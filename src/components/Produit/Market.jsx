// app/marketplace/page.js
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Produit } from "@/components/Produit/Produit";
import { ProductFilters } from "@/components/Produit/ProductFilters";
import { IconSearch } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MarketPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showInStock, setShowInStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      if (response.data.success) {
        setAllProducts(response.data.data.products);
        setFilteredProducts(response.data.data.products);
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-100 text-red-700 font-sans rounded-lg",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "product-added") {
      fetchProducts(); // Refetch to include new product
      toast.success("🎉 Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-[#83C5BE] text-[#006D77] font-sans rounded-lg",
        progressClassName: "bg-[#006D77]",
      });
    }
  }, [searchParams]);

  const applyFilters = () => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false;
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some(
          (cat) => product.category?.toLowerCase() === cat.toLowerCase()
        );
      const matchesPetTypes =
        selectedPetTypes.length === 0 ||
        selectedPetTypes.some(
          (petType) => product.petType?.toLowerCase() === petType.toLowerCase()
        );
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStock || product.inStock;

      return (
        matchesSearch &&
        matchesCategories &&
        matchesPetTypes &&
        matchesPrice &&
        matchesStock
      );
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [
    searchQuery,
    selectedCategories,
    selectedPetTypes,
    priceRange,
    showInStock,
    allProducts,
  ]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPetTypes([]);
    setPriceRange([0, 100]);
    setShowInStock(false);
    setSearchQuery("");
  };

  const generateProductKey = (product, index) => {
    if (product.id) return `product-${product.id}`;
    return `product-${product.name || "unnamed"}-${
      product.category || "uncategorized"
    }-${index}`.replace(/\s+/g, "-");
  };

  return (
    <div className="flex flex-col md:flex-row gap-19">
      <div className="flex-1 ml-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#83C5BE] focus:outline-none focus:ring-2 focus:ring-[#006D77]"
            />
            <IconSearch className="absolute left-3 top-2.5 text-[#006D77] h-5 w-5" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-tbridges-t-2 border-b-2 border-[#006D77]"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`products-${filteredProducts.length}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
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
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md sticky top-5 p-4 z-10">
          <ProductFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedPetTypes={selectedPetTypes}
            setSelectedPetTypes={setSelectedPetTypes}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            showInStock={showInStock}
            setShowInStock={setShowInStock}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
