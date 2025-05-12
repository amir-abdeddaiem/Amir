"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Produit } from "@/components/Produit/Produit";
import { ProductFilters } from "@/components/Produit/ProductFilters";
import { IconSearch } from "@tabler/icons-react";

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showInStock, setShowInStock] = useState(false);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPetTypes([]);
    setPriceRange([0, 100]);
    setShowInStock(false);
  };

  const products = [
    {
      title: "Hamster",
      description: "Hamsters are fun animals...",
      image: "/hams.jpg",
      category: "Small Pet",
      price: 29.99,
      inStock: true,
    },
    {
      title: "Cat",
      description: "Cats are independent...",
      image: "/cat.jpg",
      category: "Cat",
      price: 59.99,
      inStock: true,
    },
    {
      title: "Dog",
      description: "Dogs are loyal...",
      image: "/dog.jpg",
      category: "Dog",
      price: 89.99,
      inStock: true,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || product.title === filter;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !showInStock || product.inStock;

    return (
      matchesSearch &&
      matchesFilter &&
      matchesCategory &&
      matchesPrice &&
      matchesStock
    );
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Produit key={index} product={product} />
          ))}
        </div>
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
