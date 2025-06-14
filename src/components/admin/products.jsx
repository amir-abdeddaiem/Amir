"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { Eye, MessageSquare, Trash2 } from "lucide-react";

// API functions using Axios
const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/admin/product/myproduct");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchReviews = async (productId) => {
  try {
    const response = await axios.get(
      `/api/admin/review?productId=${productId}`
    );
    return response.data.reviews || [];
  } catch (error) {
    console.error(
      `Error fetching reviews for product ${productId}:`,
      error.response?.data || error.message
    );
    return [];
  }
};

const deleteProduct = async (id) => {
  try {
    await axios.delete(`/api/admin/product/${id}`);
    return true;
  } catch (error) {
    console.error(
      "Error deleting product:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const deleteReview = async (id) => {
  try {
    await axios.delete(`/api/review/${id}`);
    return true;
  } catch (error) {
    console.error(
      "Error deleting review:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Reusable ProductCard component
const ProductCard = ({ product, reviews, onDeleteProduct, onDeleteReview }) => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const isPet = product.category === "pets";

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 transition-all hover:shadow-2xl border border-[#FFDDD2]/50">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-shrink-0">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name || "Product"}
                width={200}
                height={200}
                className="object-cover rounded-xl border border-[#FFDDD2]/50 transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-48 h-48 bg-[#FFDDD2]/20 rounded-xl flex items-center justify-center">
                <span className="text-[#006D77] text-sm font-semibold">
                  No Image
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-[#006D77] mb-3 tracking-tight">
              {product.name || "N/A"}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Category: {product.category || "N/A"}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Type: {product.petType || "N/A"}
            </p>
            <p className="text-gray-600 text-base line-clamp-3 mb-6">
              {product.description || "No description available."}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative group">
                <button
                  onClick={() => setIsProductOpen(!isProductOpen)}
                  className="flex items-center gap-2 bg-[#83C5BE] text-white px-6 py-3 rounded-lg hover:bg-[#006D77] transition-all transform hover:scale-105 text-sm font-semibold shadow-md"
                  aria-label={
                    isProductOpen
                      ? "Hide product details"
                      : "View product details"
                  }
                >
                  <Eye size={18} />
                  {isProductOpen ? "Hide Product" : "View Product"}
                </button>
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-[#006D77] text-white text-xs rounded py-1 px-2">
                  {isProductOpen
                    ? "Collapse product details"
                    : "Show product details"}
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                  className="flex items-center gap-2 bg-[#FFDDD2] text-[#006D77] px-6 py-3 rounded-lg hover:bg-[#006D77] hover:text-white transition-all transform hover:scale-105 text-sm font-semibold shadow-md"
                  aria-label={
                    isReviewsOpen
                      ? "Hide reviews"
                      : `View ${reviews.length} reviews`
                  }
                >
                  <MessageSquare size={18} />
                  {isReviewsOpen
                    ? "Hide Reviews"
                    : `View Reviews (${reviews.length})`}
                </button>
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-[#006D77] text-white text-xs rounded py-1 px-2">
                  {isReviewsOpen
                    ? "Collapse reviews"
                    : `Show ${reviews.length} reviews`}
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={() => {
                    if (
                      window.confirm(`Delete ${product.name || "product"}?`)
                    ) {
                      onDeleteProduct(product._id);
                    }
                  }}
                  className="flex items-center gap-2 bg-[#E29578] text-white px-6 py-3 rounded-lg hover:bg-[#D17A60] transition-all transform hover:scale-105 text-sm font-semibold shadow-md"
                  aria-label="Delete product"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-[#006D77] text-white text-xs rounded py-1 px-2">
                  Delete this product
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(isProductOpen || isReviewsOpen) && (
        <div className="bg-[#FFDDD2]/30 p-8 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {isProductOpen && (
              <div>
                <h4 className="text-xl font-semibold text-[#006D77] mb-4 tracking-tight">
                  Product Details
                </h4>
                <ul className="space-y-3 text-gray-700 text-sm">
                  <li>
                    <strong>Price:</strong> $
                    {product.price?.toFixed(2) || "N/A"}
                  </li>
                  <li>
                    <strong>Location:</strong> {product.localisation || "N/A"}
                  </li>
                  <li>
                    <strong>Featured:</strong> {product.featured ? "Yes" : "No"}
                  </li>
                  <li>
                    <strong>Quantity:</strong> {product.quantity || "N/A"}
                  </li>
                  <li>
                    <strong>Posted by:</strong> {product.user?.email || "N/A"}
                  </li>
                  {isPet && (
                    <>
                      <li>
                        <strong>Breed:</strong> {product.breed || "N/A"}
                      </li>
                      <li>
                        <strong>Age:</strong> {product.age || "N/A"}
                      </li>
                      <li>
                        <strong>Gender:</strong> {product.gender || "N/A"}
                      </li>
                      <li>
                        <strong>Weight:</strong> {product.weight || "N/A"}
                      </li>
                      <li>
                        <strong>Color:</strong> {product.Color || "N/A"}
                      </li>
                      <li>
                        <strong>Listing Type:</strong>{" "}
                        {product.listingType || "N/A"}
                      </li>
                      <li>
                        <strong>Health Status:</strong>
                        <ul className="pl-5 list-disc mt-1">
                          <li>
                            Vaccinated:{" "}
                            {product.HealthStatus?.vaccinated ? "Yes" : "No"}
                          </li>
                          <li>
                            Neutered:{" "}
                            {product.HealthStatus?.neutered ? "Yes" : "No"}
                          </li>
                          <li>
                            Microchipped:{" "}
                            {product.HealthStatus?.microchipped ? "Yes" : "No"}
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>Friendly:</strong>
                        <ul className="pl-5 list-disc mt-1">
                          <li>
                            Children:{" "}
                            {product.friendly?.children ? "Yes" : "No"}
                          </li>
                          <li>Dogs: {product.friendly?.dogs ? "Yes" : "No"}</li>
                          <li>Cats: {product.friendly?.cats ? "Yes" : "No"}</li>
                          <li>
                            Other Animals:{" "}
                            {product.friendly?.animals ? "Yes" : "No"}
                          </li>
                        </ul>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
            {isReviewsOpen && (
              <div>
                <h4 className="text-xl font-semibold text-[#006D77] mb-4 tracking-tight">
                  Reviews
                </h4>
                {reviews?.length === 0 ? (
                  <p className="text-gray-600 text-base">
                    No reviews available.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-l-4 border-[#83C5BE] pl-4 py-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-700 text-sm font-semibold">
                              <strong>Rating:</strong> {review.stars || "N/A"}/5
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {review.message || "No message"}
                            </p>
                            {review.photo && (
                              <Image
                                src={review.photo}
                                alt="Review photo"
                                width={100}
                                height={100}
                                className="mt-2 rounded-lg object-cover"
                              />
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              By{" "}
                              {review.user?.name ||
                                review.user?.email ||
                                "Anonymous"}{" "}
                              on{" "}
                              {review.createdAt
                                ? new Date(
                                    review.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this review?")) {
                                  onDeleteReview(review._id);
                                }
                              }}
                              className="flex items-center gap-2 bg-[#E29578] text-white px-4 py-2 rounded-lg hover:bg-[#D17A60] transition-all transform hover:scale-105 text-sm font-semibold"
                              aria-label="Delete review"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-[#006D77] text-white text-xs rounded py-1 px-2">
                              Delete this review
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main AdminPage component
const AdminPage = () => {
  const [productList, setProductList] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductsAndReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const products = await fetchProducts();
        setProductList(products);

        // Fetch reviews for each product
        const reviewsPromises = products.map((product) =>
          fetchReviews(product._id).then((reviews) => ({
            id: product._id,
            reviews,
          }))
        );
        const reviewsResults = await Promise.all(reviewsPromises);
        const newReviewsMap = reviewsResults.reduce(
          (acc, { id, reviews }) => ({
            ...acc,
            [id]: reviews,
          }),
          {}
        );
        setReviewsMap(newReviewsMap);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError(
          err.response?.status === 404
            ? "API endpoint not found. Please check if /api/myproduct is correctly set up."
            : `Failed to load products: ${err.message}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadProductsAndReviews();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProductList(productList.filter((p) => p._id !== id));
      setReviewsMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    } catch (error) {
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReview(id);
      setReviewsMap((prev) => {
        const newMap = { ...prev };
        Object.keys(newMap).forEach((productId) => {
          newMap[productId] = newMap[productId].filter(
            (review) => review._id !== id
          );
        });
        return newMap;
      });
    } catch (error) {
      alert(`Failed to delete review: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <Head>
        <title>Admin - Marketplace Products</title>
      </Head>
      <div className="container mx-auto px-6 py-12 sm:px-8">
        <h1 className="text-4xl font-bold text-[#006D77] mb-12 tracking-tight">
          Admin: Manage Products & Reviews
        </h1>
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg font-medium animate-pulse">
              Loading products...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-[#E29578] text-lg font-medium">{error}</p>
          </div>
        ) : productList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg font-medium">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {productList.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                reviews={reviewsMap[product._id] || []}
                onDeleteProduct={handleDeleteProduct}
                onDeleteReview={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
