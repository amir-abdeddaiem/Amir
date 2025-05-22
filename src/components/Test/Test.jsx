"use client";
import React, { useEffect, useState } from "react";
import { useUserData } from "@/contexts/UserData";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pic } from "@/components/Produit/Pic";
import { ReviewPopup } from "@/components/Produit/review/ReviewPopup";
import axios from "axios";

export default function Test({ params }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const { userData } = useUserData();
  console.log(userData);
  useEffect(() => {
    // Using example data directly instead of API call
    const exampleProduct = {
      _id: "682e06d2593d41b016964c69",
      name: "louppy",
      description:
        "The loopy rabbit is a whirlwind of energy and eccentric charm. With wi…",
      price: 70,
      images: ["image1.jpg", "image2.jpg"], // Assuming array of image URLs
      category: "Accessories",
      localisation: "",
      featured: true,
      petType: "Reptile",
      quantity: 1,
      specifications: [
        { key: "Material", value: "Plush" },
        { key: "Size", value: "Medium" },
      ],
      user: "6824d2e30b47408a868cacaf",
      createdAt: "2025-05-21T17:01:06.344+00:00",
      updatedAt: "2025-05-21T17:01:06.344+00:00",
      __v: 0,
    };

    const exampleReviews = [
      {
        _id: "1",
        user: { firstName: "John", lastName: "Doe" },
        stars: 5,
        message: "Great product! My reptile loves it.",
        createdAt: "2025-05-22T10:00:00.000Z",
      },
      {
        _id: "2",
        user: { firstName: "Jane", lastName: "Smith" },
        stars: 4,
        message: "Good quality but a bit expensive.",
        createdAt: "2025-05-21T14:30:00.000Z",
      },
    ];

    setProduct(exampleProduct);
    setReviews(exampleReviews);
  }, []);

  return (
    <div className=" flex">
      <Modal>
        <ModalTrigger className="bg-[#E29578] text-white flex ">
          <span className="group-hover/modal-btn:translate-x-40 transition duration-500">
            View Product
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            📦
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent className="max-h-[90vh] overflow-y-auto p-4 bg-[#EDF6F9] rounded-xl shadow-xl">
            {error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : product ? (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Images */}
                <div className="flex flex-col gap-4 w-full md:w-1/2">
                  <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={product.images?.[0] || "/images/noImg.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-16 h-16 rounded-md border object-cover"
                        />
                      ))}
                    </div>
                  )}
                  {/* Extra Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm bg-[#FFDDD2] p-4 rounded-lg shadow-md text-gray-800 text-center ">
                    <div>
                      <strong>Category:</strong> {product.category}
                    </div>
                    <div>
                      <strong>Pet Type:</strong> {product.petType}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {product.quantity}
                    </div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {product.localisation || "Unknown"}
                    </div>
                    <div>
                      <strong>Owner:</strong> John PetSeller
                    </div>
                    <div>
                      <strong>Contact:</strong> john@example.com
                    </div>
                    <div>
                      <strong>phone:</strong> 25951400
                    </div>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-2 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">
                      {product.name}
                    </h1>
                    <p className="text-xl text-[#E29578] font-semibold">
                      ${product.price?.toFixed(2)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {product.description}
                    </p>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-[#006D77]">
                      Specifications:
                    </h2>
                    <ul className="space-y-1 list-disc pl-5 text-sm text-gray-700">
                      {product.specifications?.length > 0 ? (
                        product.specifications.map((spec, i) => (
                          <li key={i}>
                            <strong>{spec.key}:</strong> {spec.value}
                          </li>
                        ))
                      ) : (
                        <li className="italic">No specifications available.</li>
                      )}
                    </ul>
                  </div>

                  {/* Reviews */}
                  <Card className="border-[#E29578] bg-white shadow-lg rounded-lg">
                    <CardHeader className="bg-[#FFDDD2] rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-[#006D77] text-lg">
                        <span>Customer Reviews</span>
                        <span className="bg-[#83C5BE] text-white text-xs px-2 py-0.5 rounded-full">
                          {reviews.length}
                        </span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-gray-800">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div
                            key={review._id}
                            className="bg-white dark:bg-neutral-700 p-3 rounded-lg"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-[#006D77]">
                                {review.user?.firstName} {review.user?.lastName}
                              </span>
                              <span className="text-[#E29578]">
                                {"⭐".repeat(review.stars)}
                              </span>
                            </div>
                            <p className="text-sm italic">{review.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-[#006D77] italic">
                          No reviews yet.
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-center pt-4">
                      <ReviewPopup productId={product._id} />
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="animate-pulse inline-block h-8 w-8 rounded-full bg-[#006D77] mb-4"></div>
                <p className="text-gray-600 dark:text-gray-100">
                  Loading product details...
                </p>
              </div>
            )}
          </ModalContent>

          <ModalFooter className="gap-4 bg-[#EDF6F9] p-4 rounded-b-xl">
            <button className="px-4 py-2 bg-[#E29578] hover:bg-[#d37a61] text-white font-medium rounded-full text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow">
              ❤️ Favoriser
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
