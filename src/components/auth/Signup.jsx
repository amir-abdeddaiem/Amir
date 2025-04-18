"use client";
import { useState ,useEffect} from "react";
import { useSession } from "next-auth/react"; // Add this import

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, PawPrintIcon as Paw } from "lucide-react";
import Link from "next/link";
import Signin from "./Signin";
import SigninWithGoogle from "@/components/SigninWithGoogle/SigninWithGoogle";
import SigninWithFcb from "@/components/SigninWithFcb/SigninWithFcb";
export default function Signup() {
  const { data: session, status } = useSession();
  const [userType, setUserType] = useState("regular");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Regular user fields
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    gender: "",
    birthDate: "",
    // Service provider fields
    businessName: "",
    businessType: "",
    certifications: "",
    services: [],
    description: "",
    website: "",
    phone: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Redirect to success page or home
  };

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

  useEffect(() => {
    if (session) {
      console.log("Session Data:", session);
      console.log("User Info:", session.user);
      console.log("Authentication Status:", status);
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user) {
      // Split the full name into first and last name
      const [firstName, ...lastNameParts] = session.user.name.split(" ");
      const lastName = lastNameParts.join(" ");

      setFormData(prev => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastName || "",
        email: session.user.email || "",
        // Keep other fields as they are
      }));
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-[#EDF6F9] py-12">
      {/* Paw print background pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-5"
        style={{
          backgroundImage: "url('/paw-pattern.svg')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="./home"
            className="inline-flex items-center text-[#E29578] hover:underline mb-1"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-[#E29578] text-white rounded-t-lg">
                <div className="flex items-center gap-1">
                  <Paw size={24} />
                  <div>
                    <CardTitle className="text-2xl">
                      Join Animal's Club
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Create your account to connect with pet lovers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <Tabs
                  defaultValue="regular"
                  onValueChange={setUserType}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="regular" className="text-base">
                      Pet Owner
                    </TabsTrigger>
                    <TabsTrigger value="provider" className="text-base">
                      Service Provider
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="regular">
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            nextStep();
                          }}
                        >
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  name="firstName"
                                  value={formData.firstName}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  name="lastName"
                                  value={formData.lastName}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                  id="password"
                                  name="password"
                                  type="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                  Confirm Password
                                </Label>
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                              <Button
                                type="submit"
                                className="bg-[#E29578] hover:bg-[#d88a6d]"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                name="location"
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <RadioGroup
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    gender: value,
                                  }))
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="male" id="male" />
                                  <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="female" id="female" />
                                  <Label htmlFor="female">Female</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="other" id="other" />
                                  <Label htmlFor="other">Other</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="birthDate">Birth Date</Label>
                              <Input
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="terms" required />
                                <Label htmlFor="terms" className="text-sm">
                                  I agree to the{" "}
                                  <Link
                                    href="/terms"
                                    className="text-[#E29578] hover:underline"
                                  >
                                    Terms of Service
                                  </Link>{" "}
                                  and{" "}
                                  <Link
                                    href="/privacy"
                                    className="text-[#E29578] hover:underline"
                                  >
                                    Privacy Policy
                                  </Link>
                                </Label>
                              </div>
                            </div>

                            <div className="pt-4 flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                className="bg-[#E29578] hover:bg-[#d88a6d]"
                              >
                                Create Account
                              </Button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="provider">
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            nextStep();
                          }}
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="businessName">
                                Business Name
                              </Label>
                              <Input
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="businessType">
                                Business Type
                              </Label>
                              <Select
                                value={formData.businessType}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    businessType: value,
                                  }))
                                }
                                required
                              >
                                <SelectTrigger id="businessType">
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {serviceTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                  id="password"
                                  name="password"
                                  type="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                  Confirm Password
                                </Label>
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                              <Button
                                type="submit"
                                className="bg-[#E29578] hover:bg-[#d88a6d]"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            nextStep();
                          }}
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="location">
                                Business Location
                              </Label>
                              <Input
                                id="location"
                                name="location"
                                placeholder="Full Address"
                                value={formData.location}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="website">
                                Website (Optional)
                              </Label>
                              <Input
                                id="website"
                                name="website"
                                type="url"
                                placeholder="https://"
                                value={formData.website}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="pt-4 flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                className="bg-[#E29578] hover:bg-[#d88a6d]"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="certifications">
                                Certifications/Qualifications
                              </Label>
                              <Textarea
                                id="certifications"
                                name="certifications"
                                placeholder="List your professional certifications and qualifications"
                                value={formData.certifications}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Services Provided</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {servicesList.map((service) => (
                                  <div
                                    key={service.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={service.id}
                                      checked={formData.services.includes(
                                        service.id
                                      )}
                                      onCheckedChange={() =>
                                        handleServiceChange(service.id)
                                      }
                                    />
                                    <Label htmlFor={service.id}>
                                      {service.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">
                                Business Description
                              </Label>
                              <Textarea
                                id="description"
                                name="description"
                                placeholder="Tell pet owners about your business and services"
                                value={formData.description}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="terms" required />
                                <Label htmlFor="terms" className="text-sm">
                                  I agree to the{" "}
                                  <Link
                                    href="/terms"
                                    className="text-[#E29578] hover:underline"
                                  >
                                    Terms of Service
                                  </Link>{" "}
                                  and{" "}
                                  <Link
                                    href="/privacy"
                                    className="text-[#E29578] hover:underline"
                                  >
                                    Privacy Policy
                                  </Link>
                                </Label>
                              </div>
                            </div>

                            <div className="pt-4 flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                className="bg-[#E29578] hover:bg-[#d88a6d]"
                              >
                                Create Business Account
                              </Button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                <div className="text-center w-full">
                  Already have an account? <Signin />
                </div>

                <div className="flex items-center justify-center w-full">
                  <div className="h-px bg-gray-200 w-full"></div>
                  <span className="px-4 text-gray-400 text-sm">OR</span>
                  <div className="h-px bg-gray-200 w-full"></div>
                </div>

                <div className="flex gap-4 w-full">
                  {/* <Button variant="outline" className="w-full">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button> */}
                  <SigninWithGoogle />
                  {/* <Button variant="outline" className="w-full">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="#1877F2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                    </svg>
                    Facebook
                  </Button> */}
                  <SigninWithFcb />
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
