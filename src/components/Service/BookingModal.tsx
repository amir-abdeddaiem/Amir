"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, PawPrint, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedTime: string;
  providerId: string;
}

interface FormData {
  petId: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

interface FormErrors {
  petId?: string;
  description?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

interface Pet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  img: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  providerId,
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    petId: "",
    description: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      fetchPets();
    }
  }, [isOpen]);

  const fetchPets = async () => {
    setIsLoadingPets(true);
    try {
      const response = await fetch('/api/myanimal');
      const data = await response.json();
      if (response.ok) {
        setPets(data.data.map((pet: any) => ({
          _id: pet._id,
          name: pet.name,
          type: pet.type,
          breed: pet.breed,
          img: pet.img
        })));
      } else {
        throw new Error(data.message || 'Failed to fetch pets');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to load pets', {
        description: 'Please try again later',
      });
    } finally {
      setIsLoadingPets(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.petId) {
      newErrors.petId = "Please select a pet";
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.ownerName || formData.ownerName.length < 2) {
      newErrors.ownerName = "Owner name must be at least 2 characters";
    }

    if (!formData.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = "Please enter a valid email address";
    }

    if (!formData.ownerPhone || formData.ownerPhone.length < 10) {
      newErrors.ownerPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/service/${providerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-123", // Replace with actual user ID from auth
        },
        body: JSON.stringify({
          times: [selectedTime],
          date: selectedDate,
          bookingDetails: {
            petId: formData.petId,
            description: formData.description,
            ownerName: formData.ownerName,
            ownerEmail: formData.ownerEmail,
            ownerPhone: formData.ownerPhone,
          }
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Booking request submitted successfully!", {
          description: `We'll confirm your appointment for ${formatDate(selectedDate)} at ${selectedTime}.`,
        });
        handleClose();
      } else {
        throw new Error(result.error || "Failed to submit booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking", {
        description: error instanceof Error ? error.message : "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        petId: "",
        description: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
      });
      setErrors({});
      setIsSelectOpen(false);
      onClose();
    }
  };

  const selectedPet = pets.find(pet => pet._id === formData.petId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PawPrint className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
              <p className="text-sm text-gray-500">Complete the form below</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Appointment Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-6">
            <h3 className="font-semibold mb-3 text-gray-900">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatDate(selectedDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pet Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pet
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  disabled={isLoadingPets}
                  className={`w-full p-3 text-left bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.petId ? 'border-red-300' : 'border-gray-300'
                  } ${isLoadingPets ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoadingPets ? (
                    <span className="text-gray-500">Loading pets...</span>
                  ) : selectedPet ? (
                    <div className="flex items-center gap-3">
                      {selectedPet.img && (
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={selectedPet.img}
                            alt={selectedPet.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span>{selectedPet.name} - {selectedPet.type} ({selectedPet.breed})</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Choose your pet</span>
                  )}
                </button>
                
                {isSelectOpen && !isLoadingPets && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {pets.length > 0 ? (
                      pets.map((pet) => (
                        <button
                          key={pet._id}
                          type="button"
                          onClick={() => {
                            handleInputChange('petId', pet._id);
                            setIsSelectOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          {pet.img && (
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                              <Image
                                src={pet.img}
                                alt={pet.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span>{pet.name} - {pet.type} ({pet.breed})</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No pets found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.petId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.petId}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please describe your pet's symptoms, concerns, or the reason for this visit..."
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Owner Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  placeholder="Your full name"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.ownerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ownerName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ownerName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                  placeholder="Your phone number"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.ownerPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ownerPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ownerPhone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                placeholder="Your email address"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.ownerEmail ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.ownerEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.ownerEmail}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingPets}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}