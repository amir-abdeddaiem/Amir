"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  PawPrintIcon as Paw,
} from "lucide-react";
import Form1 from "@/components/Animal/Form1";
import Form2 from "@/components/Animal/Form2";
import Form3 from "@/components/Animal/Form3";
import Form4 from "@/components/Animal/Form4";
import axios from "axios";
import { useUserData } from "@/contexts/UserData";
export default function AddAnimal() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    description: "",
    HealthStatus: {
      vaccinated: false,
      neutered: false,
      microchipped: false,
    },
    birthDate: "",
    friendly: {
      children: false,
      dogs: false,
      cats: false,
      other: false,
    },
    image: null,
    owner: Cookies.get("userId"),
  });

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle friendly checkboxes
  const handleFriendlyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      friendly: {
        ...prev.friendly,
        [field]: value,
      },
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call

    // In a real app, you would send the formData to your backend here
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post("/api/animal", formData);
      const data = response.data;

      if (!data.success) {
        console.log("Registration failed:", data.message || "Unknown error");
      } else {
        console.log("Registration successful:", data);
      }
    } catch (error) {
      console.error("Network or fetch error:", error);
      // Provide user feedback for network issues
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next step
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress(progress + 25);
    }
  };

  // Previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  // Render form steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Form1 formData={formData} handleChange={handleChange} />;
      case 2:
        return (
          <Form2
            formData={formData}
            handleChange={handleChange}
            handleFriendlyChange={handleFriendlyChange}
          />
        );
      case 3:
        return (
          <Form3
            formData={formData}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            previewImage={previewImage}
          />
        );
      case 4:
        return <Form4 formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Add Your Animal
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Join our community by adding your pet to Animal's Club
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-[#E29578] text-white">
                    Step {step} of 4
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-[#E29578]">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#FFDDD2]">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E29578]"
                ></motion.div>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

                <div className="mt-8 flex justify-between">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-[#E29578] hover:bg-[#E29578]/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Submit
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center text-sm text-gray-500">
              <Paw className="mr-2 h-4 w-4 text-[#E29578]" />
              Your pet's information is safe with us
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
