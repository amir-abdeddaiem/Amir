"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  PawPrint,
  Store,
  Pencil,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { useUserData } from "@/contexts/UserData";
import { toast } from "sonner";
import { IconEdit } from "@tabler/icons-react";
import ProductModal from "../Produit/ProductModal";
import Link from "next/link";
// Adding a glassmorphism effect component
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

  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // New state for selected post
  const router = useRouter();

  const goToEditProfile = () => {
    router.push("/user/edit");
  };

  const fetchAnimal = async () => {
    try {
      const response = await axios.get("/api/animal");
      setPets(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/myproduct");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAnimal();
  }, []);

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

  const openModal = (post) => {
    setSelectedPost(post); // Set the selected post
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null); // Clear the selected post
  };

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
                  <Button onClick={goToEditProfile} className={"bg-[#E29578]"}>
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
                            onChange={(e) => setBio(e.target.value)}
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
                          <Link href={`/animal/${pet.id}`} passHref>
                            <motion.div
                              key={pet.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ y: -5 }}
                              className="bg-white/50 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
                            >
                              <img
                                src={pet.image || "/default-pet.png"}
                                alt={pet.name}
                                className="w-full h-40 object-cover rounded-md mb-3"
                              />
                              <h3 className="text-lg font-semibold text-[#006D77]">
                                {pet.name}
                              </h3>
                              <p className="text-[#83C5BE]">
                                Breed: {pet.breed}
                              </p>
                              <p className="text-[#83C5BE]">
                                Age: {pet.age} years
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddToTinder(pet.id)}
                                  className="flex-1 border-[#E29578] text-[#E29578] hover:bg-[#E29578]/10"
                                >
                                  <Heart className="mr-2 h-4 w-4" /> Add to
                                  Tinder
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReportLost(pet.id)}
                                  className="flex-1 text-[#E29578] border-[#E29578] hover:bg-[#E29578]/10"
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />{" "}
                                  Report Lost
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
                      onClick={() => router.push("animal/add-animal")}
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
                    <br />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posts.length > 0 ? (
                        posts.map((post) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/50 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
                          >
                            <img
                              src={post.images?.[0] || "/default-post.png"}
                              alt={post.title}
                              className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <h3 className="text-lg font-semibold text-[#006D77]">
                              {post.title}
                            </h3>
                            <p className="text-[#83C5BE] line-clamp-2">
                              {post.description}
                            </p>
                            <p className="text-[#E29578] font-bold">
                              {post.price}DT
                            </p>
                            <div className="flex gap-3">
                              <motion.button
                                className="bg-transparent text-[#EDF6F9] hover:bg-[#EDF6F9]/10 flex items-center justify-center rounded-lg border border-[#EDF6F9] px-4 font-medium transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(post); // Pass the post to openModal
                                }}
                              >
                                Quick View
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
                    <br />
                    <div>
                      <Button
                        onClick={() =>
                          router.push("/marcket_place/add-product")
                        }
                        className="mt-6 bg-[#E29578] hover:bg-[#E29578]/90 w-full"
                      >
                        Add to Marketplace
                      </Button>
                    </div>
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
          toggleFavorite={() => {}}
        />
      )}
    </>
  );
}
