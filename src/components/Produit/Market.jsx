"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Produit } from "@/components/Produit/Produit";
import { ProductFilters } from "@/components/Produit/ProductFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { IconX } from "@tabler/icons-react";

export default function MarketPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showInStock, setShowInStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [petTypeFilter, setPetTypeFilter] = useState("all");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPetTypes([]);
    setPriceRange([0, 100]);
    setShowInStock(false);
    setSearchQuery("");
    setPetTypeFilter("all");
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/products", {
        params: {
          name: debouncedSearchQuery || undefined,
          category: filter !== "all" ? filter : undefined,
          petType: petTypeFilter !== "all" ? petTypeFilter : undefined,
          priceMin: priceRange[0],
          priceMax: priceRange[1],
          inStock: showInStock ? "true" : undefined,
          categories:
            selectedCategories.length > 0 ? selectedCategories : undefined,
          petTypes: selectedPetTypes.length > 0 ? selectedPetTypes : undefined,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchQuery,
    filter,
    petTypeFilter,
    priceRange,
    showInStock,
    selectedCategories,
    selectedPetTypes,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const getPetEmoji = () => {
    switch (petTypeFilter) {
      case "dog":
        return "🐶";
      case "cat":
        return "🐱";
      case "bird":
        return "🦜";
      default:
        return "🐾";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Pet Type Selector */}
          <select
            value={petTypeFilter}
            onChange={(e) => setPetTypeFilter(e.target.value)}
            className="w-32 bg-amber-100 border-amber-300 text-amber-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Pets</option>
            <option value="dog">🐶 Dogs</option>
            <option value="cat">🐱 Cats</option>
            <option value="bird">🦜 Birds</option>
          </select>

          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg">
                {getPetEmoji()}
              </span>
              <Input
                type="text"
                placeholder={`Search ${
                  petTypeFilter !== "all" ? petTypeFilter + " " : ""
                }products...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border-amber-200 focus:ring-2 focus:ring-amber-300"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  onClick={handleClearSearch}
                >
                  <IconX className="h-4 w-4 text-amber-500" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <span key={index}>
                  <Produit product={product} />
                </span>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-amber-600">
                No products found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md sticky top-20 p-4 border border-amber-100">
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
