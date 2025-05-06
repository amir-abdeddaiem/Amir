"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ShoppingCart,
  Heart,
} from "lucide-react";
import Image from "next/image";

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Premium Dog Food",
    price: 29.99,
    description: "High-quality dog food for all breeds",
    image: "/placeholder.svg?height=200&width=200&text=Dog+Food",
    category: "Food",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    featured: true,
    petType: "Dog",
  },
  {
    id: 2,
    name: "Cat Tree",
    price: 59.99,
    description: "Multi-level cat tree with scratching posts",
    image: "/placeholder.svg?height=200&width=200&text=Cat+Tree",
    category: "Furniture",
    rating: 4.2,
    reviews: 85,
    inStock: true,
    featured: false,
    petType: "Cat",
  },
  {
    id: 3,
    name: "Bird Cage",
    price: 39.99,
    description: "Spacious cage for small to medium birds",
    image: "/placeholder.svg?height=200&width=200&text=Bird+Cage",
    category: "Housing",
    rating: 4.0,
    reviews: 42,
    inStock: true,
    featured: false,
    petType: "Bird",
  },
  {
    id: 4,
    name: "Fish Tank",
    price: 89.99,
    description: "10-gallon aquarium with filter system",
    image: "/placeholder.svg?height=200&width=200&text=Fish+Tank",
    category: "Housing",
    rating: 4.7,
    reviews: 63,
    inStock: false,
    featured: true,
    petType: "Fish",
  },
  {
    id: 5,
    name: "Hamster Wheel",
    price: 19.99,
    description: "Silent spinner wheel for small pets",
    image: "/placeholder.svg?height=200&width=200&text=Hamster+Wheel",
    category: "Toys",
    rating: 3.9,
    reviews: 28,
    inStock: true,
    featured: false,
    petType: "Small Pet",
  },
  {
    id: 6,
    name: "Dog Leash",
    price: 14.99,
    description: "Durable nylon leash with comfortable handle",
    image: "/placeholder.svg?height=200&width=200&text=Dog+Leash",
    category: "Accessories",
    rating: 4.3,
    reviews: 112,
    inStock: true,
    featured: false,
    petType: "Dog",
  },
  {
    id: 7,
    name: "Cat Litter Box",
    price: 24.99,
    description: "Covered litter box with odor control",
    image: "/placeholder.svg?height=200&width=200&text=Litter+Box",
    category: "Essentials",
    rating: 4.1,
    reviews: 76,
    inStock: true,
    featured: false,
    petType: "Cat",
  },
  {
    id: 8,
    name: "Dog Bed",
    price: 34.99,
    description: "Orthopedic bed for medium to large dogs",
    image: "/placeholder.svg?height=200&width=200&text=Dog+Bed",
    category: "Furniture",
    rating: 4.6,
    reviews: 95,
    inStock: true,
    featured: true,
    petType: "Dog",
  },
];

// Categories for filtering
const categories = [
  "Food",
  "Toys",
  "Accessories",
  "Housing",
  "Furniture",
  "Essentials",
];
const petTypes = [
  "Dog",
  "Cat",
  "Bird",
  "Fish",
  "Small Pet",
  "Reptile",
  "Other",
];

export default function Marketplace() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [showInStock, setShowInStock] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    petTypes: true,
    price: true,
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Toggle filter sections
  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle pet type selection
  const handlePetTypeChange = (petType) => {
    setSelectedPetTypes((prev) =>
      prev.includes(petType)
        ? prev.filter((p) => p !== petType)
        : [...prev, petType]
    );
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    // Search term filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    // Pet type filter
    const matchesPetType =
      selectedPetTypes.length === 0 ||
      selectedPetTypes.includes(product.petType);

    // Price range filter
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    // In stock filter
    const matchesStock = !showInStock || product.inStock;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPetType &&
      matchesPrice &&
      matchesStock
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "featured":
        return b.featured - a.featured;
      default:
        return 0;
    }
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedPetTypes([]);
    setPriceRange([0, 100]);
    setShowInStock(false);
    setSortBy("featured");
  };

  // Render sidebar content
  const renderSidebarContent = () => (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#E29578]">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleFilterSection("categories")}
          >
            <h3 className="font-medium">Categories</h3>
            {expandedFilters.categories ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <AnimatePresence>
            {expandedFilters.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Pet Types */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleFilterSection("petTypes")}
          >
            <h3 className="font-medium">Pet Type</h3>
            {expandedFilters.petTypes ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <AnimatePresence>
            {expandedFilters.petTypes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {petTypes.map((petType) => (
                    <div key={petType} className="flex items-center">
                      <Checkbox
                        id={`pet-${petType}`}
                        checked={selectedPetTypes.includes(petType)}
                        onCheckedChange={() => handlePetTypeChange(petType)}
                      />
                      <Label
                        htmlFor={`pet-${petType}`}
                        className="ml-2 text-sm"
                      >
                        {petType}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleFilterSection("price")}
          >
            <h3 className="font-medium">Price Range</h3>
            {expandedFilters.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <AnimatePresence>
            {expandedFilters.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 px-2">
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Availability */}
        <div className="flex items-center">
          <Checkbox
            id="in-stock"
            checked={showInStock}
            onCheckedChange={setShowInStock}
          />
          <Label htmlFor="in-stock" className="ml-2 text-sm">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <Button
            onClick={() => router.push("/marketplace/add")}
            className="bg-[#E29578] hover:bg-[#E29578]/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md sticky top-20">
              {renderSidebarContent()}
            </div>
          </div>

          {/* Sidebar - Mobile */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-[#E29578]">
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="overflow-y-auto h-full pb-20">
                  {renderSidebarContent()}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                  <Button
                    className="w-full bg-[#E29578] hover:bg-[#E29578]/90"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Search and Sort */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none bg-transparent focus:outline-none focus:ring-0"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Mobile Sort */}
            <div className="md:hidden flex justify-end mb-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none bg-transparent focus:outline-none focus:ring-0"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 ||
              selectedPetTypes.length > 0 ||
              showInStock ||
              priceRange[0] > 0 ||
              priceRange[1] < 100) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="bg-[#FFDDD2] text-[#E29578] border-[#E29578] flex items-center"
                  >
                    {category}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => handleCategoryChange(category)}
                    />
                  </Badge>
                ))}
                {selectedPetTypes.map((petType) => (
                  <Badge
                    key={petType}
                    variant="outline"
                    className="bg-[#FFDDD2] text-[#E29578] border-[#E29578] flex items-center"
                  >
                    {petType}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => handlePetTypeChange(petType)}
                    />
                  </Badge>
                ))}
                {showInStock && (
                  <Badge
                    variant="outline"
                    className="bg-[#FFDDD2] text-[#E29578] border-[#E29578] flex items-center"
                  >
                    In Stock
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setShowInStock(false)}
                    />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 100) && (
                  <Badge
                    variant="outline"
                    className="bg-[#FFDDD2] text-[#E29578] border-[#E29578] flex items-center"
                  >
                    ${priceRange[0]} - ${priceRange[1]}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange([0, 100])}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-full" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 w-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.featured && (
                          <Badge className="absolute top-2 left-2 bg-[#E29578] text-white">
                            Featured
                          </Badge>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="bg-red-500 text-white">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                        >
                          <Heart className="h-4 w-4 text-[#E29578]" />
                        </Button>
                      </div>
                      <CardContent className="p-4 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {product.name}
                          </h3>
                          <span className="font-bold text-[#E29578]">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <div className="flex">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                          </div>
                          <span className="ml-1">({product.reviews})</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.petType}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full bg-[#83C5BE] hover:bg-[#83C5BE]/90"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
