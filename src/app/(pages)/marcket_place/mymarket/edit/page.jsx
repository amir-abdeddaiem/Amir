"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { BasicDetailsForm } from "@/components/Produit/addingProduct/BasicDetailsForm";
import { ImageUploadForm } from "@/components/Produit/addingProduct/ImageUploadForm";
import { SpecificationsForm } from "@/components/Produit/addingProduct/SpecificationsForm";
import { ProductPreview } from "@/components/Produit/addingProduct/ProductPreview";
import { useUserData } from "@/contexts/UserData";

export default function EditProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { userData } = useUserData();

  const [loading, setLoading] = useState({
    isLoading: true,
    isSubmitting: false,
  });
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
  });
  const [previewImages, setPreviewImages] = useState([]);

  // Fetch original product data
  useEffect(() => {
    if (!productId || !userData?.id) {
      setLoading((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/myproduct?id=${productId}`);
        const product = response.data;

        if (!product) {
          throw new Error("Product not found");
        }

        console.log("Received product data:", product); // Debug log

        // Initialize form with original product data
        const initialFormData = {
          name: product.name || "",
          price: product.price?.toString() || "",
          description: product.description || "",
          category: product.category || "",
          petType: product.petType || "",
          quantity: product.quantity?.toString() || "1",
          featured: product.featured || false,
          images: product.images || [],
          specifications:
            product.specifications?.length > 0
              ? product.specifications
              : [{ key: "", value: "" }],
          localisation: product.localisation || "",
        };

        console.log("Setting form data:", initialFormData); // Debug log
        setFormData(initialFormData);

        if (product.images?.length) {
          console.log("Setting preview images:", product.images); // Debug log
          setPreviewImages(product.images);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Error loading product data: " + error.message);
      } finally {
        setLoading((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchProduct();
  }, [productId, userData?.id]);

  const handleChange = (field, value) => {
    console.log(`Updating ${field} to:`, value); // Debug log
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((base64Images) => {
      setPreviewImages((prev) => [...prev, ...base64Images]);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    });
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const payload = {
        _id: productId,
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        specifications: formData.specifications.filter(
          (spec) => spec.key && spec.value
        ),
        images: previewImages,
        user: userData?.id,
      };

      await axios.put("/api/myproduct", payload, {
        headers: {
          "x-user-id": userData?.id,
        },
      });

      alert("Product updated successfully!");
      router.push("/marcket_place/mymarket");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du produit."
      );
    } finally {
      setLoading((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  if (loading.isLoading) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement des détails du produit...
          </p>
        </div>
      </div>
    );
  }

  if (!productId)
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Aucun ID de produit fourni</p>
        </div>
      </div>
    );

  if (!userData?.id)
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Utilisateur non authentifié</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Détails de base</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="specifications">
                      Spécifications
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
                      isSubmitting={loading.isSubmitting}
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
                  <p className="font-medium mb-2">
                    Conseils de prévisualisation
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ajoutez des images claires et de haute qualité</li>
                    <li>Rédigez des descriptions détaillées</li>
                    <li>Incluez des spécifications précises</li>
                    <li>Définissez des prix compétitifs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 sticky top-20">
            <ProductPreview previewImages={previewImages} formData={formData} />
          </div>
        </div>
      </main>
    </div>
  );
}
