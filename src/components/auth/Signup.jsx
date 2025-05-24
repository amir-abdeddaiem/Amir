"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from 'js-cookie';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, PawPrintIcon as Paw } from "lucide-react";
import Link from "next/link";
import Signin from "./Signin"; // Assuming Signin modal logic is handled correctly
import SigninWithGoogle from "@/components/SigninWithGoogle/SigninWithGoogle";
import SigninWithFcb from "@/components/SigninWithFcb/SigninWithFcb";
import RegularUserStep1 from "./signup/RegularUserStep1";
import RegularUserStep2 from "./signup/RegularUserStep2";
import ServiceProviderStep1 from "./signup/ServiceProviderStep1";
import ServiceProviderStep2 from "./signup/ServiceProviderStep2";
import ServiceProviderStep3 from "./signup/ServiceProviderStep3";
import axios from "axios";  
export default function Signup() {
  const { data: session, status } = useSession();
  const [userType, setUserType] = useState("regular");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accType: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    coordinates: null,
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    businessName: "",
    businessType: "",
    certifications: "",
    services: [],
    description: "",
    website: "",
    phone: "",
  });

  // --- Data Constants ---
  const serviceTypes = [
    { value: "veterinarian", label: "Veterinarian" },
    { value: "trainer", label: "Pet Trainer" },
    { value: "groomer", label: "Groomer" },
    { value: "shelter", label: "Animal Shelter" },
    { value: "daycare", label: "Pet Daycare" },
    { value: "shop", label: "Pet Shop" },
  ];

  const servicesList = [
    { id: "checkup", label: "Regular Checkups" },
    { id: "vaccination", label: "Vaccinations" },
    { id: "surgery", label: "Surgery" },
    { id: "dental", label: "Dental Care" },
    { id: "grooming", label: "Grooming" },
    { id: "training", label: "Training" },
    { id: "boarding", label: "Boarding" },
    { id: "emergency", label: "Emergency Care" },
  ];

  // --- Handlers ---
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const services = [...prev.services];
      if (services.includes(service)) {
        return { ...prev, services: services.filter((s) => s !== service) };
      } else {
        return { ...prev, services: [...services, service] };
      }
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await axios.post('/api/auth/register', formData);
      const data = response.data;

      if (!data.success) {
        setError(data.message || "Registration failed. Please try again.");
        toast.error(data.message || "Registration failed. Please try again.");
      } else {
        console.log("Registration successful:", data);

        if (data.token) {
          Cookies.set('jwt', data.token, { expires: 7 }); 
          Cookies.set('userId', data.user._id, { expires: 7 });
          Cookies.set('email', data.user.email, { expires: 7 });
        }

        toast.success("Registration successful! Please check your email.");
        router.push("/Profile");
      }
    } catch (error) {
      // console.error("Registration error:", error);
      setError(error.response?.data?.message || "An error occurred during registration. Please try again.");
      toast.error(error.response?.data?.message || "An error occurred during registration. Please try again.");
      toast.error(error.response?.data?.message || "An error occurred during registration. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#E29578",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
        },
      });
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (session) {
      console.log("Session Data:", session);
    }
  }, [session]);

  useEffect(() => {
    // Pre-fill form if user is authenticated via OAuth (Google/Facebook)
    if (session?.user) {
      const [firstName, ...lastNameParts] = session.user.name?.split(" ") || ["", ""];
      const lastName = lastNameParts.join(" ");

      setFormData((prev) => ({
        ...prev,
        firstName: firstName || prev.firstName || "",
        lastName: lastName || prev.lastName || "",
        email: session.user.email || prev.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    // Reset step when user type changes
    setStep(1);
    setFormData(prev => ({ ...prev, accType: userType }));
  }, [userType]);

  // --- Render Logic ---
  const renderStepContent = () => {
    const commonProps = { formData, handleChange, setFormData };

    if (userType === "regular") {
      switch (step) {
        case 1:
          return <RegularUserStep1 {...commonProps} nextStep={nextStep} />;
        case 2:
          return <RegularUserStep2 {...commonProps} prevStep={prevStep} handleSubmit={handleSubmit} />;
        default:
          return null;
      }
    } else if (userType === "provider") {
      switch (step) {
        case 1:
          return <ServiceProviderStep1 {...commonProps} nextStep={nextStep} serviceTypes={serviceTypes} />;
        case 2:
          return <ServiceProviderStep2 {...commonProps} prevStep={prevStep} nextStep={nextStep} />;
        case 3:
          return (
            <ServiceProviderStep3
              {...commonProps}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              handleServiceChange={handleServiceChange}
              servicesList={servicesList}
            />
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            <CardHeader className="bg-[#E29578] text-white rounded-t-lg p-6">
              <div className="flex items-center gap-3">
                <Paw size={28} />
                <div>
                  <CardTitle className="text-2xl font-semibold">Join Animal's Club</CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Create your account to connect with pet lovers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 px-6">
              <Tabs
                value={userType} // Controlled component
                onValueChange={(value) => setUserType(value)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-md">
                  <TabsTrigger
                    value="regular"
                    className="text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
                  >
                    Pet Owner
                  </TabsTrigger>
                  <TabsTrigger
                    value="provider"
                    className="text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
                  >
                    Service Provider
                  </TabsTrigger>
                </TabsList>

                {/* Render content based on userType and step */} 
                {renderStepContent()}

              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50 p-6">
              <div className="text-center text-sm text-gray-600 w-full">
                Already have an account?
                {/* Assuming Signin is a DialogTrigger or similar */}
                <Signin />
              </div>

              <div className="flex items-center justify-center w-full py-2">
                <div className="h-px bg-gray-200 flex-grow"></div>
                <span className="px-4 text-gray-400 text-xs font-medium uppercase">Or continue with</span>
                <div className="h-px bg-gray-200 flex-grow"></div>
              </div>

              <div className="flex gap-4 w-full">
                <SigninWithGoogle />
                <SigninWithFcb />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
    // </AuthLayout>
  );
}
