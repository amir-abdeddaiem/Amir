"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { BasicDetailsForm } from "@/components/Produit/addingProduct/BasicDetailsForm";
import { ImageUploadForm } from "@/components/Produit/addingProduct/ImageUploadForm";
import { SpecificationsForm } from "@/components/Produit/addingProduct/SpecificationsForm";
import { ProductPreview } from "@/components/Produit/addingProduct/ProductPreview";

export default function AddProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

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
    user: "6824d2e30b47408a868cacaf", // Add user ID
  });

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle specification changes
  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = {
        ...newSpecs[index],
        [field]: value,
      };
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  // Add new specification field
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  // Remove specification field
  const removeSpecification = (index) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs.splice(index, 1);
      return {
        ...prev,
        specifications: newSpecs.length ? newSpecs : [{ key: "", value: "" }],
      };
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    const newPreviewImages = [...previewImages];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewImages.push(reader.result);
        setPreviewImages([...newPreviewImages]);
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    setPreviewImages((prev) => {
      const newPreviewImages = [...prev];
      newPreviewImages.splice(index, 1);
      return newPreviewImages;
    });

    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: previewImages,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit product");

      const data = await response.json();
      router.push("/marcket_place");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
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
                        handleSpecChange={handleSpecChange}
                        addSpecification={addSpecification}
                        removeSpecification={removeSpecification}
                        setActiveTab={setActiveTab}
                        isSubmitting={isSubmitting}
                        handleSubmit={handleSubmit}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Preview Tips - Moved inside the form column */}
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

            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="fix top-20">
                <ProductPreview
                  previewImages={previewImages}
                  formData={formData}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
