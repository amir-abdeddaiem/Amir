"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  Upload,
  Camera,
  Check,
  X,
  ArrowLeft,
  DollarSign,
  Info,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

// Categories for product
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

export default function AddProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  // Form state
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
    shipping: {
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
    },
  });

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested field changes
  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Handle dimensions changes
  const handleDimensionsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        dimensions: {
          ...prev.shipping.dimensions,
          [field]: value,
        },
      },
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

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In a real app, you would send the formData to your backend here
        console.log("Form submitted:", formData);

        // Navigate back to marketplace
        router.push("/marketplace");
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsSubmitting(false);
      }
    };

    // Product preview component
    const ProductPreview = () => (
      <Card className="overflow-hidden h-full">
        <div className="relative h-64 w-full bg-gray-100">
          {previewImages.length > 0 ? (
            <Image
              src={previewImages[0] || "/placeholder.svg"}
              alt={formData.name || "Product preview"}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No image uploaded</p>
            </div>
          )}
          {formData.featured && (
            <Badge className="absolute top-2 left-2 bg-[#E29578] text-white">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">
              {formData.name || "Product Name"}
            </h3>
            <span className="font-bold text-[#E29578]">
              ${Number(formData.price || 0).toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {formData.description || "Product description will appear here"}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.category && (
              <Badge variant="outline" className="text-xs">
                {formData.category}
              </Badge>
            )}
            {formData.petType && (
              <Badge variant="outline" className="text-xs">
                {formData.petType}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-[#83C5BE] hover:bg-[#83C5BE]/90">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    );

    return (
      <div className="min-h-screen bg-[#EDF6F9]">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => router.push("/marketplace")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-gray-600 mt-1">
                Fill in the details below to list your product in the
                marketplace
              </p>
            </div>

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
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Product Name*</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                handleChange("name", e.target.value)
                              }
                              placeholder="Enter product name"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">Price ($)*</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="price"
                                  value={formData.price}
                                  onChange={(e) =>
                                    handleChange("price", e.target.value)
                                  }
                                  placeholder="0.00"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="quantity">Quantity*</Label>
                              <Input
                                id="quantity"
                                value={formData.quantity}
                                onChange={(e) =>
                                  handleChange("quantity", e.target.value)
                                }
                                placeholder="1"
                                type="number"
                                min="0"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description">Description*</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) =>
                                handleChange("description", e.target.value)
                              }
                              placeholder="Describe your product"
                              rows={4}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">Category*</Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                  handleChange("category", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="petType">Pet Type*</Label>
                              <Select
                                value={formData.petType}
                                onValueChange={(value) =>
                                  handleChange("petType", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select pet type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {petTypes.map((petType) => (
                                    <SelectItem key={petType} value={petType}>
                                      {petType}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="featured"
                              checked={formData.featured}
                              onCheckedChange={(checked) =>
                                handleChange("featured", checked)
                              }
                            />
                            <Label htmlFor="featured">
                              Mark as featured product
                            </Label>
                          </div>

                          <Separator className="my-4" />

                          <h3 className="text-lg font-medium">
                            Shipping Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="weight">Weight (kg)</Label>
                              <Input
                                id="weight"
                                value={formData.shipping.weight}
                                onChange={(e) =>
                                  handleNestedChange(
                                    "shipping",
                                    "weight",
                                    e.target.value
                                  )
                                }
                                placeholder="0.5"
                                type="number"
                                step="0.01"
                                min="0"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Dimensions (cm)</Label>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Input
                                  placeholder="Length"
                                  value={formData.shipping.dimensions.length}
                                  onChange={(e) =>
                                    handleDimensionsChange(
                                      "length",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  min="0"
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder="Width"
                                  value={formData.shipping.dimensions.width}
                                  onChange={(e) =>
                                    handleDimensionsChange(
                                      "width",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  min="0"
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder="Height"
                                  value={formData.shipping.dimensions.height}
                                  onChange={(e) =>
                                    handleDimensionsChange(
                                      "height",
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <Button onClick={() => setActiveTab("images")}>
                            Next: Add Images
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="images" className="pt-4">
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center">
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-4">
                                Drag and drop images here, or click to select
                                files
                              </p>
                              <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center px-4 py-2 bg-[#83C5BE] text-white rounded-md cursor-pointer hover:bg-[#83C5BE]/90 transition-colors"
                              >
                                <Camera className="mr-2 h-4 w -4" />
                                Select Images
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {previewImages.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                Uploaded Images
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previewImages.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                                      <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-4 w-4 text-red-500" />
                                    </button>
                                    {index === 0 && (
                                      <Badge className="absolute bottom-1 left-1 bg-[#83C5BE] text-white">
                                        Main
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setActiveTab("details")}
                            >
                              Back
                            </Button>
                            <Button
                              onClick={() => setActiveTab("specifications")}
                            >
                              Next: Specifications
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="specifications" className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                              Product Specifications
                            </h3>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addSpecification}
                            >
                              Add Specification
                            </Button>
                          </div>

                          {formData.specifications.map((spec, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div className="grid grid-cols-2 gap-2 flex-grow">
                                <Input
                                  placeholder="Specification name"
                                  value={spec.key}
                                  onChange={(e) =>
                                    handleSpecChange(
                                      index,
                                      "key",
                                      e.target.value
                                    )
                                  }
                                />
                                <Input
                                  placeholder="Value"
                                  value={spec.value}
                                  onChange={(e) =>
                                    handleSpecChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSpecification(index)}
                                disabled={formData.specifications.length === 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          <div className="flex justify-between mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setActiveTab("images")}
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="bg-[#E29578] hover:bg-[#E29578]/90"
                              disabled={isSubmitting}
                              onClick={handleSubmit}
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Add Product
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <h2 className="text-lg font-medium mb-4">Product Preview</h2>
                  <ProductPreview />
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Preview Tips</p>
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
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };
}
