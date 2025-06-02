"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
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

export default function AddAnimal() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    description: "",
    birthDate: "",
    image: null, // base64 string

    HealthStatus: {
      vaccinated: false,
      neutered: false,
      microchipped: false,
    },
    friendly: {
      children: false,
      dogs: false,
      cats: false,
      other: false,
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFriendlyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      friendly: {
        ...prev.friendly,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // This is base64
      setFormData((prev) => ({
        ...prev,
        image: reader.result, // base64 string
      }));
      console.log(reader.result); // Should start with "data:image/jpeg;base64,..."
    };
    reader.readAsDataURL(file); // <--- this is correct
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/animal", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Animal added successfully:", response.data);
        router.push("/");
      } else {
        console.error("Failed to add animal:", response.data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress(progress + 25);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

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
            handleChange={handleChange}
            formData={formData}
            handleImageUpload={handleImageUpload}
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
                    <div />
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
    </div>
  );
}
