"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QRCode from 'qrcode';

import {
  Loader2,
  PawPrint,
  Store,
  Pencil,
  Heart,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { useUserData } from "@/contexts/UserData";
import { toast } from "sonner";
import { IconEdit } from "@tabler/icons-react";
import ProductModal from "../Produit/ProductModal";
import Link from "next/link";
import EditProfile from "@/components/Animal/EditProfile"; // Import the EditProfile animal component

// Glassmorphism effect component
const GlassCard = ({ children, className }) => (
  <div
    className={`backdrop-blur-md bg-white/30 border border-white/20 rounded-xl shadow-lg ${className}`}
  >
    {children}
  </div>
);

export default function UserProfile() {


  const { userData } = useUserData();
  const user = userData;
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/myproduct");
      const data = Array.isArray(response.data) ? response.data : [];
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load marketplace posts.");
      setPosts([]);
    }
  };

  const fetchAnimal = async () => {
    try {
      const response = await axios.get("/api/myanimal", {
        headers: {
          "x-user-id": user?.id,
        },
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setPets(data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
      if (error.response?.status === 404) {
        setPets([]);
      } else {
        setError("Failed to load pets. Please try again later.");
        setPets([]);
      }
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchAnimal()])
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleEdit = (petId) => {
    const pet = pets.find((p) => p._id === petId);
    if (pet) {
      setSelectedPet(pet);
      setIsEditDialogOpen(true);
    }
  };

  const handleSavePet = async (updatedPet) => {
    try {
      // Ensure the ID matches the API's expected field (_id)
      const petToUpdate = { ...updatedPet, _id: updatedPet.id };
      await axios.put(`/api/myanimal/${updatedPet.id}`, petToUpdate);
      toast.success("Pet updated successfully");
      // Update the pets state with the updated pet
      setPets((prevPets) =>
        prevPets.map((pet) => (pet._id === updatedPet.id ? updatedPet : pet))
      );
      setIsEditDialogOpen(false);
      setSelectedPet(null);
    } catch (error) {
      console.error("Failed to update pet:", error);
      toast.error("Failed to update pet");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmed) return;

      const response = await fetch(`/api/myproduct?id=${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
      console.error("Delete error:", error);
    }
  };
  const handleEditproduct = (e, post) => {
    e.stopPropagation();
    router.push(`/marcket_place/mymarket/edit?id=${post._id}`);
  };

  const handleAddToTinder = (petId) => {
    // Implement Tinder functionality
    toast.info("Add to Tinder not implemented yet");
  };

  const handleReportLost = (petId) => {
    // Implement report lost functionality
    toast.info("Report lost not implemented yet");
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };


  const [qrCodeUrl, setQrCodeUrl] = useState('/user');


  const generateQRCode = async (id) => {
    try {
      const url = await QRCode.toDataURL(`http://localhost:3000/animal/${id}`);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };





  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#EDF6F9] to-[#FFDDD2]">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#E29578]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#EDF6F9] to-[#FFDDD2]">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-[#E29578]">{error}</div>
            <Button
              variant="ghost"
              size="md"
              className="mt-2 text-[#006D77] hover:bg-[#83C5BE]/20"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const bio =
    user?.bio || user?.businessProvider?.description || "No bio provided";

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#EDF6F9] to-[#FFDDD2]">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Profile Sidebar */}
              <div className="lg:col-span-1">
                <GlassCard className="flex flex-col items-center p-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <Avatar className="w-48 h-48 mb-6 border-4 border-[#E29578] shadow-xl">
                      <AvatarImage
                        className="object-cover"
                        src={user?.avatar || "/default-avatar.png"}
                        alt="Profile"
                      />
                    </Avatar>
                  </motion.div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2 text-[#006D77]">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-[#83C5BE] mb-4">{user?.email}</p>
                  </div>
                  <Button
                    onClick={() => router.push("/user/edit")}
                    className="bg-[#E29578]"
                  >
                    Edit Profile
                    <IconEdit />
                  </Button>
                </GlassCard>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Information */}
                <GlassCard>
                  <Card className="bg-transparent border-none">
                    <CardHeader>
                      <CardTitle className="text-[#006D77] text-2xl">
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-[#83C5BE] font-medium">
                            Birth Date
                          </p>
                          <p className="text-[#006D77]">
                            {user?.birthDate
                              ? new Date(user.birthDate)
                                .toISOString()
                                .split("T")[0]
                              : "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#83C5BE] font-medium">
                            Gender
                          </p>
                          <p className="text-[#006D77]">
                            {user?.gender || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#83C5BE] font-medium">
                            Location
                          </p>
                          <p className="text-[#006D77]">
                            {user?.location || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#83C5BE] font-medium">
                            Phone
                          </p>
                          <p className="text-[#006D77]">
                            {user?.phone || "Not provided"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-teal-500 mb-1"
                          >
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={3}
                            className="w-full px-3 py-2 text-cyan-900 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                            placeholder="Décrivez-vous en quelques mots..."
                            value={bio}
                            readOnly // Make bio read-only since it's not editable here
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            {bio ? `${bio.length}/250 caractères` : "Optionnel"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlassCard>

                {/* Business Information (if applicable) */}
                {user?.businessProvider && (
                  <GlassCard>
                    <Card className="bg-transparent border-none">
                      <CardHeader>
                        <CardTitle className="text-[#006D77] text-2xl">
                          Business Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <p className="text-sm text-[#83C5BE] font-medium">
                              Business Name
                            </p>
                            <p className="text-[#006D77]">
                              {user.businessProvider.businessName ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#83C5BE] font-medium">
                              Description
                            </p>
                            <p className="text-[#006D77]">
                              {user.businessProvider.description ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#83C5BE] font-medium">
                              Website
                            </p>
                            <p className="text-[#006D77]">
                              {user.businessProvider.website || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GlassCard>
                )}
              </div>
            </motion.div>

            {/* Pets and Marketplace Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Pets Section */}
              <GlassCard>
                <Card className="bg-transparent border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#006D77] text-2xl">
                      <PawPrint className="mr-2 h-6 w-6 text-[#E29578]" /> My
                      Pets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pets.length > 0 ? (
                        pets.map((pet) => (
                          <Link
                            key={pet._id}
                            href={`/animal/${pet._id}`}
                            passHref
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ y: -5 }}
                              className="relative bg-white/70 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all"
                            >
                              <img
                                src={pet.image || "/default-pet.png"}
                                alt={pet.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                              />
                              <div className="absolute top-56 right-2 flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-[#006D77] hover:bg-[#006D77]/10"
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent Link navigation
                                    handleEdit(pet._id);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500 hover:bg-red-100"
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent Link navigation
                                    handleDelete(pet._id);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                              <h3 className="text-xl font-bold text-[#006D77]">
                                {pet.name}
                              </h3>
                              <p className="text-sm text-[#83C5BE]">
                                Breed: {pet.breed}
                              </p>
                              <p onLoad={() => { generateQRCode(pet._id) }} className="text-sm text-[#83C5BE] mb-4">
                                Age: {pet.age} years
                              </p>
                              <div className="col-span-2 text-center py-1 justify-center flex">

                                <img src={qrCodeUrl} className="w-25 h-25" alt="" onError={() => { generateQRCode(pet._id) }} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent Link navigation
                                    handleAddToTinder(pet._id);
                                  }}
                                  className="border-[#E29578] text-[#E29578] hover:bg-[#E29578]/10"
                                >
                                  <Heart className="mr-2 h-4 w-4" /> Tinder
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent Link navigation
                                    handleReportLost(pet._id);
                                  }}
                                  className="border-[#E29578] text-[#E29578] hover:bg-[#E29578]/10"
                                >

                                  <AlertTriangle className="mr-2 h-4 w-4" />{" "}
                                  Lost
                                </Button>
                              </div>


                            </motion.div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-[#83C5BE]">No pets added yet.</p>
                      )}
                    </div>
                    <Button
                      onClick={() => router.push("/animal/add-animal")}
                      className="mt-6 bg-[#E29578] hover:bg-[#E29578]/90 w-full"
                    >
                      Add New Pet
                    </Button>
                  </CardContent>
                </Card>
              </GlassCard>

              {/* Marketplace Posts Section */}
              <GlassCard>
                <Card className="bg-transparent border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#006D77] text-2xl">
                      <Store className="mr-2 h-6 w-6 text-[#E29578]" /> My
                      Marketplace Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posts.length > 0 ? (
                        posts.map((post) => (
                          <motion.div
                            key={post._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="relative bg-white/50 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all"
                          >
                            <div className="relative w-full h-40 mb-4">
                              <img
                                src={post.images?.[0] || "/default-post.png"}
                                alt={post.title}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <div className="absolute top-60 right-1 flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-[#006D77] hover:bg-[#006D77]/10"
                                  onClick={(e) => handleEditproduct(e, post)} // Pass the post object
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500 hover:bg-red-100"
                                  onClick={handleDelete}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-[#006D77]">
                              {post.title}
                            </h3>
                            <p className="text-[#83C5BE] line-clamp-2">
                              {post.description}
                            </p>
                            <p className="text-[#E29578] font-bold">
                              {post.price} DT
                            </p>
                            <div className="flex gap-3 mt-3">
                              <motion.button
                                className="bg-transparent text-[#006D77] hover:bg-[#006D77]/10 flex items-center justify-center rounded-lg border border-[#006D77] px-4 py-2 font-medium transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(post); // Pass the `post` object
                                }}
                              >
                                View Product
                              </motion.button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-[#83C5BE]">
                          No marketplace posts yet.
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => router.push("/marketplace/add-product")}
                      className="mt-6 bg-[#E29578] hover:bg-[#E29578]/90 w-full"
                    >
                      Add to Marketplace
                    </Button>
                  </CardContent>
                </Card>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedPost && (
        <ProductModal
          product={selectedPost}
          show={showModal}
          onClose={closeModal}
          isFavorite={false}
          toggleFavorite={() => { }}
        />
      )}

      {/* Edit Pet Dialog */}
      {selectedPet && (
        <EditProfile
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedPet(null);
          }}
          onSave={handleSavePet}
          animal={selectedPet}
        />
      )}
    </>
  );
}
