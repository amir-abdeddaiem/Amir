"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  MapPin,
  Clock,
  DollarSign,
  Camera,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const serviceTypes = [
  "Veterinary",
  "Grooming",
  "Training",
  "Pet Sitting",
  "Boarding",
  "Walking",
];

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function AddServiceModal({ isOpen, onClose, onServiceAdded }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [serviceData, setServiceData] = useState({
    name: "",
    type: "",
    description: "",
    price: { min: 0, max: 0, currency: "USD" },
    duration: 60,
    location: {
      address: "",
      city: "",
      coordinates: { lat: 0, lng: 0 },
    },
    images: [],
    availability: [],
  });

  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setServiceData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setServiceData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addTimeSlot = () => {
    if (selectedDay === null || !newTimeSlot) return;

    setServiceData((prev) => {
      const newAvailability = [...prev.availability];
      const dayIndex = newAvailability.findIndex(
        (a) => a.dayOfWeek === selectedDay
      );

      if (dayIndex >= 0) {
        if (!newAvailability[dayIndex].timeSlots.includes(newTimeSlot)) {
          newAvailability[dayIndex].timeSlots.push(newTimeSlot);
          newAvailability[dayIndex].timeSlots.sort();
        }
      } else {
        newAvailability.push({
          dayOfWeek: selectedDay,
          timeSlots: [newTimeSlot],
        });
      }

      return { ...prev, availability: newAvailability };
    });

    setNewTimeSlot("");
  };

  const removeTimeSlot = (dayOfWeek, timeSlot) => {
    setServiceData((prev) => ({
      ...prev,
      availability: prev.availability
        .map((a) =>
          a.dayOfWeek === dayOfWeek
            ? { ...a, timeSlots: a.timeSlots.filter((t) => t !== timeSlot) }
            : a
        )
        .filter((a) => a.timeSlots.length > 0),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios.post("/api/services", serviceData);

      toast({
        title: "Service created! 🎉",
        description: "Your new service has been added successfully.",
      });

      onServiceAdded();
      resetForm();
    } catch (error) {
      toast({
        title: "Error creating service",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setServiceData({
      name: "",
      type: "",
      description: "",
      price: { min: 0, max: 0, currency: "USD" },
      duration: 60,
      location: {
        address: "",
        city: "",
        coordinates: { lat: 0, lng: 0 },
      },
      images: [],
      availability: [],
    });
    setCurrentStep(1);
    setSelectedDay(null);
    setNewTimeSlot("");
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return serviceData.name && serviceData.type && serviceData.description;
      case 2:
        return (
          serviceData.price.min > 0 &&
          serviceData.location.address &&
          serviceData.location.city
        );
      case 3:
        return serviceData.availability.length > 0;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#83C5BE] to-[#E29578] rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            Add New Service
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? "bg-gradient-to-br from-[#83C5BE] to-[#E29578] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? "bg-[#E29578]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Basic Information
                </h3>
                <p className="text-gray-600">Tell us about your service</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Service Name *
                  </label>
                  <Input
                    value={serviceData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Premium Dog Grooming"
                    className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Service Type *
                  </label>
                  <Select
                    value={serviceData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description *
                </label>
                <Textarea
                  value={serviceData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your service in detail..."
                  className="border-2 border-[#83C5BE]/20 focus:border-[#E29578] min-h-[120px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={serviceData.duration}
                  onChange={(e) =>
                    handleInputChange(
                      "duration",
                      Number.parseInt(e.target.value)
                    )
                  }
                  placeholder="60"
                  className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Pricing & Location
                </h3>
                <p className="text-gray-600">
                  Set your pricing and location details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Minimum Price *
                  </label>
                  <Input
                    type="number"
                    value={serviceData.price.min}
                    onChange={(e) =>
                      handleInputChange(
                        "price.min",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="50"
                    className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Maximum Price *
                  </label>
                  <Input
                    type="number"
                    value={serviceData.price.max}
                    onChange={(e) =>
                      handleInputChange(
                        "price.max",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="100"
                    className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address *
                </label>
                <Input
                  value={serviceData.location.address}
                  onChange={(e) =>
                    handleInputChange("location.address", e.target.value)
                  }
                  placeholder="123 Main Street"
                  className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  City *
                </label>
                <Input
                  value={serviceData.location.city}
                  onChange={(e) =>
                    handleInputChange("location.city", e.target.value)
                  }
                  placeholder="New York"
                  className="border-2 border-[#83C5BE]/20 focus:border-[#E29578]"
                />
              </div>

              <div className="p-4 bg-gradient-to-br from-[#83C5BE]/10 to-[#E29578]/10 rounded-xl border border-[#83C5BE]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-[#E29578]" />
                  <span className="text-sm font-medium text-gray-700">
                    Service Images
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Upload images of your service (coming soon)
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Set Your Availability
                </h3>
                <p className="text-gray-600">
                  When are you available to provide this service?
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Add Time Slots
                  </h4>

                  <div className="space-y-3">
                    <Select
                      value={selectedDay?.toString()}
                      onValueChange={(value) =>
                        setSelectedDay(Number.parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day of week" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem
                            key={day.value}
                            value={day.value.toString()}
                          >
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={newTimeSlot}
                        onChange={(e) => setNewTimeSlot(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={addTimeSlot}
                        disabled={selectedDay === null || !newTimeSlot}
                        className="bg-[#E29578] hover:bg-[#E29578]/90"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Current Availability
                  </h4>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {serviceData.availability.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No availability set yet
                      </p>
                    ) : (
                      serviceData.availability.map((avail) => (
                        <div
                          key={avail.dayOfWeek}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <h5 className="font-medium text-gray-800 mb-2">
                            {
                              daysOfWeek.find(
                                (d) => d.value === avail.dayOfWeek
                              )?.label
                            }
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {avail.timeSlots.map((slot) => (
                              <Badge
                                key={slot}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {slot}
                                <button
                                  onClick={() =>
                                    removeTimeSlot(avail.dayOfWeek, slot)
                                  }
                                  className="ml-1 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-[#83C5BE] to-[#E29578] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="bg-gradient-to-r from-[#E29578] to-[#83C5BE] text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Service"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
