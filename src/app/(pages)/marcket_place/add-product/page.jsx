// app/add-product/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { BasicDetailsForm } from "@/components/Produit/addingProduct/BasicDetailsForm";
import { ImageUploadForm } from "@/components/Produit/addingProduct/ImageUploadForm";
import { SpecificationsForm } from "@/components/Produit/addingProduct/SpecificationsForm";
import { ProductPreview } from "@/components/Produit/addingProduct/ProductPreview";
import { useUserData } from "@/contexts/UserData";
import { toast } from "sonner";

export default function AddProduct() {
  const router = useRouter();
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState(""); // Add state for message
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    petType: "",
    quantity: "1",
    featured: false,
    images: [],
    specifications: [{ key: "", value: "" }],
    localisation: "",
    user: null, // Initialize as null
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!userData) {
      toast.error("Please login to add a product");
      router.push("/login");
      return;
    }

    // Update form data with user ID once userData is available
    setFormData((prev) => ({
      ...prev,
      user: userData.id,
    }));
  }, [userData, router]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecifications,
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      setPreviewImages((prev) => [...prev, ...base64Images]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    });
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    setFormData((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return {
        ...prev,
        images: updated,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      toast.error("Please login to add a product");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setMessage(""); // Clear previous message

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userData.id,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }

      const data = await response.json();
      toast.success("Product added successfully!");
      router.push("/marcket_place");
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage(error.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not authenticated, show loading or redirect
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006D77] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {message && (
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    message.includes("success")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              <Card>
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Basic Details</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="specifications">
                        Specifications
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="pt-4">
                      <BasicDetailsForm
                        formData={formData}
                        handleChange={handleChange}
                        setActiveTab={setActiveTab}
                      />
                    </TabsContent>

                    <TabsContent value="images" className="pt-4">
                      <ImageUploadForm
                        previewImages={previewImages}
                        handleImageUpload={handleImageUpload}
                        removeImage={removeImage}
                        setActiveTab={setActiveTab}
                      />
                    </TabsContent>

                    <TabsContent value="specifications" className="pt-4">
                      <SpecificationsForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSpecificationChange={handleSpecificationChange}
                        addSpecification={addSpecification}
                        removeSpecification={removeSpecification}
                        setActiveTab={setActiveTab}
                        isSubmitting={isLoading}
                        handleSubmit={handleSubmit}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-2">Preview Tips</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Add clear, high-quality images</li>
                      <li>Write detailed descriptions</li>
                      <li>Include accurate specifications</li>
                      <li>Set competitive pricing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 sticky top-20">
              <ProductPreview
                previewImages={previewImages}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
