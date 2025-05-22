"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Produit } from "@/components/Produit/Produit";
import { ProductFilters } from "@/components/Produit/ProductFilters";
import { IconSearch } from "@tabler/icons-react";

export default function MarketPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showInStock, setShowInStock] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPetTypes([]);
    setPriceRange([0, 100]);
    setShowInStock(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products", {
          params: {
            name: searchQuery || undefined,
            category: filter !== "all" ? filter : undefined,
            priceMin: priceRange[0],
            priceMax: priceRange[1],
            inStock: showInStock ? "true" : undefined,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // searchQuery, filter, priceRange, showInStock;

  return (
    <div className="flex  md:flex-row gap-6">
      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-md pl-10 pr-4 py-2 rounded-lg border border-[#83C5BE] focus:outline-none focus:ring-2 focus:ring-[#006D77]"
            />
            <IconSearch className="absolute left-3 top-2.5 text-[#006D77] h-5 w-5" />
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Produit key={index} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md sticky top-20">
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
    </div>
  );
}
